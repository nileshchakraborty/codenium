
const fs = require('fs');
const path = require('path');
const vm = require('vm');
// Try to load sucrase from frontend node_modules
let transform;
try {
    const sucrase = require('../frontend/node_modules/sucrase');
    transform = sucrase.transform;
} catch (e) {
    try {
        const sucrase = require('sucrase');
        transform = sucrase.transform;
    } catch (e2) {
        console.warn("Could not load sucrase. TypeScript validation will fail on types.");
    }
}

const SOLUTIONS_PATH = path.join(__dirname, '../api/data/solutions.json');

// Mock Data Structures
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

async function validate() {
    console.log("Loading solutions...");
    let data;
    try {
        data = JSON.parse(fs.readFileSync(SOLUTIONS_PATH, 'utf8'));
    } catch (e) {
        console.error("Failed to load solutions.json", e);
        return;
    }

    let passedJS = 0;
    let failedJS = 0;

    let passedTS = 0;
    let failedTS = 0;

    let skipped = 0;

    for (const [slug, problem] of Object.entries(data)) {
        if (!problem.implementations) {
            skipped++;
            continue;
        }

        // --- JavaScript Validation ---
        if (problem.implementations.javascript && problem.implementations.javascript.code) {
            const jsCode = problem.implementations.javascript.code;
            try {
                new vm.Script(jsCode);
                passedJS++;
            } catch (e) {
                console.error(`[${slug}] JS Syntax Error: ${e.message}`);
                failedJS++;
            }
        }

        // --- TypeScript Validation ---
        if (problem.implementations.typescript && problem.implementations.typescript.code) {
            let tsCode = problem.implementations.typescript.code;
            // Transpile if available
            if (transform) {
                try {
                    const result = transform(tsCode, { transforms: ['typescript'] });
                    tsCode = result.code;
                } catch (e) {
                    console.error(`[${slug}] TS Compilation Error: ${e.message}`);
                    failedTS++;
                    continue;
                }
            }

            try {
                new vm.Script(tsCode);
                // If this passes, it means it's valid JS (transpiled)
                passedTS++;
            } catch (e) {
                console.error(`[${slug}] TS Syntax Error (Post-Transpile): ${e.message}`);
                failedTS++;
            }
        }
    }

    console.log("\nValidation Complete");
    console.log(`JavaScript: passed=${passedJS}, failed=${failedJS}`);
    console.log(`TypeScript: passed (as JS)=${passedTS}, failed (has types)=${failedTS}`);

    if (failedTS > 0) {
        console.log("\nNote: TypeScript 'failures' here mean the code contains type annotations that Node.js cannot execute directly.");
        console.log("This confirms that a transpilation step is required for TypeScript execution in the browser.");
    }
}

validate();
