"use client"

import { cn } from "@/lib/utils"
import { BookOpen, CheckCircle, FileQuestion, Loader2, Pencil, Plus } from "lucide-react"
import { CreateChallenge } from "../CreateChallange"
import { Button } from "@mui/material"
import RequireAccess from "../RequireAccess"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { challengeService } from "@/services/challengeService"
import type { Challenge } from "@/types/api"

interface ChallengesProps {
  activeTab: string
  competitionId: string
}

function Challenges({ activeTab, competitionId }: ChallengesProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(false)
  const [solvedChallenges, setSolvedChallenges] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (activeTab === "Challenges") {
      fetchChallenges()
    }
  }, [activeTab, competitionId])

  const fetchChallenges = async () => {
    try {
      setLoading(true)
      const response = await challengeService.getChallenges(competitionId, { limit: 50 })
      setChallenges(response.data)
      // TODO: Fetch user's solved challenges
    } catch (err: any) {
      console.error("[v0] Error fetching challenges:", err)
    } finally {
      setLoading(false)
    }
  }

  const isSolved = (challengeId: string) => solvedChallenges.has(challengeId)

  return (
    <div className={cn("", activeTab === "Challenges" ? "block" : "hidden")}>
      <div className="flex justify-between items-center">
        <h1 className="my-4 py-4">Challenges</h1>
        <RequireAccess roles={["admin", "hoster"]}>
          <CreateChallenge competitionId={competitionId} onSuccess={fetchChallenges}>
            <button className="flex items-center text-sm gap-1 bg-indigo-500 text-white rounded-md p-2 px-3 h-fit">
              <Plus size={14} /> New Challenge
            </button>
          </CreateChallenge>
        </RequireAccess>
      </div>
      <hr />
      <div className="mt-3">
        <div className="rounded-md p-1 min-h-10 bg-background dark:bg-zinc-950/50">
          <div className="grid grid-cols-4 px-5 py-2 text-muted-foreground text-sm">
            <div className="col-span-3">Challenge Title</div>
            <div>Actions</div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-muted-foreground" size={24} />
            </div>
          ) : challenges.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No challenges yet</div>
          ) : (
            <div className="bg-card border border-border border-dashed rounded-md">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="grid grid-cols-4 items-center px-5 py-2 text-muted-foreground text-sm"
                >
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="w-8 h-8 text-white rounded-full bg-indigo-400 flex justify-center items-center">
                          <FileQuestion size={14} />
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{challenge.title}</div>
                        <div className="text-xs line-clamp-2">{challenge.description}</div>
                        <div className="text-xs mt-1">
                          <span className="bg-accent px-2 py-0.5 rounded">{challenge.category}</span>
                          <span className="ml-2 text-yellow-500">{challenge.points} pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="gap-2 flex flex-wrap">
                    <RequireAccess roles={["user"]}>
                      {isSolved(challenge.id) ? (
                        <Button
                          variant="contained"
                          color="success"
                          className="shadow-none! text-capitalized! flex gap-2 text-sm!"
                        >
                          <CheckCircle size={13} /> Solved
                        </Button>
                      ) : (
                        <Link to={`/competition/${competitionId}/challenge/${challenge.id}`}>
                          <Button
                            variant="contained"
                            color="success"
                            className="shadow-none! text-capitalized! flex gap-2 text-sm!"
                          >
                            <BookOpen size={13} /> Solve
                          </Button>
                        </Link>
                      )}
                    </RequireAccess>
                    <RequireAccess roles={["admin", "hoster"]}>
                      <Button
                        variant="contained"
                        color="primary"
                        className="shadow-none! text-capitalized! flex gap-2 text-sm!"
                      >
                        <Pencil size={13} /> Edit
                      </Button>
                    </RequireAccess>
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

export default Challenges
