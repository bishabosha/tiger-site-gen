import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../extension.cjs', import.meta.url), 'utf8');

function activate(groups, opened, errors = []) {
  let handler;
  const vscode = {
    Uri: { file: path => ({ path }) }, ViewColumn: { Beside: -2 },
    workspace: { getWorkspaceFolder: () => ({}) },
    window: {
      tabGroups: { all: groups, activeTabGroup: groups[0] },
      registerUriHandler: value => { handler = value; return {}; },
      showTextDocument: async (resource, options) => { opened.push({ resource, options }); },
      showErrorMessage: message => errors.push(message)
    }
  };
  const context = { exports: {}, require: name => name === 'vscode' ? vscode : { installLivePreview() {}, installSiteHighlighting() {} }, URLSearchParams };
  vm.runInNewContext(source, context);
  context.exports.activate({ subscriptions: [] });
  return handler;
}

test('opens opposite either browser group, or creates a split, without taking focus', async () => {
  for (const columns of [[1, 2], [2, 1], [1]]) {
    const opened = [];
    const handler = activate(columns.map(viewColumn => ({ viewColumn })), opened);
    await handler.handleUri({ path: '/open', query: new URLSearchParams({ file: '/project/content/articles/040 - post.md' }).toString() });
    assert.equal(opened[0].resource.path, '/project/content/articles/040 - post.md');
    assert.equal(opened[0].options.viewColumn, columns[1] ?? -2);
    assert.equal(opened[0].options.preserveFocus, true);
  }
});

test('edit-slide stays an alias; other paths and non-Markdown files are refused', async () => {
  const opened = [], errors = [];
  const handler = activate([{ viewColumn: 1 }], opened, errors);
  await handler.handleUri({ path: '/edit-slide', query: new URLSearchParams({ file: '/project/040 - slide.md' }).toString() });
  await handler.handleUri({ path: '/other', query: new URLSearchParams({ file: '/project/a.md' }).toString() });
  await handler.handleUri({ path: '/open', query: new URLSearchParams({ file: '/project/secret.txt' }).toString() });
  assert.deepEqual(opened.map(entry => entry.resource.path), ['/project/040 - slide.md']);
  assert.equal(errors.length, 1);
});
