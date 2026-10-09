import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../site-highlighting.cjs', import.meta.url), 'utf8');
const tick = () => new Promise(resolve => setImmediate(resolve));

test('provider scopes to source roots, refreshes on grammar changes, and clears deleted registrations', async () => {
  const folder = { name:'site', uri:{scheme:'file',fsPath:'/project'} };
  let provider, onCreate, onChange, onRemove, onGrant, version=0, deleted=false, refreshed=0, disposed=0;
  const subscriptions=[];
  const vscode={
    EventEmitter: class { event=()=>{}; fire(){refreshed++;} dispose(){} },
    SemanticTokensLegend: class {},
    SemanticTokensBuilder: class { rows=[]; push(range,type){this.rows.push({range,type});} build(){return this.rows;} },
    Range: class { constructor(line,start,endLine,end){Object.assign(this,{line,start,endLine,end});} },
    RelativePattern:class {},
    window:{createOutputChannel:()=>({appendLine(){},dispose(){}})},
    languages:{registerDocumentSemanticTokensProvider(selector,value){assert.equal(selector.language,'markdown');provider=value;return {dispose(){}};}},
    workspace:{isTrusted:true,workspaceFolders:[folder],getWorkspaceFolder:()=>folder,
      createFileSystemWatcher:()=>({onDidCreate:f=>(onCreate=f,{dispose(){}}),onDidChange:f=>(onChange=f,{dispose(){}}),onDidDelete:f=>(onRemove=f,{dispose(){}}),dispose(){}}),
      onDidChangeWorkspaceFolders:()=>({dispose(){}}),onDidGrantWorkspaceTrust:f=>(onGrant=f,{dispose(){}})}
  };
  const core={tokenTypes:['keyword'],within:(root,file)=>file.startsWith(root+'/'),
    async loadSite(){if(deleted)throw Object.assign(new Error(),{code:'ENOENT'});return {sources:['/project/content'],files:new Set(['/project/grammars/test.tmLanguage.json']),version:++version,dispose(){disposed++;}};},
    tokenize:(text,site)=>[{line:0,start:site.version,length:4,type:'keyword'}]};
  const module={exports:{}};
  vm.runInNewContext(source,{module,require:name=>name==='node:path'?path:core});
  module.exports.installSiteHighlighting(vscode,{subscriptions});await tick();
  const doc={uri:{scheme:'file',fsPath:'/project/content/slide.md'},getText:()=>''};
  const cancel={isCancellationRequested:false};
  assert.equal(provider.provideDocumentSemanticTokens(doc,cancel)[0].range.start,1);
  assert.equal(provider.provideDocumentSemanticTokens({...doc,uri:{fsPath:'/project/README.md'}},cancel).length,0);
  onChange({fsPath:'/project/grammars/test.tmLanguage.json'});await tick();
  assert.equal(provider.provideDocumentSemanticTokens(doc,cancel)[0].range.start,2);
  assert.equal(disposed,1);
  onCreate({fsPath:'/project/.tiger-grammars.json'});await tick();
  assert.equal(provider.provideDocumentSemanticTokens(doc,cancel)[0].range.start,3);
  onChange({fsPath:'/project/.tiger-grammars.json'});await tick();
  assert.equal(provider.provideDocumentSemanticTokens(doc,cancel)[0].range.start,4);
  onRemove({fsPath:'/project/.tiger-grammars.json'});await tick();
  assert.equal(provider.provideDocumentSemanticTokens(doc,cancel)[0].range.start,5);
  deleted=true;onRemove({fsPath:'/project/.tiger-editor.json'});await tick();
  assert.equal(provider.provideDocumentSemanticTokens(doc,cancel).length,0);
  assert.equal(disposed,5);
  deleted=false;vscode.workspace.isTrusted=false;onChange({fsPath:'/project/.tiger-editor.json'});await tick();
  assert.equal(provider.provideDocumentSemanticTokens(doc,cancel).length,0);
  vscode.workspace.isTrusted=true;onGrant();await tick();
  assert.equal(provider.provideDocumentSemanticTokens(doc,cancel)[0].range.start,6);
  assert.ok(refreshed>=5);
  subscriptions.forEach(d=>d.dispose());
});
