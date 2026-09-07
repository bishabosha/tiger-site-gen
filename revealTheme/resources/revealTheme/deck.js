/* Reveal theme browser behavior. reveal.js is MIT licensed. */
'use strict';
const deckParams = new URLSearchParams(location.search);
const slides = [...document.querySelectorAll('.slides > section')];
const mainSlides = slides.filter(slide => slide.dataset.visibility !== 'uncounted');
const appendices = slides.filter(slide => slide.dataset.visibility === 'uncounted');
const revealReady = Reveal.initialize({
  width: 1600,
  height: 900,
  margin: 0,
  minScale: 0.15,
  maxScale: 2,
  center: false,
  hash: true,
  history: true,
  controls: true,
  controlsTutorial: false,
  progress: true,
  transition: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'none' : 'fade',
  transitionSpeed: 'fast',
  backgroundTransition: 'none',
  totalTime: mainSlides.reduce((total, slide) => total + Number(slide.dataset.timing), 0),
  autoSlide: 0,
  pdfMaxPagesPerSlide: 1,
  showNotes: deckParams.has('show-notes') ? 'separate-page' : false,
  slideNumber: slide => {
    const current = slide || Reveal.getCurrentSlide();
    const index = mainSlides.indexOf(current);
    return index >= 0 ? [index + 1, '/', mainSlides.length] : [`A${appendices.indexOf(current) + 1}`];
  },
  plugins: [RevealNotes, RevealHighlight]
});

revealReady.then(async () => {
  const { installSlideFitting } = await import('./slide-fit.mjs');
  await installSlideFitting(Reveal, document.querySelector('.reveal'));
});
