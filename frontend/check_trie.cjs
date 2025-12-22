const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../api/data/solutions.json'), 'utf8'));
const trie = data['implement-trie-prefix-tree'];

console.log('=== Root initialCode ===');
console.log(trie.initialCode?.substring(0, 300) || 'N/A');

console.log('\n=== implementations.python.initialCode ===');
console.log(trie.implementations?.python?.initialCode?.substring(0, 300) || 'N/A');

console.log('\n=== All implementation keys ===');
console.log(Object.keys(trie.implementations || {}));

console.log('\n=== testCases ===');
console.log(JSON.stringify(trie.testCases, null, 2)?.substring(0, 500) || 'N/A');

console.log('\n=== examples ===');
console.log(JSON.stringify(trie.examples, null, 2)?.substring(0, 500) || 'N/A');
