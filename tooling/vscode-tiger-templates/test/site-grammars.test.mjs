import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, copyFile, mkdir, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { loadSite, tokenize, fencedRegions } = require('../site-grammars.cjs');
const traceFile = new URL('./fixtures/trace.tmLanguage.json', import.meta.url);
const manifest = { version: 1, sources: ['content'], blocks: [{ name: 'decoder', fences: [{ fence: 'trace', grammar: 'grammars/trace.tmLanguage.json' }] }] };
async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'tiger-grammar-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'grammars'));
  await copyFile(traceFile, path.join(root, 'grammars/trace.tmLanguage.json'));
  await writeFile(path.join(root, '.tiger-editor.json'), JSON.stringify(manifest));
  return root;
}
const example = ':::decoder\n\n```trace\nsource (port = [[port:5432]])\nfields port:Int host:String\nread Ref = @config\nstep Publish the object\n# comment\nobject host = "db"\n```\n:::';
function tokenAt(source, tokens, row, word) {
  const index = source.split(/\r?\n/)[row].indexOf(word); assert.ok(index >= 0);
  return tokens.find(t => t.line === row && t.start <= index && t.start + t.length > index)?.type;
}
test('trace commands, types, references, literals and markers have semantic types', async t => {
  const site = await loadSite(await fixture(t)); t.after(() => site.dispose());
  const tokens = tokenize(example, site);
  for (const [line, word, type] of [[3,'source','keyword'],[3,'port:','parameter'],[3,'5432','number'],[4,'Int','type'],[5,'@config','variable'],[6,'Publish','string'],[7,'#','comment'],[8,'"db"','string']]) assert.equal(tokenAt(example,tokens,line,word),type);
  assert.ok(tokens.every(t => t.line > 2 && t.line < 9));
  assert.deepEqual(tokenize(example,site,()=>true),[]);
});
test('standalone fences, other blocks, examples, comments and frontmatter stay untouched', async t => {
  const site = await loadSite(await fixture(t)); t.after(() => site.dispose());
  for (const source of ['```trace\nread Int = 1\n```', example.replace(':::decoder',':::other'), '````markdown\n'+example+'\n````', '<!--\n'+example+'\n-->', '---scala\n'+example+'\n---', '---\n'+example+'\n---']) assert.deepEqual(tokenize(source,site),[],source);
  const nested=':::decoder\n:::other\n```trace\nread Int = 1\n```\n:::\n```trace\nread Int = 2\n```\n:::';
  assert.deepEqual([...new Set(tokenize(nested,site).map(t=>t.line))],[7]);
});
test('quotes, lists, CRLF, tilde fences and incomplete buffers preserve source positions', async t => {
  const site = await loadSite(await fixture(t)); t.after(() => site.dispose());
  for (const prefix of ['', '> ', '  ']) {
    const source = (prefix === '  ' ? '- Item\n' : '') + example.split('\n').map(l=>prefix+l).join('\r\n');
    const row=source.split(/\r?\n/).findIndex(l=>l.includes('read Ref')), tokens=tokenize(source,site);
    assert.equal(tokenAt(source,tokens,row,'read'),'keyword');
    assert.equal(tokenAt(source,tokens,row,'@config'),'variable');
  }
  const incomplete=':::outer\n:::decoder\n~~~trace\nread Int = 42';
  assert.equal(tokenAt(incomplete,tokenize(incomplete,site),3,'42'),'number');
  const literal=':::decoder\n````markdown\n:::other\n```trace\nread Int = 99\n```\n:::\n````\n~~~trace\nread Int = 1\n~~~\n:::';
  assert.deepEqual(fencedRegions(literal).map(r=>[r.block,r.fence]),[['decoder','markdown'],['decoder','trace']]);
  assert.deepEqual([...new Set(tokenize(literal,site).map(t=>t.line))],[9]);
});
test('grammar reloads change highlighting and do not share registries across sites', async t => {
  const root=await fixture(t), old=await loadSite(root);t.after(()=>old.dispose());
  await writeFile(path.join(root,'grammars/trace.tmLanguage.json'),JSON.stringify({scopeName:'source.decoder-trace',patterns:[{match:'read',name:'entity.name.function.custom'}]}));
  const next=await loadSite(root);t.after(()=>next.dispose());
  assert.equal(tokenAt(example,tokenize(example,old),5,'read'),'keyword');
  assert.equal(tokenAt(example,tokenize(example,next),5,'read'),'function');
});
test('invalid metadata, traversal, external files and symlinks fail closed', async t => {
  const root=await fixture(t);
  for(const grammar of ['../escape.tmLanguage.json','/tmp/escape.tmLanguage.json','https://example.com/x.tmLanguage.json']) {
    const changed=structuredClone(manifest);changed.blocks[0].fences[0].grammar=grammar;
    await writeFile(path.join(root,'.tiger-editor.json'),JSON.stringify(changed));
    await assert.rejects(loadSite(root),/workspace/);
  }
  const external=await mkdtemp(path.join(tmpdir(),'tiger-external-'));t.after(()=>rm(external,{recursive:true,force:true}));
  await copyFile(traceFile,path.join(external,'external.tmLanguage.json'));
  await symlink(path.join(external,'external.tmLanguage.json'),path.join(root,'grammars/link.tmLanguage.json'));
  const changed=structuredClone(manifest);changed.blocks[0].fences[0].grammar='grammars/link.tmLanguage.json';
  await writeFile(path.join(root,'.tiger-editor.json'),JSON.stringify(changed));
  await assert.rejects(loadSite(root),/workspace/);
  await writeFile(path.join(root,'.tiger-editor.json'),'{unfinished');
  await assert.rejects(loadSite(root),SyntaxError);
});

test('colon-labelled square markers retain label and literal token types', async t => {
  const site = await loadSite(await fixture(t)); t.after(() => site.dispose());
  const source = example;
  const tokens = tokenize(source, site);
  assert.equal(tokenAt(source,tokens,3,'port:'),'parameter');
  assert.equal(tokenAt(source,tokens,3,'5432'),'number');
  assert.equal(tokenAt(source,tokens,3,':5432'),'operator');
  const old = source.replace('[[port:5432]]','[[port|5432]]');
  assert.notEqual(tokenAt(old,tokenize(old,site),3,'port|'),'parameter');
});
