import apiClient from "@/lib/api"
import type { Announcement, PaginatedResponse } from "@/types/api"

export const announcementService = {
  // Get announcements for a competition
  getAnnouncements: async (competitionId: string, params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get<PaginatedResponse<Announcement>>(
      `/competitions/${competitionId}/announcements`,
      { params },
    )
    return response.data
  },

  // Create announcement
  createAnnouncement: async (competitionId: string, data: { title: string; content: string }) => {
    const response = await apiClient.post<Announcement>(`/competitions/${competitionId}/announcements`, data)
    return response.data
  },

  // Update announcement
  updateAnnouncement: async (competitionId: string, announcementId: string, data: Partial<Announcement>) => {
    const response = await apiClient.patch<Announcement>(
      `/competitions/${competitionId}/announcements/${announcementId}`,
      data,
    )
    return response.data
  },

  // Delete announcement
  deleteAnnouncement: async (competitionId: string, announcementId: string) => {
    const response = await apiClient.delete(`/competitions/${competitionId}/announcements/${announcementId}`)
    return response.data
  },
}
