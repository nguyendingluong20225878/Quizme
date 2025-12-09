/**
 * Analytics Service
 * Phân tích lỗi sai, competency, và performance
 */

import api from './api';

export interface CompetencyRadar {
  subject: string;
  score: number;
  fullMark: number;
  attempts: number;
}

export interface ErrorByDifficulty {
  difficulty: string;
  correct: number;
  incorrect: number;
  total: number;
  percentage: number;
  color: string;
}

export interface ErrorByType {
  type: string;
  correct: number;
  incorrect: number;
  total: number;
  percentage: number;
  icon: string;
  color: string;
}

export interface ProgressTrend {
  date: string;
  score: number;
  xp?: number;
}

export interface WeakTopic {
  id: string;
  topic: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  wrongQuestions: number;
  totalQuestions: number;
  commonErrors: string[];
  icon: string;
}

export const analyticsService = {
  /**
   * Lấy competency radar data
   * GET /api/analytics/competency-radar
   */
  getCompetencyRadar: async (): Promise<CompetencyRadar[]> => {
    return api.get<any, CompetencyRadar[]>('/analytics/competency-radar');
  },

  /**
   * Lấy error analysis theo độ khó
   * GET /api/analytics/error-analysis/by-difficulty
   */
  getErrorByDifficulty: async (): Promise<ErrorByDifficulty[]> => {
    return api.get<any, ErrorByDifficulty[]>('/analytics/error-analysis/by-difficulty');
  },

  /**
   * Lấy error analysis theo loại câu hỏi
   * GET /api/analytics/error-analysis/by-type
   */
  getErrorByType: async (): Promise<ErrorByType[]> => {
    return api.get<any, ErrorByType[]>('/analytics/error-analysis/by-type');
  },

  /**
   * Lấy progress trend (tuần/tháng)
   * GET /api/analytics/progress-trend
   */
  getProgressTrend: async (period: 'week' | 'month' = 'week'): Promise<ProgressTrend[]> => {
    return api.get<any, ProgressTrend[]>('/analytics/progress-trend', {
      params: { period },
    });
  },

  /**
   * Lấy weak topics (điểm yếu)
   * GET /api/analytics/weak-topics
   */
  getWeakTopics: async (limit?: number): Promise<WeakTopic[]> => {
    return api.get<any, WeakTopic[]>('/analytics/weak-topics', {
      params: { limit },
    });
  },
};
