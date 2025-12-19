/**
 * usePlayground ViewModel
 * Manages code execution state and test cases
 */
import { useState, useCallback, useEffect } from 'react';
import { PlaygroundAPI } from '../models';
import type { Solution, TestCaseResult } from '../models';

export interface TestCase {
    input: string;
    output: string;
}

export interface PlaygroundState {
    code: string;
    testCases: TestCase[];
    isRunning: boolean;
    results: TestCaseResult[];
    error: string | null;
}

export function usePlayground(solution: Solution | null) {
    const [code, setCode] = useState('');
    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<TestCaseResult[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Initialize from solution
    useEffect(() => {
        if (solution) {
            setCode(solution.code || '');
            setTestCases(solution.testCases || []);
            setResults([]);
            setError(null);
        }
    }, [solution]);

    const runCode = useCallback(async (slug: string) => {
        if (!code) {
            setError('No code to run');
            return;
        }

        try {
            setIsRunning(true);
            setError(null);
            setResults([]);

            const response = await PlaygroundAPI.runCode(code, slug, testCases);

            if (response.success && response.results) {
                setResults(response.results);
            } else {
                setError(response.error || 'Failed to run code');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to run code');
        } finally {
            setIsRunning(false);
        }
    }, [code, testCases]);

    const updateCode = useCallback((newCode: string) => {
        setCode(newCode);
    }, []);

    const addTestCase = useCallback(() => {
        setTestCases(prev => [...prev, { input: '', output: '' }]);
    }, []);

    const removeTestCase = useCallback((index: number) => {
        setTestCases(prev => prev.filter((_, i) => i !== index));
    }, []);

    const updateTestCase = useCallback((index: number, field: 'input' | 'output', value: string) => {
        setTestCases(prev => prev.map((tc, i) =>
            i === index ? { ...tc, [field]: value } : tc
        ));
    }, []);

    const resetCode = useCallback(() => {
        if (solution) {
            setCode(solution.code || '');
        }
    }, [solution]);

    const clearResults = useCallback(() => {
        setResults([]);
        setError(null);
    }, []);

    // Derived state
    const allPassed = results.length > 0 && results.every(r => r.passed);
    const passCount = results.filter(r => r.passed).length;
    const failCount = results.filter(r => !r.passed).length;

    return {
        // State
        code,
        testCases,
        isRunning,
        results,
        error,

        // Derived
        allPassed,
        passCount,
        failCount,
        hasResults: results.length > 0,

        // Actions
        runCode,
        updateCode,
        addTestCase,
        removeTestCase,
        updateTestCase,
        resetCode,
        clearResults,
    };
}

export type PlaygroundViewModel = ReturnType<typeof usePlayground>;
