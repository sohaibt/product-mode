import { execFileSync, spawnSync } from 'child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

const root = resolve(__dirname, '..');
let workspace: string;
let cli: string;
let packageFiles: string[];

beforeAll(() => {
  workspace = mkdtempSync(join(tmpdir(), 'product-mode-package-test-'));
  const packed = JSON.parse(execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', workspace], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, npm_config_cache: join(workspace, 'npm-cache') },
  }));
  packageFiles = packed[0].files.map((file: { path: string }) => file.path);
  execFileSync('tar', ['-xzf', join(workspace, packed[0].filename), '-C', workspace]);
  // Exercise exactly the shipped files, using the dependencies installed by npm ci.
  symlinkSync(join(root, 'node_modules'), join(workspace, 'package', 'node_modules'), 'junction');
  cli = join(workspace, 'package', 'dist', 'index.js');
}, 30000);

afterAll(() => {
  if (workspace) rmSync(workspace, { recursive: true, force: true });
});

function run(args: string[], cwd = workspace) {
  return spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8', timeout: 10000 });
}

test('the npm tarball contains the executable and identical instruction files', () => {
  expect(packageFiles).toContain('dist/index.js');
  expect(packageFiles).toContain('CLAUDE.md');
  expect(packageFiles).toContain('AGENTS.md');
  expect(readFileSync(join(workspace, 'package', 'CLAUDE.md'))).toEqual(readFileSync(join(workspace, 'package', 'AGENTS.md')));
  expect(packageFiles.some(file => file.startsWith('src/') || file.startsWith('test/'))).toBe(false);
});

test('help and version start from the packaged executable', () => {
  const help = run(['--help']);
  expect(help.status).toBe(0);
  expect(help.stdout).toContain('checklist');
  const version = run(['--version']);
  expect(version.status).toBe(0);
  expect(version.stdout.trim()).toBe(JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version);
});

test('init preserves existing instructions and is safe to repeat', () => {
  const project = join(workspace, 'project');
  mkdirSync(project);
  writeFileSync(join(project, 'CLAUDE.md'), '# Existing conventions\n');
  expect(run(['init'], project).status).toBe(0);
  const once = readFileSync(join(project, 'CLAUDE.md'), 'utf8');
  expect(once).toMatch(/^# Existing conventions\n/);
  expect(once).toContain('## Prior Decisions & Checklists');
  expect(run(['init'], project).status).toBe(0);
  expect(readFileSync(join(project, 'CLAUDE.md'), 'utf8')).toBe(once);
});

test.each(['checklist', 'decision'])('%s fails clearly without an interactive terminal', command => {
  const result = run([command]);
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('interactive terminal');
  expect(result.stderr).not.toContain('ERR_USE_AFTER_CLOSE');
});

test('a failed init has a nonzero exit status', () => {
  const project = join(workspace, 'broken-project');
  mkdirSync(project);
  writeFileSync(join(project, '.product-mode'), 'This path is a file');
  const result = run(['init'], project);
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('Command failed');
});

test('trivial fails outside a git repository', () => {
  const result = run(['trivial']);
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('Unable to read the git diff');
});

test('explicit paths support staged and unstaged edits without shell interpretation', () => {
  const project = join(workspace, 'git-project');
  mkdirSync(project);
  const git = (args: string[]) => execFileSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', ...args], { cwd: project, stdio: 'pipe' });
  const name = 'guide;touch SENTINEL.md';
  git(['init']);
  writeFileSync(join(project, name), 'Old note\n');
  git(['add', '--', name]);
  git(['-c', 'user.name=Product Mode Test', '-c', 'user.email=test@example.invalid', 'commit', '-m', 'Fixture']);
  writeFileSync(join(project, name), 'New note\n');
  git(['add', '--', name]);
  const staged = run(['trivial', name], project);
  expect(staged.status).toBe(0);
  expect(staged.stdout).toContain('Only small edits to ordinary documentation');
  git(['-c', 'user.name=Product Mode Test', '-c', 'user.email=test@example.invalid', 'commit', '-m', 'Staged fixture']);
  writeFileSync(join(project, name), 'Another note\n');
  const unstaged = run(['trivial', name], project);
  expect(unstaged.status).toBe(0);
  expect(unstaged.stdout).toContain('Only small edits to ordinary documentation');
  expect(existsSync(join(project, 'SENTINEL.md'))).toBe(false);
});
