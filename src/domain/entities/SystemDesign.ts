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
    category: string;
    topics: string[];
    estimatedTime: string;
    has_solution?: boolean;
    functionalRequirements?: string[];
    nonFunctionalRequirements?: string[];
    constraints?: Record<string, string>;
    expectedComponents?: string[];
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
    expectedArchitectureSummary?: string;
}
