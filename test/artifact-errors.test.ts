import inquirer from 'inquirer';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { preflightChecklist } from '../src/commands/preflight';
import { decisionLog } from '../src/commands/decision';

jest.mock('inquirer', () => ({ prompt: jest.fn() }));

const prompt = jest.mocked(inquirer.prompt);
const originalCwd = process.cwd();
const originalExitCode = process.exitCode;
let workspace: string;

beforeEach(() => {
  workspace = mkdtempSync(join(tmpdir(), 'product-mode-artifact-test-'));
  process.chdir(workspace);
  process.exitCode = undefined;
  jest.spyOn(console, 'log').mockImplementation(() => undefined);
  jest.spyOn(console, 'error').mockImplementation(() => undefined);
  prompt.mockReset();
});

afterEach(() => {
  process.chdir(originalCwd);
  process.exitCode = originalExitCode;
  jest.restoreAllMocks();
  rmSync(workspace, { recursive: true, force: true });
});

test('a checklist save failure sets a failing exit status', async () => {
  mkdirSync('.product-mode');
  writeFileSync('.product-mode/checklist', 'This path is a file');
  prompt.mockResolvedValue({ problem: 'Cannot save', whyNow: 'Reproduced', scope: 'Fix saving', successMetric: 'Successful saves', reversibility: 'two-way' });

  await preflightChecklist('Failed save');

  expect(process.exitCode).toBe(1);
  expect(console.error).toHaveBeenCalled();
  expect(console.log).not.toHaveBeenCalledWith('\n✅ Checklist completed!');
});

test('a decision save failure sets a failing exit status', async () => {
  mkdirSync('.product-mode');
  writeFileSync('.product-mode/decisions', 'This path is a file');
  prompt.mockResolvedValue({ date: '2026-10-10', context: 'Review', options: 'A, B', choice: 'A', reversibility: 'two-way door', revisitTrigger: 'Feedback' });

  await decisionLog('Failed save');

  expect(process.exitCode).toBe(1);
  expect(console.error).toHaveBeenCalled();
  expect(console.log).not.toHaveBeenCalledWith('\n✅ Decision logged!');
});

test('a cancelled checklist cannot appear successful to a script', async () => {
  prompt.mockRejectedValue('invalid');
  await preflightChecklist('Cancelled');
  expect(process.exitCode).toBe(1);
});
