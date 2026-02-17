const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../system-design/data');
const problemsFile = path.join(dataDir, 'system_design_problems.json');
const topicsFile = path.join(dataDir, 'topics.json');

const newProblemsFile = path.join(dataDir, 'system-design-problems.json');
const newSolutionsFile = path.join(dataDir, 'system-design-solutions.json');

// Verified Video IDs
const verifiedVideos = {
    'design-rate-limiter': 'MIJFyUPG4Z4',
    'design-url-shortener': 'iUU4O1sWtJA',
    'design-youtube': 'IUrQ5_g3XKs',
    'design-whatsapp': 'cr6p0n0N-VA',
    'design-distributed-cache': 'dGAgxozNWFE',
    'design-ticketmaster': 'fhdPyoO6aXI',
    'design-web-crawler': '6u25GckPhLU',
    'design-proximity-service': 'M4lR_Va97cQ',
    'design-ride-sharing': 'lsKU38RKQSo',
    'design-news-feed': 'Qj4-GruzyDU',
    'design-facebook-news-feed': 'Qj4-GruzyDU',
    'design-unique-id-generator': 'kCpL2V5P6S0'
};

function migrate() {
    if (!fs.existsSync(problemsFile)) {
        console.error('Source problems file not found');
        return;
    }

    const { problems } = JSON.parse(fs.readFileSync(problemsFile, 'utf8'));
    const topics = JSON.parse(fs.readFileSync(topicsFile, 'utf8'));

    // 1. Create Problems File (Categorized)
    const categorizedProblems = {
        categories: topics.map(topic => ({
            name: topic.title,
            icon: getIconForTopic(topic.id),
            problems: problems
                .filter(p => p.category === topic.id)
                .map(p => ({
                    id: p.id,
                    title: p.title,
                    slug: p.slug,
                    difficulty: p.difficulty,
                    description: p.description,
                    topics: p.topics,
                    estimatedTime: p.estimatedTime,
                    has_solution: true
                }))
        }))
    };

    fs.writeFileSync(newProblemsFile, JSON.stringify(categorizedProblems, null, 2));
    console.log(`Created ${newProblemsFile}`);

    // 2. Create Solutions File
    const solutions = {};
    problems.forEach(p => {
        solutions[p.slug] = {
            title: p.title,
            videoId: verifiedVideos[p.slug] || p.videoId,
            description: p.description,
            intuition: [
                `Understand the scale: ${p.estimatedTime} deep dive.`,
                `Focus on key components: ${p.topics.join(', ')}.`,
                "Prioritize availability and scalability."
            ],
            walkthrough: [
                "Understand Requirements & Scale",
                "High-Level Design (Core Components)",
                "Deep Dive into Bottlenecks",
                "Scalability & Optimization"
            ],
            hints: [
                "Consider the throughput requirements.",
                "Think about how to handle failures.",
                "Where can we add caching?"
            ],
            keyInsight: "A robust design prioritizes data consistency and low latency.",
            mentalModel: "Think of it as building a lego set where each piece must handle millions of requests.",
            difficulty: p.difficulty,
            pattern: "System Design Pattern",
            relatedProblems: []
        };
    });

    fs.writeFileSync(newSolutionsFile, JSON.stringify(solutions, null, 2));
    console.log(`Created ${newSolutionsFile}`);
}

function getIconForTopic(id) {
    const icons = {
        'foundations': '🏗️',
        'storage': '💾',
        'distributed-systems': '🌐',
        'system-design-case-studies': '🏢'
    };
    return icons[id] || '📝';
}

migrate();
