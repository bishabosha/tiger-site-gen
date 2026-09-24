import { installPreviewFrame } from './frame.js';

export function installSidebar(reveal, toolbar) {
  const directory = decodeURIComponent(new URL('.', location.href).pathname).replace(/^\/+|\/+$/g, '') + '/slides';
  const storageKey = `slide-sidebar:${directory}`;
  const cutKey = `${storageKey}:cut`;
  const pendingKey = `${storageKey}:pending`;
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('./sidebar.css', import.meta.url).href;
  stylesheet.dataset.previewStyles = 'true';
  stylesheet.addEventListener('load', () => reveal.layout());
  document.head.append(stylesheet);
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.textContent = 'Thumbnails';
  toggle.title = 'Show slide thumbnails';
  toggle.setAttribute('aria-controls', 'slide-sidebar');
  toolbar.append(toggle);
  const sidebar = document.createElement('aside');
  sidebar.id = 'slide-sidebar';
  sidebar.setAttribute('aria-label', 'Slide thumbnails');
  sidebar.hidden = true;
  const iconButton = (action, label, drawing) => `<span class="slide-sidebar-action" data-tooltip="${label}"><button type="button" data-action="${action}" aria-label="${label}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${drawing}</svg></button></span>`;
  sidebar.innerHTML = `<header><strong>Slides</strong><button type="button" data-action="close" title="Close thumbnails" aria-label="Close thumbnails">×</button></header>
    <div class="slide-sidebar-actions" role="group" aria-label="Slide actions">
      ${iconButton('add', 'Add slide after current', '<path d="M12 5v14M5 12h14"/>')}
      ${iconButton('duplicate', 'Duplicate slide after current', '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/>')}
      ${iconButton('cut', 'Cut slide', '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="m8 8 12 12M8 16 20 4"/>')}
      ${iconButton('paste', 'Paste slide after current', '<rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 5H5v16h14V5h-3M9 12h6m-3-3v6"/>')}
      ${iconButton('delete', 'Delete slide (keep recoverable backup)', '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>')}
      ${iconButton('recalculate', 'Recalculate indices (space by 10)', '<path d="M10 6h11M10 12h11M10 18h11M3 4h1v4M2 11c0-2 4-2 4 0 0 1-4 3-4 3h4M2 17h3l-2 2h2v2H2"/>')}
      ${iconButton('refresh', 'Refresh thumbnails', '<path d="M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 14 6M4 12a8 8 0 0 0 14 6"/>')}
    </div>
    <p class="slide-sidebar-hint">Click to navigate and edit. Cut, select a destination, then paste after it.</p>
    <p role="status" class="slide-sidebar-status"></p><nav aria-label="Slide thumbnails"></nav>`;
  document.body.append(sidebar);
  installPreviewFrame(reveal, toolbar);
  const status = sidebar.querySelector('[role="status"]');
  const list = sidebar.querySelector('nav');
  const paste = sidebar.querySelector('[data-action="paste"]');
  const cut = sidebar.querySelector('[data-action="cut"]');
  let state, busy = false, observer;
  let cutId = sessionStorage.getItem(cutKey);
  const currentId = () => reveal.getCurrentSlide()?.id;

  async function request(action, input) {
    const response = await fetch(`/__author/${action}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ directory, ...input })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Slide action failed');
    return result;
  }
  function navigate(id) {
    const slide = reveal.getSlides().find(slide => slide.id === id);
    if (!slide) return false;
    const { h, v } = reveal.getIndices(slide);
    reveal.slide(h, v);
    return true;
  }
  function updateSelection() {
    for (const item of list.children) {
      const selected = item.dataset.id === currentId();
      item.querySelector('button').setAttribute('aria-current', selected ? 'true' : 'false');
      item.classList.toggle('is-cut', item.dataset.id === cutId);
    }
    paste.disabled = busy || !cutId || cutId === currentId() || !state;
    cut.disabled = busy || !state;
    sidebar.querySelector('[data-action="duplicate"]').disabled = busy || !state || !state.files.some(file => file.ordered && file.id === currentId());
    sidebar.querySelector('[data-action="delete"]').disabled = busy || !state || state.files.filter(file => file.ordered).length < 2 || !state.files.some(file => file.id === currentId());
    sidebar.querySelector('[data-action="recalculate"]').disabled = busy || !state;
  }
  async function run(action) {
    if (busy) return;
    busy = true;
    sidebar.setAttribute('aria-busy', 'true');
    for (const button of sidebar.querySelectorAll('button')) button.disabled = true;
    status.textContent = '';
    let finish;
    // The preview's build event can arrive before the API response.
    window.slideAuthoringPending = new Promise(resolve => { finish = resolve; });
    try { await action(); }
    catch (error) { status.textContent = error.message; }
    finally {
      busy = false;
      sidebar.removeAttribute('aria-busy');
      for (const button of sidebar.querySelectorAll('button')) button.disabled = false;
      updateSelection();
      finish();
      window.slideAuthoringPending = undefined;
    }
  }
  function previewDocument(slide) {
    // Thumbnails run no scripts: deck modules can finish preparing the source slide
    // (e.g. before their first pass) and adjust the static copy through these events.
    document.dispatchEvent(new CustomEvent('slide-thumbnail:source', { detail: { slide } }));
    const html = document.createElement('html');
    html.className = 'slide-thumbnail';
    const head = document.createElement('head');
    const base = document.createElement('base');
    base.href = new URL('.', location.href).href;
    head.append(base);
    for (const style of document.head.querySelectorAll('link[rel="stylesheet"], style')) {
      if (!style.matches('[data-preview-styles]') && !style.href?.includes('/__author/')) head.append(style.cloneNode(true));
    }
    const overrides = document.createElement('style');
    overrides.textContent = `html,body{margin:0!important;width:1600px!important;height:900px!important;overflow:hidden!important}.reveal{width:1600px!important;height:900px!important}.reveal .slides{position:absolute!important;inset:0!important;margin:0!important;width:1600px!important;height:900px!important;transform:none!important}.reveal .slides>section{display:block!important;opacity:1!important;visibility:visible!important;position:absolute!important;inset:0!important;width:1600px!important;height:900px!important;transform:none!important}.fragment{opacity:1!important;visibility:visible!important}aside.notes,.anchor-link{display:none!important}`;
    head.append(overrides);
    const body = document.createElement('body');
    body.className = 'reveal-standalone';
    const wrapper = document.createElement('div');
    wrapper.className = 'reveal';
    // Preserve the deck's font variables without copying its live frame bounds.
    const deckStyle = document.querySelector('body > .reveal')?.style;
    if (deckStyle) for (const property of deckStyle) {
      if (property.startsWith('--')) wrapper.style.setProperty(property, deckStyle.getPropertyValue(property));
    }
    const slides = document.createElement('div');
    slides.className = 'slides';
    const copy = slide.cloneNode(true);
    document.dispatchEvent(new CustomEvent('slide-thumbnail:copy', { detail: { slide, copy } }));
    copy.classList.remove('past', 'future');
    copy.classList.add('present');
    copy.removeAttribute('hidden');
    copy.removeAttribute('aria-hidden');
    if (slide.dataset.backgroundColor) copy.style.backgroundColor = slide.dataset.backgroundColor;
    copy.querySelectorAll('script, iframe, video, audio, aside.notes').forEach(node => node.remove());
    slides.append(copy); wrapper.append(slides); body.append(wrapper); html.append(head, body);
    return '<!doctype html>' + html.outerHTML;
  }
  function render() {
    observer?.disconnect();
    const existing = new Map([...list.children].map(item => [item.dataset.id, item]));
    const slides = new Map([...document.querySelectorAll('.reveal > .slides > section')].map(slide => [slide.id, slide]));
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        const item = entry.target;
        const slide = slides.get(item.dataset.id);
        if (slide && !item.querySelector('iframe')) {
          const frame = document.createElement('iframe');
          frame.setAttribute('sandbox', 'allow-same-origin');
          frame.setAttribute('tabindex', '-1');
          frame.setAttribute('aria-hidden', 'true');
          frame.title = 'Slide preview';
          frame.srcdoc = previewDocument(slide);
          item.querySelector('.slide-thumbnail').replaceChildren(frame);
        }
        observer.unobserve(item);
      }
    }, { root: list, rootMargin: '200px' });
    const files = state.files.filter(file => file.ordered);
    const ids = new Set(files.map(file => file.id));
    for (const [id, item] of existing) if (!ids.has(id)) item.remove();
    for (const [index, file] of files.entries()) {
      const retained = existing.get(file.id);
      if (retained) {
        retained.querySelector('button').setAttribute('aria-label', `Edit ${file.title}`);
        retained.querySelector('button').title = `Edit ${file.title}`;
        retained.querySelector('.slide-thumbnail-label').textContent = `${file.number} · ${file.title}`;
        // Leave unchanged iframe nodes attached: moving them can reload their documents.
        if (list.children[index] !== retained) list.insertBefore(retained, list.children[index] || null);
        if (!retained.querySelector('iframe')) observer.observe(retained);
        continue;
      }
      const item = document.createElement('div');
      item.className = 'slide-thumbnail-item'; item.dataset.id = file.id;
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `Edit ${file.title}`);
      button.title = `Edit ${file.title}`;
      const preview = document.createElement('span');
      preview.className = 'slide-thumbnail'; preview.setAttribute('aria-hidden', 'true');
      preview.textContent = 'Preview available after rebuild';
      const label = document.createElement('span');
      label.className = 'slide-thumbnail-label';
      label.textContent = `${file.number} · ${file.title}`;
      button.append(preview, label); item.append(button); list.insertBefore(item, list.children[index] || null);
      button.addEventListener('click', () => run(async () => {
        if (!navigate(file.id)) {
          sessionStorage.setItem(pendingKey, file.id);
          status.textContent = 'Waiting for the deck to rebuild…';
        } else sessionStorage.removeItem(pendingKey);
        await request('open', { id: file.id });
      }));
      observer.observe(item);
    }
    updateSelection();
  }
  async function refresh() {
    const response = await fetch(`/__author/collection?directory=${encodeURIComponent(directory)}`);
    state = await response.json();
    if (!response.ok) { const error = state.error; state = undefined; throw new Error(error); }
    if (cutId && !state.files.some(file => file.id === cutId)) {
      cutId = null; sessionStorage.removeItem(cutKey);
    }
    render();
  }
  function setOpen(open) {
    sidebar.hidden = !open;
    document.body.classList.toggle('slide-sidebar-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.title = open ? 'Hide slide thumbnails' : 'Show slide thumbnails';
    sessionStorage.setItem(storageKey, String(open));
    reveal.layout();
    if (open && !state) run(refresh);
  }
  function markCut() {
    cutId = currentId(); sessionStorage.setItem(cutKey, cutId);
    status.textContent = 'Slide cut. Select a destination and choose Paste after. Escape cancels.';
    updateSelection();
  }
  async function insert(moveId, duplicate = false) {
    const result = duplicate
      ? await request('duplicate', { revision: state.revision, id: currentId() })
      : await request('insert', { revision: state.revision, afterId: currentId(), ...(moveId ? { moveId } : {}) });
    state = result.state;
    sessionStorage.setItem(pendingKey, result.id);
    if (moveId) { cutId = null; sessionStorage.removeItem(cutKey); }
    navigate(result.id);
    render();
    status.textContent = `${duplicate ? 'Duplicated as' : moveId ? 'Moved' : 'Created'} ${result.name}.${result.shifted ? ` Shifted ${result.shifted} neighboring slide(s) to make room.` : ''} Waiting for rebuild…`;
    await request('open', { id: result.id });
  }
  toggle.addEventListener('click', () => setOpen(sidebar.hidden));
  sidebar.querySelector('[data-action="close"]').addEventListener('click', () => setOpen(false));
  sidebar.querySelector('[data-action="add"]').addEventListener('click', () => run(() => insert()));
  sidebar.querySelector('[data-action="duplicate"]').addEventListener('click', () => run(() => insert(undefined, true)));
  sidebar.querySelector('[data-action="refresh"]').addEventListener('click', () => run(refresh));
  cut.addEventListener('click', markCut);
  paste.addEventListener('click', () => run(() => insert(cutId)));
  sidebar.querySelector('[data-action="delete"]').addEventListener('click', () => run(async () => {
    const id = currentId();
    const result = await request('delete', { revision: state.revision, id });
    state = result.state;
    if (cutId === id) { cutId = null; sessionStorage.removeItem(cutKey); }
    sessionStorage.setItem(pendingKey, result.nextId);
    navigate(result.nextId);
    render();
    status.textContent = `Deleted ${result.name}. Recoverable copy: ${result.backup}`;
  }));
  sidebar.querySelector('[data-action="recalculate"]').addEventListener('click', () => run(async () => {
    const id = currentId();
    state = await request('recalculate', { revision: state.revision });
    if (id) sessionStorage.setItem(pendingKey, id);
    render();
    status.textContent = 'Indices recalculated: 010, 020, 030… Slide order preserved.';
  }));
  sidebar.addEventListener('keydown', event => {
    if (event.target.matches('input, textarea, [contenteditable="true"]')) return;
    if ((event.metaKey || event.ctrlKey) && ['x', 'v'].includes(event.key.toLowerCase())) {
      event.preventDefault(); event.stopPropagation();
      if (busy || !state) return;
      if (event.key.toLowerCase() === 'x') markCut();
      else if (!paste.disabled) run(() => insert(cutId));
    } else if (event.key === 'Escape') {
      event.stopPropagation(); cutId = null; sessionStorage.removeItem(cutKey); status.textContent = ''; updateSelection();
    }
  });
  reveal.on('slidechanged', updateSelection);
  document.addEventListener('preview:updated', async event => {
    const { changedIds, structural, stylesChanged } = event.detail;
    if (structural) {
      const scrollTop = list.scrollTop;
      await run(refresh);
      list.scrollTop = scrollTop;
    } else {
      for (const item of list.children) {
        if (!stylesChanged && !changedIds.includes(item.dataset.id)) continue;
        const slide = document.getElementById(item.dataset.id);
        const frame = item.querySelector('iframe');
        if (slide && frame) frame.srcdoc = previewDocument(slide);
        if (slide) {
          const title = slide.querySelector('h1,h2')?.textContent.trim();
          const file = state?.files.find(file => file.id === slide.id);
          if (file && title) {
            file.title = title;
            item.querySelector('button').setAttribute('aria-label', `Edit ${title}`);
            item.querySelector('button').title = `Edit ${title}`;
            item.querySelector('.slide-thumbnail-label').textContent = `${file.number} · ${title}`;
          }
        }
      }
    }
    const pending = sessionStorage.getItem(pendingKey);
    if (pending && navigate(pending)) {
      sessionStorage.removeItem(pendingKey);
      status.textContent = '';
    }
    // Source revisions change even when the list itself stays mounted.
    if (!structural && state && !event.detail.draftOnly) {
      const response = await fetch(`/__author/collection?directory=${encodeURIComponent(directory)}`);
      if (response.ok) state = await response.json();
    }
    updateSelection();
  });
  const restore = () => {
    const pending = sessionStorage.getItem(pendingKey);
    if (pending && navigate(pending)) sessionStorage.removeItem(pendingKey);
    setOpen(sessionStorage.getItem(storageKey) === 'true');
  };
  if (reveal.isReady()) restore(); else reveal.on('ready', restore);
}
