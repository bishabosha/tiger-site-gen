const vscode = require('vscode');

// `open` is the generic "open in editor" action of Tiger's live server; `edit-slide` is kept
// for pages built before it existed.
const openPaths = new Set(['/open', '/edit-slide']);

exports.activate = context => {
  require('./site-highlighting.cjs').installSiteHighlighting(vscode, context);
  require('./live-preview.cjs').installLivePreview(vscode, context);
  context.subscriptions.push(vscode.window.registerUriHandler({
    async handleUri(uri) {
      if (!openPaths.has(uri.path)) return;
      const file = new URLSearchParams(uri.query).get('file');
      if (!file) return;
      const resource = vscode.Uri.file(file);
      if (!file.endsWith('.md') || !vscode.workspace.getWorkspaceFolder(resource)) {
        vscode.window.showErrorMessage('Tiger can only open Markdown sources in the open workspace.');
        return;
      }
      const groups = vscode.window.tabGroups;
      const current = groups.activeTabGroup;
      // Every group's active tab is visible, even when another split has keyboard focus.
      // Native integrated-browser tabs have undefined input in VS Code's public API.
      // Protect opaque tabs and webviews rather than guessing from their page titles.
      const protectedGroup = group => {
        const tab = group.activeTab;
        if (!tab) return false;
        const input = tab.input;
        return !input || (vscode.TabInputWebview && input instanceof vscode.TabInputWebview) ||
          ['workbench.editor.browser', 'simpleBrowser.view', 'browserPreview'].includes(input.viewType);
      };
      const candidates = groups.all.filter(group => !protectedGroup(group));
      const existing = candidates.find(group => group.tabs?.some(tab =>
        tab.input instanceof vscode.TabInputText && tab.input.uri.toString() === resource.toString()));
      const target = existing || (candidates.includes(current) ? current : candidates.sort((a, b) =>
        Math.abs(a.viewColumn - current.viewColumn) - Math.abs(b.viewColumn - current.viewColumn))[0]);
      // Beside can reuse a browser split. An explicit new column cannot obscure one.
      const viewColumn = target?.viewColumn ?? Math.max(...groups.all.map(group => group.viewColumn)) + 1;
      try {
        if (viewColumn > vscode.ViewColumn.Nine) {
          throw new Error('No source split is available. Free an editor group while keeping the browser visible.');
        }
        await vscode.window.showTextDocument(resource, {
          viewColumn,
          preview: true,
          preserveFocus: true
        });
      } catch (error) {
        vscode.window.showErrorMessage(`Could not open source: ${error.message}`);
      }
    }
  }));
};
