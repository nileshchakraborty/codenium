import fs from 'fs';
import path from 'path';
import { config } from '../config';

export interface SystemDesignTopic {
    id: string;
    title: string;
    description: string;
}

export interface SystemDesignProblem {
    id: string;
    title: string;
    slug: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    constraints: string[];
    expectedComponents: string[];
    category: string;
    topics: string[];
    estimatedTime?: string;
    source?: string;
    has_solution?: boolean;
}

export interface DesignSolution {
    title: string;
    videoId?: string;
    description: string;
    intuition: string[];
    walkthrough: string[];
    hints: string[];
    keyInsight: string;
    mentalModel: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    pattern: string;
    relatedProblems: string[];
}

class SystemDesignRepository {
    private topicsCache: SystemDesignTopic[] | null = null;
    private problemsCache: SystemDesignProblem[] | null = null;

    private getTopicsPath(): string {
        return path.resolve(__dirname, '../../', config.sdTopicsPath);
    }

    private getProblemsPath(): string {
        return path.resolve(__dirname, '../../', config.sdProblemsPath);
    }

    private getSolutionsPath(): string {
        return path.resolve(__dirname, '../../', config.sdSolutionsPath);
    }

    async getTopics(): Promise<SystemDesignTopic[]> {
        if (this.topicsCache) return this.topicsCache;

        try {
            const raw = fs.readFileSync(this.getTopicsPath(), 'utf-8');
            this.topicsCache = JSON.parse(raw);
            return this.topicsCache || [];
        } catch (error) {
            console.error('Failed to load SD topics:', error);
            return [];
        }
    }

    async getProblems(): Promise<SystemDesignProblem[]> {
        if (this.problemsCache) return this.problemsCache;

        try {
            const raw = fs.readFileSync(this.getProblemsPath(), 'utf-8');
            const data = JSON.parse(raw);
            if (data.categories && data.problemsById) {
                console.log('Loading SD problems with categories + problemsById');
                // Resolve problemIds from the problemsById lookup
                this.problemsCache = [];
                data.categories.forEach((cat: any) => {
                    const categoryId = cat.id || cat.name.toLowerCase().replace(/\s+/g, '-');
                    console.log(`Processing category: ${categoryId} with ${cat.problemIds?.length} problems`);
                    (cat.problemIds || []).forEach((slug: string) => {
                        const problem = data.problemsById[slug];
                        if (problem) {
                            const enriched = {
                                ...problem,
                                category: categoryId
                            };
                            // console.log(`Added problem ${slug} with category ${categoryId}`);
                            this.problemsCache!.push(enriched);
                        } else {
                            console.warn(`Problem ${slug} not found in problemsById`);
                        }
                    });
                });
            } else if (data.categories) {
                console.log('Loading SD problems with legacy categories');
                // Legacy: categories with inline problems
                this.problemsCache = [];
                data.categories.forEach((cat: any) => {
                    this.problemsCache!.push(...(cat.problems || []).map((p: any) => ({
                        ...p,
                        category: cat.name.toLowerCase().replace(/\s+/g, '-')
                    })));
                });
            } else {
                console.log('Loading SD problems from flat list');
                this.problemsCache = Array.isArray(data) ? data : (data.problems || []);
            }
            console.log(`Loaded ${this.problemsCache?.length} problems total`);
            return this.problemsCache || [];
        } catch (error) {
            console.error('Failed to load SD problems:', error);
            return [];
        }
    }

    async getSolution(slug: string): Promise<DesignSolution | null> {
        try {
            const raw = fs.readFileSync(this.getSolutionsPath(), 'utf-8');
            const solutions = JSON.parse(raw);
            return solutions[slug] || null;
        } catch (error) {
            console.error('Failed to load SD solution:', error);
            return null;
        }
    }

    async getProblemsByCategory(categoryId: string): Promise<SystemDesignProblem[]> {
        const problems = await this.getProblems();
        return problems.filter(p => p.category === categoryId);
    }

    async getProblemBySlug(slug: string): Promise<SystemDesignProblem | null> {
        const problems = await this.getProblems();
        return problems.find(p => p.slug === slug) || null;
    }
}

export const systemDesignRepository = new SystemDesignRepository();
