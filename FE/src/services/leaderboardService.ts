/**
 * Leaderboard Service
 * Quản lý leaderboards (weekly, monthly, all-time, friends)
 */

import api from './api';

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  score: number;
  xp?: number;
  streak?: number;
  level?: number;
  isCurrentUser?: boolean;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  currentUser?: LeaderboardEntry;
  totalParticipants: number;
}

export const leaderboardService = {
  /**
   * Lấy leaderboard tuần
   * GET /api/leaderboard/weekly
   */
  getWeeklyLeaderboard: async (limit?: number): Promise<LeaderboardResponse> => {
    const response = await api.get<any, { success: boolean; data: any[] }>('/leaderboard/weekly', {
      params: { limit },
    });
    const data = response.data || response;
    const entries = (Array.isArray(data) ? data : []).map((item: any) => ({
      rank: item.rank,
      user: {
        id: item.user.id || item.user._id,
        name: item.user.fullName,
        avatar: item.user.avatar,
      },
      score: item.weeklyScore || 0,
      xp: item.user.xp,
      level: item.user.level,
    }));
    return {
      leaderboard: entries,
      totalParticipants: entries.length,
    };
  },

  /**
   * Lấy leaderboard tháng
   * GET /api/leaderboard/monthly
   */
  getMonthlyLeaderboard: async (limit?: number): Promise<LeaderboardResponse> => {
    const response = await api.get<any, { success: boolean; data: any[] }>('/leaderboard/monthly', {
      params: { limit },
    });
    const data = response.data || response;
    const entries = (Array.isArray(data) ? data : []).map((item: any) => ({
      rank: item.rank,
      user: {
        id: item.user.id || item.user._id,
        name: item.user.fullName,
        avatar: item.user.avatar,
      },
      score: item.monthlyScore || 0,
      xp: item.user.xp,
      level: item.user.level,
    }));
    return {
      leaderboard: entries,
      totalParticipants: entries.length,
    };
  },

  /**
   * Lấy leaderboard all-time
   * GET /api/leaderboard/alltime
   */
  getAllTimeLeaderboard: async (limit?: number): Promise<LeaderboardResponse> => {
    const response = await api.get<any, { success: boolean; data: any[] }>('/leaderboard/alltime', {
      params: { limit },
    });
    const data = response.data || response;
    const entries = (Array.isArray(data) ? data : []).map((item: any) => ({
      rank: item.rank,
      user: {
        id: item.user.id || item.user._id,
        name: item.user.fullName,
        avatar: item.user.avatar,
      },
      score: item.leaderboardScore || 0,
      xp: item.user.xp,
      level: item.user.level,
      streak: item.user.streakDays,
    }));
    return {
      leaderboard: entries,
      totalParticipants: entries.length,
    };
  },

  /**
   * Lấy leaderboard bạn bè
   * GET /api/leaderboard/friends
   */
  getFriendsLeaderboard: async (): Promise<LeaderboardResponse> => {
    const response = await api.get<any, { success: boolean; data: any[] }>('/leaderboard/friends');
    const data = response.data || response;
    const entries = (Array.isArray(data) ? data : []).map((item: any) => ({
      rank: item.rank,
      user: {
        id: item.user.id || item.user._id,
        name: item.user.fullName,
        avatar: item.user.avatar,
      },
      score: item.leaderboardScore || 0,
      xp: item.user.xp,
      level: item.user.level,
      streak: item.user.streakDays,
      isCurrentUser: item.isCurrentUser || false,
    }));
    const currentUser = entries.find(e => e.isCurrentUser);
    return {
      leaderboard: entries,
      currentUser,
      totalParticipants: entries.length,
    };
  },
};
