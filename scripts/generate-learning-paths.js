/**
 * Generate Learning Paths Script
 * Group problems by Normalized Pattern and link them by Difficulty (Easy -> Medium -> Hard).
 * Adds `suggestedNextQuestion` to solutions.json.
 */
const fs = require('fs');
const path = require('path');

const PROBLEMS_PATH = path.join(__dirname, '../api/data/problems.json');
const SOLUTIONS_PATH = path.join(__dirname, '../api/data/solutions.json');

const PATTERN_MAP = {
    "Two Pointers": ["Two Pointers", "Fast & Slow", "Floyd", "Trapping Rain Water"],
    "Sliding Window": ["Sliding Window"],
    "Dynamic Programming": ["Dynamic Programming", "DP", "1D DP", "2D DP", "Knapsack", "Unbounded Knapsack", "Memoization"],
    "Backtracking": ["Backtracking"],
    "Graphs": ["BFS", "DFS", "Union-Find", "Topological Sort", "Graph", "Dijkstra"],
    "Trees": ["Tree", "BST", "Binary Tree", "Inorder", "Preorder", "Postorder", "Level Order"],
    "Binary Search": ["Binary Search"],
    "Greedy": ["Greedy"],
    "Arrays & Hashing": ["Array", "Hash Map", "Hash Set", "Prefix Sum"],
    "Linked List": ["Linked List"]
};

function normalizePattern(rawPattern) {
    if (!rawPattern) return "Other";
    for (const [canonical, keywords] of Object.entries(PATTERN_MAP)) {
        for (const kw of keywords) {
            if (rawPattern.includes(kw)) return canonical;
        }
    }
    return "Other";
}

const DIFFICULTY_SCORE = { "Easy": 1, "Medium": 2, "Hard": 3 };

function main() {
    console.log("Analyzing existing paths...");
    const problemsData = JSON.parse(fs.readFileSync(PROBLEMS_PATH, 'utf8'));
    const solutionsData = JSON.parse(fs.readFileSync(SOLUTIONS_PATH, 'utf8'));
    const solutions = solutionsData.solutions;

    // 1. Gather all problems with metadata
    let allProblems = [];
    problemsData.categories.forEach(cat => {
        cat.problems.forEach(p => {
            const sol = solutions[p.slug];
            if (sol) {
                allProblems.push({
                    slug: p.slug,
                    title: p.title,
                    difficulty: p.difficulty,
                    rawPattern: sol.pattern,
                    normalizedPattern: normalizePattern(sol.pattern)
                });
            }
        });
    });

    // 2. Group by Normalized Pattern
    const groups = {};
    allProblems.forEach(p => {
        if (p.normalizedPattern === "Other") return;
        if (!groups[p.normalizedPattern]) groups[p.normalizedPattern] = [];
        groups[p.normalizedPattern].push(p);
    });

    // 3. Sort each group: Difficulty ASC, then Title ASC (or ID if we had it, keeping it stable)
    let totalLinks = 0;
    Object.entries(groups).forEach(([pattern, list]) => {
        // Sort
        list.sort((a, b) => {
            const diffA = DIFFICULTY_SCORE[a.difficulty] || 0;
            const diffB = DIFFICULTY_SCORE[b.difficulty] || 0;
            if (diffA !== diffB) return diffA - diffB;
            return a.title.localeCompare(b.title);
        });

        // Link
        for (let i = 0; i < list.length - 1; i++) {
            const curr = list[i];
            const next = list[i + 1];

            // Update Solution Data
            if (solutions[curr.slug]) {
                solutions[curr.slug].suggestedNextQuestion = {
                    slug: next.slug,
                    title: next.title,
                    difficulty: next.difficulty,
                    pattern: pattern // Useful for UI context
                };
                totalLinks++;
            }
        }
        // Last one has no next
        const last = list[list.length - 1];
        if (solutions[last.slug]) {
            solutions[last.slug].suggestedNextQuestion = null; // Clear if exists
        }
    });

    // 4. Save
    fs.writeFileSync(SOLUTIONS_PATH, JSON.stringify(solutionsData, null, 2));
    console.log(`✅ Generated Learning Paths! Linked ${totalLinks} problems across ${Object.keys(groups).length} patterns.`);
    console.log("Groups size:", Object.keys(groups).map(k => `${k}: ${groups[k].length}`).join(', '));
}

main();
