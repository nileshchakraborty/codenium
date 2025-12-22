const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../api/data/solutions.json');
const rawData = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(rawData);

if (data['detect-squares']) {
    console.log('Patching detect-squares initialCode...');

    // Correct Python starter template for DetectSquares design problem
    const correctInitialCode = `from collections import defaultdict

class DetectSquares:
    def __init__(self):
        # Initialize your data structure here
        pass
    
    def add(self, point: list[int]) -> None:
        # Add a point to the data structure
        pass
    
    def count(self, point: list[int]) -> int:
        # Count axis-aligned squares with given query point
        pass
`;

    data['detect-squares'].initialCode = correctInitialCode;

    // Also update implementations.python.initialCode if it exists
    if (data['detect-squares'].implementations && data['detect-squares'].implementations.python) {
        data['detect-squares'].implementations.python.initialCode = correctInitialCode;
    }

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    console.log('Patched detect-squares initialCode successfully.');
} else {
    console.error('detect-squares key not found!');
}
