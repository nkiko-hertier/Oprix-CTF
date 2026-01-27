"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, AlertTriangle, Info, Bell } from "lucide-react";
import { GradientCard } from "../HomeCards";
import getApiClient from "@/lib/api-client";
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
  isVisible: boolean;
}

// Priority mappings
const PRIORITY_CONFIG: Record<
  AnnouncementPriority,
  { icon: React.ReactNode; borderColor: string; badgeColor: string }
> = {
  URGENT: {
    icon: <AlertCircle className="size-5 text-red-400" />,
    borderColor: "border-red-500",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/50",
  },
  HIGH: {
    icon: <AlertTriangle className="size-5 text-orange-400" />,
    borderColor: "border-orange-500",
    badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/50",
  },
  NORMAL: {
    icon: <Info className="size-5 text-blue-400" />,
    borderColor: "border-blue-500",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  },
  LOW: {
    icon: <Bell className="size-5 text-slate-400" />,
    borderColor: "border-slate-500",
    badgeColor: "bg-slate-500/20 text-slate-400 border-slate-500/50",
  },
};

function Announcements({ id }: { id: string }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // prevent state update if component unmounts
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const res = await getApiClient().get<{
          data: Announcement[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        }>(`/announcements?competitionId=${id}`);

        // Filter visible announcements
        const visibleAnnouncements = res.data.data.filter(a => a.isVisible);

        // Sort by priority and date
        const sorted = visibleAnnouncements.sort((a, b) => {
          const priorityOrder = { URGENT: 0, HIGH: 1, NORMAL: 2, LOW: 3 };
          const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
          if (priorityDiff !== 0) return priorityDiff;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setAnnouncements(sorted);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load announcements");
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };


    fetchAnnouncements();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!announcements.length) {
    return (
      <NoContent
        title="No announcements yet"
        description="Check back later for updates and important information"
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Bell className="size-5" />
        Announcements
      </h2>

      <div className="space-y-3">
        {announcements.map((announcement) => {
          const { icon, borderColor, badgeColor } = PRIORITY_CONFIG[announcement.priority];

          return (
            <div
              key={announcement.id}
              className={`p-5 border-l-4 rounded-md bg-[#1a2435] ${borderColor}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {icon}
                  <h3 className="font-semibold text-white text-lg">
                    {announcement.title}
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${badgeColor}`}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Announcements;
