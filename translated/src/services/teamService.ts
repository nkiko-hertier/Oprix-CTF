import apiClient from "@/lib/api"
import type { Team, PaginatedResponse } from "@/types/api"

export const teamService = {
  // Get teams for a competition
  getTeams: async (competitionId: string, params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get<PaginatedResponse<Team>>(`/competitions/${competitionId}/teams`, { params })
    return response.data
  },

  // Get single team
  getTeam: async (competitionId: string, teamId: string) => {
    const response = await apiClient.get<Team>(`/competitions/${competitionId}/teams/${teamId}`)
    return response.data
  },

  // Create team
  createTeam: async (competitionId: string, data: { name: string; description?: string }) => {
    const response = await apiClient.post<Team>(`/competitions/${competitionId}/teams`, data)
    return response.data
  },

  // Update team
  updateTeam: async (competitionId: string, teamId: string, data: Partial<Team>) => {
    const response = await apiClient.patch<Team>(`/competitions/${competitionId}/teams/${teamId}`, data)
    return response.data
  },

  // Delete team
  deleteTeam: async (competitionId: string, teamId: string) => {
    const response = await apiClient.delete(`/competitions/${competitionId}/teams/${teamId}`)
    return response.data
  },

  // Join team
  joinTeam: async (competitionId: string, teamId: string) => {
    const response = await apiClient.post(`/competitions/${competitionId}/teams/${teamId}/join`)
    return response.data
  },

  // Leave team
  leaveTeam: async (competitionId: string, teamId: string) => {
    const response = await apiClient.post(`/competitions/${competitionId}/teams/${teamId}/leave`)
    return response.data
  },

  // Remove member from team
  removeMember: async (competitionId: string, teamId: string, userId: string) => {
    const response = await apiClient.delete(`/competitions/${competitionId}/teams/${teamId}/members/${userId}`)
    return response.data
  },
}
