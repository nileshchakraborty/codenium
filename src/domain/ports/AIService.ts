export interface AIService {
    generateHint(problem: string, code: string): Promise<any>;
    explainSolution(code: string, title: string): Promise<any>;
    answerQuestion(problemTitle: string, problemDesc: string, chatHistory: any[], userMessage: string, systemPrompt?: string): Promise<any>;
    generateSolution(problemTitle: string, problemDesc: string): Promise<any>;
    analyzeDesign(problemTitle: string, problemDesc: string, elements: string[], expectedComponents?: string[]): Promise<any>;
}
