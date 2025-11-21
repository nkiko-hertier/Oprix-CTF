"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Medal, Users, User } from "lucide-react";
import getApiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api.config";
import { toast } from "sonner";
import type { LeaderboardEntry, TeamLeaderboardEntry } from "@/types";
import NoContent from "../NoContent";
import LoadingSpinner from "../ui/loading-spinner";
import { formatTimeAgoOrRemaining } from "@/lib/utils";

interface LeaderboardProps {
  competitionId: string;
  isTeamBased?: boolean;
}

export default function Leaderboard({ competitionId, isTeamBased = false }: LeaderboardProps) {
  const [loading, setLoading] = useState(true);
  const [individualLeaderboard, setIndividualLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [teamLeaderboard, setTeamLeaderboard] = useState<TeamLeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<{ rank: number; score: number } | null>(null);
  const [viewMode, setViewMode] = useState<"individual" | "team">(isTeamBased ? "team" : "individual");

  useEffect(() => {
    fetchLeaderboard();
    if (!isTeamBased) fetchMyRank();
  }, [competitionId, viewMode]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);

      if (viewMode === "individual") {
        const res = await getApiClient().get(API_ENDPOINTS.LEADERBOARD.COMPETITION(competitionId));
        setIndividualLeaderboard(res.data || []);
      } else {
        const res = await getApiClient().get(API_ENDPOINTS.LEADERBOARD.COMPETITION_TEAM(competitionId));
        setTeamLeaderboard(res.data || []);
      }
    } catch (error) {
      toast.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRank = async () => {
    try {
      const res = await getApiClient().get(API_ENDPOINTS.LEADERBOARD.MY_RANK(competitionId));
      setMyRank(res.data);
    } catch { }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="size-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="size-5 text-gray-300" />;
    if (rank === 3) return <Medal className="size-5 text-amber-600" />;
    return <span className="text-slate-500 font-medium">#{rank}</span>;
  };

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleString() : "—";

  if (loading) {
    return (
      <div className="pb-8 space-y-4">
        {/* Title Skeleton */}
          <div className="skeleton h-30! w-full!"></div>
          <div className="skeleton h-6 w-40!"></div>
  
        {/* Table Skeleton */}
        <div className="rounded-lg border border-white/10 overflow-hidden">
          <table className="w-full border-collapse text-left text-white/90">
            <thead className="bg-white/20">
              <tr>
                <th className="p-3"><div className="skeleton h-4 w-8"></div></th>
                <th className="p-3"><div className="skeleton h-4 w-24"></div></th>
                <th className="p-3"><div className="skeleton h-4 w-16"></div></th>
                <th className="p-3"><div className="skeleton h-4 w-16"></div></th>
                <th className="p-3"><div className="skeleton h-4 w-20"></div></th>
              </tr>
            </thead>
  
            <tbody>
              {/* 5 Skeleton Rows */}
              {[1,].map((i) => (
                <tr key={i} className="border-b border-white/10">
                  <td className="p-3">
                    <div className="skeleton h-4 w-6"></div>
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    <div className="skeleton size-7 rounded-full"></div>
                    <div className="skeleton h-4 w-28"></div>
                  </td>
                  <td className="p-3">
                    <div className="skeleton h-4 w-14"></div>
                  </td>
                  <td className="p-3">
                    <div className="skeleton h-4 w-12"></div>
                  </td>
                  <td className="p-3">
                    <div className="skeleton h-4 w-24"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  

  return (
    <div className="space-y-6 min-h-[500px]">

      {/* View Toggle */}
      {isTeamBased && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode("individual")}
            className={`px-4 py-2 rounded-md ${viewMode === "individual"
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-slate-400 hover:bg-white/20"
              }`}
          >
            <User className="size-4 inline mr-1" /> Individual
          </button>

          <button
            onClick={() => setViewMode("team")}
            className={`px-4 py-2 rounded-md ${viewMode === "team"
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-slate-400 hover:bg-white/20"
              }`}
          >
            <Users className="size-4 inline mr-1" /> Teams
          </button>
        </div>
      )}

      {/* My Rank */}
      {!isTeamBased && myRank && (
        <div className="p-4 bg-white/5 rounded-lg border border-blue-500/40">
          <p className="text-slate-400 text-sm">Your Rank</p>
          <p className="text-2xl font-bold text-white">#{myRank.rank}</p>

          <p className="text-slate-400 text-sm mt-2">Your Score</p>
          <p className="text-2xl font-bold text-blue-400">{myRank.score} pts</p>
        </div>
      )}

      {/* Table – Individual */}
      {viewMode === "individual" && (
        <>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User className="size-5" /> Individual Leaderboard
          </h3>

          {individualLeaderboard.length === 0 ? (
            <NoContent title="No rankings yet" description="Be the first to solve a challenge!" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-white/10 text-slate-300 text-sm">
                    <th className="p-3">Rank</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Solved</th>
                    <th className="p-3">Last Submission</th>
                  </tr>
                </thead>

                <tbody>
                  {individualLeaderboard.map((entry) => (
                    <tr
                      key={entry.userId}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <td className="p-3">{getRankIcon(entry.rank)}</td>

                      <td className="p-3 flex items-center gap-2">
                        {entry.avatarUrl && (
                          <img src={entry.avatarUrl} className="size-7 rounded-full" />
                        )}
                        <span>{entry.username}</span>
                      </td>

                      <td className="p-3 font-semibold">{entry.totalPoints}</td>

                      <td className="p-3">{entry.solvedCount}</td>

                      <td className="p-3 text-xs">
                        {formatTimeAgoOrRemaining(entry.lastSolveTime || "")}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </>
      )}

      {/* Table – Team */}
      {viewMode === "team" && (
        <>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="size-5" /> Team Leaderboard
          </h3>

          {teamLeaderboard.length === 0 ? (
            <NoContent
              title="No team rankings yet"
              description="Teams will appear here once they start solving challenges!"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-white/10 text-slate-300 text-sm">
                    <th className="p-3">Rank</th>
                    <th className="p-3">Team</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Solved</th>
                    <th className="p-3">Last Submission</th>
                  </tr>
                </thead>

                <tbody>
                  {teamLeaderboard.map((entry) => (
                    <tr
                      key={entry.teamId}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <td className="p-3">{getRankIcon(entry.rank)}</td>

                      <td className="p-3">
                        <p className="font-semibold">{entry.teamName}</p>
                        <p className="text-xs text-slate-400">
                          {entry.memberCount} member{entry.memberCount > 1 ? "s" : ""}
                        </p>
                      </td>

                      <td className="p-3 font-semibold">{entry.score}</td>
                      <td className="p-3">{entry.solvedChallenges}</td>
                      <td className="p-3 text-xs">{formatTimeAgoOrRemaining(entry.lastSubmission || "")}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
