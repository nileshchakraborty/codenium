/**
 * Problem Lists - Scalable Study Plans Architecture
 * 
 * Data is stored in api/data/study-plans.json
 * This file provides typed interfaces and helper functions.
 */

import studyPlansData from '../../../api/data/study-plans.json';

// ============================================
// Types & Interfaces
// ============================================

export interface StudyPlan {
    id: string;
    name: string;
    icon: string;
    description: string;
    difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
    estimatedHours?: number;
    problems: string[];
}

export interface StudyPlansData {
    version: string;
    plans: Record<string, StudyPlan>;
}

// Type for filter dropdown - 'all' or any plan ID
export type ListFilter = 'all' | string;

// ============================================
// Data Access
// ============================================

const data = studyPlansData as StudyPlansData;

/**
 * Get all available study plans
 */
export const getAllPlans = (): StudyPlan[] => {
    return Object.values(data.plans);
};

/**
 * Get plan IDs for dropdown options
 */
export const getPlanIds = (): string[] => {
    return Object.keys(data.plans);
};

/**
 * Get a specific study plan by ID
 */
export const getStudyPlan = (planId: string): StudyPlan | null => {
    return data.plans[planId] || null;
};

/**
 * Get problems for a specific plan
 */
export const getPlanProblems = (planId: string): string[] => {
    const plan = data.plans[planId];
    return plan ? plan.problems : [];
};

/**
 * Check if a problem slug is in a specific plan
 */
export const isInPlan = (slug: string, planId: string): boolean => {
    const plan = data.plans[planId];
    return plan ? plan.problems.includes(slug) : false;
};

// ============================================
// Legacy Compatibility Exports
// (Maintain backward compatibility with existing code)
// ============================================

/** @deprecated Use getStudyPlan('blind75').problems instead */
export const BLIND_75: string[] = data.plans.blind75?.problems || [];

/** @deprecated Use getStudyPlan('top150').problems instead */
export const TOP_150: string[] = data.plans.top150?.problems || [];

/** @deprecated Use isInPlan(slug, 'blind75') instead */
export const isInBlind75 = (slug: string): boolean => isInPlan(slug, 'blind75');

/** @deprecated Use isInPlan(slug, 'top150') instead */
export const isInTop150 = (slug: string): boolean => isInPlan(slug, 'top150');

/** @deprecated Use getPlanProblems(filter) instead */
export const getProblemList = (filter: ListFilter): string[] | null => {
    if (filter === 'all') return null;
    return getPlanProblems(filter) || null;
};
