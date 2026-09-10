#!/usr/bin/env node

import { Command } from 'commander';
import { preflightChecklist } from './commands/preflight';
import { decisionLog } from './commands/decision';
import { trivialChangeDetector } from './commands/trivial';
import { readFileSync } from 'fs';
import { join } from 'path';

const packagePath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

const program = new Command();

program
  .name('product-mode')
  .description('CLI tool for product-mode principles - helps teams ship the right thing, not just ship fast')
  .version(packageJson.version);

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
  .description('Initialize product-mode for a project')
  .action(() => {
    console.log('Initializing product-mode...');
    console.log('✓ Added product-mode to your project');
    console.log('  Run "product-mode checklist" before starting work');
    console.log('  Run "product-mode decision" to log important decisions');
    console.log('  Run "product-mode trivial" to check if changes are trivial');
  });

program.parse();