import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { revealPlugin } from '../../resources/revealTheme/authoring/patch.js';

const directory = await mkdtemp(join(tmpdir(), 'reveal-patch-'));
const base = pathToFileURL(directory + '/');
await writeFile(join(directory, 'slide-fit.mjs'), 'export function fitSlides(slides) { slides.forEach(s => s.fitted = true); }');
await writeFile(join(directory, 'slide-picker.mjs'), 'export function installSlidePicker() {}');
after(() => rm(directory, { recursive: true }));

function fixture() {
  const oldDocument = globalThis.document, oldWindow = globalThis.window;
  const calls = { fullSync: 0, configure: [], slides: [], navigation: [] };
  const makeSlide = index => ({ id: `slide-${index}`, tagName: 'SECTION', text: 'original',
    dataset: { timing: '10' }, isConnected: true,
    get outerHTML() { return JSON.stringify([this.id, this.text, this.dataset]); },
    querySelector() { return { textContent: this.id }; }, querySelectorAll() { return []; },
    remove() { this.isConnected = false; container.children.splice(container.children.indexOf(this), 1); }
  });
  const previousSlides = Array.from({ length: 90 }, (_, i) => makeSlide(i));
  const incoming = Array.from({ length: 90 }, (_, i) => makeSlide(i));
  const container = { children: Array.from({ length: 90 }, (_, i) => makeSlide(i)),
    querySelectorAll() { return this.children; },
    insertBefore(slide, before) {
      const index = this.children.indexOf(slide);
      if (index >= 0) this.children.splice(index, 1);
      this.children.splice(before ? this.children.indexOf(before) : this.children.length, 0, slide);
    }
  };
  const selected = container.children[89];
  const reveal = { isReady: () => true, getCurrentSlide: () => selected,
    getIndices: slide => slide ? { h: container.children.indexOf(slide), v: 0 } : { h: 89, v: 0, f: 2 },
    configure(config) { calls.configure.push(config); this.sync(); },
    sync() { calls.fullSync++; }, syncSlide(slide) { calls.slides.push(slide); },
    slide(...args) { calls.navigation.push(args); }, getPlugin: () => undefined, removeKeyBinding() {}
  };
  globalThis.window = { Reveal: reveal };
  globalThis.document = { querySelector(selector) {
    if (selector === '.reveal > .slides') return container;
    if (selector.startsWith('body')) return {};
    return null;
  }, dispatchEvent() {}, importNode: slide => slide };
  return { incoming, container, selected, calls,
    async update(options = {}) {
      return revealPlugin(base).update({ previous: { querySelectorAll: () => previousSlides },
        next: { querySelectorAll: () => incoming }, draft: true, stylesChanged: false,
        morph(target, before, next) { target.text = next.text; target.dataset = { ...next.dataset }; },
        refreshImages: async () => {}, ...options });
    },
    restore() { globalThis.document = oldDocument; globalThis.window = oldWindow; }
  };
}

test('a text edit in a 90-slide deck only syncs and fits its slide, preserving navigation', async () => {
  const f = fixture();
  try {
    f.incoming[89].text = 'edited';
    await f.update();
    assert.equal(f.calls.fullSync, 0);
    assert.deepEqual(f.calls.slides, [f.selected]);
    assert.deepEqual(f.container.children.filter(s => s.fitted), [f.selected]);
    assert.equal(f.selected.text, 'edited');
    assert.deepEqual(f.calls.navigation, [[89, 0, 2]]);
  } finally { f.restore(); }
});

test('timing and visibility edits recalculate numbering with exactly one full sync', async () => {
  const f = fixture();
  try {
    f.incoming[89].dataset = { timing: '0', visibility: 'uncounted' };
    await f.update();
    assert.equal(f.calls.fullSync, 1);
    assert.equal(f.calls.configure[0].totalTime, 890);
    assert.deepEqual(f.calls.configure[0].slideNumber(f.selected), ['A1']);
    assert.deepEqual(f.calls.configure[0].slideNumber(f.container.children[0]), [1, '/', 89]);
  } finally { f.restore(); }
});

test('removing the current slide updates the deck once and selects a valid slide', async () => {
  const f = fixture();
  try {
    f.incoming.pop();
    await f.update();
    assert.equal(f.calls.fullSync, 1);
    assert.equal(f.container.children.length, 89);
    assert.equal(f.selected.isConnected, false);
    assert.deepEqual(f.calls.navigation, [[88]]);
  } finally { f.restore(); }
});

test('global styles refit all slides and synchronize once without reconfiguring', async () => {
  const f = fixture();
  try {
    await f.update({ stylesChanged: true });
    assert.equal(f.calls.fullSync, 1);
    assert.equal(f.calls.configure.length, 0);
    assert.equal(f.container.children.filter(s => s.fitted).length, 90);
  } finally { f.restore(); }
});
