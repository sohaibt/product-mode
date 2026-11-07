import { existsSync, mkdirSync, readFileSync, appendFileSync, copyFileSync } from 'fs';
import { join } from 'path';

const SKILLS = ['preflight', 'decision'];

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

  // .claude/skills = Claude Code; .agents/skills = Codex and Cursor.
  const shipped = join(__dirname, '..', '..', 'skills');
  for (const root of ['.claude', '.agents']) {
    for (const skill of SKILLS) {
      const target = join(root, 'skills', skill, 'SKILL.md');
      if (existsSync(join(cwd, target))) {
        console.log(`- ${target} already exists, left unchanged`);
        continue;
      }
      mkdirSync(join(cwd, root, 'skills', skill), { recursive: true });
      copyFileSync(join(shipped, skill, 'SKILL.md'), join(cwd, target));
      console.log(`✓ Added /${skill} command (${target})`);
    }
  }

  console.log('\nType /preflight in your agent chat before starting work');
  console.log('Type /decision in your agent chat to log important decisions');
  console.log('\nRun "product-mode checklist" before starting work');
  console.log('Run "product-mode decision" to log important decisions');
  console.log('Run "product-mode trivial" to check if changes are trivial');
}
