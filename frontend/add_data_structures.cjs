const fs = require('fs');
const path = require('path');

const solutionsPath = path.resolve(__dirname, '../api/data/solutions.json');
const problemsPath = path.resolve(__dirname, '../api/data/problems.json');

const solutions = JSON.parse(fs.readFileSync(solutionsPath, 'utf8'));
const problems = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));

// =============================================
// DATA STRUCTURE DEFINITIONS FOR EACH LANGUAGE
// =============================================

const DATA_STRUCTURES = {
    // ---------- PYTHON ----------
    python: {
        ListNode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

`,
        TreeNode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

`,
        Node: `class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

`,
        NestedInteger: `# This is the interface that allows for creating nested lists.
# You should not implement it, or speculate about its implementation
class NestedInteger:
    def __init__(self, value=None):
        pass
    def isInteger(self) -> bool:
        pass
    def add(self, elem):
        pass
    def setInteger(self, value):
        pass
    def getInteger(self) -> int:
        pass
    def getList(self) -> list:
        pass

`,
    },

    // ---------- JAVASCRIPT ----------
    javascript: {
        ListNode: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

`,
        TreeNode: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

`,
        Node: `/**
 * Definition for a Node.
 * function Node(val, neighbors) {
 *     this.val = val === undefined ? 0 : val;
 *     this.neighbors = neighbors === undefined ? [] : neighbors;
 * }
 */

`,
    },

    // ---------- JAVA ----------
    java: {
        ListNode: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */

`,
        TreeNode: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */

`,
        Node: `/**
 * Definition for a Node.
 * class Node {
 *     public int val;
 *     public List<Node> neighbors;
 *     public Node() { val = 0; neighbors = new ArrayList<>(); }
 *     public Node(int _val) { val = _val; neighbors = new ArrayList<>(); }
 *     public Node(int _val, ArrayList<Node> _neighbors) { val = _val; neighbors = _neighbors; }
 * }
 */

`,
    },

    // ---------- C++ ----------
    cpp: {
        ListNode: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */

`,
        TreeNode: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */

`,
        Node: `/**
 * Definition for a Node.
 * class Node {
 * public:
 *     int val;
 *     vector<Node*> neighbors;
 *     Node() { val = 0; neighbors = vector<Node*>(); }
 *     Node(int _val) { val = _val; neighbors = vector<Node*>(); }
 *     Node(int _val, vector<Node*> _neighbors) { val = _val; neighbors = _neighbors; }
 * };
 */

`,
    },

    // ---------- GO ----------
    go: {
        ListNode: `/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */

`,
        TreeNode: `/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */

`,
        Node: `/**
 * Definition for a Node.
 * type Node struct {
 *     Val int
 *     Neighbors []*Node
 * }
 */

`,
    },

    // ---------- RUST ----------
    rust: {
        ListNode: `// Definition for singly-linked list.
// #[derive(PartialEq, Eq, Clone, Debug)]
// pub struct ListNode {
//   pub val: i32,
//   pub next: Option<Box<ListNode>>
// }
// impl ListNode {
//   #[inline]
//   fn new(val: i32) -> Self {
//     ListNode { next: None, val }
//   }
// }

`,
        TreeNode: `// Definition for a binary tree node.
// #[derive(Debug, PartialEq, Eq)]
// pub struct TreeNode {
//   pub val: i32,
//   pub left: Option<Rc<RefCell<TreeNode>>>,
//   pub right: Option<Rc<RefCell<TreeNode>>>,
// }
// impl TreeNode {
//   #[inline]
//   pub fn new(val: i32) -> Self {
//     TreeNode { val, left: None, right: None }
//   }
// }
use std::rc::Rc;
use std::cell::RefCell;

`,
    },
};

// =============================================
// DETECT WHICH DATA STRUCTURES A PROBLEM NEEDS
// =============================================

function detectRequiredStructures(solution, slug) {
    const structures = new Set();
    const code = solution.code || '';
    const title = (solution.title || '').toLowerCase();
    const category = (solution.category || '').toLowerCase();

    // Tree problems
    if (title.includes('tree') || title.includes('bst') ||
        category.includes('tree') || category.includes('binary') ||
        code.includes('TreeNode') || code.includes('self.left') || code.includes('self.right') ||
        code.includes('.left') || code.includes('.right')) {
        structures.add('TreeNode');
    }

    // Linked list problems
    if (title.includes('linked') || title.includes('list') && !title.includes('array') ||
        category.includes('linked') ||
        code.includes('ListNode') || code.includes('self.next') ||
        (code.includes('.next') && !code.includes('next('))) {
        structures.add('ListNode');
    }

    // Graph problems with Node class
    if ((title.includes('graph') || title.includes('clone') || title.includes('neighbor')) &&
        (code.includes('Node') || code.includes('neighbors'))) {
        structures.add('Node');
    }

    return Array.from(structures);
}

// =============================================
// GENERATE STARTER TEMPLATE FOR A LANGUAGE
// =============================================

function generateStarterTemplate(solution, language, requiredStructures) {
    let template = '';

    // Add required data structure definitions
    for (const struct of requiredStructures) {
        if (DATA_STRUCTURES[language]?.[struct]) {
            template += DATA_STRUCTURES[language][struct];
        }
    }

    // Try to extract the method signature from the full solution
    const fullCode = solution.implementations?.[language]?.code ||
        (language === 'python' ? solution.code : null);

    if (fullCode) {
        const starterCode = extractMethodSignature(fullCode, language);
        if (starterCode) {
            template += starterCode;
        }
    }

    // If we couldn't extract, use a generic template
    if (!template.trim()) {
        template = getGenericTemplate(language);
    }

    return template;
}

function extractMethodSignature(code, language) {
    const lines = code.split('\n');
    let result = [];
    let inClass = false;
    let braceCount = 0;

    if (language === 'python') {
        for (const line of lines) {
            const trimmed = line.trim();

            // Skip imports for now (we add them via data structures)
            if (trimmed.startsWith('from ') || trimmed.startsWith('import ')) continue;

            // Class definition
            if (trimmed.startsWith('class ')) {
                result.push(line);
                inClass = true;
                continue;
            }

            // Method definition inside class
            if (inClass && trimmed.startsWith('def ')) {
                // Get the full signature
                let sig = line;
                let i = lines.indexOf(line);
                while (!sig.includes(':') && i + 1 < lines.length) {
                    i++;
                    sig += '\n' + lines[i];
                }
                result.push(sig);
                result.push(line.match(/^(\s*)/)[1] + '    pass');
                result.push('');
            }
        }
    } else if (language === 'javascript') {
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('var ') && trimmed.includes('= function')) {
                result.push(line.replace(/\{[\s\S]*$/, '{\n    // Your code here\n};'));
                break;
            }
            if (trimmed.startsWith('const ') && trimmed.includes('= (')) {
                result.push(line.replace(/\{[\s\S]*$/, '{\n    // Your code here\n};'));
                break;
            }
        }
    }

    return result.join('\n');
}

function getGenericTemplate(language) {
    switch (language) {
        case 'python':
            return `class Solution:
    def solve(self, args):
        # Your code here
        pass
`;
        case 'javascript':
            return `/**
 * @param {*} args
 * @return {*}
 */
var solve = function(args) {
    // Your code here
};
`;
        case 'java':
            return `class Solution {
    public Object solve(Object args) {
        // Your code here
        return null;
    }
}
`;
        case 'cpp':
            return `class Solution {
public:
    void solve() {
        // Your code here
    }
};
`;
        case 'go':
            return `func solve() {
    // Your code here
}
`;
        case 'rust':
            return `impl Solution {
    pub fn solve() {
        // Your code here
    }
}
`;
        default:
            return '';
    }
}

// =============================================
// MAIN PROCESSING
// =============================================

const SUPPORTED_LANGUAGES = ['python', 'javascript', 'java', 'cpp', 'go', 'rust'];
let updatedCount = 0;
let detailsLog = [];

const slugs = Object.keys(solutions);
console.log(`Processing ${slugs.length} solutions for ${SUPPORTED_LANGUAGES.length} languages...`);

for (const slug of slugs) {
    const solution = solutions[slug];
    if (!solution) continue;

    const requiredStructures = detectRequiredStructures(solution, slug);

    if (requiredStructures.length > 0) {
        detailsLog.push(`${slug}: needs ${requiredStructures.join(', ')}`);

        for (const lang of SUPPORTED_LANGUAGES) {
            // Ensure implementations object exists
            if (!solution.implementations) solution.implementations = {};
            if (!solution.implementations[lang]) solution.implementations[lang] = {};

            const currentInitial = solution.implementations[lang].initialCode || '';

            // Check if data structure definitions are already present
            let needsUpdate = false;
            for (const struct of requiredStructures) {
                if (!currentInitial.includes(struct)) {
                    needsUpdate = true;
                    break;
                }
            }

            if (needsUpdate) {
                const newTemplate = generateStarterTemplate(solution, lang, requiredStructures);
                if (newTemplate.trim()) {
                    solution.implementations[lang].initialCode = newTemplate;
                    updatedCount++;
                }
            }
        }

        // Also update root initialCode for Python
        if (requiredStructures.length > 0) {
            const pythonTemplate = generateStarterTemplate(solution, 'python', requiredStructures);
            if (pythonTemplate.trim()) {
                solution.initialCode = pythonTemplate;
            }
        }
    }
}

// Save updated solutions
fs.writeFileSync(solutionsPath, JSON.stringify(solutions, null, 2));

console.log(`\n===== COMPLETE =====`);
console.log(`Updated ${updatedCount} initialCode entries across all languages`);
console.log(`\nProblems requiring data structures (${detailsLog.length}):`);
detailsLog.slice(0, 20).forEach(d => console.log(`  - ${d}`));
if (detailsLog.length > 20) console.log(`  ... and ${detailsLog.length - 20} more`);
