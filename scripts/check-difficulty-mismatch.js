const fs = require('fs');
const path = require('path');

const PROBLEMS_PATH = path.join(__dirname, '../api/data/problems.json');
const SOLUTIONS_PATH = path.join(__dirname, '../api/data/solutions.json');

function main() {
    const problems = JSON.parse(fs.readFileSync(PROBLEMS_PATH, 'utf8'));
    const solutions = JSON.parse(fs.readFileSync(SOLUTIONS_PATH, 'utf8')).solutions;

    let mismatches = 0;

    problems.categories.forEach(cat => {
        cat.problems.forEach(p => {
            const sol = solutions[p.slug];
            if (sol && sol.difficulty && p.difficulty && sol.difficulty !== p.difficulty) {
                console.log(`[Mismatch] ${p.slug}: Problems says '${p.difficulty}', Solution says '${sol.difficulty}'`);
                mismatches++;
            }
        });
    });

    console.log(`\nTotal Distcrepancies: ${mismatches}`);
}

main();
