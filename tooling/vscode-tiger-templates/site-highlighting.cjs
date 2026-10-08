const path = require('node:path');
const { tokenTypes, loadSite, tokenize, within } = require('./site-grammars.cjs');

function installSiteHighlighting(vscode, context) {
  const changed = new vscode.EventEmitter();
  const output = vscode.window.createOutputChannel('Tiger site grammars');
  const sites = new Map();
  const legend = new vscode.SemanticTokensLegend(tokenTypes, []);
  let disposed = false;
  async function reload(folder) {
    const key = folder.uri.fsPath;
    let entry = sites.get(key);
    if (!entry) { entry = { generation: 0, site: null }; sites.set(key, entry); }
    const generation = ++entry.generation;
    try {
      const site = vscode.workspace.isTrusted ? await loadSite(key) : null;
      if (disposed || sites.get(key) !== entry || generation !== entry.generation) { site?.dispose(); return; }
      entry.site?.dispose(); entry.site = site;
    } catch (error) {
      if (disposed || generation !== entry.generation || sites.get(key) !== entry) return;
      entry.site?.dispose(); entry.site = null;
      if (error.code !== 'ENOENT') output.appendLine(`${folder.name}: ${error.message}`);
    }
    changed.fire();
  }
  function add(folder) {
    if (folder.uri.scheme !== 'file') return;
    const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(folder, '**/{.tiger-editor.json,.tiger-grammars.json,*.tmLanguage.json}'));
    const refresh = uri => {
      const entry = sites.get(folder.uri.fsPath);
      if (['.tiger-editor.json', '.tiger-grammars.json'].some(name => uri.fsPath === path.join(folder.uri.fsPath, name)) || !entry?.site || entry.site.files.has(uri.fsPath)) reload(folder);
    };
    const listeners = [watcher.onDidCreate(refresh), watcher.onDidChange(refresh), watcher.onDidDelete(refresh)];
    const entry = { generation: 0, site: null, dispose() { watcher.dispose(); listeners.forEach(l => l.dispose()); this.site?.dispose(); } };
    sites.set(folder.uri.fsPath, entry);
    reload(folder);
  }
  const provider = {
    onDidChangeSemanticTokens: changed.event,
    provideDocumentSemanticTokens(document, cancellation) {
      const builder = new vscode.SemanticTokensBuilder(legend);
      if (!vscode.workspace.isTrusted || cancellation.isCancellationRequested) return builder.build();
      const folder = vscode.workspace.getWorkspaceFolder(document.uri);
      const site = folder && sites.get(folder.uri.fsPath)?.site;
      if (site && site.sources.some(root => within(root, document.uri.fsPath))) {
        try {
          for (const token of tokenize(document.getText(), site, () => cancellation.isCancellationRequested)) {
            builder.push(new vscode.Range(token.line, token.start, token.line, token.start + token.length), token.type);
          }
        } catch (error) { output.appendLine(`Highlighting: ${error.message}`); }
      }
      return builder.build();
    }
  };
  context.subscriptions.push(changed, output,
    vscode.languages.registerDocumentSemanticTokensProvider({ language: 'markdown', scheme: 'file' }, provider, legend),
    vscode.workspace.onDidChangeWorkspaceFolders(event => {
      for (const folder of event.removed) { sites.get(folder.uri.fsPath)?.dispose(); sites.delete(folder.uri.fsPath); }
      event.added.forEach(add); changed.fire();
    }),
    vscode.workspace.onDidGrantWorkspaceTrust(() => { for (const folder of vscode.workspace.workspaceFolders ?? []) reload(folder); }),
    { dispose() { disposed = true; for (const entry of sites.values()) entry.dispose(); sites.clear(); } }
  );
  for (const folder of vscode.workspace.workspaceFolders ?? []) add(folder);
}
module.exports = { installSiteHighlighting };
