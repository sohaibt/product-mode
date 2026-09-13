"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRIOR_ARTIFACTS_SECTION = void 0;
exports.init = init;
const fs_1 = require("fs");
const path_1 = require("path");
exports.PRIOR_ARTIFACTS_SECTION = `
## Prior Decisions & Checklists

Before any non-trivial work, read \`.product-mode/decisions/\` - it is the decision log from Principle 7. Do not re-decide what is already decided there unless its revisit trigger has fired.

Before running a new pre-flight checklist, check \`.product-mode/checklist/\` for an existing one on the same topic and build on it.

Reference the relevant file by path when you rely on it, so the reasoning stays traceable.
`;
function init() {
    const cwd = process.cwd();
    for (const sub of ['checklist', 'decisions']) {
        const dir = (0, path_1.join)(cwd, '.product-mode', sub);
        if (!(0, fs_1.existsSync)(dir)) {
            (0, fs_1.mkdirSync)(dir, { recursive: true });
            console.log(`✓ Created ${(0, path_1.join)('.product-mode', sub)}/`);
        }
    }
    for (const file of ['CLAUDE.md', 'AGENTS.md']) {
        const path = (0, path_1.join)(cwd, file);
        if (!(0, fs_1.existsSync)(path))
            continue;
        if ((0, fs_1.readFileSync)(path, 'utf8').includes('## Prior Decisions & Checklists')) {
            console.log(`- ${file} already points at .product-mode/`);
            continue;
        }
        (0, fs_1.appendFileSync)(path, exports.PRIOR_ARTIFACTS_SECTION);
        console.log(`✓ Added "Prior Decisions & Checklists" section to ${file}`);
    }
    console.log('\nRun "product-mode checklist" before starting work');
    console.log('Run "product-mode decision" to log important decisions');
    console.log('Run "product-mode trivial" to check if changes are trivial');
}
//# sourceMappingURL=init.js.map