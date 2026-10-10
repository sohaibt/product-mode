#!/usr/bin/env node

import { Command } from 'commander';
import { preflightChecklist } from './commands/preflight';
import { decisionLog } from './commands/decision';
import { trivialChangeDetector } from './commands/trivial';
import { init } from './commands/init';
import { readFileSync } from 'fs';
import { join } from 'path';

const packagePath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

const program = new Command();

program
  .name('product-mode')
  .description('CLI tool for product-mode principles - helps teams ship the right thing, not just ship fast')
  .version(packageJson.version)
  .hook('preAction', (_command, actionCommand) => {
    if (['checklist', 'decision'].includes(actionCommand.name()) && !process.stdin.isTTY) {
      throw new Error('This command needs an interactive terminal. Run it in a terminal, or write the Markdown artifact in .product-mode/ directly.');
    }
  });

program
  .command('checklist')
  .description('Run the pre-flight checklist before starting work')
  .argument('[work-description]', 'Description of the work you\'re about to start')
  .action((workDescription) => preflightChecklist(workDescription));

program
  .command('decision')
  .description('Create a decision log entry')
  .argument('[title]', 'Short title for the decision')
  .action((title) => decisionLog(title ?? ''));

program
  .command('trivial')
  .description('Check if a change is trivial and can skip full rigor')
  .argument('[files...]', 'Files to check (optional - will check staged changes if none provided)')
  .action((files) => trivialChangeDetector(files));

program
  .command('init')
  .description('Create .product-mode/ and point CLAUDE.md/AGENTS.md at it so agents read prior decisions')
  .action(() => init());

void program.parseAsync().catch((error: unknown) => {
  console.error('❌ Command failed:', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
