import { existsSync, mkdirSync, readFileSync, appendFileSync, copyFileSync } from 'fs';
import { join } from 'path';

const SKILLS = ['preflight', 'decision', 'product-review'];

export const PRIOR_ARTIFACTS_SECTION = `
## Prior Decisions & Checklists

Before any non-trivial work, read \`.product-mode/decisions/\` - it is the decision log from Principle 7. Do not re-decide what is already decided there unless its revisit trigger has fired.

Before running a new pre-flight checklist, check \`.product-mode/checklist/\` for an existing one on the same topic and build on it.

Reference the relevant file by path when you rely on it, so the reasoning stays traceable.
`;

export function init(upgradeSkill?: string): void {
  if (upgradeSkill !== undefined && upgradeSkill !== 'product-review') {
    throw new Error(`Unsupported skill "${upgradeSkill}". The only supported upgrade is "product-review".`);
  }

  const cwd = process.cwd();

  if (upgradeSkill) {
    console.log(`! Upgrading /${upgradeSkill} will replace local changes to that skill`);
  }

  if (!upgradeSkill) {
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
  }

  // .claude/skills = Claude Code; .agents/skills = Codex and Cursor.
  const shipped = join(__dirname, '..', '..', 'skills');
  for (const root of ['.claude', '.agents']) {
    for (const skill of SKILLS) {
      if (upgradeSkill && skill !== upgradeSkill) continue;
      const target = join(root, 'skills', skill, 'SKILL.md');
      const targetPath = join(cwd, target);
      const exists = existsSync(targetPath);
      if (exists && skill !== upgradeSkill) {
        console.log(`- ${target} already exists, left unchanged`);
        continue;
      }
      mkdirSync(join(cwd, root, 'skills', skill), { recursive: true });
      copyFileSync(join(shipped, skill, 'SKILL.md'), targetPath);
      console.log(exists
        ? `✓ Updated /${skill} command (${target})`
        : `✓ Added /${skill} command (${target})`);
    }
  }

  if (upgradeSkill) return;

  console.log('\nType /preflight in your agent chat before starting work');
  console.log('Type /decision in your agent chat to log important decisions');
  console.log('Type /product-review in your agent chat to review a plan, change, or product and its readiness for the next step');
  console.log('\nRun "product-mode checklist" before starting work');
  console.log('Run "product-mode decision" to log important decisions');
  console.log('Run "product-mode trivial" to check if changes are trivial');
}
