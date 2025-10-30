import axios, { type AxiosInstance, type AxiosError } from "axios"

// const API_BASE = "https://oprix-ctf-backend-production.up.railway.app"
const API_BASE = "/api/v1/"

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Get Clerk token if available
    const token = await window.Clerk?.session?.getToken({ template: 'default' })
    console.log("Clerk Token:", token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = "/auth/signin"
    }
    return Promise.reject(error)
  },
)

export default apiClient
