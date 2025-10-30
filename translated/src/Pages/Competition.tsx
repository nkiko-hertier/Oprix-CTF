"use client"

import Announcements from "@/components/competition-tabs/Announcements"
import Challenges from "@/components/competition-tabs/Challenges"
import Leaderboard from "@/components/competition-tabs/Leaderboard"
import Members from "@/components/competition-tabs/Members"
import Teams from "@/components/competition-tabs/Teams"
import { cn } from "@/lib/utils"
import { Circle, Flag, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { competitionService } from "@/services/competitionService"
import type { Competition } from "@/types/api"
import { useUser } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"

function CompetitionPage() {
  type CompetitionTab = "Announcements" | "Challenges" | "Members" | "Teams" | "Leaderboard"
  const [activeTab, setActiveTab] = useState<CompetitionTab>("Announcements")
  const [competition, setCompetition] = useState<Competition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isJoining, setIsJoining] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)

  const { id } = useParams<{ id: string }>()
  const { user } = useUser()
  const userRole = (user?.publicMetadata?.role as string) ?? "user"

  // Determine which tabs to show based on user role and competition type
  const isAdmin = userRole === "admin" || userRole === "hoster"
  const showAllTabs = isAdmin || hasJoined

  useEffect(() => {
    const fetchCompetition = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)
        const data = await competitionService.getCompetition(id)
        setCompetition(data)
        // TODO: Check if user has joined this competition
        // For now, assume they haven't joined
      } catch (err: any) {
        console.error("[v0] Error fetching competition:", err)
        setError(err.response?.data?.message || "Failed to load competition")
      } finally {
        setLoading(false)
      }
    }

    fetchCompetition()
  }, [id])

  const handleJoinCompetition = async () => {
    if (!id) return

    try {
      setIsJoining(true)
      await competitionService.joinCompetition(id)
      setHasJoined(true)
      alert("Successfully joined the competition!")
    } catch (err: any) {
      console.error("[v0] Error joining competition:", err)
      alert(err.response?.data?.message || "Failed to join competition")
    } finally {
      setIsJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    )
  }

  if (error || !competition) {
    return (
      <div className="bg-destructive/10 border border-destructive text-destructive rounded-md p-4 my-4">
        <p>{error || "Competition not found"}</p>
      </div>
    )
  }

  const statusColors = {
    draft: "bg-gray-500",
    upcoming: "bg-yellow-500",
    active: "bg-green-500",
    ended: "bg-red-500",
  }

  // Define tabs based on user role and competition type
  let availableTabs: CompetitionTab[] = []

  if (showAllTabs) {
    availableTabs = ["Announcements", "Challenges", "Leaderboard"]
    if (competition.isTeamBased) {
      availableTabs.push("Teams")
    } else {
      availableTabs.push("Members")
    }
  } else {
    // Normal user who hasn't joined - only show description
    availableTabs = []
  }

  return (
    <div>
      <div className="bg-background cursor-pointer group h-[200px] flex flex-col border border-dashed rounded-md p-1">
        <div className="h-full bg-accent w-full rounded-md border-border flex flex-col justify-between p-4">
          <div className="flex justify-between">
            <Flag size={13} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{competition.organizationUrl || "CTF Platform"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{competition.difficulty}</p>
            <div className="font-medium">{competition.title}</div>
            <p
              className={`text-sm w-fit px-2 mt-2 rounded-md border text-white flex gap-1 items-center ${statusColors[competition.status]}`}
            >
              <Circle size={10} fill="currentColor" /> {competition.status}
            </p>
          </div>
        </div>

        {/* Tabs or Join Button */}
        {showAllTabs ? (
          <div className="text-muted-foreground flex gap-2 *:py-2 px-2 *:cursor-pointer text-sm *:hover:text-white">
            {availableTabs.map((tab) => {
              const isActive = tab === activeTab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn("py-2", isActive ? "text-white border-b-2 border-white" : "text-muted-foreground")}
                >
                  {tab}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-3">
            <div className="text-sm text-muted-foreground">
              <h3 className="font-semibold text-foreground mb-2">About this competition</h3>
              <p>{competition.description}</p>
              <div className="mt-3 space-y-1">
                <p>
                  <span className="font-medium">Type:</span> {competition.isTeamBased ? "Team-based" : "Individual"}
                </p>
                <p>
                  <span className="font-medium">Start:</span> {new Date(competition.startDate).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">End:</span> {new Date(competition.endDate).toLocaleString()}
                </p>
              </div>
            </div>
            <Button onClick={handleJoinCompetition} disabled={isJoining} className="w-full">
              {isJoining ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} />
                  Joining...
                </>
              ) : (
                "Join Competition"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Tab Content */}
      {showAllTabs && (
        <div className="mt-4">
          <Announcements activeTab={activeTab} competitionId={id!} />
          <Challenges activeTab={activeTab} competitionId={id!} />
          <Members activeTab={activeTab} competitionId={id!} />
          <Teams activeTab={activeTab} competitionId={id!} />
          <Leaderboard activeTab={activeTab} competitionId={id!} />
        </div>
      )}
    </div>
  )
}

export default CompetitionPage
