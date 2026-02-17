import { SystemDesignProblem, DesignSolution } from '../entities/SystemDesign';

export interface SystemDesignRepository {
  getProblems(): Promise<SystemDesignProblem[]>;
  getProblemBySlug(slug: string): Promise<SystemDesignProblem | null>;
  getSolution(problemId: string): Promise<DesignSolution | null>;
}
