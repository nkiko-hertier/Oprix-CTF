"use client"

import { cn } from "@/lib/utils"
import { Loader2, Trophy } from "lucide-react"
import { useState, useEffect } from "react"
import { leaderboardService } from "@/services/leaderboardService"
import type { LeaderboardEntry } from "@/types/api"

interface LeaderboardProps {
  activeTab: string
  competitionId: string
}

function Leaderboard({ activeTab, competitionId }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === "Leaderboard") {
      fetchLeaderboard()
    }
  }, [activeTab, competitionId])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const data = await leaderboardService.getLeaderboard(competitionId, { limit: 50 })
      setLeaderboard(data)
    } catch (err: any) {
      console.error("[v0] Error fetching leaderboard:", err)
    } finally {
      setLoading(false)
    }
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-500"
    if (rank === 2) return "text-gray-400"
    if (rank === 3) return "text-orange-600"
    return "text-muted-foreground"
  }

  return (
    <div className={cn("", activeTab === "Leaderboard" ? "block" : "hidden")}>
      <div className="flex justify-between items-center">
        <h1 className="my-4 py-4 flex items-center gap-2">
          <Trophy size={20} /> Leaderboard
        </h1>
      </div>
      <hr />
      <div className="mt-3">
        <div className="rounded-md p-1 min-h-10 bg-background dark:bg-zinc-950/50">
          <div className="grid grid-cols-4 px-5 py-2 text-muted-foreground text-sm">
            <div>Rank</div>
            <div>Name</div>
            <div>Score</div>
            <div>Solved</div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-muted-foreground" size={24} />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No entries yet</div>
          ) : (
            <div className="bg-card border border-border border-dashed rounded-md">
              {leaderboard.map((entry) => (
                <div
                  key={entry.userId || entry.teamId}
                  className="grid grid-cols-4 items-center px-5 py-2 text-muted-foreground text-sm"
                >
                  <div>
                    <span className={`font-bold text-lg ${getRankColor(entry.rank)}`}>#{entry.rank}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 text-white rounded-full bg-indigo-400 flex justify-center items-center">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="font-semibold text-foreground">{entry.name}</div>
                    </div>
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">{entry.score}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{entry.solvedChallenges}</p>
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

export default Leaderboard
