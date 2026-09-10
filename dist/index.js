#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const preflight_1 = require("./commands/preflight");
const decision_1 = require("./commands/decision");
const trivial_1 = require("./commands/trivial");
const fs_1 = require("fs");
const path_1 = require("path");
const packagePath = (0, path_1.join)(__dirname, '..', 'package.json');
const packageJson = JSON.parse((0, fs_1.readFileSync)(packagePath, 'utf8'));
const program = new commander_1.Command();
program
    .name('product-mode')
    .description('CLI tool for product-mode principles - helps teams ship the right thing, not just ship fast')
    .version(packageJson.version);
program
    .command('checklist')
    .description('Run the pre-flight checklist before starting work')
    .argument('[work-description]', 'Description of the work you\'re about to start')
    .action((workDescription) => (0, preflight_1.preflightChecklist)(workDescription));
program
    .command('decision')
    .description('Create a decision log entry')
    .argument('[title]', 'Short title for the decision')
    .action((title) => (0, decision_1.decisionLog)(title ?? ''));
program
    .command('trivial')
    .description('Check if a change is trivial and can skip full rigor')
    .argument('[files...]', 'Files to check (optional - will check staged changes if none provided)')
    .action((files) => (0, trivial_1.trivialChangeDetector)(files));
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
//# sourceMappingURL=index.js.map