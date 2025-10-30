"use client"

import { useState, useEffect } from "react"
import { competitionService } from "@/services/competitionService"
import type { Competition } from "@/types/api"
import { useUser } from "@clerk/clerk-react"

export function useCompetitions(search?: string) {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()
  const userRole = (user?.publicMetadata?.role as string) ?? "user"

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true)
        setError(null)

        // If user is admin/hoster, fetch their competitions
        // Otherwise fetch public competitions
        const response =
          userRole === "admin" || userRole === "hoster"
            ? await competitionService.getMyCompetitions({ limit: 50 })
            : await competitionService.getCompetitions({ isPublic: true, limit: 50, search })

        setCompetitions(response.data)
      } catch (err: any) {
        console.error("[v0] Error fetching competitions:", err)
        setError(err.response?.data?.message || "Failed to load competitions")
      } finally {
        setLoading(false)
      }
    }

    fetchCompetitions()
  }, [userRole, search])

  return { competitions, loading, error, refetch: () => setLoading(true) }
}
