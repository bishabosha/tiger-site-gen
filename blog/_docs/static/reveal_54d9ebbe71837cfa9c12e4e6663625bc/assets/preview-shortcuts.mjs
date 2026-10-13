// Iframe key events stay inside their document; install in the deck and viewer.
export function installPreviewCloseShortcut(target, close) {
  target.addEventListener('keydown', event => {
    if (event.key.toLowerCase() !== 'x' || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"])')) return;
    if (!close()) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);
}

installPreviewCloseShortcut(document, () => {
  const button = document.querySelector('.r-overlay-preview .r-overlay-close');
  if (!button) return false;
  button.click();
  return true;
});
