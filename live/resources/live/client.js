// Tiger live client: injected by the live server into generated pages.
// Completed builds update the page in place: changed stylesheets swap without a flash, the body is
// morphed (keeping scroll position and unchanged DOM), and script changes reload the page. Failed
// builds show an error overlay until the next success. Unsaved editor drafts that affect this page
// are applied the same way. Site scripts can take over patching with
//   (window.tigerLivePlugins ||= []).push({ name, codePaths, beforeUpdate, update(context) })
// or window.tigerLive.register(...) once 'tiger-live:ready' has fired.
(() => {
  const script = document.currentScript;
  let revision = script?.dataset.revision;
  const plugins = [];
  const read = async url => {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Preview update failed: ${response.status}`);
    return response.text();
  };
  const own = node => node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-tiger-live');
  // Parsed pages drop the injected client, so they compare equal across revisions.
  const parse = html => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('[data-tiger-live]').forEach(node => node.remove());
    return doc;
  };
  const absolute = value => new URL(value, location.href);
  const sameOrigin = value => absolute(value).origin === location.origin;
  const route = (() => {
    let path = decodeURIComponent(location.pathname);
    if (path.endsWith('/')) path += 'index.html';
    return path;
  })();
  // Frames follow their top window's stream instead of opening their own: every open event
  // stream holds one of the browser's 6 connections per host, so a page embedding a dozen
  // live pages would stall every other request to the server.
  const leader = (() => {
    try { return window.top !== window && window.top.document.querySelector('script[data-tiger-live]') ? window.top : null; }
    catch { return null; } // Cross-origin top window.
  })();
  let updates = null;
  let lastNavigation;
  const navigationListeners = new Set();
  function onNavigation(event) {
    const value = JSON.parse(event.data);
    if (value.route !== route) return;
    lastNavigation = value;
    for (const listener of navigationListeners) listener(value);
  }
  const navigation = {
    subscribe(listener) {
      navigationListeners.add(listener);
      if (lastNavigation) listener(lastNavigation);
      return () => navigationListeners.delete(listener);
    },
    async publish(value) {
      const response = await fetch('/__author/navigate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...value, route })
      });
      if (!response.ok) throw new Error(`Navigation sync failed: ${response.status}`);
    }
  };

  /** Update `current` (live DOM) from `before` to `after` (parsed pages), touching only differences. */
  function morph(current, before, after) {
    if (before?.isEqualNode(after)) return;
    if (!before || current.nodeType !== after.nodeType || current.nodeName !== after.nodeName) {
      current.replaceWith(document.importNode(after, true));
      return;
    }
    if (after.nodeType === Node.TEXT_NODE || after.nodeType === Node.COMMENT_NODE) {
      current.nodeValue = after.nodeValue;
      return;
    }
    for (const attr of [...before.attributes]) {
      if (!after.hasAttribute(attr.name)) current.removeAttribute(attr.name);
    }
    for (const attr of after.attributes) {
      if (before.getAttribute(attr.name) !== attr.value) {
        if (attr.name === 'class') {
          for (const name of before.classList) current.classList.remove(name);
          current.classList.add(...after.classList);
        } else current.setAttribute(attr.name, attr.value);
      }
    }
    // Highlighted code has generated children that don't correspond to source nodes.
    if (after.nodeName === 'PRE') { current.innerHTML = after.innerHTML; return; }
    morphChildren(current, before, after);
  }

  const children = node => [...node.childNodes].filter(child => !own(child));
  const signature = node => node.nodeType === Node.ELEMENT_NODE ? node.outerHTML : `${node.nodeType}:${node.nodeValue}`;
  /** Reconcile children in order. Unchanged nodes are kept rather than paired by position, so
   *  inserting or deleting a block does not rebuild everything after it: embedded frames keep
   *  their loaded documents and scripts' changes to untouched nodes (highlighting) survive.
   */
  function morphChildren(current, before, after) {
    const oldChildren = children(before), nextChildren = children(after), live = children(current);
    const insert = (child, anchor) => current.insertBefore(document.importNode(child, true),
      anchor || [...current.childNodes].find(own) || null);
    // Page scripts may have restructured this element; positions then say nothing. Rebuild it.
    if (live.length !== oldChildren.length) {
      live.forEach(child => child.remove());
      nextChildren.forEach(child => insert(child));
      return;
    }
    const oldSignatures = oldChildren.map(signature), nextSignatures = nextChildren.map(signature);
    const positions = new Map();
    oldSignatures.forEach((key, index) => positions.has(key) ? positions.get(key).push(index) : positions.set(key, [index]));
    // How often each signature is still wanted, so a kept node is never dropped as "skipped".
    const wanted = new Map();
    nextSignatures.forEach(key => wanted.set(key, (wanted.get(key) || 0) + 1));
    let cursor = 0;
    nextChildren.forEach((child, index) => {
      const key = nextSignatures[index];
      wanted.set(key, wanted.get(key) - 1);
      const queue = positions.get(key) || [];
      while (queue.length && queue[0] < cursor) queue.shift();
      const match = queue[0];
      // Jump to an identical node only if every node skipped over is gone from the new page.
      if (match !== undefined && oldSignatures.slice(cursor, match).every(skipped => !wanted.get(skipped))) {
        queue.shift();
        for (; cursor < match; cursor++) live[cursor].remove();
        cursor = match + 1;
      } else if (cursor < oldChildren.length && oldChildren[cursor].nodeName === child.nodeName &&
          !wanted.get(oldSignatures[cursor])) {
        morph(live[cursor], oldChildren[cursor], child); // Edited in place.
        cursor++;
      } else insert(child, live[cursor]);
    });
    for (; cursor < live.length; cursor++) live[cursor].remove();
  }

  // -- Code: script changes need a reload ------------------------------------------------
  const code = new Map();
  const track = async url => {
    const key = absolute(url).href;
    if (!sameOrigin(key) || code.has(key)) return;
    code.set(key, undefined);
    try { code.set(key, await read(key)); } catch { code.delete(key); }
  };
  const scripts = doc => [...doc.querySelectorAll('script')].filter(node => !own(node)).map(node =>
    node.hasAttribute('src') ? `src ${node.type} ${absolute(node.getAttribute('src')).href}` : `inline ${node.type} ${node.textContent}`);
  async function codeChanged(before, after) {
    if (scripts(before).join('\n') !== scripts(after).join('\n')) return true;
    let changed = false;
    await Promise.all([...code.keys()].map(async url => {
      const source = await read(url).catch(() => undefined);
      if (code.get(url) !== undefined && source !== code.get(url)) changed = true;
      code.set(url, source);
    }));
    return changed;
  }

  // -- Styles: load replacements before removing the old sheets --------------------------
  const styles = new Map();
  const styleKey = href => absolute(href).pathname;
  const sheets = () => [...document.querySelectorAll('link[rel="stylesheet"]')].filter(link => sameOrigin(link.href));
  const readStyles = () => Promise.all(sheets().map(async link => {
    const key = styleKey(link.href);
    if (!styles.has(key)) styles.set(key, await read(link.href).catch(() => ''));
  }));
  function syncHeadStyles(before, after) {
    const hrefs = doc => [...doc.head.querySelectorAll('link[rel="stylesheet"]')].map(link => styleKey(link.getAttribute('href')));
    const previous = new Set(hrefs(before)), wanted = new Set(hrefs(after));
    for (const link of document.head.querySelectorAll('link[rel="stylesheet"]')) {
      const key = styleKey(link.href);
      if (previous.has(key) && !wanted.has(key)) link.remove();
    }
    for (const link of after.head.querySelectorAll('link[rel="stylesheet"]')) {
      if (!previous.has(styleKey(link.getAttribute('href')))) document.head.append(document.importNode(link, true));
    }
  }
  async function swapStyles(nextRevision) {
    const changed = [];
    for (const link of sheets()) {
      const key = styleKey(link.href);
      const source = await read(link.href).catch(() => undefined);
      if (source === undefined) continue;
      if (styles.has(key) && styles.get(key) !== source) changed.push(link);
      styles.set(key, source);
    }
    await Promise.all(changed.map(link => new Promise(resolve => {
      const replacement = link.cloneNode(true);
      const url = new URL(link.href); url.searchParams.set('__preview', nextRevision);
      replacement.href = url;
      replacement.onload = replacement.onerror = () => { link.remove(); resolve(); };
      link.after(replacement);
    })));
    return changed.length > 0;
  }
  // With unchanged markup and styles, the build may have replaced an image file.
  // Decode replacements before swapping URLs so the old image stays visible.
  async function refreshImages(root, nextRevision) {
    await Promise.all([...root.querySelectorAll('img[src]')].map(async img => {
      const url = absolute(img.getAttribute('src'));
      if (url.origin !== location.origin) return;
      url.searchParams.set('__preview', nextRevision);
      const preload = new Image(); preload.src = url;
      try { await preload.decode(); img.src = url; } catch {}
    }));
  }

  // -- Overlays (isolated from page styles) ----------------------------------------------
  function overlay(id, css) {
    let host = document.getElementById(id);
    if (!host) {
      host = document.createElement('div');
      host.id = id; host.setAttribute('data-tiger-live', '');
      host.attachShadow({ mode: 'open' }).innerHTML = `<style>${css}</style><div part="panel"></div>`;
      document.body.append(host);
    }
    return host;
  }
  function showError(status) {
    const host = overlay('tiger-live-error', `
      :host { all: initial; position: fixed; inset: 0; z-index: 2147483647; display: block; overflow: auto;
        background: #991b1bf2; color: #fff; font: 18px/1.5 system-ui, sans-serif; }
      :host([hidden]) { display: none; }
      div { box-sizing: border-box; min-height: 100%; padding: clamp(24px, 5vw, 64px); }
      h1 { font-size: clamp(28px, 5vw, 56px); margin: 0 0 12px; }
      p { margin: 0 0 20px; } button { font: inherit; font-size: 14px; color: #fff; background: #450a0a;
        border: 1px solid #fca5a5; border-radius: 6px; padding: 4px 12px; cursor: pointer; float: right; }
      pre { padding: 20px; background: #450a0a; border-radius: 10px; white-space: pre-wrap;
        overflow-wrap: anywhere; font: 14px/1.5 ui-monospace, monospace; }`);
    host.setAttribute('role', 'alert');
    const panel = host.shadowRoot.querySelector('div');
    panel.replaceChildren();
    const hide = Object.assign(document.createElement('button'), { type: 'button', textContent: 'Hide' });
    hide.onclick = () => { host.hidden = true; };
    const heading = Object.assign(document.createElement('h1'), { textContent: 'Build failed' });
    const note = Object.assign(document.createElement('p'), {
      textContent: 'Fix the error and save again. This page returns after the next successful build.' });
    const message = Object.assign(document.createElement('pre'), { textContent: status.message || 'Unknown error' });
    panel.append(hide, heading, note, message);
    if (status.trace && status.trace !== status.message) {
      panel.append(Object.assign(document.createElement('pre'), { textContent: status.trace }));
    }
    host.hidden = false;
    document.documentElement.dataset.tigerLiveError = '';
  }
  function hideError() {
    document.getElementById('tiger-live-error')?.remove();
    delete document.documentElement.dataset.tigerLiveError;
  }
  function draftStatus(message) {
    const host = overlay('tiger-live-draft-status', `
      :host { all: initial; position: fixed; right: 16px; top: 8px; z-index: 2147483646; display: block;
        max-width: 420px; padding: 6px 10px; background: #fff5dc; color: #5b451d; font: 12px system-ui, sans-serif; }
      :host([hidden]) { display: none; }`);
    host.setAttribute('role', 'status');
    host.shadowRoot.querySelector('div').textContent = message;
    host.hidden = !message;
  }

  // -- Updates -----------------------------------------------------------------------------
  let previous, saved, running = false, latest = revision;
  const drafts = new Map();
  let draftSerial = 0, draftGeneration = 0, appliedDraft = 0;
  const reload = () => { updates?.close(); location.reload(); };
  const ready = new Promise(resolve => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', resolve, { once: true });
    else resolve();
  }).then(() => Promise.all([
    read(location.href).then(parse).then(doc => { previous = doc; saved = doc; }),
    readStyles(),
    ...[...document.querySelectorAll('script[src]')].filter(node => !own(node)).map(node => track(node.src))
  ]));
  const draftPage = () => [...drafts.values()].filter(draft => draft.page)
    .sort((a, b) => b.serial - a.serial)[0]?.page;

  async function apply(next, nextRevision, draft) {
    if (document.body.hasAttribute('data-tiger-live-placeholder')) return reload();
    if (!draft && await codeChanged(previous, next)) return reload();
    let stylesChanged = false;
    if (!draft) {
      syncHeadStyles(previous, next);
      stylesChanged = await swapStyles(nextRevision);
    }
    const context = { previous, next, revision: nextRevision, draft, stylesChanged, morph, refreshImages };
    let handled = false;
    for (const plugin of plugins) {
      if (!plugin.update) continue;
      const result = await plugin.update(context);
      if (result === 'reload') return reload();
      if (result) { handled = plugin.name || true; break; }
    }
    if (!handled) {
      if (!previous.body.isEqualNode(next.body)) {
        const x = scrollX, y = scrollY;
        morph(document.body, previous.body, next.body);
        scrollTo(x, y);
      } else if (!draft && !stylesChanged) await refreshImages(document.body, nextRevision);
    }
    document.title = next.title;
    previous = next;
    document.dispatchEvent(new CustomEvent('tiger-live:updated', {
      detail: { revision: nextRevision, draft, stylesChanged, handledBy: handled || null } }));
    return true;
  }

  async function drain() {
    if (running) return;
    running = true;
    try {
      await ready;
      while (latest !== revision || appliedDraft !== draftGeneration) {
        const target = latest, generation = draftGeneration;
        const draftOnly = target === revision;
        for (const plugin of plugins) await plugin.beforeUpdate?.();
        if (!draftOnly) saved = parse(await read(location.href));
        const page = draftPage();
        const next = page ? parse(page.html) : saved.cloneNode(true);
        if (!await apply(next, target, draftOnly)) return;
        revision = target;
        appliedDraft = generation;
      }
    } catch (error) {
      console.warn('Live update failed; reloading', error);
      reload();
    } finally { running = false; }
  }

  const followers = new Set();
  let lastStatus;
  function onStatus(data) {
    lastStatus = data;
    for (const follower of followers) try { follower(data); } catch { followers.delete(follower); }
    const status = JSON.parse(data);
    if (!status.ok) { showError(status); return; }
    hideError();
    latest = status.revision;
    if (latest !== revision) drain();
  }
  const follow = listener => {
    followers.add(listener);
    if (lastStatus) listener(lastStatus);
    return () => followers.delete(listener);
  };
  if (leader) {
    // Framed pages refresh after builds; drafts are only previewed in the top window.
    const attach = () => {
      if (!leader.tigerLive?.follow) {
        leader.document.addEventListener('tiger-live:ready', attach, { once: true });
        return;
      }
      const stop = leader.tigerLive.follow(onStatus);
      addEventListener('pagehide', stop, { once: true });
    };
    attach();
  } else {
    // Drafts carry only this page's HTML (a blog draft re-renders every page listing the post).
    updates = new EventSource(`/__preview/events?route=${encodeURIComponent(route)}`);
    updates.onmessage = event => onStatus(event.data);
    updates.addEventListener('navigation', onNavigation);
    listenForDrafts(updates);
  }

  function listenForDrafts(updates) {
    updates.addEventListener('draft', event => {
      const draft = JSON.parse(event.data);
      const before = drafts.get(draft.file)?.page;
      if (draft.clear) drafts.delete(draft.file);
      else drafts.set(draft.file, { serial: ++draftSerial, page: draft.pages?.find(page => '/' + page.route === route) });
      if (!before && !drafts.get(draft.file)?.page) return; // Not shown on this page.
      draftStatus('');
      draftGeneration++;
      if (!draft.saved) drain();
    });
    updates.addEventListener('draft-error', event => {
      const { file, error } = JSON.parse(event.data);
      if (drafts.get(file)?.page) draftStatus(`Preview paused — keeping the last valid version. ${error.slice(0, 200)}`);
    });
  }

  async function openSource(input = { route: location.pathname }) {
    const response = await fetch('/__author/open', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not open the source');
    return result;
  }
  // Alt+Shift+E opens this page's source in the editor.
  document.addEventListener('keydown', event => {
    if (event.code !== 'KeyE' || !event.altKey || !event.shiftKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
    event.preventDefault();
    openSource().catch(error => draftStatus(`Could not open source: ${error.message}`));
  });

  const api = window.tigerLive = {
    get revision() { return revision; },
    register(plugin) {
      plugins.push(plugin);
      for (const path of plugin.codePaths || []) track(new URL(path, plugin.base || location.href));
      return api;
    },
    openSource, morph, reload, follow, navigation
  };
  const queued = Array.isArray(window.tigerLivePlugins) ? window.tigerLivePlugins : [];
  window.tigerLivePlugins = { push: plugin => api.register(plugin) };
  queued.forEach(plugin => api.register(plugin));
  document.dispatchEvent(new CustomEvent('tiger-live:ready', { detail: api }));
})();
