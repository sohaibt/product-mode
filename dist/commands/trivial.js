"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trivialChangeDetector = trivialChangeDetector;
const child_process_1 = require("child_process");
function trivialChangeDetector(files = []) {
    console.log('\n🔍 Product-Mode Trivial Change Detector\n');
    try {
        let diffOutput;
        if (files.length === 0) {
            // Check staged changes
            diffOutput = (0, child_process_1.execSync)('git diff --cached --no-color', { encoding: 'utf8' });
        }
        else {
            // Check specific files
            diffOutput = (0, child_process_1.execSync)(`git diff --no-color -- ${files.join(' ')}`, { encoding: 'utf8' });
        }
        if (!diffOutput.trim()) {
            console.log('ℹ️  No changes detected');
            return;
        }
        // Simple heuristics for trivial changes
        const lines = diffOutput.split('\n');
        const changeLines = lines.filter(line => line.startsWith('+') || line.startsWith('-'));
        // Count actual content changes (excluding metadata)
        const contentChanges = changeLines.filter(line => !line.startsWith('@@') &&
            !line.startsWith('+++') &&
            !line.startsWith('---') &&
            line.length > 1);
        // Check if changes are likely trivial
        const isTrivial = _isLikelyTrivial(contentChanges, diffOutput);
        if (isTrivial) {
            console.log('✅ Changes appear to be trivial');
            console.log('   You may skip full product-mode rigor for this change');
            console.log('   (Still apply Principles 2, 3, 5: assumptions, scope, outcome definition)');
        }
        else {
            console.log('⚠️  Changes appear non-trivial');
            console.log('   Please run full product-mode pre-flight checklist');
            console.log('   Run: product-mode checklist');
        }
        // Show brief stats
        console.log(`\n📊 Stats: ${contentChanges.length} content lines changed`);
    }
    catch (error) {
        if (error.status === 128) {
            console.error('❌ Not a git repository or git not installed');
            console.error('   Make sure you are in a git repository');
        }
        else {
            console.error('❌ Error checking changes:', error.message);
        }
    }
}
function _isLikelyTrivial(changes, fullDiff) {
    // If very few changes, likely trivial
    if (changes.length <= 4) {
        return true;
    }
    // Check for common trivial patterns
    const trivialPatterns = [
        /^\+.*\/\//, // Comment additions
        /^-\.*\/\//, // Comment removals
        /^\+.*\s*$/, // Empty line additions
        /^-\.*\s*$/, // Empty line removals
        /^\+.*\s+\/\//, // Inline comment additions
        /^-\.*\s+\/\//, // Inline comment removals
        /^\+.*import\s+/, // Import additions (could be significant, but often trivial)
        /^-\.*import\s+/, // Import removals
        /^\+.*require\s*\(/, // Require additions
        /^-\.*require\s*\(/, // Require removals
    ];
    const trivialChangeCount = changes.filter(line => trivialPatterns.some(pattern => pattern.test(line))).length;
    // If most changes are trivial patterns, likely trivial overall
    if (changes.length > 0 && (trivialChangeCount / changes.length) > 0.7) {
        return true;
    }
    // Check for single line changes that are likely typos
    if (changes.length === 2) { // One + and one - likely a simple fix
        const plusLine = changes.find(line => line.startsWith('+'))?.slice(1) || '';
        const minusLine = changes.find(line => line.startsWith('-'))?.slice(1) || '';
        // Simple typo detection: one character difference, whitespace change, etc.
        if (_isSimpleTypo(plusLine, minusLine)) {
            return true;
        }
    }
    return false;
}
function _isSimpleTypo(a, b) {
    // Remove leading/trailing whitespace
    const cleanA = a.trim();
    const cleanB = b.trim();
    // If identical after trim, it's just whitespace change
    if (cleanA === cleanB)
        return true;
    // If one is empty and other is just whitespace/punctuation
    if ((cleanA.length === 0 && /^[\s\.,;:!?'"[\]{}()\-_]+$/.test(cleanB)) ||
        (cleanB.length === 0 && /^[\s\.,;:!?'"[\]{}()\-_]+$/.test(cleanA))) {
        return true;
    }
    // Check for single character differences (common typos)
    if (Math.abs(cleanA.length - cleanB.length) <= 1) {
        // Simple Levenshtein distance check for small strings
        if (cleanA.length < 5 && cleanB.length < 5) {
            const distance = _levenshteinDistance(cleanA, cleanB);
            return distance <= 1;
        }
    }
    return false;
}
function _levenshteinDistance(a, b) {
    if (a.length === 0)
        return b.length;
    if (b.length === 0)
        return a.length;
    const matrix = [];
    // Initialize first row and column
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    // Fill in the rest
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                matrix[i][j - 1] + 1, // insertion
                matrix[i - 1][j] + 1 // deletion
                );
            }
        }
    }
    return matrix[b.length][a.length];
}
//# sourceMappingURL=trivial.js.map