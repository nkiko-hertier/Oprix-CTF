"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, AlertTriangle, Info, Bell } from "lucide-react";
import { GradientCard } from "../HomeCards";
import getApiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api.config";
import { toast } from "sonner";
import NoContent from "../NoContent";
import LoadingSpinner from "../ui/loading-spinner";
import { formatTimeAgoOrRemaining } from "@/lib/utils";

type AnnouncementPriority = "URGENT" | "HIGH" | "NORMAL" | "LOW";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  createdAt: string;
  updatedAt: string;
}

function Announcements({ id }: { id: string }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, [id]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      // Fetch competition which should include announcements
      const res = await getApiClient().get(
        API_ENDPOINTS.COMPETITIONS.GET(id)
      );
      
      // Check if announcements are included in the response
      // If not, we'll need to add a separate endpoint or modify the backend
      const competitionData = res.data;
      
      if (competitionData.announcements) {
        // Sort by priority and date
        const sorted = [...competitionData.announcements].sort((a: Announcement, b: Announcement) => {
          const priorityOrder = { URGENT: 0, HIGH: 1, NORMAL: 2, LOW: 3 };
          const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
          if (priorityDiff !== 0) return priorityDiff;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setAnnouncements(sorted);
      } else {
        // If announcements aren't included, set empty array
        // In production, you'd want a dedicated endpoint like:
        // GET /competitions/:id/announcements
        setAnnouncements([]);
      }
    } catch (error: any) {
      toast.error("Failed to load announcements");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityIcon = (priority: AnnouncementPriority) => {
    switch (priority) {
      case "URGENT":
        return <AlertCircle className="size-5 text-red-400" />;
      case "HIGH":
        return <AlertTriangle className="size-5 text-orange-400" />;
      case "NORMAL":
        return <Info className="size-5 text-blue-400" />;
      case "LOW":
        return <Bell className="size-5 text-slate-400" />;
      default:
        return <Bell className="size-5 text-slate-400" />;
    }
  };

  const getPriorityBadgeColor = (priority: AnnouncementPriority) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "HIGH":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "NORMAL":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "LOW":
        return "bg-slate-500/20 text-slate-400 border-slate-500/50";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Bell className="size-5" />
        Announcements
      </h2>

      {announcements.length === 0 ? (
        <NoContent
          title="No announcements yet"
          description="Check back later for updates and important information"
        />
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <GradientCard
              key={announcement.id}
              className={`p-5 border-l-4 ${
                announcement.priority === "URGENT"
                  ? "border-red-500"
                  : announcement.priority === "HIGH"
                  ? "border-orange-500"
                  : announcement.priority === "NORMAL"
                  ? "border-blue-500"
                  : "border-slate-500"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getPriorityIcon(announcement.priority)}
                  <h3 className="font-semibold text-white text-lg">
                    {announcement.title}
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityBadgeColor(
                    announcement.priority
                  )}`}
                >
                  {announcement.priority}
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed mb-4">
                {announcement.content}
              </p>

              <div className="border-t border-dashed border-slate-700 pt-3">
                <p className="text-sm text-slate-400">
                  {formatTimeAgoOrRemaining(announcement.createdAt)}
                </p>
              </div>
            </GradientCard>
          ))}
        </div>
      )}
    </div>
  );
}

export default Announcements;
