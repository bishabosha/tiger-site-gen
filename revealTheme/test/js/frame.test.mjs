import test from 'node:test';
import assert from 'node:assert/strict';
import { previewBounds } from '../../resources/revealTheme/authoring/frame.js';

test('16:9 preview fits wide, tall and split editor windows outside the sidebar and footer', () => {
  for (const [width, height, sidebar, footer] of [[1920,1080,252,72], [640,1000,252,160], [1400,500,0,72]]) {
    const frame = previewBounds(width, height, sidebar, footer);
    assert.ok(Math.abs(frame.width / frame.height - 16 / 9) < 1e-10);
    assert.ok(frame.left >= sidebar + 16);
    assert.ok(frame.top >= 16);
    assert.ok(frame.left + frame.width <= width - 16 + 1e-9);
    assert.ok(frame.top + frame.height <= height - footer - 16 + 1e-9);
  }
});
test('presentation fills the available 16:9 area with space for navigation', () => {
  for (const [width, height] of [[1920,1080], [640,1000], [1400,500]]) {
    const frame = previewBounds(width,height,0,56,0);
    assert.ok(Math.abs(frame.width / frame.height - 16 / 9) < 1e-10);
    assert.ok(frame.left >= 0 && frame.top >= 0);
    assert.ok(frame.left + frame.width <= width + 1e-9);
    assert.ok(frame.top + frame.height <= height - 56 + 1e-9);
    assert.ok(Math.abs(frame.width - width) < 1e-9 || Math.abs(frame.height - (height - 56)) < 1e-9);
  }
});
