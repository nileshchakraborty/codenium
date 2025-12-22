import { ExecutionResult, ExecutionService } from '../../../domain/ports/ExecutionService';

import { JavascriptRunner } from './runners/JavascriptRunner';
import { PythonRunner } from './runners/PythonRunner';
import { ConstraintValidator } from './ConstraintValidator';

// Feature flag: Only enable safe runners in production (Vercel)
const ENABLE_EXPERIMENTAL_LANGUAGES = process.env.ENABLE_EXPERIMENTAL_LANGUAGES === 'true';

export class LocalExecutionService implements ExecutionService {
    private runners: Record<string, any>;

    constructor() {
        // Always available: Python and JavaScript
        this.runners = {
            'python': new PythonRunner(),
            'javascript': new JavascriptRunner(),
            'typescript': new JavascriptRunner(),
        };

        // Experimental runners (only if flag is enabled)
        if (ENABLE_EXPERIMENTAL_LANGUAGES) {
            console.log('[LocalExecutionService] Loading experimental language runners...');
            // Dynamic imports to avoid loading binaries on Vercel
            const { JavaRunner } = require('./runners/JavaRunner');
            const { GoRunner } = require('./runners/GoRunner');
            const { RustRunner } = require('./runners/RustRunner');
            const { CppRunner } = require('./runners/CppRunner');

            this.runners['java'] = new JavaRunner();
            this.runners['go'] = new GoRunner();
            this.runners['golang'] = new GoRunner();
            this.runners['rust'] = new RustRunner();
            this.runners['rs'] = new RustRunner();
            this.runners['cpp'] = new CppRunner();
            this.runners['c++'] = new CppRunner();
            this.runners['c'] = new CppRunner();
        }
    }

    async execute(code: string, testCases: any[], language: string = 'python', referenceCode?: string, constraints?: string[]): Promise<ExecutionResult> {
        const runner = this.runners[language.toLowerCase()];
        if (!runner) {
            return {
                success: false,
                error: `Language '${language}' not supported. Supported: ${Object.keys(this.runners).join(', ')}`
            };
        }

        // Validate custom test cases against constraints
        if (constraints && constraints.length > 0 && testCases) {
            const customCases = testCases.filter(tc => !tc.output || tc.output.trim() === '');
            for (const tc of customCases) {
                const validation = ConstraintValidator.validate(tc.input, constraints);
                if (!validation.valid) {
                    return {
                        success: true,
                        passed: false,
                        results: [{
                            case: 1,
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

        // If reference code is provided, compute expected output for test cases with empty output
        let enrichedTestCases = testCases;
        if (referenceCode && testCases && testCases.length > 0) {
            // Find test cases that need expected output computed
            const needsExpected = testCases.some(tc => !tc.output || tc.output.trim() === '');

            if (needsExpected) {
                try {
                    // Run reference solution to get expected outputs
                    const refResult = await runner.execute(referenceCode, testCases);

                    if (refResult.success && refResult.results) {
                        // Check if any reference execution failed (indicates invalid input)
                        const invalidInputCases: number[] = [];

                        // Enrich test cases with expected output from reference solution
                        enrichedTestCases = testCases.map((tc, i) => {
                            const refCase = refResult.results?.[i];

                            // If reference execution had an error for this case, input might be invalid
                            if (refCase?.error) {
                                invalidInputCases.push(i);
                                return tc; // Keep original
                            }

                            const refOutput = refCase?.actual;
                            // If test case has no expected output and we got a reference result, use it
                            if ((!tc.output || tc.output.trim() === '') && refOutput) {
                                return { ...tc, output: refOutput };
                            }
                            return tc;
                        });

                        // If custom test cases (ones with empty output) have errors, report invalid input
                        const customCaseIndices = testCases.map((tc, i) => (!tc.output || tc.output.trim() === '') ? i : -1).filter(i => i >= 0);
                        const invalidCustomCases = invalidInputCases.filter(i => customCaseIndices.includes(i));

                        if (invalidCustomCases.length > 0) {
                            const errorCase = refResult.results?.[invalidCustomCases[0]];
                            return {
                                success: true,
                                passed: false,
                                results: invalidCustomCases.map(i => ({
                                    case: i + 1,
                                    passed: false,
                                    input: testCases[i]?.input || '',
                                    expected: '',
                                    actual: '',
                                    error: `Invalid test input. Please check your input format.\n\nDetails: ${errorCase?.error || 'Input could not be parsed'}`
                                })),
                                logs: ''
                            };
                        }
                    } else if (!refResult.success && refResult.error) {
                        // Reference solution completely failed - likely syntax error in input
                        const customCases = testCases.filter(tc => !tc.output || tc.output.trim() === '');
                        if (customCases.length > 0) {
                            return {
                                success: true,
                                passed: false,
                                results: customCases.map((tc, i) => ({
                                    case: i + 1,
                                    passed: false,
                                    input: tc.input || '',
                                    expected: '',
                                    actual: '',
                                    error: `Invalid test input. Please check your input format.\n\nError: ${refResult.error}`
                                })),
                                logs: ''
                            };
                        }
                    }
                } catch (e: any) {
                    // If reference execution fails, return error for custom cases
                    const customCases = testCases.filter(tc => !tc.output || tc.output.trim() === '');
                    if (customCases.length > 0) {
                        return {
                            success: true,
                            passed: false,
                            results: customCases.map((tc, i) => ({
                                case: i + 1,
                                passed: false,
                                input: tc.input || '',
                                expected: '',
                                actual: '',
                                error: `Invalid test input. Please check your input format.\n\nError: ${e.message || 'Unknown error'}`
                            })),
                            logs: ''
                        };
                    }
                }
            }
        }

        return runner.execute(code, enrichedTestCases);
    }
}
