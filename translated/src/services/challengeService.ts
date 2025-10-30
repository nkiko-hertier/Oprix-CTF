import apiClient from "@/lib/api"
import type { Challenge, ChallengeFile, Submission, PaginatedResponse } from "@/types/api"

export const challengeService = {
  // Get challenges for a competition
  getChallenges: async (competitionId: string, params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get<PaginatedResponse<Challenge>>(`/competitions/${competitionId}/challenges`, {
      params,
    })
    return response.data
  },

  // Get single challenge
  getChallenge: async (competitionId: string, challengeId: string) => {
    const response = await apiClient.get<Challenge>(`/competitions/${competitionId}/challenges/${challengeId}`)
    return response.data
  },

  // Create challenge
  createChallenge: async (competitionId: string, data: Partial<Challenge>) => {
    const response = await apiClient.post<Challenge>(`/competitions/${competitionId}/challenges`, data)
    return response.data
  },

  // Update challenge
  updateChallenge: async (competitionId: string, challengeId: string, data: Partial<Challenge>) => {
    const response = await apiClient.patch<Challenge>(`/competitions/${competitionId}/challenges/${challengeId}`, data)
    return response.data
  },

  // Delete challenge
  deleteChallenge: async (competitionId: string, challengeId: string) => {
    const response = await apiClient.delete(`/competitions/${competitionId}/challenges/${challengeId}`)
    return response.data
  },

  // Submit flag
  submitFlag: async (competitionId: string, challengeId: string, flag: string, teamId?: string) => {
    const response = await apiClient.post<Submission>(
      `/competitions/${competitionId}/challenges/${challengeId}/submit`,
      { flag, teamId },
    )
    return response.data
  },

  // Get challenge files
  getChallengeFiles: async (competitionId: string, challengeId: string) => {
    const response = await apiClient.get<ChallengeFile[]>(
      `/competitions/${competitionId}/challenges/${challengeId}/files`,
    )
    return response.data
  },

  // Upload challenge file
  uploadChallengeFile: async (competitionId: string, challengeId: string, file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await apiClient.post<ChallengeFile>(
      `/competitions/${competitionId}/challenges/${challengeId}/files`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    )
    return response.data
  },
}
