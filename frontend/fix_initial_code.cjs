const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../api/data/solutions.json');
const rawData = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(rawData);

let fixedCount = 0;

/**
 * Extract function/class signature from full solution code and create a starter template
 */
function createStarterTemplate(fullCode, slug) {
    if (!fullCode) return null;

    const lines = fullCode.split('\n');
    const templateLines = [];
    let inClass = false;
    let inMethod = false;
    let classIndent = '';
    let methodIndent = '';
    let currentClassName = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip empty lines at the start
        if (templateLines.length === 0 && trimmed === '') continue;

        // Keep import statements
        if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
            templateLines.push(line);
            continue;
        }

        // Detect class definition
        const classMatch = trimmed.match(/^class\s+(\w+)/);
        if (classMatch) {
            currentClassName = classMatch[1];
            inClass = true;
            classIndent = line.match(/^(\s*)/)[1];
            templateLines.push(line);
            continue;
        }

        // Inside class: look for method definitions
        if (inClass && !inMethod) {
            const methodMatch = trimmed.match(/^def\s+(\w+)\s*\([^)]*\)/);
            if (methodMatch) {
                methodIndent = line.match(/^(\s*)/)[1];
                // Get full method signature including return type hint if present
                let methodLine = line;
                // Check if signature continues on next line
                while (!methodLine.includes(':') && i + 1 < lines.length) {
                    i++;
                    methodLine += '\n' + lines[i];
                }
                templateLines.push(methodLine);
                templateLines.push(methodIndent + '    pass');
                templateLines.push('');
                inMethod = false;
                continue;
            }
        }

        // If we've found a class and at least one method, we likely have enough
        // Stop if we hit non-method code after methods
        if (inClass && templateLines.length > 3 && trimmed !== '' && !trimmed.startsWith('def ') && !trimmed.startsWith('#') && !trimmed.startsWith('"""') && !trimmed.startsWith("'''")) {
            // Don't add more lines, we have the template
            break;
        }
    }

    // If no class found, try function-based problems
    if (!inClass) {
        templateLines.length = 0; // Reset

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            // Keep imports
            if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
                templateLines.push(line);
                continue;
            }

            // Look for class Solution
            if (trimmed.startsWith('class Solution')) {
                templateLines.push(line);
                inClass = true;
                continue;
            }

            // Inside Solution class, find the main method
            if (inClass) {
                const methodMatch = trimmed.match(/^def\s+(\w+)\s*\(self[^)]*\)/);
                if (methodMatch) {
                    // Get signature line(s)
                    let methodLine = line;
                    while (!methodLine.includes(':') && i + 1 < lines.length) {
                        i++;
                        methodLine += '\n' + lines[i];
                    }
                    templateLines.push(methodLine);
                    templateLines.push('        pass');
                    break; // Usually only one method needed for Solution class
                }
            }
        }
    }

    // If still nothing useful, return a generic template
    if (templateLines.length < 2) {
        return `class Solution:
    def solve(self):
        # Your code here
        pass
`;
    }

    return templateLines.join('\n').trim() + '\n';
}

// Process all solutions
const slugs = Object.keys(data);
console.log(`Processing ${slugs.length} solutions...`);

for (const slug of slugs) {
    const solution = data[slug];
    if (!solution) continue;

    // Check if implementations.python.initialCode exists and is a full solution
    if (solution.implementations?.python?.initialCode) {
        const currentInitial = solution.implementations.python.initialCode;

        // If initialCode is long (full solution), create a starter template
        if (currentInitial.length > 500 && currentInitial.includes('return ')) {
            const fullCode = solution.code || solution.implementations.python.code || currentInitial;
            const starterTemplate = createStarterTemplate(fullCode, slug);

            if (starterTemplate && starterTemplate.length < currentInitial.length) {
                solution.implementations.python.initialCode = starterTemplate;
                solution.initialCode = starterTemplate; // Also update root initialCode
                fixedCount++;
                console.log(`Fixed ${slug}: ${currentInitial.length} chars -> ${starterTemplate.length} chars`);
            }
        }
    }

    // Also fix root initialCode if it's a full solution
    if (solution.initialCode && solution.initialCode.length > 500 && solution.initialCode.includes('return ')) {
        const fullCode = solution.code || solution.initialCode;
        const starterTemplate = createStarterTemplate(fullCode, slug);

        if (starterTemplate && starterTemplate.length < solution.initialCode.length) {
            solution.initialCode = starterTemplate;
            if (!solution.implementations?.python?.initialCode) {
                // Ensure implementations.python exists and has initialCode
                if (!solution.implementations) solution.implementations = {};
                if (!solution.implementations.python) solution.implementations.python = {};
                solution.implementations.python.initialCode = starterTemplate;
            }
            fixedCount++;
            console.log(`Fixed root initialCode for ${slug}`);
        }
    }
}

// Save the fixed data
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n=== COMPLETE ===`);
console.log(`Fixed ${fixedCount} solutions`);
