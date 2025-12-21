import fs from 'fs';
import path from 'path';
import { Problem, Solution } from '../../../domain/entities/Problem';
import { ProblemRepository } from '../../../domain/ports/ProblemRepository';

export class FileProblemRepository implements ProblemRepository {
    private problemsFile: string;
    private solutionsFile: string;

    constructor() {
        // Robust path finding for Vercel / Local
        const candidates = [
            path.join(process.cwd(), 'api', 'data'),              // Local / Vercel Root
            path.join(__dirname, '..', '..', '..', '..', 'api', 'data'), // Original Prod relative
            path.join(__dirname, 'api', 'data'),                  // Possible Vercel structure
            path.join('/var/task/api/data'),                       // AWS Lambda / Vercel absolute
            path.join(process.cwd(), 'data')                       // Fallback
        ];

        const DATA_DIR = candidates.find(p => fs.existsSync(p)) || candidates[0];
        console.log(`FileProblemRepository initialized with DATA_DIR: ${DATA_DIR} (Exists: ${fs.existsSync(DATA_DIR)})`);

        this.problemsFile = path.join(DATA_DIR, 'problems.json');
        this.solutionsFile = path.join(DATA_DIR, 'solutions.json');
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
