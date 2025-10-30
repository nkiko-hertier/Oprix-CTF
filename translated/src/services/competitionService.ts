import apiClient from "@/lib/api"
import type { Competition, PaginatedResponse } from "@/types/api"

export const competitionService = {
  // Get all competitions with filters
  getCompetitions: async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    isPublic?: boolean
  }) => {
    const response = await apiClient.get<PaginatedResponse<Competition>>("/competitions", { params })
    return response.data
  },

  // Get user's owned competitions
  getMyCompetitions: async (params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get<PaginatedResponse<Competition>>("/competitions/my", { params })
    return response.data
  },

  // Get single competition
  getCompetition: async (id: string) => {
    const response = await apiClient.get<Competition>(`/competitions/${id}`)
    return response.data
  },

  // Create competition
  createCompetition: async (data: Partial<Competition>) => {
    const response = await apiClient.post<Competition>("/competitions", data)
    return response.data
  },

  // Update competition
  updateCompetition: async (id: string, data: Partial<Competition>) => {
    const response = await apiClient.patch<Competition>(`/competitions/${id}`, data)
    return response.data
  },

  // Delete competition
  deleteCompetition: async (id: string) => {
    const response = await apiClient.delete(`/competitions/${id}`)
    return response.data
  },

  // Join competition
  joinCompetition: async (id: string, teamId?: string) => {
    const response = await apiClient.post(`/competitions/${id}/join`, { teamId })
    return response.data
  },

  // Leave competition
  leaveCompetition: async (id: string) => {
    const response = await apiClient.post(`/competitions/${id}/leave`)
    return response.data
  },
}
