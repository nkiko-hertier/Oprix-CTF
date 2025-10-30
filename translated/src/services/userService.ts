import apiClient from "@/lib/api"
import type { User, PaginatedResponse } from "@/types/api"

export const userService = {
  // Get all users (SuperAdmin only)
  getUsers: async (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
    const response = await apiClient.get<PaginatedResponse<User>>("/users", { params })
    return response.data
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get<User>("/users/me")
    return response.data
  },

  // Get user by ID
  getUser: async (id: string) => {
    const response = await apiClient.get<User>(`/users/${id}`)
    return response.data
  },

  // Create user
  createUser: async (data: Partial<User> & { password: string }) => {
    const response = await apiClient.post<User>("/users", data)
    return response.data
  },

  // Update user
  updateUser: async (id: string, data: Partial<User>) => {
    const response = await apiClient.patch<User>(`/users/${id}`, data)
    return response.data
  },

  // Delete user
  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}`)
    return response.data
  },

  // Update user role
  updateUserRole: async (id: string, role: "user" | "admin" | "hoster") => {
    const response = await apiClient.patch<User>(`/users/${id}/role`, { role })
    return response.data
  },
}
