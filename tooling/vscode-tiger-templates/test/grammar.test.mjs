import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import textmate from 'vscode-textmate';
import oniguruma from 'vscode-oniguruma';

const require = createRequire(import.meta.url);
const extensionRoot = fileURLToPath(new URL('../', import.meta.url));
const vscodeRoot = process.env.VSCODE_APP_ROOT ?? '/Applications/Visual Studio Code.app/Contents/Resources/app';
const markdownPath = path.join(vscodeRoot, 'extensions/markdown-basics/syntaxes/markdown.tmLanguage.json');
const injectionPath = path.join(extensionRoot, 'syntaxes/tiger-template.tmLanguage.json');
let scalaPath = process.env.SCALA_GRAMMAR_PATH;
if (!scalaPath) {
  const extensions = path.join(homedir(), '.vscode/extensions');
  const scala = (await readdir(extensions)).filter(name => name.startsWith('scala-lang.scala-')).sort().at(-1);
  assert.ok(scala, 'Install the Scala syntax extension or set SCALA_GRAMMAR_PATH');
  scalaPath = path.join(extensions, scala, 'syntaxes/Scala.tmLanguage.json');
}

await oniguruma.loadWASM(await readFile(require.resolve('vscode-oniguruma/release/onig.wasm')));
const grammarFiles = {
  'text.html.markdown': markdownPath,
  'source.scala': scalaPath,
  'tiger-template.injection': injectionPath,
};
async function createGrammar(inject) {
  const registry = new textmate.Registry({
    onigLib: Promise.resolve({
      createOnigScanner: patterns => new oniguruma.OnigScanner(patterns),
      createOnigString: value => new oniguruma.OnigString(value),
    }),
    loadGrammar: async scope => {
      const file = grammarFiles[scope];
      return file ? textmate.parseRawGrammar(await readFile(file, 'utf8'), file) : null;
    },
    getInjections: scope => inject && scope === 'text.html.markdown' ? ['tiger-template.injection'] : [],
  });
  return registry.loadGrammar('text.html.markdown');
}
const grammar = await createGrammar(true);
const baseline = await createGrammar(false);

function tokenize(source, tokenizer = grammar) {
  let state = textmate.INITIAL;
  return source.split('\n').map(line => {
    const result = tokenizer.tokenizeLine(line, state);
    state = result.ruleStack;
    return { line, tokens: result.tokens };
  });
}
function scopesAt(row, text) {
  const index = row.line.indexOf(text);
  assert.ok(index >= 0, `Missing ${text} in ${row.line}`);
  return row.tokens.find(token => token.startIndex <= index && index < token.endIndex).scopes;
}
function hasScope(row, text, scope) {
  assert.ok(scopesAt(row, text).includes(scope), `${text}: expected ${scope}, got ${scopesAt(row, text)}`);
}
function hasNoTiger(row) {
  assert.ok(row.tokens.every(token => token.scopes.every(scope => !scope.endsWith('.tiger'))), row.line);
}

test('SON frontmatter embeds Scala and returns to Markdown at its closing delimiter', () => {
  const rows = tokenize([
    '---scala', '(', '  // Metadata', '  title = "{{not-a-template}}",',
    '  seconds = 75,', "  description = '''", '    Two lines', "    of SON text''',",
    '  fontSize = 44', ')', '---', '', '## Body', '', '{{stack}}',
  ].join('\n'));
  hasScope(rows[0], '---', 'punctuation.definition.frontmatter.begin.tiger');
  hasScope(rows[3], 'title', 'meta.embedded.block.scala');
  assert.ok(scopesAt(rows[2], '//').some(scope => scope.startsWith('comment.')));
  assert.ok(scopesAt(rows[3], '{{').some(scope => scope.startsWith('string.')));
  assert.ok(!scopesAt(rows[3], 'not-a-template').includes('entity.name.function.template.tiger'));
  assert.ok(scopesAt(rows[4], '75').some(scope => scope.startsWith('constant.numeric')));
  hasScope(rows[6], 'Two lines', 'string.quoted.triple.single.scala');
  hasScope(rows[10], '---', 'punctuation.definition.frontmatter.end.tiger');
  assert.deepEqual(rows[12], tokenize('## Body', baseline)[0]);
  hasScope(rows[14], 'stack', 'entity.name.function.template.tiger');
});

test('frontmatter supports BOM and CRLF without changing YAML or later Markdown examples', () => {
  const rows = tokenize('\uFEFF---scala \t\r\n(title = "Example")\r\n--- \t\r\n\r\nBody');
  hasScope(rows[1], 'title', 'meta.embedded.block.scala');
  hasNoTiger(rows[4]);
  for (const source of [
    '---\ntitle: YAML\n---\n\n# Body',
    '# Body\n\n---scala\n(title = "Ordinary text")\n---',
    '```markdown\n---scala\n(title = "Example")\n---\n```',
  ]) assert.deepEqual(tokenize(source), tokenize(source, baseline));
});

test('generic calls, closing markers, arguments and inline calls', () => {
  const rows = tokenize('{{columns aligned top}}\n\n{{new-theme_widget blue 42 "two words"}}\n\n{{end-columns}}\n\nText {{br}} follows.');
  hasScope(rows[0], '{{', 'punctuation.definition.template.begin.tiger');
  hasScope(rows[0], 'columns', 'entity.name.function.template.tiger');
  hasScope(rows[0], 'aligned', 'variable.parameter.template.tiger');
  hasScope(rows[0], '}}', 'punctuation.definition.template.end.tiger');
  hasScope(rows[2], 'new-theme_widget', 'entity.name.function.template.tiger');
  hasScope(rows[2], '42', 'constant.numeric.tiger');
  hasScope(rows[2], 'two words', 'string.quoted.double.tiger');
  hasScope(rows[4], 'end-columns', 'keyword.control.template.end.tiger');
  hasScope(rows[6], 'br', 'entity.name.function.template.tiger');
  assert.ok(scopesAt(rows[6], 'follows').every(scope => !scope.endsWith('.tiger')));
});

test('colon fences highlight their markers and leave their Markdown body intact', () => {
  const source = ':::mindmap Collections {.blue}\n\n## **Branches**\n\n- *First*\n\n:::custom-block label\n\nBody\n\n:::\n\n:::';
  const rows = tokenize(source);
  const original = tokenize(source, baseline);
  hasScope(rows[0], 'mindmap', 'entity.name.function.template.tiger');
  hasScope(rows[0], '.blue', 'entity.other.attribute-name.class.tiger');
  hasScope(rows[6], 'custom-block', 'entity.name.function.template.tiger');
  hasScope(rows[10], ':::', 'keyword.control.template.end.tiger');
  for (const index of [2, 4, 8]) assert.deepEqual(rows[index], original[index]);
});

test('attributes support classes, IDs and quoted values without recoloring ordinary braces', () => {
  const rows = tokenize('{.footer #summary style="font-size:0.5em"}\n\nA paragraph{.focus}\n\nA set {apple, orange}.');
  hasScope(rows[0], '.footer', 'entity.other.attribute-name.class.tiger');
  hasScope(rows[0], '#summary', 'entity.other.attribute-name.class.tiger');
  hasScope(rows[0], 'style', 'entity.other.attribute-name.tiger');
  hasScope(rows[0], 'font-size', 'string.quoted.double.tiger');
  hasScope(rows[2], '.focus', 'entity.other.attribute-name.class.tiger');
  hasNoTiger(rows[4]);
});

test('code examples, fenced Scala, escaping and ordinary Markdown keep their original tokens', () => {
  const source = [
    '# Heading with *emphasis*', '',
    '`{{stack}}` and `{.footer}`', '',
    '```scala', 'val label = "{{columns top}}"', 'val size = 44', '```', '',
    '```markdown', '{{stack}}', ':::mindmap Example', '{.footer}', '```', '',
    '~~~', '{{br}}', '~~~', '',
    '    {{stack}}', '    {.footer}', '',
    '\\{{stack}} and \\{.footer}', '',
    'Ordinary [link](https://example.com) and **bold**.',
  ].join('\n');
  const rows = tokenize(source);
  assert.deepEqual(rows, tokenize(source, baseline));
  rows.forEach(hasNoTiger);
  assert.ok(scopesAt(rows[5], 'val').some(scope => scope.startsWith('keyword.')), 'Scala keywords remain highlighted');
});

test('an unfinished call or string cannot swallow following paragraphs', () => {
  for (const source of ['{{stack top', '{{widget "unfinished', '{style="unfinished']) {
    const rows = tokenize(`${source}\n\n# Next heading\n\nNormal content`);
    hasNoTiger(rows[2]);
    hasNoTiger(rows[4]);
    assert.deepEqual(rows[2], tokenize('# Next heading', baseline)[0]);
  }
});

// TIGER_SLIDES_DIR checks a real deck (e.g. content/<deck>/slides); by default, this repository's examples.
const slideDirectories = process.env.TIGER_SLIDES_DIR ? [path.resolve(process.env.TIGER_SLIDES_DIR)] :
  ['examples/live/content/demo-deck/slides', 'examples/embedded/content/presentations/conference/slides']
    .map(dir => path.resolve(extensionRoot, '../..', dir));
test('all slides retain fenced code and highlight template calls and attributes', async () => {
  let calls = 0;
  for (const slides of slideDirectories) for (const file of (await readdir(slides)).filter(file => file.endsWith('.md'))) {
    const source = await readFile(path.join(slides, file), 'utf8');
    const original = tokenize(source, baseline);
    const rows = tokenize(source);
    rows.forEach((row, index) => {
      if (original[index].tokens.some(token => token.scopes.some(scope => scope.startsWith('markup.fenced_code')))) {
        assert.deepEqual(row, original[index], `${file}:${index + 1}: fenced code changed`);
        return;
      }
      for (const match of row.line.matchAll(/\{\{([^\s{}]+)[^}]*\}\}/g)) {
        const position = match.index + 2;
        const scopes = row.tokens.find(token => token.startIndex <= position && position < token.endIndex).scopes;
        if (scopes.some(scope => scope.startsWith('markup.inline.raw'))) continue;
        assert.ok(scopes.includes(match[1].startsWith('end-') ? 'keyword.control.template.end.tiger' : 'entity.name.function.template.tiger'), `${file}:${index + 1}: ${match[0]}`);
        calls++;
      }
    });
  }
  const minimum = process.env.TIGER_SLIDES_DIR ? 50 : 3;
  assert.ok(calls >= minimum, `Expected to exercise the deck's template calls, got ${calls}`);
});
