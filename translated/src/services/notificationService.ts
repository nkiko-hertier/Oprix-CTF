import apiClient from "@/lib/api"
import type { Notification, PaginatedResponse } from "@/types/api"

export const notificationService = {
  // Get user notifications
  getNotifications: async (params?: { page?: number; limit?: number; isRead?: boolean }) => {
    const response = await apiClient.get<PaginatedResponse<Notification>>("/notifications", {
      params,
    })
    return response.data
  },

  // Mark notification as read
  markAsRead: async (id: string) => {
    const response = await apiClient.patch(`/notifications/${id}/read`)
    return response.data
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await apiClient.patch("/notifications/read-all")
    return response.data
  },

  // Delete notification
  deleteNotification: async (id: string) => {
    const response = await apiClient.delete(`/notifications/${id}`)
    return response.data
  },
}
