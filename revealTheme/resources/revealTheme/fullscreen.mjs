// Fullscreen belongs to the document, so slides and the PDF share one mode.
const buttons = [...document.querySelectorAll('[data-fullscreen]')];
const statuses = [...document.querySelectorAll('.fullscreen-status')];

function updateControls() {
  const label = document.fullscreenElement ? 'Exit fullscreen' : 'Fullscreen';
  for (const button of buttons) {
    const text = button.querySelector('[data-fullscreen-label]');
    if (text) text.textContent = label;
    button.setAttribute('aria-label', label);
    button.title = `${label} (F)`;
  }
  for (const status of statuses) status.hidden = true;
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    for (const status of statuses) {
      status.textContent = 'Fullscreen is unavailable here. Open this presentation in a browser window and use its fullscreen command.';
      status.hidden = false;
    }
  }
}

document.addEventListener('fullscreenchange', updateControls);
document.addEventListener('click', event => {
  if (event.target.closest('[data-fullscreen]')) toggleFullscreen();
});
// Capture before Reveal or the PDF dialog handles keys, without changing their controls.
document.addEventListener('keydown', event => {
  const exiting = event.key === 'Escape' && document.fullscreenElement;
  if (!exiting && (event.key.toLowerCase() !== 'f' || event.ctrlKey || event.metaKey || event.altKey)) return;
  if (!exiting && event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (!event.repeat) toggleFullscreen();
}, true);
updateControls();
