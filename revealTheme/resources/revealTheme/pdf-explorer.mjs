// Local document explorer: PDF.js for .explore-pdf, native images for .explore-image.
const dialog = document.querySelector('#pdf-tour');
const scroller = dialog.querySelector('#pdf-scroll');
const pages = dialog.querySelector('#pdf-pages');
const imageStage = document.createElement('div');
imageStage.className = 'explorer-image-stage';
imageStage.hidden = true;
scroller.append(imageStage);
const status = dialog.querySelector('#pdf-status');
const zoom = dialog.querySelector('#pdf-zoom');
const toolbar = dialog.querySelector('#pdf-toolbar');
const controlsToggle = dialog.querySelector('[data-pdf-action="controls"]');
const zoomButtons = [...dialog.querySelectorAll('[data-pdf-action]')]
  .filter(button => ['fit', 'actual', 'in', 'out'].includes(button.dataset.pdfAction));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const base = new URL('./vendor/pdfjs/', import.meta.url);
let libraries, viewer, linkService, loadingTask, pdf, currentURL;
let generation = 0, opener, previousControls, mode;
let photo, photoURL, photoScale = 1, photoFitted = true;
const positions = { pdf: { left: 0, top: 0 }, image: { left: 0, top: 0 } };

function showScale(scale) {
  zoom.textContent = `${Math.round(scale * 100)}%`;
  zoom.setAttribute('aria-label', `${zoom.textContent} zoom. Reset to 100%`);
}
function rememberPosition() {
  if (dialog.open && mode) positions[mode] = { left: scroller.scrollLeft, top: scroller.scrollTop };
}
function restorePosition() {
  scroller.scrollTo({ ...positions[mode], behavior: 'instant' });
  scroller.focus({ preventScroll: true });
}
function openExplorer(link, kind) {
  rememberPosition();
  const request = ++generation;
  opener = link;
  mode = kind;
  if (!dialog.open) {
    const config = Reveal.getConfig();
    previousControls = { keyboard: config.keyboard, mouseWheel: config.mouseWheel, touch: config.touch };
    Reveal.configure({ keyboard: false, mouseWheel: false, touch: false });
    dialog.showModal();
  }
  pages.hidden = kind !== 'pdf';
  imageStage.hidden = kind !== 'image';
  const label = kind === 'image' ? 'image' : 'PDF';
  dialog.setAttribute('aria-label', link.closest('section')?.querySelector('h1,h2')?.textContent || `${label} viewer`);
  scroller.setAttribute('aria-label', `${label}: scroll or drag to explore`);
  const original = dialog.querySelector('#pdf-original');
  original.href = link.href;
  original.title = `Open original ${label}`;
  original.setAttribute('aria-label', original.title);
  delete dialog.dataset.ready;
  enableZoom(false);
  message(`Loading ${label}…`);
  return request;
}
function fittedPhotoScale() {
  return Math.min(scroller.clientWidth / photo.naturalWidth, scroller.clientHeight / photo.naturalHeight);
}
function sizePhoto(scale) {
  photoScale = scale;
  const width = photo.naturalWidth * scale, height = photo.naturalHeight * scale;
  photo.style.width = `${width}px`;
  photo.style.height = `${height}px`;
  imageStage.style.width = `${Math.max(width, scroller.clientWidth)}px`;
  imageStage.style.height = `${Math.max(height, scroller.clientHeight)}px`;
  showScale(scale);
}
function zoomPhoto(value) {
  if (!photo) return;
  // Keep the image point beneath the viewport center fixed, including centered letterboxing.
  const offsetX = (imageStage.clientWidth - photo.naturalWidth * photoScale) / 2;
  const offsetY = (imageStage.clientHeight - photo.naturalHeight * photoScale) / 2;
  const x = (scroller.scrollLeft + scroller.clientWidth / 2 - offsetX) / photoScale;
  const y = (scroller.scrollTop + scroller.clientHeight / 2 - offsetY) / photoScale;
  photoFitted = value === 'page-fit';
  const scale = photoFitted ? fittedPhotoScale() : Math.max(Math.min(.1, fittedPhotoScale()), Math.min(8, value));
  sizePhoto(scale);
  scroller.scrollTo({
    left: x * scale + (imageStage.clientWidth - photo.naturalWidth * scale) / 2 - scroller.clientWidth / 2,
    top: y * scale + (imageStage.clientHeight - photo.naturalHeight * scale) / 2 - scroller.clientHeight / 2,
    behavior: 'instant',
  });
}
async function openImage(link) {
  const request = openExplorer(link, 'image');
  if (photo && photoURL === link.href) {
    sizePhoto(photoFitted ? fittedPhotoScale() : photoScale);
    message('');
    enableZoom(true);
    dialog.dataset.ready = 'true';
    restorePosition();
    return;
  }
  imageStage.replaceChildren();
  photo = null;
  photoURL = null;
  imageStage.style.width = imageStage.style.height = '100%';
  try {
    const image = new Image();
    image.alt = link.closest('section')?.querySelector('img')?.alt || link.textContent;
    image.draggable = false;
    image.src = link.href;
    await image.decode();
    if (request !== generation || !dialog.open) return;
    photo = image;
    photoURL = link.href;
    imageStage.replaceChildren(photo);
    photoFitted = true;
    sizePhoto(fittedPhotoScale());
    positions.image = { left: 0, top: 0 };
    message('');
    enableZoom(true);
    dialog.dataset.ready = 'true';
    restorePosition();
  } catch (error) {
    if (request === generation && dialog.open) {
      message('Could not open image. Open the original with ↗.');
      console.error('Image viewer:', error);
    }
  }
}
function currentScale() { return mode === 'image' ? photoScale : viewer?.currentScale; }
function ready() { return mode === 'image' ? !!photo : !!pdf; }

function message(text) {
  status.textContent = text;
  status.hidden = !text;
}
function enableZoom(enabled) {
  zoomButtons.forEach(button => button.disabled = !enabled);
}
async function prepareViewer() {
  libraries ??= (async () => {
    const core = await import(new URL('pdf.mjs', base));
    globalThis.pdfjsLib = core; // Required by PDF.js's standalone viewer module.
    core.GlobalWorkerOptions.workerSrc = new URL('pdf.worker.mjs', base).href;
    const ui = await import(new URL('pdf_viewer.mjs', base));
    return { core, ui };
  })();
  const { core, ui } = await libraries;
  if (!dialog.open) return core;
  if (!viewer) {
    const eventBus = new ui.EventBus();
    linkService = new ui.PDFLinkService({ eventBus, externalLinkTarget: 2 });
    viewer = new ui.PDFViewer({
      container: scroller,
      viewer: pages,
      eventBus,
      linkService,
      removePageBorders: true,
      annotationMode: core.AnnotationMode.ENABLE,
      enableDetailCanvas: true,
      maxCanvasPixels: 16 * 1024 * 1024,
      minDurationToUpdateCanvas: 150,
    });
    linkService.setViewer(viewer);
    eventBus.on('pagesinit', () => {
      if (mode !== 'pdf' || !dialog.open) return;
      viewer.currentScaleValue = 'page-fit';
      enableZoom(true);
      scroller.focus();
    });
    eventBus.on('scalechanging', event => {
      if (mode === 'pdf') showScale(event.scale);
    });
    eventBus.on('pagerendered', event => {
      if (mode !== 'pdf' || !dialog.open) return;
      if (event.error) message('Could not render PDF. Open the original with ↗.');
      else {
        message('');
        dialog.dataset.ready = 'true';
      }
    });
  }
  return core;
}

async function openPDF(link) {
  const request = openExplorer(link, 'pdf');
  const url = link.href;
  if (pdf && currentURL === url) {
    viewer.update();
    showScale(viewer.currentScale);
    message('');
    enableZoom(true);
    dialog.dataset.ready = 'true';
    restorePosition();
    return;
  }
  delete dialog.dataset.ready;
  enableZoom(false);
  message('Loading PDF…');
  try {
    const core = await prepareViewer();
    if (request !== generation || !dialog.open) return;
    viewer.setDocument(null);
    pdf = null;
    currentURL = null;
    await loadingTask?.destroy();
    if (request !== generation || !dialog.open) return;
    loadingTask = core.getDocument({
      url,
      cMapUrl: new URL('cmaps/', base).href,
      cMapPacked: true,
      standardFontDataUrl: new URL('standard_fonts/', base).href,
      wasmUrl: new URL('wasm/', base).href,
      iccUrl: new URL('iccs/', base).href,
      isEvalSupported: false,
    });
    const document = await loadingTask.promise;
    if (request !== generation || !dialog.open) {
      await document.destroy();
      return;
    }
    pdf = document;
    currentURL = url;
    linkService.setDocument(pdf, url);
    viewer.setDocument(pdf);
    message('Rendering PDF…');
  } catch (error) {
    if (request === generation && dialog.open) {
      message('Could not open PDF. Open the original with ↗.');
      console.error('PDF viewer:', error);
    }
  }
}
function releaseExplorerControls() {
  if (!previousControls) return;
  ++generation;
  stopDrag();
  const controls = previousControls;
  previousControls = null;
  Reveal.configure(controls);
  opener?.focus({ preventScroll: true });
  if (!pdf) loadingTask?.destroy().catch(() => {});
}
function closeExplorer() {
  if (dialog.open) {
    rememberPosition();
    dialog.close();
  }
  releaseExplorerControls();
}
// Native closure must release Reveal too. Ignore a queued close after reopening.
dialog.addEventListener('close', () => {
  if (!dialog.open) releaseExplorerControls();
});
document.addEventListener('fullscreenchange', () => {
  if (!dialog.open) return;
  if (!document.fullscreenElement) {
    // Browsers can consume Escape without delivering a key or cancel event.
    closeExplorer();
  } else {
    // Fullscreen adds a new top-layer entry: raise the modal above it again.
    rememberPosition();
    dialog.close();
    dialog.showModal();
    resizeExplorer();
    restorePosition();
  }
});
function toggleControls() {
  toolbar.hidden = !toolbar.hidden;
  const label = toolbar.hidden ? 'Show controls' : 'Hide controls';
  controlsToggle.setAttribute('aria-expanded', String(!toolbar.hidden));
  controlsToggle.setAttribute('aria-label', label);
  controlsToggle.title = `${label} (H)`;
  if (toolbar.hidden && toolbar.contains(document.activeElement)) scroller.focus({ preventScroll: true });
}
function changeZoom(value) {
  if (!ready()) return;
  if (mode === 'image') { zoomPhoto(value); return; }
  // Preserve the point at the center while the PDF viewer resizes its page.
  const x = (scroller.scrollLeft + scroller.clientWidth / 2) / scroller.scrollWidth;
  const y = (scroller.scrollTop + scroller.clientHeight / 2) / scroller.scrollHeight;
  viewer.currentScaleValue = typeof value === 'number' ? String(Math.max(.1, Math.min(8, value))) : value;
  scroller.scrollTo({
    left: scroller.scrollWidth * x - scroller.clientWidth / 2,
    top: scroller.scrollHeight * y - scroller.clientHeight / 2,
    behavior: 'instant',
  });
}

document.addEventListener('click', event => {
  const link = event.target.closest('a.explore-pdf, a.explore-image');
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (link.classList.contains('explore-image')) openImage(link);
  else openPDF(link);
});
dialog.addEventListener('click', event => {
  const action = event.target.closest('[data-pdf-action]')?.dataset.pdfAction;
  if (action === 'close') closeExplorer();
  if (action === 'controls') toggleControls();
  if (action === 'fit') changeZoom('page-fit');
  if (action === 'actual') changeZoom(1);
  if (action === 'in') changeZoom(currentScale() * 1.25);
  if (action === 'out') changeZoom(currentScale() / 1.25);
});
dialog.addEventListener('cancel', event => { event.preventDefault(); closeExplorer(); });
dialog.addEventListener('keydown', event => {
  event.stopPropagation();
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const step = 120;
  const moves = {
    ArrowLeft: [-step, 0], ArrowRight: [step, 0],
    ArrowUp: [0, -step], ArrowDown: [0, step],
    PageUp: [0, -scroller.clientHeight * .8], PageDown: [0, scroller.clientHeight * .8],
  };
  if (event.key.toLowerCase() === 'x' || event.key === 'Escape') {
    event.preventDefault();
    closeExplorer();
  } else if (event.key.toLowerCase() === 'h') {
    event.preventDefault();
    if (!event.repeat) toggleControls();
  } else if (moves[event.key]) {
    event.preventDefault();
    const [left, top] = moves[event.key];
    scroller.scrollBy({ left, top, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  } else if (event.key === '+' || event.key === '=') {
    event.preventDefault();
    if (ready()) changeZoom(currentScale() * 1.25);
  } else if (event.key === '-') {
    event.preventDefault();
    if (ready()) changeZoom(currentScale() / 1.25);
  }
});

let drag;
scroller.addEventListener('pointerdown', event => {
  if (event.button !== 0 || event.pointerType === 'touch' || event.target.closest('a,button,input')) return;
  drag = { x: event.clientX, y: event.clientY, left: scroller.scrollLeft, top: scroller.scrollTop };
  scroller.setPointerCapture(event.pointerId);
  scroller.classList.add('dragging');
  event.preventDefault();
});
scroller.addEventListener('pointermove', event => {
  if (!drag) return;
  scroller.scrollTo({ left: drag.left + drag.x - event.clientX, top: drag.top + drag.y - event.clientY, behavior: 'instant' });
});
function stopDrag() { drag = null; scroller.classList.remove('dragging'); }
scroller.addEventListener('pointerup', stopDrag);
scroller.addEventListener('pointercancel', stopDrag);
scroller.addEventListener('lostpointercapture', stopDrag);
function resizeExplorer() {
  if (!dialog.open) return;
  if (mode === 'image' && photo) zoomPhoto(photoFitted ? 'page-fit' : photoScale);
  else if (mode === 'pdf' && pdf) viewer.update();
}
window.addEventListener('resize', resizeExplorer);
