const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../api/data/solutions.json');
const rawData = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(rawData);

if (data.solutions && !data['detect-squares']) {
    console.log('Detected nested "solutions" key. Flattening...');
    const flatData = data.solutions;
    fs.writeFileSync(jsonPath, JSON.stringify(flatData, null, 2));
    console.log('Flattened and saved. New key count:', Object.keys(flatData).length);
} else {
    console.log('Structure seems correct or "solutions" key missing.');
    console.log('Keys:', Object.keys(data).length);
}
