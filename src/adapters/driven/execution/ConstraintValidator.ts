/**
 * ConstraintValidator - Parses and validates LeetCode-style constraints against test inputs
 * 
 * Supports patterns like:
 * - "2 <= nums.length <= 10^4"
 * - "-10^9 <= nums[i] <= 10^9"
 * - "1 <= target <= 10^9"
 */

export interface ParsedInput {
    [key: string]: any;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

export class ConstraintValidator {
    /**
     * Parse an input string into structured variables
     * Example: "nums = [1,2,3], target = 9" => { nums: [1,2,3], target: 9 }
     */
    static parseInput(inputStr: string): ParsedInput {
        const result: ParsedInput = {};

        try {
            // Split by comma that's not inside brackets
            const assignments = this.splitAssignments(inputStr);

            for (const assignment of assignments) {
                const match = assignment.trim().match(/^(\w+)\s*=\s*(.+)$/);
                if (match) {
                    const [, varName, valueStr] = match;
                    result[varName.trim()] = this.parseValue(valueStr.trim());
                }
            }
        } catch (e) {
            // Return empty object on parse error
        }

        return result;
    }

    /**
     * Split input by commas, respecting brackets
     */
    private static splitAssignments(input: string): string[] {
        const result: string[] = [];
        let current = '';
        let depth = 0;

        for (const char of input) {
            if (char === '[' || char === '{' || char === '(') depth++;
            else if (char === ']' || char === '}' || char === ')') depth--;

            if (char === ',' && depth === 0) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        if (current.trim()) {
            result.push(current.trim());
        }

        return result;
    }

    /**
     * Parse a value string into its JavaScript type
     */
    private static parseValue(valueStr: string): any {
        const trimmed = valueStr.trim();

        // Array
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                return JSON.parse(trimmed);
            } catch {
                // Try eval for Python-style arrays
                return eval(trimmed);
            }
        }

        // String
        if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
            (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
            return trimmed.slice(1, -1);
        }

        // Number
        if (!isNaN(Number(trimmed))) {
            return Number(trimmed);
        }

        // Boolean
        if (trimmed === 'true' || trimmed === 'True') return true;
        if (trimmed === 'false' || trimmed === 'False') return false;
        if (trimmed === 'null' || trimmed === 'None') return null;

        return trimmed;
    }

    /**
     * Parse a constraint string and extract validation rules
     * Example: "2 <= nums.length <= 10^4" => { variable: "nums.length", min: 2, max: 10000 }
     */
    static parseConstraint(constraint: string): {
        variable: string;
        min?: number;
        max?: number;
        matches?: (input: ParsedInput) => boolean;
    } | null {
        // Normalize ^4 to power notation
        const normalized = constraint
            .replace(/10\^(\d+)/g, (_, exp) => Math.pow(10, parseInt(exp)).toString())
            .replace(/\s+/g, ' ')
            .trim();

        // Pattern: "min <= var <= max" or "min <= var" or "var <= max"
        const rangeMatch = normalized.match(/(-?\d+)\s*<=\s*(\w+(?:\.\w+)?(?:\[\w+\])?)\s*<=\s*(-?\d+)/);
        if (rangeMatch) {
            return {
                variable: rangeMatch[2],
                min: parseInt(rangeMatch[1]),
                max: parseInt(rangeMatch[3])
            };
        }

        const minOnlyMatch = normalized.match(/(-?\d+)\s*<=\s*(\w+(?:\.\w+)?(?:\[\w+\])?)/);
        if (minOnlyMatch) {
            return {
                variable: minOnlyMatch[2],
                min: parseInt(minOnlyMatch[1])
            };
        }

        const maxOnlyMatch = normalized.match(/(\w+(?:\.\w+)?(?:\[\w+\])?)\s*<=\s*(-?\d+)/);
        if (maxOnlyMatch) {
            return {
                variable: maxOnlyMatch[1],
                max: parseInt(maxOnlyMatch[2])
            };
        }

        return null;
    }

    /**
     * Get the value of a variable expression from parsed input
     * Example: "nums.length" from { nums: [1,2,3] } => 3
     */
    static getVariableValue(input: ParsedInput, variable: string): number | undefined {
        // Handle array element constraints like "nums[i]" - just skip these as they need special handling
        if (variable.includes('[i]') || variable.includes('[j]')) {
            return undefined;
        }

        // Handle property access like "nums.length"
        const parts = variable.split('.');
        let value: any = input[parts[0]];

        for (let i = 1; i < parts.length; i++) {
            if (value === undefined || value === null) return undefined;
            value = value[parts[i]];
        }

        if (typeof value === 'number') return value;
        if (Array.isArray(value)) return value.length; // For variable that IS an array, return length

        return undefined;
    }

    /**
     * Validate all array elements against a constraint
     * Example: "-10^9 <= nums[i] <= 10^9"
     */
    static validateArrayElements(input: ParsedInput, constraint: string): string | null {
        const normalized = constraint
            .replace(/10\^(\d+)/g, (_, exp) => Math.pow(10, parseInt(exp)).toString());

        // Match array element constraints
        const match = normalized.match(/(-?\d+)\s*<=\s*(\w+)\[i\]\s*<=\s*(-?\d+)/);
        if (!match) return null;

        const [, minStr, arrayName, maxStr] = match;
        const min = parseInt(minStr);
        const max = parseInt(maxStr);
        const arr = input[arrayName];

        if (!Array.isArray(arr)) return null;

        for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i] !== 'number') continue;
            if (arr[i] < min || arr[i] > max) {
                return `Element ${arrayName}[${i}] = ${arr[i]} violates constraint: ${constraint}`;
            }
        }

        return null;
    }

    /**
     * Validate input against an array of constraint strings
     */
    static validate(inputStr: string, constraints: string[]): ValidationResult {
        const errors: string[] = [];
        const input = this.parseInput(inputStr);

        if (Object.keys(input).length === 0) {
            return { valid: false, errors: ['Could not parse input'] };
        }

        for (const constraint of constraints) {
            // Skip non-range constraints (like "Only one valid answer exists.")
            if (!constraint.includes('<=') && !constraint.includes('>=')) {
                continue;
            }

            // Handle array element constraints
            if (constraint.includes('[i]') || constraint.includes('[j]')) {
                const arrError = this.validateArrayElements(input, constraint);
                if (arrError) {
                    errors.push(arrError);
                }
                continue;
            }

            // Parse and validate range constraints
            const parsed = this.parseConstraint(constraint);
            if (!parsed) continue;

            const value = this.getVariableValue(input, parsed.variable);
            if (value === undefined) continue; // Can't validate if we can't get the value

            if (parsed.min !== undefined && value < parsed.min) {
                errors.push(`${parsed.variable} = ${value} violates constraint: ${constraint} (minimum is ${parsed.min})`);
            }

            if (parsed.max !== undefined && value > parsed.max) {
                errors.push(`${parsed.variable} = ${value} violates constraint: ${constraint} (maximum is ${parsed.max})`);
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}
