const fs = require('fs');
const path = require('path');

const problemsPath = path.resolve(__dirname, '../api/data/problems.json');
const solutionsPath = path.resolve(__dirname, '../api/data/solutions.json');

const problems = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));
const solutions = JSON.parse(fs.readFileSync(solutionsPath, 'utf8'));

const report = {
    totalProblems: 0,
    totalSolutions: Object.keys(solutions).length,
    missingInSolutions: [],
    missingSlugsInProblems: [],
    missingInitialCode: [],
    emptyInitialCode: [],
    validProblems: [],
    invalidInitialCodeSyntax: [],
};

// Extract all problem slugs from problems.json
const problemSlugs = new Set();

if (problems.categories) {
    for (const category of problems.categories) {
        if (category.problems) {
            for (const problem of category.problems) {
                if (problem.slug) {
                    problemSlugs.add(problem.slug);
                    report.totalProblems++;
                }
            }
        }
    }
}

console.log(`Found ${report.totalProblems} problems in problems.json`);
console.log(`Found ${report.totalSolutions} solutions in solutions.json`);

// Check each problem has a solution with valid initialCode
for (const slug of problemSlugs) {
    const solution = solutions[slug];

    if (!solution) {
        report.missingInSolutions.push(slug);
        continue;
    }

    // Check for initialCode
    const initialCode = solution.initialCode || solution.implementations?.python?.initialCode;

    if (!initialCode) {
        report.missingInitialCode.push(slug);
        continue;
    }

    if (initialCode.trim().length < 20) {
        report.emptyInitialCode.push({ slug, length: initialCode.length, content: initialCode.trim() });
        continue;
    }

    // Basic Python syntax validation
    const hasClassOrDef = /class\s+\w+|def\s+\w+/.test(initialCode);
    if (!hasClassOrDef) {
        report.invalidInitialCodeSyntax.push({
            slug,
            reason: 'No class or function definition found',
            snippet: initialCode.substring(0, 100)
        });
        continue;
    }

    report.validProblems.push(slug);
}

// Check for solutions without corresponding problems (orphans)
const solutionSlugs = Object.keys(solutions);
for (const slug of solutionSlugs) {
    if (!problemSlugs.has(slug)) {
        report.missingSlugsInProblems.push(slug);
    }
}

// Output report
console.log('\n===== VALIDATION REPORT =====\n');

console.log(`✅ Valid problems with proper initialCode: ${report.validProblems.length}/${report.totalProblems}`);

if (report.missingInSolutions.length > 0) {
    console.log(`\n❌ Problems missing solutions (${report.missingInSolutions.length}):`);
    report.missingInSolutions.slice(0, 10).forEach(s => console.log(`   - ${s}`));
    if (report.missingInSolutions.length > 10) console.log(`   ... and ${report.missingInSolutions.length - 10} more`);
}

if (report.missingInitialCode.length > 0) {
    console.log(`\n⚠️ Solutions missing initialCode (${report.missingInitialCode.length}):`);
    report.missingInitialCode.slice(0, 10).forEach(s => console.log(`   - ${s}`));
    if (report.missingInitialCode.length > 10) console.log(`   ... and ${report.missingInitialCode.length - 10} more`);
}

if (report.emptyInitialCode.length > 0) {
    console.log(`\n⚠️ Solutions with empty/very short initialCode (${report.emptyInitialCode.length}):`);
    report.emptyInitialCode.slice(0, 5).forEach(item =>
        console.log(`   - ${item.slug}: "${item.content.substring(0, 50)}"`)
    );
    if (report.emptyInitialCode.length > 5) console.log(`   ... and ${report.emptyInitialCode.length - 5} more`);
}

if (report.invalidInitialCodeSyntax.length > 0) {
    console.log(`\n⚠️ Solutions with invalid Python syntax (${report.invalidInitialCodeSyntax.length}):`);
    report.invalidInitialCodeSyntax.slice(0, 5).forEach(item =>
        console.log(`   - ${item.slug}: ${item.reason}`)
    );
    if (report.invalidInitialCodeSyntax.length > 5) console.log(`   ... and ${report.invalidInitialCodeSyntax.length - 5} more`);
}

if (report.missingSlugsInProblems.length > 0) {
    console.log(`\n📋 Orphan solutions (in solutions.json but not in problems.json): ${report.missingSlugsInProblems.length}`);
    report.missingSlugsInProblems.slice(0, 10).forEach(s => console.log(`   - ${s}`));
    if (report.missingSlugsInProblems.length > 10) console.log(`   ... and ${report.missingSlugsInProblems.length - 10} more`);
}

// Save full report
fs.writeFileSync(
    path.resolve(__dirname, 'validation_report.json'),
    JSON.stringify(report, null, 2)
);
console.log('\nFull report saved to frontend/validation_report.json');

// Summary
const successRate = ((report.validProblems.length / report.totalProblems) * 100).toFixed(1);
console.log(`\n===== SUMMARY =====`);
console.log(`Success rate: ${successRate}%`);
console.log(`Valid: ${report.validProblems.length} | Missing solution: ${report.missingInSolutions.length} | Missing initialCode: ${report.missingInitialCode.length} | Empty: ${report.emptyInitialCode.length} | Invalid syntax: ${report.invalidInitialCodeSyntax.length}`);
