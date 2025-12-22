/**
 * BrowserJSRunner - Client-side JavaScript execution in the browser
 * 
 * Executes JavaScript code against test cases without server calls.
 * Results can be synced to backend for progress tracking.
 */

import { ConstraintValidator } from './ConstraintValidator';
import { Transpiler } from './Transpiler';

export interface TestCase {
    input: string;
    output: string;
}

export interface TestResult {
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    error?: string;
}

export interface ExecutionResult {
    success: boolean;
    passed?: boolean;
    results?: TestResult[];
    logs?: string;
    error?: string;
}

export class BrowserJSRunner {
    private logs: string[] = [];

    /**
     * Execute JavaScript code against test cases in the browser
     */
    async execute(
        userCode: string,
        testCases: TestCase[],
        language: string = 'javascript',
        referenceCode?: string,
        constraints?: string[]
    ): Promise<ExecutionResult> {
        this.logs = [];
        const results: TestResult[] = [];

        // Transpile code if needed (e.g. TypeScript -> JavaScript)
        let executableCode = userCode;
        try {
            executableCode = Transpiler.transpile(userCode, language);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            return {
                success: false,
                error: `Compilation Error: ${errMsg}`,
                logs: ''
            };
        }

        try {
            // Validate custom test cases against constraints
            if (constraints && constraints.length > 0) {
                for (const tc of testCases) {
                    if (!tc.output || tc.output.trim() === '') {
                        const validation = ConstraintValidator.validate(tc.input, constraints);
                        if (!validation.valid) {
                            return {
                                success: true,
                                passed: false,
                                results: [{
                                    passed: false,
                                    input: tc.input,
                                    expected: '',
                                    actual: '',
                                    error: `Input violates problem constraints:\n\n${validation.errors.join('\n')}`
                                }],
                                logs: ''
                            };
                        }
                    }
                }
            }

            // Compute expected output for custom test cases using reference code
            const enrichedTestCases = await this.enrichTestCases(testCases, referenceCode);

            // Execute user code against each test case
            for (let i = 0; i < enrichedTestCases.length; i++) {
                const tc = enrichedTestCases[i];
                try {
                    const result = await this.executeTestCase(executableCode, tc);
                    results.push(result);
                } catch (error: unknown) {
                    const errMsg = error instanceof Error ? error.message : String(error);
                    results.push({
                        passed: false,
                        input: tc.input,
                        expected: tc.output || '',
                        actual: '',
                        error: errMsg
                    });
                }
            }

            const allPassed = results.every(r => r.passed);
            return {
                success: true,
                passed: allPassed,
                results,
                logs: this.logs.join('\n')
            };

        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            return {
                success: false,
                error: errMsg,
                logs: this.logs.join('\n')
            };
        }
    }

    /**
     * Enrich test cases by computing expected output from reference solution
     */
    private async enrichTestCases(testCases: TestCase[], referenceCode?: string): Promise<TestCase[]> {
        if (!referenceCode) return testCases;

        const enriched: TestCase[] = [];
        for (const tc of testCases) {
            if (tc.output && tc.output.trim() !== '') {
                // Already has expected output
                enriched.push(tc);
            } else {
                // Compute expected output from reference solution
                try {
                    const refResult = await this.runCode(referenceCode, tc.input);
                    enriched.push({
                        input: tc.input,
                        output: this.formatOutput(refResult)
                    });
                } catch (error: unknown) {
                    // If reference fails, mark as error
                    const errMsg = error instanceof Error ? error.message : String(error);
                    enriched.push({
                        input: tc.input,
                        output: `[Reference Error: ${errMsg}]`
                    });
                }
            }
        }
        return enriched;
    }

    /**
     * Execute a single test case
     */
    private async executeTestCase(code: string, tc: TestCase): Promise<TestResult> {
        const actual = await this.runCode(code, tc.input);
        const expected = tc.output;
        const actualStr = this.formatOutput(actual);

        // Compare results (normalize for comparison)
        const passed = this.compareOutputs(actualStr, expected);

        return {
            passed,
            input: tc.input,
            expected,
            actual: actualStr
        };
    }

    /**
     * Run code with input and return the result
     */
    private async runCode(code: string, input: string): Promise<unknown> {
        // Parse input string into variables
        const parsedInput = ConstraintValidator.parseInput(input);

        // Capture console.log output
        const originalLog = console.log;
        const capturedLogs: string[] = [];
        console.log = (...args: unknown[]) => {
            capturedLogs.push(args.map(a =>
                typeof a === 'object' ? JSON.stringify(a) : String(a)
            ).join(' '));
        };

        try {
            // Extract the solution function from the code
            const result = this.executeSolutionCode(code, parsedInput);

            // Add captured logs
            if (capturedLogs.length > 0) {
                this.logs.push(...capturedLogs);
            }

            return result;
        } finally {
            console.log = originalLog;
        }
    }

    /**
     * Execute solution code and return the result
     */
    private executeSolutionCode(code: string, input: Record<string, unknown>): unknown {
        // Extract function name and create execution wrapper
        // Support various patterns: function twoSum(...), var twoSum = function(...), const twoSum = (...) =>

        const funcNameMatch = code.match(/(?:function\s+(\w+)|(?:var|let|const)\s+(\w+)\s*=)/);
        const funcName = funcNameMatch ? (funcNameMatch[1] || funcNameMatch[2]) : null;

        if (!funcName) {
            throw new Error('Could not find function name in code');
        }

        // Create a sandboxed execution context
        const args = Object.values(input);

        // Wrap the code to expose the function and call it
        const wrappedCode = `
            ${code}
            return ${funcName}(...args);
        `;

        try {
            // Use Function constructor for safer eval
            const executor = new Function('args', wrappedCode);
            return executor(args);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            throw new Error(`Execution error: ${errMsg}`);
        }
    }

    /**
     * Format output value to string for comparison
     */
    private formatOutput(value: unknown): string {
        if (value === undefined || value === null) return 'null';
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return String(value);
    }

    /**
     * Compare two outputs for equality
     */
    private compareOutputs(actual: string, expected: string): boolean {
        // Normalize both strings
        const normalizeOutput = (s: string): string => {
            // Remove whitespace, normalize brackets
            return s.trim()
                .replace(/\s+/g, '')
                .replace(/'/g, '"');
        };

        return normalizeOutput(actual) === normalizeOutput(expected);
    }
}

// Singleton instance for convenience
export const browserJSRunner = new BrowserJSRunner();
