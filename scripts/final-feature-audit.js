/**
 * Final Feature Audit
 * Verifies that all "Big MVP" features are actually present in the data.
 */
const fs = require('fs');
const path = require('path');

const SOLUTIONS_PATH = path.join(__dirname, '../api/data/solutions.json');

function main() {
    console.log("Running Final Feature Audit...");
    const data = JSON.parse(fs.readFileSync(SOLUTIONS_PATH, 'utf8'));
    const solutions = Object.values(data.solutions);
    const total = solutions.length;

    const stats = {
        hasSuggestedNext: 0,
        hasMentalModel: 0,
        hasOneLiner: 0,
        hasDeepIntuition: 0,
        hasVideoId: 0
    };

    solutions.forEach(sol => {
        if (sol.suggestedNextQuestion) stats.hasSuggestedNext++;
        if (sol.mentalModel) stats.hasMentalModel++;
        if (sol.oneliner && sol.oneliner.length > 10) stats.hasOneLiner++;
        if (sol.intuition && sol.intuition.length > 0) stats.hasDeepIntuition++;
        if (sol.videoId) stats.hasVideoId++;
    });

    console.log(`\n___ Feature Saturation Report (N=${total}) ___`);
    console.log(`\n🧠 Pattern Learning Paths`);
    console.log(`   - Linked Problems: ${stats.hasSuggestedNext} / ${total} (${Math.round(stats.hasSuggestedNext / total * 100)}%)`);
    console.log(`   - Note: Not all problems have a "next" (end of path), so <100% is expected.`);

    console.log(`\n💭 Conceptual Learning`);
    console.log(`   - Mental Model Analogies: ${stats.hasMentalModel} / ${total} (${Math.round(stats.hasMentalModel / total * 100)}%)`);
    console.log(`   - Deep Intuition & Narratives: ${stats.hasDeepIntuition} / ${total} (${Math.round(stats.hasDeepIntuition / total * 100)}%)`);

    console.log(`\n🎤 Voiceover Readiness`);
    console.log(`   - One-Liners (Script): ${stats.hasOneLiner} / ${total} (${Math.round(stats.hasOneLiner / total * 100)}%)`);

    console.log(`\n📺 Multimedia`);
    console.log(`   - Video Explanations: ${stats.hasVideoId} / ${total} (${Math.round(stats.hasVideoId / total * 100)}%)`);

    console.log(`\nOverall Health: ${stats.hasDeepIntuition === total ? "EXCELLENT" : "GOOD"}`);
}

main();
