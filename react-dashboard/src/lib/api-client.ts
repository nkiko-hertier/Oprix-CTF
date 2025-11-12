"use client"

import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios"
import { API_CONFIG } from "@/config/api.config"

let axiosInstance: AxiosInstance | null = null

/**
 * Waits for Clerk to be fully initialized before proceeding.
 */
async function waitForClerkReady(maxWaitMs = 5000): Promise<boolean> {
  const start = Date.now()
  while (
    (!(window as any).Clerk || !(window as any).Clerk.session) &&
    Date.now() - start < maxWaitMs
  ) {
    await new Promise((resolve) => setTimeout(resolve, 150))
  }

  if (!(window as any).Clerk?.session) {
    console.warn("[API] Clerk not ready after waiting period.")
    return false
  }

  return true
}

/**
 * Creates a preconfigured Axios instance with:
 * - Authorization header injection
 * - Retry logic for transient errors
 * - 401 handling
 */
export const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
      "Content-Type": "application/json",
    },
  })

  // 🔹 Request Interceptor
  instance.interceptors.request.use(
    async (config: any) => {
      try {
        const clerkReady = await waitForClerkReady()
        if (clerkReady && (window as any).Clerk?.session) {
          const token = await (window as any).Clerk.session.getToken({
            template: "default",
          })
          if (token) {
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${token}`,
            }
          }
        } else {
          console.warn("[API] Skipping token injection – Clerk not ready.")
        }
      } catch (error) {
        console.error("[API] Failed to get auth token:", error)
      }

      return config
    },
    (error) => Promise.reject(error),
  )

  // 🔹 Response Interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as
        | (InternalAxiosRequestConfig & { retry?: number })
        | undefined

      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        console.error("[API] Unauthorized – user may need to log in again.")
        // Optionally redirect to login:
        // window.location.href = "/sign-in"
      }

      // Retry logic for 5xx server errors
      if (
        error.response?.status &&
        error.response.status >= 500 &&
        originalRequest
      ) {
        const retryCount = originalRequest.retry ?? 0
        if (retryCount < API_CONFIG.retryAttempts) {
          originalRequest.retry = retryCount + 1
          const delay =
            API_CONFIG.retryDelay * Math.pow(2, originalRequest.retry - 1)
          console.warn(
            `[API] Retrying request (${originalRequest.retry}/${API_CONFIG.retryAttempts}) after ${delay}ms...`,
          )
          await new Promise((resolve) => setTimeout(resolve, delay))
          return instance(originalRequest)
        }
      }

      return Promise.reject(error)
    },
  )

  return instance
}

/**
 * Singleton accessor for the shared Axios instance.
 */
export const getApiClient = (): AxiosInstance => {
  if (!axiosInstance) {
    axiosInstance = createApiClient()
  }
  return axiosInstance
}

export default getApiClient
