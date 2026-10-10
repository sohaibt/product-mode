import { execFileSync } from 'child_process';

export function trivialChangeDetector(files: string[] = []) {
  console.log('\n🔍 Product-Mode Trivial Change Detector\n');

  try {
    const paths = files.length > 0 ? ['--', ...files] : [];
    let diffOutput = gitDiff(['--cached', ...paths]);
    if (!diffOutput.trim()) diffOutput = gitDiff(paths);

    if (!diffOutput.trim()) {
      console.log('ℹ️  No tracked changes detected (untracked files are not included)');
      return;
    }

    const { trivial, reasons, changedLines } = classifyDiff(diffOutput);

    if (trivial) {
      console.log('✅ Only small edits to ordinary documentation were detected');
      console.log('   These may qualify for lighter rigor; review their meaning before deciding');
    } else {
      console.log('⚠️  Changes need review before choosing the appropriate rigor');
      for (const reason of reasons) console.log('   - ' + reason);
      console.log('   Bug fixes: Principles 2, 3, 5. New features or costly commitments: full checklist.');
      console.log('   Run: product-mode checklist');
    }

    console.log('\n📊 Stats: ' + changedLines + ' content lines changed');
  } catch (error: unknown) {
    process.exitCode = 1;
    const status = typeof error === 'object' && error !== null && 'status' in error
      ? error.status : undefined;
    if (typeof status === 'number') {
      console.error('❌ Unable to read the git diff; check the repository and file paths');
    } else {
      console.error('❌ Error checking changes:', error instanceof Error ? error.message : String(error));
    }
  }
}

function gitDiff(args: string[]): string {
  return execFileSync('git', ['diff', '--no-color', '--no-ext-diff', '--no-textconv', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

// Syntax and intent cannot be proven harmless by line-count or string-distance heuristics.
const DOC_FILE = /\.(md|txt|rst|adoc)$/i;
const MAX_DOC_LINES = 10;
const RISKY_PATH = /(migration|schema|auth|security|billing|payment|pricing|\.env|\.sql$|package\.json$|lock\.(json|ya?ml)$|\.lock$|\.ya?ml$|dockerfile)/i;
const AGENT_PATH = /(^|\/)(AGENTS(?:\.override)?|CLAUDE(?:\.local)?|GEMINI|SKILL)\.md$|\.instructions\.md$|(^|\/)\.(agents|claude|codex|cursor|windsurf|opencode)(\/|$)|(^|\/)\.github\/(agents|instructions|copilot-instructions\.md)(\/|$)/i;

interface FileDiff {
  path: string;
  isNew: boolean;
  isDeleted: boolean;
  metadataChanged: boolean;
  hasHunk: boolean;
  added: string[];
  removed: string[];
}

export function classifyDiff(diff: string): { trivial: boolean; reasons: string[]; changedLines: number } {
  const files = parseDiff(diff);
  const reasons: string[] = [];
  let changedLines = 0;

  if (files.length === 0) reasons.push('No recognizable file diff; inspect the changes manually');

  for (const file of files) {
    changedLines += file.added.length + file.removed.length;
    const label = file.path || 'Unrecognized file';

    if (!file.path || !file.hasHunk || file.metadataChanged) {
      reasons.push(label + ': metadata, binary, or unsupported diff');
    } else if (AGENT_PATH.test(file.path)) {
      reasons.push(label + ': agent instructions affect behavior and approval boundaries');
    } else if (RISKY_PATH.test(file.path)) {
      reasons.push(label + ': sensitive file (schema, auth, billing, config, dependencies)');
    } else if (file.isNew || file.isDeleted) {
      reasons.push(label + ': file ' + (file.isNew ? 'added' : 'deleted'));
    } else if (!DOC_FILE.test(file.path)) {
      reasons.push(label + ': code or unsupported file; whitespace and strings can change behavior');
    }
  }

  if (changedLines > MAX_DOC_LINES) {
    reasons.push('More than ' + MAX_DOC_LINES + ' content lines changed across the diff');
  }
  if (files.length > 0 && changedLines === 0 && reasons.length === 0) {
    reasons.push('No content changes could be classified; inspect the diff manually');
  }

  return { trivial: reasons.length === 0, reasons, changedLines };
}

function parseDiff(diff: string): FileDiff[] {
  const files: FileDiff[] = [];
  let current: FileDiff | undefined;
  let inHunk = false;

  for (const line of diff.split('\n')) {
    if (line.startsWith('diff --git ')) {
      current = { path: '', isNew: false, isDeleted: false, metadataChanged: false, hasHunk: false, added: [], removed: [] };
      files.push(current);
      inHunk = false;
    } else if (!current) {
      continue;
    } else if (line.startsWith('@@')) {
      inHunk = /^@@ -\d+(,\d+)? \+\d+(,\d+)? @@/.test(line);
      current.hasHunk ||= inHunk;
      if (!inHunk) current.metadataChanged = true;
    } else if (inHunk) {
      if (line.startsWith('+')) current.added.push(line.slice(1));
      if (line.startsWith('-')) current.removed.push(line.slice(1));
    } else if (line.startsWith('+++ b/')) {
      current.path = line.slice(6).split('\t')[0];
    } else if (line.startsWith('--- a/') && !current.path) {
      current.path = line.slice(6).split('\t')[0];
    } else if (line.startsWith('new file mode')) {
      current.isNew = true;
    } else if (line.startsWith('deleted file mode')) {
      current.isDeleted = true;
    } else if (/^(old mode|new mode|rename |copy |similarity |dissimilarity |Binary files |GIT binary patch)/.test(line)) {
      current.metadataChanged = true;
    }
  }

  return files;
}
