import { execFileSync } from 'child_process';

export function trivialChangeDetector(files: string[] = []) {
  console.log('\n🔍 Product-Mode Trivial Change Detector\n');

  try {
    let diffOutput: string;

    if (files.length === 0) {
      // Check staged changes; fall back to unstaged if nothing is staged
      diffOutput = _gitDiff(['--cached']);
      if (!diffOutput.trim()) diffOutput = _gitDiff([]);
    } else {
      // Check specific files
      diffOutput = _gitDiff(['--', ...files]);
    }

    if (!diffOutput.trim()) {
      console.log('ℹ️  No changes detected');
      return;
    }

    const { trivial, reasons, changedLines } = classifyDiff(diffOutput);

    if (trivial) {
      console.log('✅ Changes appear to be trivial');
      console.log('   You may skip full product-mode rigor for this change');
      console.log('   (Still apply Principles 2, 3, 5: assumptions, scope, outcome definition)');
    } else {
      console.log('⚠️  Changes appear non-trivial');
      for (const reason of reasons) console.log(`   - ${reason}`);
      console.log('   Please run full product-mode pre-flight checklist');
      console.log('   Run: product-mode checklist');
    }

    // Show brief stats
    console.log(`\n📊 Stats: ${changedLines} content lines changed`);

  } catch (error: any) {
    if (error.status === 128) {
      console.error('❌ Not a git repository or git not installed');
      console.error('   Make sure you are in a git repository');
    } else {
      console.error('❌ Error checking changes:', error.message);
    }
  }
}

function _gitDiff(args: string[]): string {
  return execFileSync('git', ['diff', '--no-color', ...args], { encoding: 'utf8' });
}

// Docs can take small edits; code may only change whitespace, comments, or typos in strings.
const DOC_FILE = /\.(md|mdx|txt|rst|adoc)$/i;
const MAX_DOC_LINES = 10;
// ponytail: path-name heuristic, misses risky code in innocently named files
const RISKY_PATH = /(migration|schema|auth|security|billing|payment|pricing|\.env|\.sql$|package\.json$|lock\.(json|ya?ml)$|\.lock$|\.ya?ml$|dockerfile)/i;
const COMMENT_LINE = /^\s*(\/\/|#|\/\*|\*|<!--)/;

interface FileDiff {
  path: string;
  isNew: boolean;
  isDeleted: boolean;
  added: string[];
  removed: string[];
}

export function classifyDiff(diff: string): { trivial: boolean; reasons: string[]; changedLines: number } {
  const reasons: string[] = [];
  let changedLines = 0;

  for (const file of _parseDiff(diff)) {
    changedLines += file.added.length + file.removed.length;
    const isDoc = DOC_FILE.test(file.path);

    if (RISKY_PATH.test(file.path)) {
      reasons.push(`${file.path}: sensitive file (schema, auth, billing, config, dependencies)`);
    } else if (isDoc) {
      if (file.added.length + file.removed.length > MAX_DOC_LINES) {
        reasons.push(`${file.path}: more than ${MAX_DOC_LINES} lines of docs changed`);
      }
    } else if (file.isNew || file.isDeleted) {
      reasons.push(`${file.path}: code file ${file.isNew ? 'added' : 'deleted'}`);
    } else if (!_isCosmeticCodeChange(file)) {
      reasons.push(`${file.path}: code logic changed`);
    }
  }

  return { trivial: reasons.length === 0, reasons, changedLines };
}

function _parseDiff(diff: string): FileDiff[] {
  const files: FileDiff[] = [];
  let current: FileDiff | undefined;

  for (const line of diff.split('\n')) {
    if (line.startsWith('diff --git ')) {
      current = { path: line.split(' b/').pop() || '', isNew: false, isDeleted: false, added: [], removed: [] };
      files.push(current);
    } else if (!current) {
      continue;
    } else if (line.startsWith('new file mode')) {
      current.isNew = true;
    } else if (line.startsWith('deleted file mode')) {
      current.isDeleted = true;
    } else if (line.startsWith('+++') || line.startsWith('---')) {
      continue;
    } else if (line.startsWith('+')) {
      current.added.push(line.slice(1));
    } else if (line.startsWith('-')) {
      current.removed.push(line.slice(1));
    }
  }

  return files;
}

function _isCosmeticCodeChange(file: FileDiff): boolean {
  // Drop blank and comment lines; what is left must pair up as whitespace or string typos
  const meaningful = (lines: string[]) => lines.filter(l => l.trim() !== '' && !COMMENT_LINE.test(l));
  const added = meaningful(file.added);
  const removed = meaningful(file.removed);

  if (added.length !== removed.length) return false;
  return added.every((line, i) => _isTypoFix(removed[i], line));
}

function _isTypoFix(before: string, after: string): boolean {
  const squash = (s: string) => s.replace(/\s+/g, '');
  if (squash(before) === squash(after)) return true; // whitespace only

  // Only the text inside quotes changed, and only by a couple of characters
  const code = (s: string) => squash(s).replace(/(["'`])(?:\\.|(?!\1).)*\1/g, '""');
  return code(before) === code(after) && _levenshteinDistance(before.trim(), after.trim()) <= 2;
}

function _levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  // Initialize first row and column
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i-1) === a.charAt(j-1)) {
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i-1][j-1] + 1, // substitution
          matrix[i][j-1] + 1,   // insertion
          matrix[i-1][j] + 1    // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
