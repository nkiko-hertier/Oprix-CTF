"use client"

import MdHtml from "@/components/MdHtml"
import { Button } from "@mui/material"
import { Bell, ChevronLeft, Download, Loader2 } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { challengeService } from "@/services/challengeService"
import type { Challenge, ChallengeFile } from "@/types/api"
import RequireAccess from "@/components/RequireAccess"

function ChallengePage() {
  const { id: competitionId, challengeId } = useParams<{ id: string; challengeId: string }>()
  const navigate = useNavigate()

  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [files, setFiles] = useState<ChallengeFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [flagInput, setFlagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSolved, setIsSolved] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!competitionId || !challengeId) return

      try {
        setLoading(true)
        setError(null)

        const [challengeData, filesData] = await Promise.all([
          challengeService.getChallenge(competitionId, challengeId),
          challengeService.getChallengeFiles(competitionId, challengeId).catch(() => []),
        ])

        setChallenge(challengeData)
        setFiles(filesData)
        // TODO: Check if user has already solved this challenge
      } catch (err: any) {
        console.error("[v0] Error fetching challenge:", err)
        setError(err.response?.data?.message || "Failed to load challenge")
      } finally {
        setLoading(false)
      }
    }

    fetchChallenge()
  }, [competitionId, challengeId])

  const handleSubmitFlag = async () => {
    if (!flagInput.trim()) {
      setSubmitMessage({ type: "error", text: "Please enter a flag" })
      return
    }

    if (!competitionId || !challengeId) return

    try {
      setIsSubmitting(true)
      setSubmitMessage(null)

      const result = await challengeService.submitFlag(competitionId, challengeId, flagInput)

      if (result.isCorrect) {
        setIsSolved(true)
        setSubmitMessage({ type: "success", text: `Correct! You earned ${result.points} points!` })
      } else {
        setSubmitMessage({ type: "error", text: "Incorrect flag. Try again!" })
      }
    } catch (err: any) {
      console.error("[v0] Error submitting flag:", err)
      setSubmitMessage({ type: "error", text: err.response?.data?.message || "Failed to submit flag" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextChallenge = () => {
    // TODO: Implement navigation to next challenge
    navigate(`/competition/${competitionId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    )
  }

  if (error || !challenge) {
    return (
      <div className="bg-destructive/10 border border-destructive text-destructive rounded-md p-4 my-4">
        <p>{error || "Challenge not found"}</p>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-3">
      {/* Challenge Description */}
      <div>
        <div className="rounded-md border border-border border-dashed p-1 mt-2 min-h-10 bg-background dark:bg-zinc-950/50">
          <div className="flex items-center gap-2 p-2">
            <Link to={`/competition/${competitionId}`} className="pr-5">
              <ChevronLeft />
            </Link>
            <div>
              <div className="font-semibold text-foreground">{challenge.title}</div>
              <div className="text-sm text-muted-foreground">
                <span className="bg-accent px-2 py-0.5 rounded mr-2">{challenge.category}</span>
                <span className="text-yellow-500">{challenge.points} points</span>
                <span className="ml-2">• {challenge.difficulty}</span>
              </div>
            </div>
          </div>

          <div className="dark:bg-card bg-sidebar text-muted-foreground rounded-md p-4">
            <MdHtml>{challenge.description}</MdHtml>
          </div>

          {/* Challenge Files */}
          {files.length > 0 && (
            <>
              <h1 className="my-2 px-2 text-muted-foreground">Related & Resources:</h1>
              <div className="dark:bg-card bg-sidebar text-muted-foreground rounded-md p-2 flex flex-wrap gap-2">
                {files.map((file) => (
                  <a key={file.id} href={file.fileUrl} download target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="contained"
                      color="primary"
                      className="shadow-none! flex gap-2 text-sm! bg-indigo-500!"
                    >
                      <Download size={13} /> {file.fileName}
                    </Button>
                  </a>
                ))}
              </div>
            </>
          )}

          {/* Hints */}
          {challenge.hints && challenge.hints.length > 0 && (
            <div className="mt-3 px-2">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Hints:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {challenge.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Submission Form */}
      <div className="mt-3">
        <div className="rounded-md p-1 min-h-10 bg-background dark:bg-zinc-950/50">
          <div className="px-5 py-2 text-muted-foreground text-sm">
            <div>Submit Flag</div>
          </div>
          <div className="bg-card border border-border border-dashed rounded-md p-3">
            <input
              type="text"
              placeholder="Enter flag here..."
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              disabled={isSolved}
              className="w-full p-3 outline-none bg-transparent border border-border rounded-md disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isSubmitting && !isSolved) {
                  handleSubmitFlag()
                }
              }}
            />

            {submitMessage && (
              <div
                className={`mt-3 p-3 rounded-md ${
                  submitMessage.type === "success"
                    ? "bg-green-500/10 border border-green-500 text-green-500"
                    : "bg-red-500/10 border border-red-500 text-red-500"
                }`}
              >
                {submitMessage.text}
              </div>
            )}
          </div>

          <div className="mt-2">
            {isSolved ? (
              <button
                onClick={handleNextChallenge}
                className="flex ml-auto items-center text-sm gap-1 bg-green-500 text-white rounded-md p-2 px-3 h-fit"
              >
                Next Challenge →
              </button>
            ) : (
              <Button
                onClick={handleSubmitFlag}
                disabled={isSubmitting}
                variant="contained"
                color="primary"
                className="ml-auto! flex! items-center! text-sm! gap-1! bg-indigo-500! shadow-none!"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Submitting...
                  </>
                ) : (
                  "Submit Flag"
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Admin: Create Announcement */}
        <RequireAccess roles={["admin", "hoster"]}>
          <div className="rounded-md p-1 mt-3 min-h-10 bg-background dark:bg-zinc-950/50">
            <div className="px-5 py-2 text-muted-foreground text-sm">
              <div>Create Announcement</div>
            </div>
            <div className="bg-card border border-border border-dashed rounded-md">
              <textarea placeholder="What's new today?" className="w-full p-3 outline-none min-h-[100px]"></textarea>
            </div>
            <div>
              <button className="flex ml-auto mt-1 items-center text-sm gap-1 bg-indigo-500 text-white rounded-md p-1 px-3 h-fit">
                <Bell size={15} /> Post Announcement
              </button>
            </div>
          </div>
        </RequireAccess>
      </div>
    </div>
  )
}

export default ChallengePage
