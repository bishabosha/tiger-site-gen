const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

// Unsaved Markdown drafts for a running Tiger live server (LiveSite#dev or serve). Eligible
// documents are Markdown files under the `sources` listed in the workspace folder's
// .tiger-editor.json (written by every site build); the server checks the rest.
exports.installLivePreview = (vscode, context) => {
  const session = randomUUID();
  const pending = new Map(), connections = new Map();
  let sequence = 0, disposed = false, sending = false;
  const output = vscode.window.createOutputChannel('Tiger live preview');
  const markdown = document => document.uri.scheme === 'file' && document.uri.fsPath.endsWith('.md');
  async function sources(folder) {
    try {
      const manifest = JSON.parse(await fs.readFile(path.join(folder, '.tiger-editor.json'), 'utf8'));
      return Array.isArray(manifest.sources) ? manifest.sources.filter(source => typeof source === 'string') : [];
    } catch { return []; }
  }
  async function eligible(document, folder) {
    if (!markdown(document)) return false;
    return (await sources(folder)).some(source => {
      const relative = path.relative(path.resolve(folder, source), document.uri.fsPath);
      return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
    });
  }
  async function send(document, clear = false) {
    if (disposed || !vscode.workspace.isTrusted || !markdown(document)) return;
    const folder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (!folder || !await eligible(document, folder.uri.fsPath)) return;
    const input = { file: document.uri.fsPath, session, sequence: ++sequence,
      ...(clear ? { clear: true } : { text: document.getText() }) };
    try {
      const connection = JSON.parse(await fs.readFile(path.join(folder.uri.fsPath, '.live-preview.json'), 'utf8'));
      if (!Number.isInteger(connection.port) || connection.port < 1 || connection.port > 65535) return;
      const response = await fetch(`http://127.0.0.1:${connection.port}/__preview/draft`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${connection.token}` },
        body: JSON.stringify(input), signal: AbortSignal.timeout(6000)
      });
      // Incomplete Markdown (422) is normal while typing: the preview keeps its last valid state.
      // 404: a Markdown file that no page of the site shows.
      if (!response.ok && response.status !== 422 && response.status !== 404) {
        output.appendLine(`Preview unavailable (${response.status}); start the site's live server (dev).`);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') output.appendLine(`Preview connection: ${error.message}`);
    }
  }
  // Keep one request in flight, and only the newest buffer for each queued file.
  // A debounce delays every keystroke; overlapping requests make the renderer spend
  // time on obsolete buffers and can suppress all previews until typing stops.
  function schedule(document, clear = false) {
    if (disposed || !markdown(document)) return;
    pending.set(document.uri.fsPath, { document, clear });
    if (sending) return;
    sending = true;
    Promise.resolve().then(async () => {
      try {
        while (!disposed && pending.size) {
          const [file, { document, clear }] = pending.entries().next().value;
          pending.delete(file);
          await send(document, clear);
        }
      } finally { sending = false; }
    });
  }
  const poll = setInterval(async () => {
    if (disposed || !vscode.workspace.isTrusted) return;
    for (const folder of vscode.workspace.workspaceFolders || []) {
      try {
        const value = await fs.readFile(path.join(folder.uri.fsPath, '.live-preview.json'), 'utf8');
        if (connections.get(folder.uri.fsPath) !== value) {
          connections.set(folder.uri.fsPath, value);
          for (const document of vscode.workspace.textDocuments) if (document.isDirty) schedule(document);
        }
      } catch {}
    }
  }, 1500);
  poll.unref?.();
  context.subscriptions.push(output,
    vscode.workspace.onDidChangeTextDocument(event => { if (event.contentChanges.length) schedule(event.document); }),
    vscode.workspace.onDidSaveTextDocument(document => schedule(document)),
    vscode.workspace.onDidCloseTextDocument(document => {
      schedule(document, true);
    }),
    { dispose() { disposed = true; clearInterval(poll); pending.clear(); } }
  );
  for (const document of vscode.workspace.textDocuments) if (document.isDirty) schedule(document);
};
