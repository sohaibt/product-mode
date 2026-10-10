import { classifyDiff } from '../src/commands/trivial';

// Build a minimal git diff for one file
function diff(path: string, removed: string[], added: string[], mode = ''): string {
  return [
    `diff --git a/${path} b/${path}`,
    ...(mode ? [mode] : []),
    `--- a/${path}`,
    `+++ b/${path}`,
    '@@ -1 +1 @@',
    ...removed.map(l => `-${l}`),
    ...added.map(l => `+${l}`),
  ].join('\n');
}

const trivial = (d: string) => classifyDiff(d).trivial;

test('new 200-line code file is not trivial', () => {
  const lines = Array.from({ length: 200 }, (_, i) => `export const f${i} = () => ${i};`);
  expect(trivial(diff('src/utils.ts', [], lines, 'new file mode 100644'))).toBe(false);
});

test('adding code lines to an existing file is not trivial', () => {
  expect(trivial(diff('src/app.ts', [], ['sendEmail(user);']))).toBe(false);
});

test('deleting a single security check is not trivial', () => {
  expect(trivial(diff('src/routes.ts', ['  if (!user.isAdmin) return res.status(403);'], []))).toBe(false);
});

test('changing an operator is not trivial', () => {
  expect(trivial(diff('src/cart.ts', ['if (qty > 0) {'], ['if (qty >= 0) {']))).toBe(false);
});

test('decrement is code, not a comment', () => {
  expect(trivial(diff('src/loop.ts', [], ['--count;']))).toBe(false);
});

test('sensitive paths are never trivial', () => {
  expect(trivial(diff('db/migrations/001.sql', ['-- old'], ['-- new']))).toBe(false);
  expect(trivial(diff('package.json', ['  "x": "1.0.0"'], ['  "x": "1.0.1"']))).toBe(false);
});

test('README typo is trivial', () => {
  expect(trivial(diff('README.md', ['Recieve updates'], ['Receive updates']))).toBe(true);
});

test('large docs rewrite is not trivial', () => {
  const lines = Array.from({ length: 30 }, (_, i) => `line ${i}`);
  expect(trivial(diff('README.md', [], lines))).toBe(false);
});

test('comment and blank-line edits in code require review', () => {
  expect(trivial(diff('src/app.ts', ['// old note'], ['// new note', '']))).toBe(false);
});

test('text inside a code string requires review', () => {
  expect(trivial(diff('src/ui.ts', ['label("Recieve")'], ['label("Receive")']))).toBe(false);
});

test('code whitespace requires review without being mistaken for a lockfile', () => {
  const result = classifyDiff(diff('src/clock.ts', ['const t=1;'], ['const t = 1;']));
  expect(result.trivial).toBe(false);
  expect(result.reasons.join(' ')).not.toContain('sensitive file');
});

test.each([
  ['src/routes.ts', 'redirect("/v1");', 'redirect("/v2");'],
  ['src/process.py', '    charge_customer()', 'charge_customer()'],
  ['src/app.ts', '#enabled = false;', '#enabled = true;'],
  ['src/main.c', '*ptr = 1;', '*ptr = 0;'],
  ['src/main.c', '#define MAX_RETRIES 1', '#define MAX_RETRIES 9'],
  ['src/ui.ts', 'const label = "Sign in";', 'const label = "Signin";'],
  ['component.mdx', '<Button disabled />', '<Button />'],
])('%s: semantic edits cannot be classified as cosmetic', (path, before, after) => {
  expect(trivial(diff(path, [before], [after]))).toBe(false);
});

test.each(['AGENTS.md', 'nested/AGENTS.override.md', 'CLAUDE.md', 'CLAUDE.local.md', 'GEMINI.md', 'skills/review/SKILL.md', '.cursor/rules/product.md', '.github/copilot-instructions.md', '.github/agents/reviewer.md', '.github/instructions/product.instructions.md', '.windsurf/rules/product.md', '.opencode/agent/review.md'])('%s: agent policy edits always require review', path => {
  expect(trivial(diff(path, ['Require approval.'], ['Proceed without approval.']))).toBe(false);
});

test.each(['new file mode 100644', 'deleted file mode 100644'])('documentation %s requires review', mode => {
  expect(trivial(diff('guide.md', [], ['One line'], mode))).toBe(false);
});

test.each([
  'diff --git a/run.sh b/run.sh\nold mode 100644\nnew mode 100755',
  'diff --git a/banner.png b/banner.png\nBinary files a/banner.png and b/banner.png differ',
  'diff --git a/guide.md b/README.md\nsimilarity index 100%\nrename from guide.md\nrename to README.md',
  'unsupported diff format',
  '',
])('metadata-only, binary, and unrecognized diffs require review', patch => {
  expect(trivial(patch)).toBe(false);
});

test('a mode change with a documentation hunk requires review', () => {
  expect(trivial(diff('guide.md', ['Old'], ['New'], 'old mode 100644\nnew mode 100755'))).toBe(false);
});

test('small ordinary documentation edits with spaces in the path are supported', () => {
  expect(trivial(diff('guides/getting started.md', ['Recieve'], ['Receive']))).toBe(true);
});

test('lines starting with diff header characters still count inside a hunk', () => {
  const result = classifyDiff(diff('README.md', ['-- old note'], ['++ new note']));
  expect(result.changedLines).toBe(2);
});

test('the documentation line budget applies across files', () => {
  const patch = Array.from({ length: 6 }, (_, i) => diff(`guide-${i}.md`, ['Old'], ['New'])).join('\n');
  expect(trivial(patch)).toBe(false);
});
