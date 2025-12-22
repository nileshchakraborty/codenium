const fs = require('fs');

const PROBLEMS_PATH = 'api/data/problems.json';
const SOLUTIONS_PATH = 'api/data/solutions.json';

function fixFlags() {
    try {
        const problemsData = JSON.parse(fs.readFileSync(PROBLEMS_PATH, 'utf8'));
        const solutionsData = JSON.parse(fs.readFileSync(SOLUTIONS_PATH, 'utf8'));
        const solutionsMap = solutionsData.solutions || {};

        let updates = 0;

        problemsData.categories.forEach(category => {
            category.problems.forEach(prob => {
                const slug = prob.slug;
                const hasSol = prob.has_solution;
                const exists = !!solutionsMap[slug];

                if (hasSol !== exists) {
                    prob.has_solution = exists;
                    console.log(`Updated ${slug}: has_solution -> ${exists}`);
                    updates++;
                }
            });
        });

        if (updates > 0) {
            fs.writeFileSync(PROBLEMS_PATH, JSON.stringify(problemsData, null, 2));
            console.log(`Saved ${updates} fixes to problems.json`);
        } else {
            console.log("No updates needed.");
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

fixFlags();
