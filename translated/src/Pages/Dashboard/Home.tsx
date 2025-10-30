"use client"

import AlertBox from "@/components/AlertBox"
import { CreateCompetition } from "@/components/CreateCompetition"
import RequireAccess from "@/components/RequireAccess"
import { ArrowRight, Circle, Flag, Loader2, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { useCompetitions } from "@/hooks/useCompetitions"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import type { Competition } from "@/types/api"

function CompetitionCard({ competition }: { competition: Competition }) {
  const statusColors = {
    draft: "bg-gray-500",
    upcoming: "bg-yellow-500",
    active: "bg-green-500",
    ended: "bg-red-500",
  }

  const difficultyLabels = {
    Beginner: "Beginner",
    Intermediate: "Intermediate",
    Advanced: "Advanced",
    Expert: "Expert",
  }

  return (
    <Link
      to={`/competition/${competition.id}`}
      className="bg-sidebar cursor-pointer group h-[200px] flex flex-col border border-dashed rounded-md p-1"
    >
      <div className="h-full bg-accent w-full rounded-md border-border flex flex-col justify-between p-4">
        <div className="flex justify-between">
          <Flag size={13} className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{competition.organizationUrl || "CTF Platform"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{difficultyLabels[competition.difficulty]}</p>
          <div className="font-medium truncate">{competition.title}</div>
          <p
            className={`text-sm w-fit px-2 mt-2 rounded-md border text-white flex gap-1 items-center ${statusColors[competition.status]}`}
          >
            <Circle size={10} fill="currentColor" /> {competition.status}
          </p>
        </div>
      </div>
      <div className="text-muted-foreground flex justify-between overflow-hidden">
        <p className="text-sm relative p-2 py-4 left-[0px] group-hover:left-[-200px] transition-all">
          {new Date(competition.updatedAt).toLocaleDateString()}
        </p>
        <p className="text-sm relative text-white flex p-2 py-4 gap-2 left-[200px] group-hover:left-[0px] items-center transition-all">
          Open Competition <ArrowRight size={14} />
        </p>
      </div>
    </Link>
  )
}

export default function DashboardHome() {
  const [searchQuery, setSearchQuery] = useState("")
  const { competitions, loading, error } = useCompetitions(searchQuery)

  return (
    <div>
      {/* Most recent announcement! */}
      <AlertBox type="Normal" title="Announcement">
        Hi there, hope your day closed great. Welcome back!
      </AlertBox>

      <div className="flex justify-between items-center my-4 py-4">
        <h1 className="text-lg font-semibold">Competitions</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            type="text"
            placeholder="Search competitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-muted-foreground" size={32} />
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive rounded-md p-4 my-4">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid relative sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <RequireAccess roles={["admin", "hoster"]}>
            <CreateCompetition>
              <div className="bg-accent cursor-pointer h-[200px] border border-dashed rounded-md flex">
                <p className="mx-auto my-auto text-muted-foreground">+ create competition</p>
              </div>
            </CreateCompetition>
          </RequireAccess>

          {competitions.length === 0 ? (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              <p>No competitions found</p>
            </div>
          ) : (
            competitions.map((competition) => <CompetitionCard key={competition.id} competition={competition} />)
          )}
        </div>
      )}
    </div>
  )
}
