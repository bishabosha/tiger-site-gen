import test from 'node:test';
import assert from 'node:assert/strict';
import { installNavigation } from '../../resources/revealTheme/authoring/navigation.js';

function viewer(client, bus) {
  const events = new EventTarget(), handlers = new Map();
  let slides = [{ id: 'a' }, { id: 'b' }], h = 0, f = -1, ready = true;
  const emit = name => (handlers.get(name) || []).forEach(fn => fn());
  const reveal = {
    on(name, fn) { handlers.set(name, [...handlers.get(name) || [], fn]); },
    isReady: () => ready, getCurrentSlide: () => slides[h], getSlides: () => slides,
    getIndices: slide => slide ? { h: slides.indexOf(slide), v: 0 } : { h, v: 0, f },
    slide(next, v = 0, step = -1) { h = next; f = step; emit('slidechanged'); emit('fragmentshown'); }
  };
  const nav = { subscribe(fn) { bus.listeners.push(fn); if (bus.last) fn(bus.last); },
    async publish(value) { bus.sent.push(value); bus.last = value; bus.listeners.forEach(fn => fn(value)); } };
  installNavigation(reveal, nav, events, client);
  return { reveal, events, emit, position: () => [reveal.getCurrentSlide().id, f],
    replace(next) { slides = next.map(id => ({ id })); }, ready(value) { ready = value; } };
}
const bus = () => ({ listeners: [], sent: [], last: null });
const tick = () => new Promise(resolve => setImmediate(resolve));

test('two viewers synchronize slides and fragments in both directions without echoes', async () => {
  const shared = bus(), chrome = viewer('chrome', shared), editor = viewer('editor', shared);
  chrome.reveal.slide(1, 0, 2);
  await tick();
  assert.deepEqual(editor.position(), ['b', 2]);
  assert.equal(shared.sent.length, 1);
  editor.reveal.slide(0, 0, -1);
  await tick();
  assert.deepEqual(chrome.position(), ['a', -1]);
  assert.equal(shared.sent.length, 2);
  const late = viewer('late', shared);
  assert.deepEqual(late.position(), ['a', -1]);
  assert.equal(shared.sent.length, 2);
});

test('remote navigation uses IDs after reordering and waits for a newly built slide', () => {
  const shared = bus(), editor = viewer('editor', shared);
  editor.replace(['b', 'a']);
  shared.listeners[0]({ target: 'a', step: 1, client: 'chrome' });
  assert.deepEqual(editor.position(), ['a', 1]);
  shared.listeners[0]({ target: 'new', step: -1, client: 'chrome' });
  editor.events.dispatchEvent(new Event('preview:updating'));
  editor.replace(['b', 'a', 'new']);
  editor.reveal.slide(0); // Rebuild-induced navigation is not a user navigation.
  editor.events.dispatchEvent(new Event('preview:updated'));
  assert.deepEqual(editor.position(), ['new', -1]);
  assert.equal(shared.sent.length, 0);
});

test('rapid local navigation sends requests serially and coalesces queued positions', async () => {
  let receive, finish;
  const sent = [];
  // Use a separate event source: this viewer belongs to the delayed transport.
  const nav = { subscribe(fn) { receive = fn; }, publish(value) {
    sent.push(value); return new Promise(resolve => { finish = () => { receive(value); resolve(); }; });
  } };
  const handlers = new Map(); let target = 'a', f = -1;
  const slides = [{ id: 'a' }, { id: 'b' }];
  const reveal = { on(n, fn) { handlers.set(n, fn); }, isReady: () => true,
    getCurrentSlide: () => slides.find(s => s.id === target), getSlides: () => slides,
    getIndices: s => s ? { h: slides.indexOf(s), v: 0 } : { f },
    slide(h, v, step) { target = slides[h].id; f = step; handlers.get('slidechanged')(); } };
  installNavigation(reveal, nav, new EventTarget(), 'local');
  reveal.slide(1, 0, 0); reveal.slide(1, 0, 1); reveal.slide(1, 0, 2);
  assert.equal(sent.length, 1);
  finish(); await tick();
  assert.equal(f, 2);
  assert.equal(sent.length, 2);
  assert.equal(sent[1].step, 2);
  finish(); await tick();
  assert.equal(sent.length, 2);
});
