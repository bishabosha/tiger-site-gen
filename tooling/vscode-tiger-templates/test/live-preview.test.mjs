import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const source = await readFile(new URL('../live-preview.cjs', import.meta.url), 'utf8');

/** A fake VS Code with one workspace folder at /project and the given .tiger-editor.json. */
function install({ manifest = { version: 1, sources: ['content'], blocks: [] }, status = 200, transport } = {}) {
  const handlers = {}, requests = [], subscriptions = [];
  const vscode = {
    window: { createOutputChannel: () => ({ appendLine() {}, dispose() {} }) },
    workspace: { isTrusted: true, workspaceFolders: [], textDocuments: [],
      getWorkspaceFolder: () => ({ uri: { fsPath: '/project' } }),
      onDidChangeTextDocument: fn => { handlers.changed = fn; return { dispose() {} }; },
      onDidSaveTextDocument: fn => { handlers.saved = fn; return { dispose() {} }; },
      onDidCloseTextDocument: fn => { handlers.closed = fn; return { dispose() {} }; }
    }
  };
  const context = { exports: {}, require: name => name === 'node:fs/promises' ? {
    readFile: async file => {
      if (file.endsWith('.tiger-editor.json')) {
        if (!manifest) throw Object.assign(new Error('missing'), { code: 'ENOENT' });
        return JSON.stringify(manifest);
      }
      return JSON.stringify({ port: 8123, token: 'local-token' });
    }
  } : require(name), setTimeout, clearTimeout, setInterval, clearInterval, AbortSignal,
    fetch: async (url, options) => { requests.push({ url, ...JSON.parse(options.body) });
      if (transport) await transport();
      return { ok: status === 200, status }; } };
  vm.runInNewContext(source, context);
  context.exports.installLivePreview(vscode, { subscriptions });
  return { vscode, handlers, requests, dispose: () => subscriptions.forEach(value => value.dispose()) };
}
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

test('typing sends latest unsaved text without a debounce, and closing clears the draft', async () => {
  const { vscode, handlers, requests, dispose } = install();
  const doc = { uri: { scheme: 'file', fsPath: '/project/content/blog/articles/010 - title.md' },
    isDirty: true, text: 'first draft', getText() { return this.text; } };
  handlers.changed({ document: doc, contentChanges: [{}] });
  doc.text = 'latest unsaved draft'; handlers.changed({ document: doc, contentChanges: [{}] });
  await pause(90);
  assert.equal(requests.length, 1); assert.equal(requests[0].text, doc.text);
  assert.equal(requests[0].url, 'http://127.0.0.1:8123/__preview/draft');
  handlers.saved(doc); await pause(90);
  assert.equal(requests.length, 2);
  handlers.closed(doc); await pause(20);
  assert.equal(requests.at(-1).clear, true);
  assert.ok(requests.at(-1).sequence > requests[0].sequence);
  vscode.workspace.isTrusted = false;
  handlers.changed({ document: doc, contentChanges: [{}] }); await pause(90);
  assert.equal(requests.length, 3);
  dispose();
});

test('Markdown under the site manifest\'s sources is eligible; other files are not', async () => {
  const { handlers, requests, dispose } = install({ manifest: { version: 1, sources: ['content', 'blog/_docs'], blocks: [] } });
  const files = ['/project/content/other-talk/slides/020 - next.md', '/project/content/index.md',
    '/project/blog/_docs/articles/001 - post.md', '/project/content/deep/a/b/notes.md',
    '/project/README.md', '/project/content/notes.txt', '/project/contentious/a.md', '/project/blog/_docs-draft/x.md'];
  for (const fsPath of files) handlers.changed({ document: { uri: { scheme: 'file', fsPath }, isDirty: true, getText: () => 'x' }, contentChanges: [{}] });
  await pause(90);
  assert.deepEqual(requests.map(request => request.file).sort(), files.slice(0, 4).sort());
  dispose();
});

test('without a site manifest nothing is sent', async () => {
  const { handlers, requests, dispose } = install({ manifest: null });
  handlers.changed({ document: { uri: { scheme: 'file', fsPath: '/project/content/index.md' }, isDirty: true, getText: () => 'x' }, contentChanges: [{}] });
  await pause(90);
  assert.equal(requests.length, 0);
  dispose();
});

const flush = () => new Promise(resolve => setImmediate(resolve));
const document = (name = 'index', text = 'first') => ({
  uri: { scheme: 'file', fsPath: `/project/content/${name}.md` },
  isDirty: true, text, getText() { return this.text; }
});

test('slow renders stay serial and send only the latest queued text immediately afterwards', async () => {
  const completions = [];
  const { handlers, requests, dispose } = install({ transport: () => new Promise(resolve => completions.push(resolve)) });
  try {
    const doc = document();
    const type = text => { doc.text = text; handlers.changed({ document: doc, contentChanges: [{}] }); };
    type('first');
    await flush();
    assert.equal(requests.length, 1, 'first edit must start without waiting for a timer');
    for (const text of ['second', 'third', 'latest']) { type(text); await flush(); }
    assert.equal(requests.length, 1, 'typing must not queue obsolete renders on the server');
    completions.shift()(); await flush();
    assert.equal(requests.length, 2);
    assert.equal(requests[1].text, 'latest');
    assert.ok(requests[1].sequence > requests[0].sequence);
    completions.shift()(); await flush();
    assert.equal(requests.length, 2);
  } finally { dispose(); completions.forEach(resolve => resolve()); }
});

test('closing replaces queued text with a clear, without dropping another document', async () => {
  const completions = [];
  const { handlers, requests, dispose } = install({ transport: () => new Promise(resolve => completions.push(resolve)) });
  try {
    const a = document('a'), b = document('b');
    handlers.saved(a); await flush();
    a.text = 'queued'; handlers.saved(a); handlers.saved(b); handlers.closed(a);
    completions.shift()(); await flush();
    assert.equal(requests[1].clear, true);
    assert.equal(requests[1].text, undefined);
    completions.shift()(); await flush();
    assert.equal(requests[2].file, b.uri.fsPath);
    completions.shift()(); await flush();
    assert.equal(requests.length, 3);
  } finally { dispose(); completions.forEach(resolve => resolve()); }
});

test('failed requests release the queue and disposal drops pending edits', async () => {
  const completions = [];
  const { handlers, requests, dispose } = install({ transport: () => new Promise((resolve, reject) => completions.push({ resolve, reject })) });
  const doc = document();
  handlers.saved(doc); await flush();
  doc.text = 'retry'; handlers.saved(doc);
  completions.shift().reject(new Error('offline')); await flush();
  assert.equal(requests[1].text, 'retry');
  doc.text = 'never sent'; handlers.saved(doc); dispose();
  completions.shift().resolve(); await flush();
  assert.equal(requests.length, 2);
});
