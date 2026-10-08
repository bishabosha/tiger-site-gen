const fs = require('node:fs/promises');
const path = require('node:path');
const MarkdownIt = require('markdown-it');
const textmate = require('vscode-textmate');
const oniguruma = require('vscode-oniguruma');

const tokenTypes = ['keyword', 'type', 'variable', 'property', 'function', 'string', 'number', 'comment', 'operator', 'parameter', 'namespace'];
let onig;
function onigLib() {
  return onig ??= fs.readFile(require.resolve('vscode-oniguruma/release/onig.wasm')).then(async bytes => {
    await oniguruma.loadWASM(bytes);
    return { createOnigScanner: patterns => new oniguruma.OnigScanner(patterns), createOnigString: text => new oniguruma.OnigString(text) };
  });
}
function semanticType(scopes) {
  for (const scope of [...scopes].reverse()) {
    if (/^comment\b/.test(scope)) return 'comment';
    if (/^string\b/.test(scope)) return 'string';
    if (/^constant.numeric\b/.test(scope)) return 'number';
    if (/^keyword.operator\b/.test(scope)) return 'operator';
    if (/^(keyword|storage|constant.language)\b/.test(scope)) return 'keyword';
    if (/^(entity.name.type|support.type|support.class)\b/.test(scope)) return 'type';
    if (/^(entity.name.function|support.function)\b/.test(scope)) return 'function';
    if (/^variable.parameter\b/.test(scope)) return 'parameter';
    if (/^(variable.other.property|entity.other.attribute-name)\b/.test(scope)) return 'property';
    if (/^entity.name.namespace\b/.test(scope)) return 'namespace';
    if (/^(variable|entity.name)\b/.test(scope)) return 'variable';
  }
}
const markdown = new MarkdownIt('commonmark');
// Let Markdown handle code examples, HTML, quotes and lists; only add Tiger markers.
markdown.block.ruler.before('fence', 'tiger-marker', (state, start, end, silent) => {
  if (state.sCount[start] - state.blkIndent >= 4) return false;
  const line = state.src.slice(state.bMarks[start] + state.tShift[start], state.eMarks[start]);
  const match = /^:::(?:([A-Za-z][A-Za-z0-9_-]*)(?:\s+.*)?)?\s*$/.exec(line);
  if (!match) return false;
  if (!silent) {
    const token = state.push(match[1] ? 'tiger_open' : 'tiger_close', '', 0);
    token.meta = match[1]; token.map = [start, start + 1]; state.line = start + 1;
  }
  return true;
}, { alt: ['paragraph', 'reference', 'blockquote', 'list'] });
markdown.block.ruler.before('tiger-marker', 'tiger-frontmatter', (state, start, end, silent) => {
  if (start !== 0 || !/^\uFEFF?---(?:scala)?[ \t]*$/.test(state.src.slice(0, state.eMarks[0]))) return false;
  if (!silent) {
    let next = 1;
    while (next < end && !/^---[ \t]*$/.test(state.src.slice(state.bMarks[next], state.eMarks[next]))) next++;
    state.line = Math.min(next + 1, end);
  }
  return true;
});
function templateRegions(source) {
  const stack = [], regions = [];
  let depth = 0;
  for (const token of markdown.parse(source, {})) {
    if (token.nesting === -1) { depth--; while (stack.at(-1)?.depth > depth) stack.pop(); }
    if (token.type === 'tiger_open') stack.push({ name: token.meta, depth });
    else if (token.type === 'tiger_close') { if (stack.at(-1)?.depth === depth) stack.pop(); }
    else if (token.type === 'fence' && stack.length) regions.push({ block: stack.at(-1).name, fence: token.info.trim().split(/\s+/)[0], token });
    else if (token.type === 'inline' && token.map && stack.length) regions.push({ block: stack.at(-1).name, fence: '$body', token });
    if (token.nesting === 1) depth++;
  }
  return regions;
}
function fencedRegions(source) { return templateRegions(source).filter(region => region.fence !== '$body'); }
function within(root, file) {
  const relative = path.relative(root, file);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}
function relativePath(value) {
  if (typeof value !== 'string' || !value || path.isAbsolute(value) || value.includes('\\') || value.split('/').includes('..') || value.includes(':')) throw new Error('Paths must stay within the site workspace');
  return value;
}
async function readJSON(file) {
  if ((await fs.stat(file)).size > 1024 * 1024) throw new Error('Grammar or manifest exceeds 1 MiB');
  return JSON.parse(await fs.readFile(file, 'utf8'));
}
async function loadSite(root) {
  const realRoot = await fs.realpath(root);
  const manifestFile = path.join(root, '.tiger-editor.json');
  if (!within(realRoot, await fs.realpath(manifestFile))) throw new Error('Manifest must stay within the workspace');
  const manifest = await readJSON(manifestFile);
  if (manifest.version !== 1 || !Array.isArray(manifest.sources) || !manifest.sources.length || !Array.isArray(manifest.blocks)) throw new Error('Invalid Tiger editor manifest (expected version 1)');
  const sources = manifest.sources.map(p => path.resolve(root, relativePath(p)));
  const bodyFile = path.join(root, '.tiger-grammars.json');
  const grammars = new Map(), registries = [], files = new Set([manifestFile, bodyFile]);
  let bodyBlocks = [];
  try {
    if (!within(realRoot, await fs.realpath(bodyFile))) throw new Error('Body grammar manifest must stay within the workspace');
    const authored = await readJSON(bodyFile);
    if (authored.version !== 1 || !Array.isArray(authored.blocks)) throw new Error('Invalid Tiger body grammar manifest (expected version 1)');
    bodyBlocks = authored.blocks;
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  try {
    const registrations = [];
    for (const block of manifest.blocks) {
      if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(block.name) || !Array.isArray(block.fences)) throw new Error('Invalid block grammar entry');
      for (const entry of block.fences) {
        if (!/^[A-Za-z][A-Za-z0-9_+.-]*$/.test(entry.fence)) throw new Error('Invalid fence name');
        registrations.push({ block: block.name, fence: entry.fence, grammar: entry.grammar });
      }
    }
    for (const block of bodyBlocks) {
      if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(block.name) || typeof block.body !== 'string') throw new Error('Invalid body grammar entry');
      registrations.push({ block: block.name, fence: '$body', grammar: block.body });
    }
    for (const entry of registrations) {
      const file = path.resolve(root, relativePath(entry.grammar));
      if (!file.endsWith('.tmLanguage.json') || !within(realRoot, await fs.realpath(file))) throw new Error('Grammar must be a workspace .tmLanguage.json file');
      files.add(file);
      const raw = await readJSON(file);
      if (typeof raw.scopeName !== 'string' || !raw.scopeName.startsWith('source.')) throw new Error('Grammar requires a source.* scopeName');
      // Each grammar has its own registry, so two sites can reuse the same scope name.
      const registry = new textmate.Registry({ onigLib: onigLib(), loadGrammar: async scope => scope === raw.scopeName ? raw : null });
      registries.push(registry);
      const key = `${entry.block}/${entry.fence}`;
      if (grammars.has(key)) throw new Error(`Duplicate grammar for ${key}`);
      grammars.set(key, await registry.loadGrammar(raw.scopeName));
    }
    return { files, sources, grammars, dispose() { registries.forEach(r => r.dispose()); } };
  } catch (error) { registries.forEach(r => r.dispose()); throw error; }
}
function tokenize(source, site, cancelled = () => false) {
  const lines = source.split(/\r?\n/), result = [];
  for (const { block, fence, token } of templateRegions(source)) {
    const grammar = site.grammars.get(`${block}/${fence}`);
    if (!grammar) continue;
    let state = textmate.INITIAL;
    const content = token.content.split('\n');
    if (content.at(-1) === '') content.pop();
    for (let i = 0; i < content.length; i++) {
      if (cancelled()) return [];
      const line = token.map[0] + (fence === '$body' ? 0 : 1) + i, text = content[i];
      // Markdown removes container indentation. Restore exact UTF-16 source offsets.
      const original = lines[line] ?? '', offset = original.length - text.length;
      const tokens = grammar.tokenizeLine(text, state, 20);
      state = tokens.ruleStack;
      if (tokens.stoppedEarly || offset < 0 || !original.endsWith(text)) continue;
      for (const token of tokens.tokens) {
        const type = semanticType(token.scopes), length = Math.min(token.endIndex, text.length) - token.startIndex;
        if (type && length > 0) result.push({ line, start: offset + token.startIndex, length, type });
      }
    }
  }
  return result;
}
module.exports = { tokenTypes, semanticType, fencedRegions, templateRegions, loadSite, tokenize, within };
