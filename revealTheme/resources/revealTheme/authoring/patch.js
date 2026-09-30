// Reveal plugin for the Tiger live client. Builds and drafts patch only
// the changed <section>s, so Reveal, the preview frame, the thumbnail sidebar and presentation
// mode stay mounted: section identity is kept (Reveal and the slide picker hold references),
// insertions, removals and reordering update navigation, timings and slide numbers, slides are
// re-fitted and re-highlighted, and the slide picker is rebuilt when titles change.
const sections = doc => [...doc.querySelectorAll('.reveal > .slides > section')];

/** @param base the deck's URL (its code paths and modules are relative to it). */
export function revealPlugin(base) {
  return {
    name: 'reveal',
    base,
    codePaths: ['deck.js', 'slide-fit.mjs', 'slide-picker.mjs'],
    async beforeUpdate() {
      const reveal = window.Reveal;
      if (reveal && !reveal.isReady()) await new Promise(resolve => reveal.on('ready', resolve));
      // Studio actions finish before the build they caused is applied.
      await window.slideAuthoringPending;
      document.dispatchEvent(new Event('preview:updating'));
    },
    async update({ previous, next, revision, draft, stylesChanged, morph, refreshImages }) {
      const reveal = window.Reveal;
      const incoming = sections(next);
      if (!reveal?.isReady() || !incoming.length || !document.querySelector('body[data-render-mode="live"]')) return 'reload';
      const previousSlides = new Map(sections(previous).map(slide => [slide.id, slide]));
      const container = document.querySelector('.reveal > .slides');
      const existing = new Map([...container.querySelectorAll(':scope > section')].map(slide => [slide.id, slide]));
      const currentId = reveal.getCurrentSlide()?.id;
      const indices = reveal.getIndices();
      const oldIds = [...existing.keys()];
      const newIds = incoming.map(slide => slide.id);
      const structural = JSON.stringify(oldIds) !== JSON.stringify(newIds);
      const changed = incoming.filter(slide => slide.outerHTML !== previousSlides.get(slide.id)?.outerHTML);
      if (!draft && !changed.length && !structural && !stylesChanged) await refreshImages(container, revision);
      const { fitSlides } = await import(new URL('slide-fit.mjs', base));
      const updated = [];
      for (const source of changed) {
        let slide = existing.get(source.id);
        if (!slide) {
          slide = document.importNode(source, true);
          existing.set(source.id, slide);
        } else morph(slide, previousSlides.get(source.id), source);
        updated.push(slide);
      }
      if (structural) {
        for (const [id, slide] of existing) if (!newIds.includes(id)) slide.remove();
        incoming.forEach((source, index) => {
          const slide = existing.get(source.id);
          if (container.children[index] !== slide) container.insertBefore(slide, container.children[index] || null);
        });
      }
      if (updated.length || stylesChanged || structural) {
        const all = [...container.children].filter(node => node.tagName === 'SECTION');
        // configure() already performs a full sync, rebuilding every slide background.
        // Text edits only need the changed slides synchronized; retain a full pass for
        // deck membership, numbering/timing changes, or global stylesheet changes.
        const configurationChanged = structural || changed.some(slide => {
          const old = previousSlides.get(slide.id);
          return slide.dataset.timing !== old?.dataset.timing ||
            slide.dataset.visibility !== old?.dataset.visibility;
        });
        fitSlides(stylesChanged ? all : updated);
        if (configurationChanged) {
          const main = all.filter(slide => slide.dataset.visibility !== 'uncounted');
          const appendix = all.filter(slide => slide.dataset.visibility === 'uncounted');
          reveal.configure({
            totalTime: main.reduce((total, slide) => total + Number(slide.dataset.timing), 0),
            slideNumber: slide => main.includes(slide) ? [main.indexOf(slide) + 1, '/', main.length] : [`A${appendix.indexOf(slide) + 1}`]
          });
        } else if (stylesChanged) reveal.sync();
        else updated.forEach(slide => reveal.syncSlide(slide));
        // slide() below restores fragment state and performs the layout pass.
        const selected = existing.get(currentId);
        if (selected?.isConnected) {
          const position = reveal.getIndices(selected);
          reveal.slide(position.h, position.v, indices.f);
        } else reveal.slide(Math.min(indices.h, all.length - 1));
        const highlight = reveal.getPlugin('highlight');
        for (const slide of updated) {
          slide.querySelectorAll('pre code').forEach(block => highlight?.highlightBlock(block));
          slide.querySelectorAll('img').forEach(img => img.addEventListener('load', () => fitSlides([slide]), { once: true }));
        }
        // Picker entries cache titles and search text, so rebuild only when those change.
        const title = slide => slide?.querySelector('h1,h2')?.textContent;
        if (structural || changed.some(slide => title(slide) !== title(previousSlides.get(slide.id)))) {
          const dialog = document.querySelector('dialog.slide-picker');
          const open = dialog?.open;
          const query = dialog?.querySelector('input')?.value;
          dialog?.querySelector('.slide-picker-close')?.click();
          dialog?.remove();
          document.querySelector('.presentation-tools [aria-keyshortcuts="g"]')?.remove();
          reveal.removeKeyBinding(71);
          const { installSlidePicker } = await import(new URL('slide-picker.mjs', base));
          installSlidePicker(reveal, document.querySelector('body > .reveal'));
          if (open) {
            document.querySelector('.presentation-tools [aria-keyshortcuts="g"]').click();
            const input = document.querySelector('dialog.slide-picker input');
            input.value = query; input.dispatchEvent(new Event('input'));
          }
        }
      }
      document.dispatchEvent(new CustomEvent('preview:updated', { detail: {
        changedIds: updated.map(slide => slide.id), structural, stylesChanged, draftOnly: draft
      } }));
      return true;
    }
  };
}
