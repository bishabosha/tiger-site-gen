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
      // A browser tab has no activeTextEditor: use the tab group itself.
      const groups = vscode.window.tabGroups;
      const current = groups.activeTabGroup;
      const opposite = groups.all.filter(group => group !== current)
        .sort((a, b) => Math.abs(a.viewColumn - current.viewColumn) - Math.abs(b.viewColumn - current.viewColumn))[0];
      try {
        await vscode.window.showTextDocument(resource, {
          viewColumn: opposite?.viewColumn ?? vscode.ViewColumn.Beside,
          preview: true,
          preserveFocus: true
        });
      } catch (error) {
        vscode.window.showErrorMessage(`Could not open source: ${error.message}`);
      }
    }
  }));
};
