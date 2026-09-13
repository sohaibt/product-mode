import { existsSync, mkdirSync, readFileSync, appendFileSync } from 'fs';
import { join } from 'path';

export const PRIOR_ARTIFACTS_SECTION = `
## Prior Decisions & Checklists

Before any non-trivial work, read \`.product-mode/decisions/\` - it is the decision log from Principle 7. Do not re-decide what is already decided there unless its revisit trigger has fired.

Before running a new pre-flight checklist, check \`.product-mode/checklist/\` for an existing one on the same topic and build on it.

Reference the relevant file by path when you rely on it, so the reasoning stays traceable.
`;

export function init(): void {
  const cwd = process.cwd();

  for (const sub of ['checklist', 'decisions']) {
    const dir = join(cwd, '.product-mode', sub);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      console.log(`✓ Created ${join('.product-mode', sub)}/`);
    }
  }

  for (const file of ['CLAUDE.md', 'AGENTS.md']) {
    const path = join(cwd, file);
    if (!existsSync(path)) continue;
    if (readFileSync(path, 'utf8').includes('## Prior Decisions & Checklists')) {
      console.log(`- ${file} already points at .product-mode/`);
      continue;
    }
    appendFileSync(path, PRIOR_ARTIFACTS_SECTION);
    console.log(`✓ Added "Prior Decisions & Checklists" section to ${file}`);
  }

  console.log('\nRun "product-mode checklist" before starting work');
  console.log('Run "product-mode decision" to log important decisions');
  console.log('Run "product-mode trivial" to check if changes are trivial');
}
