import { ExecutionResult, ExecutionService } from '../../../domain/ports/ExecutionService';

import { JavascriptRunner } from './runners/JavascriptRunner';
import { PythonRunner } from './runners/PythonRunner';

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

    async execute(code: string, testCases: any[], language: string = 'python'): Promise<ExecutionResult> {
        const runner = this.runners[language.toLowerCase()];
        if (!runner) {
            return {
                success: false,
                error: `Language '${language}' not supported. Supported: ${Object.keys(this.runners).join(', ')}`
            };
        }
        return runner.execute(code, testCases);
    }
}
