const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../api/data/solutions.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const slugs = Object.keys(data);

// Find design problems (class-based with multiple methods)
const designPatterns = ['cache', 'trie', 'design', 'implement', 'twitter', 'iterator', 'data structure', 'stream', 'detector', 'squares'];
const designProblems = slugs.filter(slug => {
    const sol = data[slug];
    const title = (sol.title || '').toLowerCase();
    const cat = (sol.category || '').toLowerCase();
    const code = sol.code || '';

    // Check if it's a design problem by title/category
    for (const pattern of designPatterns) {
        if (title.includes(pattern) || cat.includes(pattern)) return true;
    }

    // Check if code has a non-Solution class (like LRUCache, Trie, etc.)
    const classMatch = code.match(/class\s+(\w+)/);
    if (classMatch && classMatch[1] !== 'Solution' && code.includes('def __init__')) {
        return true;
    }

    return false;
});

console.log('Design problems found:', designProblems.length);
designProblems.forEach(s => {
    const sol = data[s];
    console.log('  -', s, ':', sol.title);
});

// Output to file for analysis
fs.writeFileSync(
    path.resolve(__dirname, 'design_problems.json'),
    JSON.stringify(designProblems.map(s => ({
        slug: s,
        title: data[s].title,
        category: data[s].category,
        currentInitialCode: (data[s].initialCode || '').substring(0, 200)
    })), null, 2)
);
console.log('\nSaved to frontend/design_problems.json');
