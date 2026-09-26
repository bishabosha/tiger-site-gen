import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../extension.cjs', import.meta.url), 'utf8');

class TextInput { constructor(uri) { this.uri = uri; } }
class WebviewInput { constructor(viewType) { this.viewType = viewType; } }
const uri = path => ({ path, toString: () => path });
const textTab = path => ({ input: new TextInput(uri(path)) });
const group = (viewColumn, activeTab, tabs = [activeTab]) => ({ viewColumn, activeTab, tabs: tabs.filter(Boolean) });

function activate(groups, opened, errors = [], active = groups[0]) {
  let handler;
  const vscode = {
    Uri: { file: uri }, ViewColumn: { Beside: -2, Nine: 9 },
    TabInputText: TextInput, TabInputWebview: WebviewInput,
    workspace: { getWorkspaceFolder: () => ({}) },
    window: {
      tabGroups: { all: groups, activeTabGroup: active },
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

const request = { path: '/open', query: new URLSearchParams({ file: '/project/slide.md' }).toString() };

test('keeps the visible browser intact regardless of which split was last active', async () => {
  for (const browserInput of [undefined, new WebviewInput('simpleBrowser.view'), { viewType: 'workbench.editor.browser' }]) {
    for (const browserColumn of [1, 2]) {
      const browser = group(browserColumn, { input: browserInput });
      const code = group(browserColumn === 1 ? 2 : 1, textTab('/project/code.scala'));
      for (const active of [browser, code]) {
        const opened = [];
        await activate([browser, code], opened, [], active).handleUri(request);
        assert.equal(opened[0].options.viewColumn, code.viewColumn);
        assert.equal(opened[0].options.preserveFocus, true);
      }
    }
  }
});

test('creates a new column when every existing split shows a browser', async () => {
  for (const groups of [[group(1, { input: undefined })],
      [group(1, { input: undefined }), group(2, { input: new WebviewInput('simpleBrowser.view') })]]) {
    const opened = [];
    await activate(groups, opened).handleUri(request);
    assert.equal(opened[0].options.viewColumn, groups.length + 1);
  }
});

test('reuses a source already open in a safe split and ignores hidden browser tabs', async () => {
  const groups = [group(1, { input: undefined }), group(2, textTab('/project/other.md')),
    group(3, textTab('/project/slide.md'), [textTab('/project/slide.md'), { input: undefined }])];
  const opened = [];
  await activate(groups, opened, [], groups[1]).handleUri(request);
  assert.equal(opened[0].options.viewColumn, 3);
});

test('does not reuse a source hidden behind a visible browser', async () => {
  const groups = [group(1, { input: undefined }, [{ input: undefined }, textTab('/project/slide.md')]),
    group(2, textTab('/project/code.scala'))];
  const opened = [];
  await activate(groups, opened).handleUri(request);
  assert.equal(opened[0].options.viewColumn, 2);
});

test('uses the active code split or an empty split without opening an unnecessary one', async () => {
  for (const activeTab of [textTab('/project/code.scala'), undefined]) {
    const opened = [];
    await activate([group(1, activeTab)], opened).handleUri(request);
    assert.equal(opened[0].options.viewColumn, 1);
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
