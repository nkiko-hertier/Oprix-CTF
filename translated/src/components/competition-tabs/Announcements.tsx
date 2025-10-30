"use client"

import { cn } from "@/lib/utils"
import { Bell, FileQuestion, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import RequireAccess from "../RequireAccess"
import { announcementService } from "@/services/announcementService"
import type { Announcement } from "@/types/api"

interface AnnouncementsProps {
  activeTab: string
  competitionId: string
}

function Announcements({ activeTab, competitionId }: AnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "" })
  const [isPosting, setIsPosting] = useState(false)

  useEffect(() => {
    if (activeTab === "Announcements") {
      fetchAnnouncements()
    }
  }, [activeTab, competitionId])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await announcementService.getAnnouncements(competitionId, { limit: 50 })
      setAnnouncements(response.data)
    } catch (err: any) {
      console.error("[v0] Error fetching announcements:", err)
    } finally {
      setLoading(false)
    }
  }

  const handlePostAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      alert("Please fill in both title and content")
      return
    }

    try {
      setIsPosting(true)
      await announcementService.createAnnouncement(competitionId, newAnnouncement)
      setNewAnnouncement({ title: "", content: "" })
      fetchAnnouncements()
    } catch (err: any) {
      console.error("[v0] Error posting announcement:", err)
      alert(err.response?.data?.message || "Failed to post announcement")
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className={cn("", activeTab === "Announcements" ? "block" : "hidden")}>
      <div className="mt-3">
        <RequireAccess roles={["admin", "hoster"]}>
          <div className="rounded-md p-1 min-h-10 bg-background dark:bg-zinc-950/50 mb-3">
            <div className="px-5 py-2 text-muted-foreground text-sm">
              <div>Create Announcement</div>
            </div>
            <div className="bg-card border border-border border-dashed rounded-md p-3 space-y-2">
              <input
                type="text"
                placeholder="Announcement title..."
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                className="w-full p-2 outline-none bg-transparent border-b border-border"
              />
              <textarea
                placeholder="What's new today?"
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                className="w-full p-3 outline-none min-h-[100px] bg-transparent"
              />
            </div>
            <div>
              <button
                onClick={handlePostAnnouncement}
                disabled={isPosting}
                className="flex ml-auto mt-1 items-center text-sm gap-1 bg-indigo-500 text-white rounded-md p-1 px-3 h-fit disabled:opacity-50"
              >
                {isPosting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Posting...
                  </>
                ) : (
                  <>
                    <Bell size={15} /> Post Announcement
                  </>
                )}
              </button>
            </div>
          </div>
        </RequireAccess>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">No announcements yet</div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="rounded-md p-1 mt-2 min-h-10 bg-background dark:bg-zinc-950/50">
              <div className="flex items-center gap-2 p-2">
                <div>
                  <div className="w-8 h-8 text-white rounded-full bg-indigo-400 flex justify-center items-center">
                    <FileQuestion size={14} />
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{announcement.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border border-dashed text-muted-foreground rounded-md p-2">
                <p>{announcement.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Announcements
