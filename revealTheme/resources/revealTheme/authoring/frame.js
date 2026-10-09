export function previewBounds(width, height, sidebarWidth, footerHeight, padding = 16) {
  const availableWidth = Math.max(1, width - sidebarWidth - padding * 2);
  const availableHeight = Math.max(1, height - footerHeight - padding * 2);
  const frameWidth = Math.min(availableWidth, availableHeight * 16 / 9);
  const frameHeight = frameWidth * 9 / 16;
  return { width: frameWidth, height: frameHeight,
    left: sidebarWidth + padding + (availableWidth - frameWidth) / 2,
    top: padding + (availableHeight - frameHeight) / 2 };
}

export function installPreviewFrame(reveal, toolbar) {
  const root = document.querySelector('body > .reveal');
  if (!root) return;
  // Narrow editor panes still need a slide canvas, not Reveal's mobile scroll view.
  reveal.configure({ scrollActivationWidth: 0, view: 'slide' });
  const button = toolbar.querySelector('[data-fullscreen]') || document.createElement('button');
  button.removeAttribute('data-fullscreen');
  button.type = 'button';
  button.textContent = 'Present';
  button.setAttribute('aria-label', 'Present');
  button.title = 'Present fullscreen (F)';
  if (!button.isConnected) toolbar.append(button);
  const exit = document.createElement('button');
  exit.type = 'button';
  exit.className = 'slide-present-exit';
  exit.textContent = 'Exit presentation';
  exit.title = 'Return to the editor (Esc)';
  exit.hidden = true;
  document.body.append(exit);
  document.body.classList.add('slide-preview-layout', 'slide-preview-framed');
  let presenting = false, scheduled = false;
  function layout() {
    scheduled = false;
    const sidebar = document.getElementById('slide-sidebar');
    const sidebarWidth = !presenting && sidebar && !sidebar.hidden ? sidebar.getBoundingClientRect().width : 0;
    document.body.style.setProperty('--preview-sidebar-width', `${sidebarWidth}px`);
    const footerHeight = presenting ? 0 : Math.max(72, toolbar.getBoundingClientRect().height + 32);
    const bounds = previewBounds(innerWidth, innerHeight, sidebarWidth, footerHeight, presenting ? 0 : 16);
    for (const [property, value] of Object.entries(bounds)) root.style[property] = `${value}px`;
    reveal.layout();
    document.dispatchEvent(new Event('preview:frame'));
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(layout); }
  }
  function update(active) {
    presenting = active;
    document.body.classList.toggle('slide-presenting', active);
    exit.hidden = !active;
    schedule();
  }
  async function toggle() {
    if (presenting) {
      update(false);
      if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
      button.focus();
    } else {
      reveal.toggleOverview(false);
      update(true);
      exit.focus({ preventScroll: true });
      // Embedded previews may deny fullscreen; clean presentation still works there.
      try { await document.documentElement.requestFullscreen(); } catch {}
    }
  }
  button.addEventListener('click', toggle);
  exit.addEventListener('click', toggle);
  // Unlike Escape, F2 reaches the page in browser fullscreen, including from search.
  function annotatePicker() {
    const picker = document.querySelector('dialog.slide-picker');
    if (!picker || picker.querySelector('.slide-picker-shortcut-hint')) return;
    const hint = document.createElement('p');
    hint.className = 'slide-picker-shortcut-hint';
    hint.textContent = 'F2: open / close picker · O: slide overview (outside search)';
    picker.querySelector('.slide-picker-header')?.after(hint);
    picker.querySelector('.slide-picker-close')?.setAttribute('title', 'Close (F2)');
    const status = picker.querySelector('.slide-picker-status');
    if (status) {
      const updateHint = () => {
        if (status.textContent.includes('Esc to close')) {
          status.textContent = status.textContent.replace('Esc to close', 'F2 to close');
        }
      };
      new MutationObserver(updateHint).observe(status, { childList: true, characterData: true, subtree: true });
      updateHint();
    }
    toolbar.querySelector('[aria-keyshortcuts="g"]')?.setAttribute('title', 'Jump to a slide (G or F2)');
  }
  const pickerObserver = new MutationObserver(annotatePicker);
  pickerObserver.observe(root, { childList: true, subtree: true });
  annotatePicker();
  document.addEventListener('keydown', event => {
    if (event.key === 'F2' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const picker = document.querySelector('dialog.slide-picker');
      if (document.querySelector('dialog[open]') && !picker?.open) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!event.repeat) {
        if (picker?.open) picker.querySelector('.slide-picker-close')?.click();
        else toolbar.querySelector('[aria-keyshortcuts="g"]')?.click();
      }
      return;
    }
    if (event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])') ||
        document.querySelector('dialog[open]') || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key.toLowerCase() !== 'f' && !(event.key === 'Escape' && presenting)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!event.repeat) toggle();
  }, true);
  new ResizeObserver(schedule).observe(toolbar);
  new MutationObserver(schedule).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('resize', schedule);
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && presenting) {
      update(false);
      button.focus();
    }
    schedule();
  });
  reveal.on('ready', schedule);
  document.querySelector('link[data-preview-styles]')?.addEventListener('load', schedule);
  schedule();
}
