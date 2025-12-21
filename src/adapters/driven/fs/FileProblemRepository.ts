import fs from 'fs';
import path from 'path';
import { Problem, Solution } from '../../../domain/entities/Problem';
import { ProblemRepository } from '../../../domain/ports/ProblemRepository';

export class FileProblemRepository implements ProblemRepository {
    private problemsFile: string;
    private solutionsFile: string;

    constructor() {
        this.problemsFile = this.findFile('problems.json');
        this.solutionsFile = this.findFile('solutions.json');

        console.log(`[FileProblemRepository] resolved:
            problems: ${this.problemsFile}
            solutions: ${this.solutionsFile}
        `);
    }

    private findFile(filename: string): string {
        // 1. Check known candidates first (fast path)
        const candidates = [
            path.join(process.cwd(), 'api', 'data', filename),
            path.join(process.cwd(), 'data', filename),
            path.join(__dirname, 'api', 'data', filename),
            path.join(__dirname, '..', 'data', filename),
            path.join('/var/task/api/data', filename)
        ];

        for (const p of candidates) {
            if (fs.existsSync(p)) return p;
        }

        // 2. Fallback: Recursive search in CWD (slow but robust for serverless init)
        try {
            console.log(`[FileProblemRepository] Valid candidates failed for ${filename}, starting recursive search in ${process.cwd()}...`);
            const found = this.searchDir(process.cwd(), filename, 0);
            if (found) return found;
        } catch (e) {
            console.error("[FileProblemRepository] Recursive search failed:", e);
        }

        // Return a default path even if missing (will fail gracefully in getAllProblems)
        return path.join(process.cwd(), 'api', 'data', filename);
    }

    private searchDir(dir: string, filename: string, depth: number): string | null {
        if (depth > 3) return null; // Limit depth
        try {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    if (file === 'node_modules' || file === '.git') continue;
                    const res = this.searchDir(fullPath, filename, depth + 1);
                    if (res) return res;
                } else if (file === filename) {
                    return fullPath;
                }
            }
        } catch (e) { }
        return null;
    }

    async getAllProblems(): Promise<any> {
        if (!fs.existsSync(this.problemsFile)) return { categories: [] };
        return JSON.parse(fs.readFileSync(this.problemsFile, 'utf-8'));
    }

    async getProblemBySlug(slug: string): Promise<Problem | null> {
        const data = await this.getAllProblems();
        if (!data.categories) return null;

        for (const category of data.categories) {
            const problem = category.problems.find((p: Problem) => p.slug === slug);
            if (problem) return problem;
        }
        return null;
    }

    async getSolution(slug: string): Promise<Solution | null> {
        if (!fs.existsSync(this.solutionsFile)) return null;
        const data = JSON.parse(fs.readFileSync(this.solutionsFile, 'utf-8'));
        return data.solutions?.[slug] || null;
    }

    async saveSolution(slug: string, solution: Solution): Promise<void> {
        let data: { solutions: Record<string, Solution> } = { solutions: {} };
        if (fs.existsSync(this.solutionsFile)) {
            data = JSON.parse(fs.readFileSync(this.solutionsFile, 'utf-8'));
        }
        if (!data.solutions) data.solutions = {};

        data.solutions[slug] = solution;
        fs.writeFileSync(this.solutionsFile, JSON.stringify(data, null, 2));
    }
}
