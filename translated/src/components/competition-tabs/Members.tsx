"use client"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

interface MembersProps {
  activeTab: string
  competitionId: string
}

function Members({ activeTab, competitionId }: MembersProps) {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === "Members") {
      // TODO: Fetch members from API
      setLoading(false)
    }
  }, [activeTab, competitionId])

  return (
    <div className={cn("", activeTab === "Members" ? "block" : "hidden")}>
      <div className="flex justify-between items-center">
        <h1 className="my-4 py-4">Members</h1>
      </div>
      <hr />
      <div className="mt-3">
        <div className="rounded-md p-1 min-h-10 bg-background dark:bg-zinc-950/50">
          <div className="grid grid-cols-4 px-5 py-2 text-muted-foreground text-sm">
            <div>Member</div>
            <div>Score</div>
            <div>Joined At</div>
            <div>Actions</div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-muted-foreground" size={24} />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No members yet</div>
          ) : (
            <div className="bg-card border border-border border-dashed rounded-md">
              {members.map((member) => (
                <div key={member.id} className="grid grid-cols-4 items-center px-5 py-2 text-muted-foreground text-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 text-white rounded-full bg-indigo-400 flex justify-center items-center">
                        N
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Member Name</div>
                        <div className="text-xs">email@example.com</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">0</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sep 27, 2025</p>
                  </div>
                  <div>Actions</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Members
