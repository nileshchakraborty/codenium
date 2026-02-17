const fs = require('fs');
const path = require('path');

// Paths
const problemsPath = path.join(__dirname, '../data/problems.json');
const systemDesignProblemsPath = path.join(__dirname, '../system-design/data/system-design-problems.json');

// Helper to read JSON
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
// Helper to write JSON
const writeJson = (p, data) => fs.writeFileSync(p, JSON.stringify(data, null, 2));

console.log('Starting source credits population...');

// 1. Update Coding Problems
try {
    if (fs.existsSync(problemsPath)) {
        const data = readJson(problemsPath);
        let updatedCount = 0;
        
        // Structure is { categories: [ { problems: [...] } ] }
        if (data.categories && Array.isArray(data.categories)) {
            data.categories.forEach(category => {
                if (category.problems && Array.isArray(category.problems)) {
                    category.problems.forEach(p => {
                        if (!p.source) {
                            p.source = "LeetCode"; // Default source for coding problems
                            updatedCount++;
                        }
                    });
                }
            });
            writeJson(problemsPath, data);
            console.log(`Updated ${updatedCount} coding problems in ${problemsPath}`);
        } else {
            console.error('Invalid structure in problems.json');
        }
    } else {
        console.error(`File not found: ${problemsPath}`);
    }
} catch (e) {
    console.error(`Error updating coding problems: ${e.message}`);
}

// 2. Update System Design Problems (Already done in previous step, but running again is safe)
try {
    if (fs.existsSync(systemDesignProblemsPath)) {
        const sdData = readJson(systemDesignProblemsPath);
        let updatedCount = 0;
        
        let isDict = false;
        let problemsArray = [];
        
        if (Array.isArray(sdData)) {
            problemsArray = sdData;
        } else if (sdData.problems) {
            problemsArray = sdData.problems;
        } else if (sdData.problemsById) {
            problemsArray = Object.values(sdData.problemsById);
            isDict = true;
        }

        if (isDict) {
            Object.values(sdData.problemsById).forEach(p => {
                if (!p.source) {
                    p.source = "System Design Interview";
                    updatedCount++;
                }
            });
            writeJson(systemDesignProblemsPath, sdData);
        } else {
             problemsArray.forEach(p => {
                if (!p.source) {
                    p.source = "System Design Interview";
                    updatedCount++;
                }
            });
             writeJson(systemDesignProblemsPath, sdData);
        }
        
        console.log(`Updated ${updatedCount} system design problems`);
    } else {
        console.error(`File not found: ${systemDesignProblemsPath}`);
    }
} catch (e) {
    console.error(`Error updating system design problems: ${e.message}`);
}

console.log('Done.');
