/** A requested size is fixed. Automatic slides use the largest readable size that fits. */
export function chooseFontSize(fits, fixedSize) {
  if (fixedSize !== undefined) {
    if (!Number.isFinite(fixedSize) || fixedSize <= 0) throw new RangeError('fontSize must be positive');
    return { size: fixedSize, overflow: !fits(fixedSize) };
  }
  // Never silently shrink an automatic slide below the readable floor.
  let low = 28, high = 44;
  const overflow = !fits(low);
  if (!overflow && fits(high)) low = high;
  else if (!overflow) {
    while (high - low > .25) {
      const middle = (low + high) / 2;
      if (fits(middle)) low = middle;
      else high = middle;
    }
  }
  return { size: low, overflow };
}

// Fit the whole composition at one type scale, keeping its hierarchy consistent.
// Measure an offscreen copy: inactive Reveal slides have no usable layout boxes.
export function fitSlides(slides, scope = document.body) {
  const ruler = document.createElement('div');
  ruler.className = 'reveal fit-measure';
  ruler.setAttribute('aria-hidden', 'true');
  const track = ruler.appendChild(document.createElement('div'));
  track.className = 'slides';
  scope.appendChild(ruler);
  try {
    for (const slide of slides) {
      const source = slide.querySelector('.slide-body');
      const section = document.createElement('section');
      section.className = slide.className;
      const body = source.cloneNode(true);
      body.removeAttribute('data-overflow');
      body.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      section.appendChild(body);
      track.replaceChildren(section);
      const fits = size => {
        body.style.setProperty('--slide-font-size', `${size}px`);
        // Check nested allocations as well as the canvas; a compressed column can
        // otherwise overlap a footer while remaining inside the slide's bounds.
        for (const container of [body, ...body.querySelectorAll('.stack,.columns,pre')]) {
          const rect = container.getBoundingClientRect();
          const css = getComputedStyle(container);
          const top = rect.top + parseFloat(css.paddingTop);
          const bottom = rect.bottom - parseFloat(css.paddingBottom);
          const left = rect.left + parseFloat(css.paddingLeft);
          const right = rect.right - parseFloat(css.paddingRight);
          for (const child of container.children) {
            const r = child.getBoundingClientRect();
            if (!r.width && !r.height) continue;
            if (r.top < top - 1 || r.bottom > bottom + 1 || r.left < left - 1 || r.right > right + 1) return false;
          }
        }
        return [...body.querySelectorAll('pre,code,table,p,h1,h2,h3')].every(node =>
          !node.clientWidth || node.scrollWidth <= node.clientWidth + 1);
      };
      const requested = source.dataset.fontSize;
      const { size, overflow } = chooseFontSize(fits, requested === undefined ? undefined : Number(requested));
      source.style.setProperty('--slide-font-size', `${size}px`);
      source.toggleAttribute('data-overflow', overflow);
      source.dataset.fitted = 'true';
    }
  } finally {
    ruler.remove();
  }
}

/** Scope measuring elements to the same document/shadow root as the slides. */
export async function installSlideFitting(reveal, container, scope = document.body) {
  const slides = [...container.querySelectorAll('.slides > section')];
  const fit = () => fitSlides(slides, scope);
  let frame;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(fit);
  };
  const onLoad = event => {
    if (event.target instanceof HTMLImageElement && !event.target.closest('.fit-measure')) schedule();
  };
  await document.fonts.ready;
  if (!container.isConnected) return () => {};
  fit();
  reveal.on('resize', schedule);
  document.fonts.addEventListener('loadingdone', schedule);
  container.addEventListener('load', onLoad, true);
  window.addEventListener('beforeprint', fit);
  return () => {
    cancelAnimationFrame(frame);
    reveal.off('resize', schedule);
    document.fonts.removeEventListener('loadingdone', schedule);
    container.removeEventListener('load', onLoad, true);
    window.removeEventListener('beforeprint', fit);
  };
}
