import fs from 'fs';
import path from 'path';
import { SystemDesignTopic, SystemDesignProblem, DesignSolution } from '../../../domain/entities/SystemDesign';

export class FileSystemDesignRepository {
    private _topicsFile: string | null = null;
    private _problemsFile: string | null = null;
    private _solutionsFile: string | null = null;

    private get topicsFile(): string {
        if (!this._topicsFile) {
            this._topicsFile = this.findFile('topics.json', true);
        }
        return this._topicsFile;
    }


    private get problemsFile(): string {
        if (!this._problemsFile) {
            this._problemsFile = this.findFile('system-design-problems.json', true);
        }
        return this._problemsFile;
    }

    private get solutionsFile(): string {
        if (!this._solutionsFile) {
            this._solutionsFile = this.findFile('system-design-solutions.json', true);
        }
        return this._solutionsFile;
    }

    private findFile(filename: string, isSystemDesign = false): string {
        const baseCandidates = [
            path.join(process.cwd(), 'api', 'data', filename),
            path.join(process.cwd(), 'data', filename),
            path.join(__dirname, '..', '..', '..', '..', 'api', 'data', filename),
            path.join('/var/task/api/data', filename),
        ];

        // Specific candidates for system-design folder
        const sdCandidates = isSystemDesign ? [
            path.join(process.cwd(), 'system-design', 'data', filename),
            path.join(__dirname, '..', '..', '..', '..', 'system-design', 'data', filename),
        ] : [];

        const candidates = [...sdCandidates, ...baseCandidates];

        for (const p of candidates) {
            try {
                if (fs.existsSync(p)) {
                    console.log(`[FileSystemDesignRepository] Found ${filename} at ${p}`);
                    return p;
                }
            } catch (e) {}
        }

        return candidates[0];
    }

    async getTopics(): Promise<SystemDesignTopic[]> {
        try {
            if (!fs.existsSync(this.topicsFile)) return [];
            return JSON.parse(fs.readFileSync(this.topicsFile, 'utf-8'));
        } catch (e) {
            console.error('Error reading SD topics:', e);
            return [];
        }
    }

    async getProblems(): Promise<SystemDesignProblem[]> {
        try {
            if (!fs.existsSync(this.problemsFile)) {
                console.log('[FileSystemDesignRepository] Problems file not found:', this.problemsFile);
                return [];
            }
            const data = JSON.parse(fs.readFileSync(this.problemsFile, 'utf-8'));
            
            // Support new flat problemsById structure
            if (data.problemsById && data.categories) {
                const problems: SystemDesignProblem[] = [];
                // Iterate categories to preserve order and assign category ID
                data.categories.forEach((cat: any) => {
                    const categoryId = cat.id || cat.name.toLowerCase().replace(/\s+/g, '-');
                    if (cat.problemIds) {
                        cat.problemIds.forEach((slug: string) => {
                            const problem = data.problemsById[slug];
                            if (problem) {
                                problems.push({
                                    ...problem,
                                    category: categoryId
                                });
                            }
                        });
                    }
                });
                return problems;
            } else if (data.problemsById) {
                 // Fallback if categories missing but problemsById exists (shouldn't happen with current data)
                 return Object.values(data.problemsById);
            }
            
            // Fallback to old nested structure
            if (!data.categories) return [];
            
            // Flatten categories into a single list of problems
            const problems: SystemDesignProblem[] = [];
            data.categories.forEach((cat: any) => {
                problems.push(...cat.problems.map((p: any) => ({
                    ...p,
                    category: cat.name
                })));
            });
            return problems;
        } catch (e) {
            console.error('Error reading SD problems:', e);
            return [];
        }
    }

    async getSolution(problemId: string): Promise<DesignSolution | null> {
        try {
            if (!fs.existsSync(this.solutionsFile)) {
                console.log('[FileSystemDesignRepository] Solutions file not found:', this.solutionsFile);
                return null;
            }
            const solutions = JSON.parse(fs.readFileSync(this.solutionsFile, 'utf-8'));
            // problemId here is the slug
            const solution = solutions[problemId];
            if (!solution) {
                console.log(`[FileSystemDesignRepository] Solution not found for slug: ${problemId}. Available keys: ${Object.keys(solutions).slice(0, 5).join(', ')}...`);
            }
            return solution || null;
        } catch (e) {
            console.error('Error reading SD solution:', e);
            return null;
        }
    }


    async getProblemBySlug(slug: string): Promise<SystemDesignProblem | null> {
        try {
            if (!fs.existsSync(this.problemsFile)) return null;
            const data = JSON.parse(fs.readFileSync(this.problemsFile, 'utf-8'));
            
            // Support new flat problemsById structure (O(1) lookup)
            if (data.problemsById && data.problemsById[slug]) {
                return data.problemsById[slug];
            }
            
            // Fallback to old nested structure (O(n) search)
            const problems = await this.getProblems();
            return problems.find(p => p.slug === slug) || null;
        } catch (e) {
            console.error('Error finding SD problem by slug:', e);
            return null;
        }
    }

    async addProblem(problem: SystemDesignProblem): Promise<void> {
        try {
            if (!fs.existsSync(this.problemsFile)) return;
            const data = JSON.parse(fs.readFileSync(this.problemsFile, 'utf-8'));
            
            const categoryIndex = data.categories.findIndex((c: any) => 
                c.name.toLowerCase().replace(/\s+/g, '-') === problem.category || 
                c.name.toLowerCase() === problem.category.toLowerCase()
            );

            if (categoryIndex === -1) {
                // Default to first category if not found
                data.categories[0].problems.push(problem);
            } else {
                const existingIndex = data.categories[categoryIndex].problems.findIndex((p: any) => p.slug === problem.slug);
                if (existingIndex >= 0) {
                    data.categories[categoryIndex].problems[existingIndex] = problem;
                } else {
                    data.categories[categoryIndex].problems.push(problem);
                }
            }

            fs.writeFileSync(this.problemsFile, JSON.stringify(data, null, 2));
            console.log(`[FileSystemDesignRepository] Saved problem ${problem.slug} to ${this.problemsFile}`);
        } catch (e) {
            console.error('Error adding SD problem:', e);
            throw e;
        }
    }
}
