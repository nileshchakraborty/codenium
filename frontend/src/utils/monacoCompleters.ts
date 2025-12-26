import type { IDisposable } from 'monaco-editor';

type Monaco = typeof import('monaco-editor');

// Omit 'range' since Monaco fills it in from completion context
type CompletionSuggestion = {
    label: string;
    kind: number;
    insertText: string;
    documentation?: string;
    insertTextRules?: number;
};

/**
 * Registers custom completion providers for LeetCode environment
 */
export const registerCompleters = (monaco: Monaco): IDisposable[] => {
    const disposables: IDisposable[] = [];

    // --- PYTHON SNIPPETS ---
    disposables.push(monaco.languages.registerCompletionItemProvider('python', {
        provideCompletionItems: () => {
            const suggestions: CompletionSuggestion[] = [
                // Structures
                {
                    label: 'ListNode',
                    kind: monaco.languages.CompletionItemKind.Class,
                    insertText: 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next',
                    documentation: 'LeetCode Singly-Linked List Node',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                },
                {
                    label: 'TreeNode',
                    kind: monaco.languages.CompletionItemKind.Class,
                    insertText: 'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right',
                    documentation: 'LeetCode Binary Tree Node',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                },
                // Common Patterns
                {
                    label: 'fori',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'for i in range(${1:n}):\n    ${2:pass}',
                    documentation: 'Standard range loop',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                },
                {
                    label: 'defsol',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'class Solution:\n    def ${1:methodName}(self, ${2:args}):\n        ${3:pass}',
                    documentation: 'Solution Class Template',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                }
            ];
            return { suggestions };
        }
    }));

    // --- JAVASCRIPT / TYPESCRIPT SNIPPETS ---
    const jsTsProvider = {
        provideCompletionItems: () => {
            const suggestions: CompletionSuggestion[] = [
                // Structures
                {
                    label: 'ListNode',
                    kind: monaco.languages.CompletionItemKind.Class,
                    insertText: 'function ListNode(val, next) {\n    this.val = (val===undefined ? 0 : val)\n    this.next = (next===undefined ? null : next)\n}',
                    documentation: 'LeetCode Singly-Linked List Node',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                },
                {
                    label: 'TreeNode',
                    kind: monaco.languages.CompletionItemKind.Class,
                    insertText: 'function TreeNode(val, left, right) {\n    this.val = (val===undefined ? 0 : val)\n    this.left = (left===undefined ? null : left)\n    this.right = (right===undefined ? null : right)\n}',
                    documentation: 'LeetCode Binary Tree Node',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                },
                // Snippets
                {
                    label: 'clog',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'console.log(${1:item});',
                    documentation: 'Console Log',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                },
                {
                    label: 'fori',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'for (let i = 0; i < ${1:n}; i++) {\n    ${2}\n}',
                    documentation: 'Standard For Loop',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                }
            ];
            return { suggestions };
        }
    };

    disposables.push(monaco.languages.registerCompletionItemProvider('javascript', jsTsProvider));
    disposables.push(monaco.languages.registerCompletionItemProvider('typescript', jsTsProvider));

    return disposables;
};
