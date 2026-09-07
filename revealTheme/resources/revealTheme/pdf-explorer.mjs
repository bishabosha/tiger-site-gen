// Local PDF.js viewer, opened by ordinary Markdown links with .explore-pdf.
const dialog = document.querySelector('#pdf-tour');
const scroller = dialog.querySelector('#pdf-scroll');
const status = dialog.querySelector('#pdf-status');
const zoom = dialog.querySelector('#pdf-zoom');
const toolbar = dialog.querySelector('#pdf-toolbar');
const controlsToggle = dialog.querySelector('[data-pdf-action="controls"]');
const zoomButtons = [...dialog.querySelectorAll('[data-pdf-action]')]
  .filter(button => ['fit', 'actual', 'in', 'out'].includes(button.dataset.pdfAction));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const base = new URL('./vendor/pdfjs/', import.meta.url);
let libraries, viewer, linkService, loadingTask, pdf, currentURL;
let generation = 0, opener, previousControls;

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
      viewer: dialog.querySelector('#pdf-pages'),
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
      viewer.currentScaleValue = 'page-fit';
      enableZoom(true);
      scroller.focus();
    });
    eventBus.on('scalechanging', event => {
      zoom.textContent = `${Math.round(event.scale * 100)}%`;
      zoom.setAttribute('aria-label', `${zoom.textContent} zoom. Reset to 100%`);
    });
    eventBus.on('pagerendered', event => {
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
  const request = ++generation;
  opener = link;
  if (!dialog.open) {
    const config = Reveal.getConfig();
    previousControls = { keyboard: config.keyboard, mouseWheel: config.mouseWheel, touch: config.touch };
    Reveal.configure({ keyboard: false, mouseWheel: false, touch: false });
    dialog.showModal();
  }
  const url = link.href;
  dialog.setAttribute('aria-label', link.closest('section')?.querySelector('h1,h2')?.textContent || 'PDF viewer');
  dialog.querySelector('#pdf-original').href = url;
  if (pdf && currentURL === url) {
    viewer.update();
    scroller.focus();
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
function closePDF() {
  if (!dialog.open) return;
  ++generation;
  dialog.close();
  Reveal.configure(previousControls);
  opener?.focus();
  if (!pdf) loadingTask?.destroy().catch(() => {});
}
function toggleControls() {
  toolbar.hidden = !toolbar.hidden;
  const label = toolbar.hidden ? 'Show controls' : 'Hide controls';
  controlsToggle.setAttribute('aria-expanded', String(!toolbar.hidden));
  controlsToggle.setAttribute('aria-label', label);
  controlsToggle.title = `${label} (H)`;
  if (toolbar.hidden && toolbar.contains(document.activeElement)) scroller.focus({ preventScroll: true });
}
function changeZoom(value) {
  if (!pdf) return;
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
  const link = event.target.closest('a.explore-pdf');
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  openPDF(link);
});
dialog.addEventListener('click', event => {
  const action = event.target.closest('[data-pdf-action]')?.dataset.pdfAction;
  if (action === 'close') closePDF();
  if (action === 'controls') toggleControls();
  if (action === 'fit') changeZoom('page-fit');
  if (action === 'actual') changeZoom(1);
  if (action === 'in') changeZoom(viewer.currentScale * 1.25);
  if (action === 'out') changeZoom(viewer.currentScale / 1.25);
});
dialog.addEventListener('cancel', event => { event.preventDefault(); closePDF(); });
dialog.addEventListener('keydown', event => {
  event.stopPropagation();
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const step = 120;
  const moves = {
    ArrowLeft: [-step, 0], ArrowRight: [step, 0],
    ArrowUp: [0, -step], ArrowDown: [0, step],
    PageUp: [0, -scroller.clientHeight * .8], PageDown: [0, scroller.clientHeight * .8],
  };
  if (event.key.toLowerCase() === 'h') {
    event.preventDefault();
    if (!event.repeat) toggleControls();
  } else if (moves[event.key]) {
    event.preventDefault();
    const [left, top] = moves[event.key];
    scroller.scrollBy({ left, top, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  } else if (event.key === '+' || event.key === '=') {
    event.preventDefault();
    if (pdf) changeZoom(viewer.currentScale * 1.25);
  } else if (event.key === '-') {
    event.preventDefault();
    if (pdf) changeZoom(viewer.currentScale / 1.25);
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
window.addEventListener('resize', () => { if (dialog.open && pdf) viewer.update(); });
