/**
 * User Service
 * Quản lý thông tin user, stats, streak, XP
 */

import api from './api';

export interface UserStats {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  rank?: string;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn?: string;
  canCheckInToday: boolean;
  streakProtections?: number;
  nextMilestone?: number;
}

export interface XPHistory {
  id: string;
  amount: number;
  source: string;
  description: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export const userService = {
  /**
   * Lấy thông tin stats (Level, XP)
   * GET /api/users/me/xp
   */
  getStats: async (): Promise<UserStats> => {
    const response = await api.get<any, { success: boolean; data: any }>('/users/me/xp');
    const data = response.data || response;
    return {
      level: data.level || 1,
      currentXP: data.xp || 0,
      xpToNextLevel: data.xpNeeded || 0,
      totalXP: data.xp || 0,
    };
  },

  /**
   * Lấy thông tin streak
   * GET /api/users/me/streak
   */
  getStreak: async (): Promise<StreakInfo> => {
    const response = await api.get<any, { success: boolean; data: any }>('/users/me/streak');
    const data = response.data || response;
    return {
      currentStreak: data.currentStreak || data.streakDays || 0,
      longestStreak: data.longestStreak || data.currentStreak || 0,
      lastCheckIn: data.lastCheckIn || data.lastActiveDate,
      canCheckInToday: data.canCheckInToday !== undefined ? data.canCheckInToday : !data.hasCheckedInToday,
    };
  },

  /**
   * Check-in streak hàng ngày
   * POST /api/users/me/streak/checkin
   */
  checkInStreak: async (): Promise<StreakInfo> => {
    const response = await api.post<any, { success: boolean; data: any }>('/users/me/streak/checkin');
    const data = response.data || response;
    return {
      currentStreak: data.currentStreak || data.streakDays || 0,
      longestStreak: data.longestStreak || data.currentStreak || 0,
      lastCheckIn: data.lastCheckIn || data.lastActiveDate,
      canCheckInToday: false,
    };
  },

  /**
   * Lấy lịch sử XP
   * GET /api/users/me/xp/history
   */
  getXPHistory: async (limit?: number): Promise<XPHistory[]> => {
    const response = await api.get<any, { success: boolean; data: any[] }>('/users/me/xp/history', {
      params: { limit },
    });
    const data = response.data || response;
    return (Array.isArray(data) ? data : []).map((item: any) => ({
      id: item._id || item.id,
      amount: item.amount,
      source: item.source,
      description: item.description || '',
      createdAt: item.createdAt || item.unlockedAt,
    }));
  },

  /**
   * Thêm XP cho user (internal - từ backend trigger)
   * POST /api/users/me/xp/add
   */
  addXP: async (amount: number, source: string): Promise<UserStats> => {
    return api.post<any, UserStats>('/users/me/xp/add', {
      amount,
      source,
    });
  },

  /**
   * Lấy achievements của user
   * GET /api/users/me/achievements
   */
  getAchievements: async (): Promise<Achievement[]> => {
    const response = await api.get<any, { success: boolean; data: any[] }>('/users/me/achievements');
    const data = response.data || response;
    return (Array.isArray(data) ? data : []).map((item: any) => ({
      id: item.achievement?._id || item.achievement?.id || item._id,
      title: item.achievement?.name || item.name || '',
      description: item.achievement?.description || item.description || '',
      icon: item.achievement?.icon || item.icon || '🏆',
      progress: 100,
      unlocked: true,
      unlockedAt: item.unlockedAt,
    }));
  },

  /**
   * Cập nhật profile user
   * PUT /api/users/me
   */
  updateProfile: async (data: {
    fullName?: string;
    avatar?: string;
    goals?: string[];
    subjects?: string[];
    onboardingCompleted?: boolean;
  }): Promise<any> => {
    return api.put('/users/me', data);
  },
};
