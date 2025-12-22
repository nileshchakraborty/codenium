import * as panels from 'react-resizable-panels';
import DefaultPanel from 'react-resizable-panels';

console.log('Named Exports:', Object.keys(panels));
console.log('Default Export:', DefaultPanel);
console.log('Is Default same as Group?', DefaultPanel === panels.Group);
console.log('Is Default same as Panel?', DefaultPanel === panels.Panel);
