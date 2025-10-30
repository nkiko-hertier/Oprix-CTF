"use client"

import { cn } from "@/lib/utils"
import { Loader2, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import RequireAccess from "../RequireAccess"
import { teamService } from "@/services/teamService"
import type { Team } from "@/types/api"

interface TeamsProps {
  activeTab: string
  competitionId: string
}

function Teams({ activeTab, competitionId }: TeamsProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === "Teams") {
      fetchTeams()
    }
  }, [activeTab, competitionId])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const response = await teamService.getTeams(competitionId, { limit: 50 })
      setTeams(response.data)
    } catch (err: any) {
      console.error("[v0] Error fetching teams:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("", activeTab === "Teams" ? "block" : "hidden")}>
      <div className="flex justify-between items-center">
        <h1 className="my-4 py-4">Teams</h1>
        <RequireAccess roles={["user"]}>
          <button className="flex items-center text-sm gap-1 bg-indigo-500 text-white rounded-md p-2 px-3 h-fit">
            <Plus size={14} /> Create Team
          </button>
        </RequireAccess>
      </div>
      <hr />
      <div className="mt-3">
        <div className="rounded-md p-1 min-h-10 bg-background dark:bg-zinc-950/50">
          <div className="grid grid-cols-4 px-5 py-2 text-muted-foreground text-sm">
            <div>Team</div>
            <div>Members</div>
            <div>Score</div>
            <div>Actions</div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-muted-foreground" size={24} />
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No teams yet</div>
          ) : (
            <div className="bg-card border border-border border-dashed rounded-md">
              {teams.map((team) => (
                <div key={team.id} className="grid grid-cols-4 items-center px-5 py-2 text-muted-foreground text-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 text-white rounded-full bg-indigo-400 flex justify-center items-center">
                        {team.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{team.name}</div>
                        <div className="text-xs">{team.description || "No description"}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{team.members?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{team.score}</p>
                  </div>
                  <div>
                    <button className="text-sm text-indigo-500 hover:underline">View</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Teams
