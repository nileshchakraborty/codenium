import fs from 'fs';
import path from 'path';
import { Problem, Solution } from '../../../domain/entities/Problem';
import { ProblemRepository } from '../../../domain/ports/ProblemRepository';

export class FileProblemRepository implements ProblemRepository {
    private problemsFile: string;
    private solutionsFile: string;

    constructor() {
        // Try to find data relative to current file first (prod), then fallback to root (dev)
        const prodPath = path.join(__dirname, '..', '..', '..', '..', 'api', 'data');
        const devPath = path.join(process.cwd(), 'api', 'data');

        const DATA_DIR = fs.existsSync(prodPath) ? prodPath : devPath;
        console.log(`FileProblemRepository initialized with DATA_DIR: ${DATA_DIR}`);

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
