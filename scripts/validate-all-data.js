/**
 * Ultimate Data Validator
 * Validates integrity of every field in problems.json and solutions.json.
 */
const fs = require('fs');
const path = require('path');

const PROBLEMS_PATH = path.join(__dirname, '../api/data/problems.json');
const SOLUTIONS_PATH = path.join(__dirname, '../api/data/solutions.json');

function main() {
    console.log("Starting Comprehensive Data Validation...");

    // Load Data
    let problemsData, solutionsData;
    try {
        problemsData = JSON.parse(fs.readFileSync(PROBLEMS_PATH, 'utf8'));
        solutionsData = JSON.parse(fs.readFileSync(SOLUTIONS_PATH, 'utf8'));
    } catch (e) {
        console.error("FATAL: Failed to parse JSON files.", e.message);
        process.exit(1);
    }

    const solutions = solutionsData.solutions;
    const report = {
        missingFields: [],
        brokenLinks: [],
        emptySections: [],
        invalidTypes: []
    };

    let totalProblems = 0;

    // 1. Validate Solutions Schema
    Object.entries(solutions).forEach(([slug, sol]) => {
        // Required Fields
        const required = ['title', 'code', 'timeComplexity', 'spaceComplexity', 'intuition', 'pattern'];
        required.forEach(field => {
            if (!sol[field]) {
                report.missingFields.push({ slug, field });
            }
        });

        // Smart Visualizer Checks
        if (!sol.animationSteps || sol.animationSteps.length === 0) {
            report.emptySections.push({ slug, field: 'animationSteps' });
        }

        // Data Types
        if (sol.intuition && !Array.isArray(sol.intuition)) {
            report.invalidTypes.push({ slug, field: 'intuition', expected: 'Array' });
        }
    });

    // 2. Validate Problems Listing vs Solutions
    problemsData.categories.forEach(cat => {
        cat.problems.forEach(p => {
            totalProblems++;
            const sol = solutions[p.slug];

            // Start Check
            if (p.has_solution && !sol) {
                report.brokenLinks.push({ slug: p.slug, error: "Marked has_solution=true but missing in solutions.json" });
            }
            if (!p.has_solution && sol) {
                // Not an error per se, but data sync issue
                // Auto-fix candidate?
            }

            // Check essential fields
            if (!p.title || !p.difficulty || !p.slug) {
                report.missingFields.push({ slug: p.slug || 'UNKNOWN', field: 'Listing Metadata' });
            }
        });
    });

    // Output Report
    console.log(`\n=== Validation Report (${totalProblems} Problems) ===`);

    if (report.missingFields.length > 0) {
        console.log(`\n❌ Missing Fields (${report.missingFields.length}):`);
        report.missingFields.slice(0, 5).forEach(e => console.log(`  - ${e.slug}: Missing '${e.field}'`));
    } else {
        console.log("✅ All required fields present.");
    }

    if (report.emptySections.length > 0) {
        console.log(`\n❌ Empty Sections (${report.emptySections.length}):`);
        report.emptySections.forEach(e => console.log(`  - ${e.slug}: Empty '${e.field}'`));
    } else {
        console.log("✅ All animation steps populated.");
    }

    if (report.brokenLinks.length > 0) {
        console.log(`\n❌ Broken Links (${report.brokenLinks.length}):`);
        report.brokenLinks.forEach(e => console.log(`  - ${e.slug}: ${e.error}`));
    } else {
        console.log("✅ Listing and Solutions are synced.");
    }

    if (report.invalidTypes.length > 0) {
        console.log(`\n❌ Invalid Types (${report.invalidTypes.length}):`);
        report.invalidTypes.forEach(e => console.log(`  - ${e.slug}: ${e.field} should be ${e.expected}`));
    } else {
        console.log("✅ Data types valid.");
    }
}

main();
