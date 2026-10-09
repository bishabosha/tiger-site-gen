import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseFontSize } from '../../resources/revealTheme/slide-fit.mjs';

test('automatic sizes fit within the readable range', () => {
  assert.deepEqual(chooseFontSize(() => true), { size: 44, overflow: false });
  const result = chooseFontSize(size => size <= 36.4);
  assert(result.size <= 36.4 && result.size > 36.15);
  assert.equal(result.overflow, false);
  assert.deepEqual(chooseFontSize(() => false), { size: 28, overflow: true });
});

test('fixed sizes survive changes in available space and report overflow', () => {
  assert.deepEqual(chooseFontSize(size => size <= 60, 40), { size: 40, overflow: false });
  assert.deepEqual(chooseFontSize(size => size <= 36, 40), { size: 40, overflow: true });
  assert.deepEqual(chooseFontSize(size => size <= 60, 40), { size: 40, overflow: false });
});

test('an explicit size may exceed the automatic range', () => {
  assert.deepEqual(chooseFontSize(() => true, 52), { size: 52, overflow: false });
  assert.deepEqual(chooseFontSize(() => true, 24), { size: 24, overflow: false });
});

test('invalid fixed sizes are rejected', () => {
  for (const size of [0, -1, NaN, Infinity]) {
    assert.throws(() => chooseFontSize(() => true, size), RangeError);
  }
});
