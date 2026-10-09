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

test('comment and blank-line edits in code are trivial', () => {
  expect(trivial(diff('src/app.ts', ['// old note'], ['// new note', '']))).toBe(true);
});

test('typo inside a string is trivial', () => {
  expect(trivial(diff('src/ui.ts', ['label("Recieve")'], ['label("Receive")']))).toBe(true);
});

test('whitespace-only change is trivial, and clock.ts is not a lockfile', () => {
  expect(trivial(diff('src/clock.ts', ['const t=1;'], ['const t = 1;']))).toBe(true);
});
