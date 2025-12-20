/**
 * Inject Mental Models Script
 * Adds a 'mentalModel' field to solutions based on their pattern.
 * Provides a concrete "Analogy" for abstract concepts.
 */
const fs = require('fs');
const path = require('path');

const SOLUTIONS_PATH = path.join(__dirname, '../api/data/solutions.json');

const ANALOGIES = {
    "Sliding Window": "Imagine a caterpillar crawling along a branch. It extends its head (right pointer) to eat leaves (add elements), and pulls its tail (left pointer) to digest (remove elements).",
    "Two Pointers": "Like two people walking towards each other from opposite ends of a hallway to meet in the middle.",
    "Dynamic Programming": "Like filling out a form where each answer depends on the previous answers. You never calculate the same thing twice!",
    "BFS": "Like a ripple in a pond, spreading out layer by layer from the center.",
    "DFS": "Like solving a maze by walking as far as you can down one path, then backtracking when you hit a dead end.",
    "Backtracking": "Like try-and-error in a lock combination. You try a number, if it fails, you 'backtrack' and try the next one.",
    "Binary Search": "Like looking up a word in a dictionary. You open the middle, see if the word is before or after, and discard half the book instantly.",
    "Linked List": "Like a treasure hunt where each clue (node) holds the location of the next clue.",
    "Stack": "Like a stack of plates. You can only add or remove the top plate (LIFO).",
    "Queue": "Like a line at a grocery store. First person in line is the first one served (FIFO).",
    "Trie": "Like an autocomplete system. As you type each letter, you walk down a specific path of the word tree.",
    "Greedy": "Like a cashier making change. Always pick the biggest coin that fits, hoping it leads to the fewest coins total."
};

function main() {
    console.log("Injecting Mental Models...");
    const data = JSON.parse(fs.readFileSync(SOLUTIONS_PATH, 'utf8'));
    const solutions = data.solutions;

    let injected = 0;

    Object.values(solutions).forEach(sol => {
        // Find best analogy based on pattern match
        let model = null;
        if (sol.pattern) {
            for (const [key, analogy] of Object.entries(ANALOGIES)) {
                if (sol.pattern.includes(key)) {
                    model = analogy;
                    break;
                }
            }
        }

        // Special overrides for specific problems
        if (sol.title === "Trapping Rain Water") {
            model = "Imagine filling a landscape with water. The water level at any point is determined by the shortest 'wall' enclosing it.";
        } else if (sol.title === "Climbing Stairs") {
            model = "Like a Fibonacci sequence. To get to step N, you must have come from step N-1 or N-2.";
        }

        if (model) {
            sol.mentalModel = model;
            injected++;
        }
    });

    fs.writeFileSync(SOLUTIONS_PATH, JSON.stringify(data, null, 2));
    console.log(`✅ Injected Mental Models into ${injected} solutions.`);
}

main();
