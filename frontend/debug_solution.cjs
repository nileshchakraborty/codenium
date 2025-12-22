const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../api/data/solutions.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const keys = Object.keys(data);
console.log('Total keys:', keys.length);
if (keys.includes('detect-squares')) {
    console.log('detect-squares found!');
    const solution = data['detect-squares'];
    console.log('Keys in solution:', Object.keys(solution));
    if (solution.examples) {
        console.log('Examples:', JSON.stringify(solution.examples, null, 2));
    } else {
        console.log('NO examples field found.');
    }
    if (solution.testCases) {
        console.log('TestCases:', JSON.stringify(solution.testCases.slice(0, 2), null, 2));
    }
} else {
    console.log('detect-squares NOT found.');
}
