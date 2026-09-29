// The live server shares navigation across browsers, scoped to this deck's page route.
// IDs survive reordering; fragments are shared too. Remote moves never open the editor.
export function installNavigation(reveal, navigation, events = document, client = crypto.randomUUID()) {
  let applying = false, patching = false, pending, sending = false, queued;
  let lastSent, submitted;
  const current = () => ({ target: reveal.getCurrentSlide()?.id, step: reveal.getIndices().f ?? -1, client });
  const same = (a, b) => a?.target === b?.target && a?.step === b?.step;
  function apply() {
    if (!pending || !reveal.isReady() || patching) return;
    const slide = reveal.getSlides().find(slide => slide.id === pending.target);
    if (!slide) return; // A new slide's build may arrive after its navigation event.
    const value = pending;
    pending = undefined;
    applying = true;
    try {
      const { h, v } = reveal.getIndices(slide);
      reveal.slide(h, v, value.step);
      lastSent = current();
    } finally { applying = false; }
  }
  async function drain() {
    if (sending) return;
    sending = true;
    try {
      while (queued) {
        const value = queued;
        queued = undefined;
        submitted = value;
        try { await navigation.publish(value); }
        catch (error) { console.warn(error.message); }
      }
    } finally { sending = false; }
  }
  function changed() {
    if (applying || patching || !reveal.isReady()) return;
    const value = current();
    if (!value.target || same(value, lastSent)) return;
    pending = undefined; // An explicit local move supersedes a missing remote slide.
    lastSent = value;
    queued = value;
    drain(); // Serialize rapid key presses so older requests cannot arrive last.
  }
  navigation.subscribe(value => {
    if (value.client === client) {
      // Do not rewind rapid local navigation to an earlier in-flight request.
      if (queued || !same(value, submitted)) return;
    } else queued = undefined;
    pending = value;
    apply();
  });
  for (const name of ['slidechanged', 'fragmentshown', 'fragmenthidden']) reveal.on(name, changed);
  reveal.on('ready', apply);
  events.addEventListener('preview:updating', () => { patching = true; });
  events.addEventListener('preview:updated', () => { patching = false; apply(); });
}
