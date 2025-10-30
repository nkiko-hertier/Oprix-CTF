import apiClient from "@/lib/api"
import type { LeaderboardEntry } from "@/types/api"

export const leaderboardService = {
  // Get leaderboard for a competition
  getLeaderboard: async (competitionId: string, params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get<LeaderboardEntry[]>(`/competitions/${competitionId}/leaderboard`, { params })
    return response.data
  },

  // Get user's rank
  getUserRank: async (competitionId: string, userId: string) => {
    const response = await apiClient.get<{ rank: number; score: number }>(
      `/competitions/${competitionId}/leaderboard/user/${userId}`,
    )
    return response.data
  },
}
