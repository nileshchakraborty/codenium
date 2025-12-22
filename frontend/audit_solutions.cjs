const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../api/data/solutions.json');
const rawData = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(rawData);

const issues = [];

// Check for C++ patterns that shouldn't be in Python code
const cppPatterns = [
    /class\s+\w+\s*\{\s*public:/,  // class Name { public:
    /\w+::\w+/,                     // namespace::function
    /#include\s*</,                 // #include <
    /std::/,                        // std::
    /->>/,                          // C++ stream operator
];

// Check for malformed Python code patterns
const malformedPythonPatterns = [
    /class\s+Solution:\s*\n\s*def\s+__init__|class Solution:\s+def __init__/, // Missing proper indentation
    /^\s*pass\s*$/,                 // Only pass in the entire code
];

function checkPythonCode(slug, code, fieldName) {
    if (!code) return;

    // Check for C++ patterns in Python code
    for (const pattern of cppPatterns) {
        if (pattern.test(code)) {
            issues.push({
                slug,
                field: fieldName,
                issue: 'C++ syntax in Python code',
                pattern: pattern.toString(),
                snippet: code.substring(0, 200).replace(/\n/g, '\\n')
            });
            return; // One issue per field is enough
        }
    }

    // Check for malformed Python (too short or placeholder-like)
    const trimmedCode = code.trim();
    if (trimmedCode.length < 50 && trimmedCode.includes('class') && trimmedCode.includes('pass')) {
        issues.push({
            slug,
            field: fieldName,
            issue: 'Placeholder/stub code',
            snippet: trimmedCode.replace(/\n/g, '\\n')
        });
    }

    // Check for broken indentation (common issue)
    if (/class\s+\w+:\s*\n\s*"""/.test(code)) {
        // Docstring immediately after class without method definition. This is OK for some classes, but let's flag it.
    }

    // Check if initialCode looks like a full solution (should be a starter template)
    if (fieldName.includes('initialCode') && code.includes('return ') && code.length > 500) {
        issues.push({
            slug,
            field: fieldName,
            issue: 'initialCode appears to be full solution, not starter template',
            length: code.length
        });
    }
}

// Iterate through all solutions
const slugs = Object.keys(data);
console.log(`Auditing ${slugs.length} solutions...`);

for (const slug of slugs) {
    const solution = data[slug];
    if (!solution) continue;

    // Check main code field
    checkPythonCode(slug, solution.code, 'code');

    // Check initialCode field
    checkPythonCode(slug, solution.initialCode, 'initialCode');

    // Check implementations.python
    if (solution.implementations?.python) {
        const pyImpl = solution.implementations.python;
        if (typeof pyImpl === 'string') {
            checkPythonCode(slug, pyImpl, 'implementations.python (string)');
        } else if (typeof pyImpl === 'object') {
            checkPythonCode(slug, pyImpl.code, 'implementations.python.code');
            checkPythonCode(slug, pyImpl.initialCode, 'implementations.python.initialCode');
        }
    }
}

console.log(`\n=== AUDIT RESULTS ===`);
console.log(`Total issues found: ${issues.length}`);

if (issues.length > 0) {
    console.log(`\n--- Issues by Type ---`);
    const byType = {};
    for (const issue of issues) {
        const key = issue.issue;
        if (!byType[key]) byType[key] = [];
        byType[key].push(issue);
    }

    for (const [type, items] of Object.entries(byType)) {
        console.log(`\n${type}: ${items.length} occurrences`);
        for (const item of items.slice(0, 5)) { // Show first 5
            console.log(`  - ${item.slug} (${item.field})`);
            if (item.snippet) console.log(`    snippet: ${item.snippet.substring(0, 100)}...`);
        }
        if (items.length > 5) {
            console.log(`  ... and ${items.length - 5} more`);
        }
    }
}

// Output full report as JSON
fs.writeFileSync(
    path.resolve(__dirname, 'audit_report.json'),
    JSON.stringify(issues, null, 2)
);
console.log(`\nFull report saved to frontend/audit_report.json`);
