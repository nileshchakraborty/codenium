
import { transform } from 'sucrase';

export class Transpiler {
    /**
     * Transpile code from source language to JavaScript
     */
    static transpile(code: string, language: string): string {
        // If not TypeScript, return as is (assuming it's valid JS)
        if (language !== 'typescript') {
            return code;
        }

        try {
            const result = transform(code, {
                transforms: ['typescript'],
            });
            return result.code;
        } catch (e) {
            console.error("Transpilation failed:", e);
            // Re-throw with user-friendly message
            throw new Error(`TypeScript compilation failed: ${e instanceof Error ? e.message : String(e)}`);
        }
    }
}
