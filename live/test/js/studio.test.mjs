import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';

// Exercise the actual module served by /__author/, without starting its DOM UI.
const html = await readFile(new URL('../../resources/live/studio/index.html', import.meta.url), 'utf8');
const script = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
const { moveSelection, selectRange, validGroupOrder } = await import(`data:text/javascript;base64,${Buffer.from(script).toString('base64')}`);
const order = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

test('gathers separated runs into one block in deck order, preserving all other pages', () => {
  const selection = ['f', 'b', 'e'];
  const next = moveSelection(order, selection, 'c', 'after');
  assert.deepEqual(next, ['a', 'c', 'b', 'e', 'f', 'd', 'g']);
  assert.deepEqual(next.filter(name => !selection.includes(name)), ['a', 'c', 'd', 'g']);
  assert.equal(new Set(next).size, order.length);
  assert.deepEqual(order, ['a', 'b', 'c', 'd', 'e', 'f', 'g'], 'the undo snapshot stays intact');
});
test('moves a group backwards before its destination without reversing it', () => {
  assert.deepEqual(moveSelection(order, ['f', 'd'], 'b', 'before'), ['a', 'd', 'f', 'b', 'c', 'e', 'g']);
});
test('moves a group forwards after its destination using its position after removal', () => {
  assert.deepEqual(moveSelection(order, ['a', 'c', 'd'], 'f', 'after'), ['b', 'e', 'f', 'a', 'c', 'd', 'g']);
});
test('supports pasting at either boundary, including the entire selection', () => {
  assert.deepEqual(moveSelection(order, ['c', 'f'], null, 'start'), ['c', 'f', 'a', 'b', 'd', 'e', 'g']);
  assert.deepEqual(moveSelection(order, ['a', 'e'], null, 'end'), ['b', 'c', 'd', 'f', 'g', 'a', 'e']);
  assert.deepEqual(moveSelection(order, [...order].reverse(), null, 'end'), order);
});
test('ignores a destination within the selected block, empty selections and missing targets', () => {
  assert.strictEqual(moveSelection(order, ['b', 'd'], 'd'), order);
  assert.strictEqual(moveSelection(order, [], 'f'), order);
  assert.strictEqual(moveSelection(order, ['a'], 'missing'), order);
  assert.strictEqual(moveSelection(order, ['a'], 'c', 'invalid'), order);
});
test('Shift selection joins distinct ranges, and can deselect a range', () => {
  const first = selectRange(order, new Set(['f']), 'b', 'd');
  assert.deepEqual([...first], ['f', 'b', 'c', 'd']);
  assert.deepEqual([...selectRange(order, first, 'c', 'b', false)], ['f', 'd']);
  assert.deepEqual([...selectRange(order, new Set(), undefined, 'e')], ['e']);
});
test('bulk moves keep main slides before appendices and refuse mixed group inversions', () => {
  const files = order.map((name, i) => ({ name, group: i < 4 ? 'main' : 'appendix' }));
  const groups = ['main', 'appendix'];
  assert.equal(validGroupOrder(moveSelection(order, ['a', 'c'], 'd'), files, groups), true);
  assert.equal(validGroupOrder(moveSelection(order, ['a', 'c'], 'f'), files, groups), false);
  assert.equal(validGroupOrder(moveSelection(order, ['b', 'f'], 'c'), files, groups), false);
  assert.equal(validGroupOrder(order, files, []), true);
});
