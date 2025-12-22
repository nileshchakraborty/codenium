const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../api/data/solutions.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Fix max-points-on-a-line
const slug = 'max-points-on-a-line';
const correctInitialCode = `from math import gcd
from collections import defaultdict

class Solution:
    def maxPoints(self, points: list[list[int]]) -> int:
        # Your code here
        pass
`;

data[slug].initialCode = correctInitialCode;

if (!data[slug].implementations) data[slug].implementations = {};
if (!data[slug].implementations.python) data[slug].implementations.python = {};
data[slug].implementations.python.initialCode = correctInitialCode;

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
console.log(`Fixed ${slug}`);
