/**
 * Sync Difficulty Script
 * Updates problems.json difficulty levels to match solutions.json (Subject of Truth).
 */
const fs = require('fs');
const path = require('path');

const PROBLEMS_PATH = path.join(__dirname, '../api/data/problems.json');
const SOLUTIONS_PATH = path.join(__dirname, '../api/data/solutions.json');

function main() {
    console.log("Syncing difficulties...");
    const problemsData = JSON.parse(fs.readFileSync(PROBLEMS_PATH, 'utf8'));
    const solutions = JSON.parse(fs.readFileSync(SOLUTIONS_PATH, 'utf8')).solutions;

    let updates = 0;

    problemsData.categories.forEach(cat => {
        cat.problems.forEach(p => {
            const sol = solutions[p.slug];
            if (sol && sol.difficulty && p.difficulty !== sol.difficulty) {
                console.log(`Updating ${p.slug}: ${p.difficulty} -> ${sol.difficulty}`);
                p.difficulty = sol.difficulty;
                updates++;
            }
        });
    });

    if (updates > 0) {
        fs.writeFileSync(PROBLEMS_PATH, JSON.stringify(problemsData, null, 2));
        console.log(`\n✅ Synced ${updates} difficulty ratings.`);
    } else {
        console.log("No updates needed.");
    }
}

main();
