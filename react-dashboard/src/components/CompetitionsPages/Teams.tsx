"use client";

import React, { useEffect, useState } from "react";
import { Search, Users, UserPlus, Trophy, Crown } from "lucide-react";
import { GradientCard } from "../HomeCards";
import getApiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api.config";
import { toast } from "sonner";
import NoContent from "../NoContent";
import LoadingSpinner from "../ui/loading-spinner";
import Pagination from "../ui/pagination";
import type { Team } from "@/types";

interface TeamWithStats extends Team {
  stats?: {
    totalPoints: number;
    memberCount: number;
    challengesSolved: number;
  };
  rank?: number;
}

function Teams({ id }: { id: string }) {
  const [teams, setTeams] = useState<TeamWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const limit = 20;

  useEffect(() => {
    fetchTeams();
  }, [id, page]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        competitionId: id,
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await getApiClient().get(
        `${API_ENDPOINTS.TEAMS.LIST}?${params.toString()}`
      );

      const teamsData = res.data?.data || res.data || [];
      setTeams(teamsData);
      
      // Calculate total pages if pagination info is available
      if (res.data?.pagination) {
        setTotalPages(res.data.pagination.pages || 1);
      } else {
        setTotalPages(1);
      }

      // Fetch stats for each team
      const teamsWithStats = await Promise.all(
        teamsData.map(async (team: TeamWithStats) => {
          try {
            const statsRes = await getApiClient().get(
              API_ENDPOINTS.TEAMS.STATS(team.id)
            );
            return { ...team, stats: statsRes.data };
          } catch {
            return team;
          }
        })
      );
      setTeams(teamsWithStats);
    } catch (error: any) {
      toast.error("Failed to load teams");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!inviteCode.trim()) {
      toast.error("Please enter an invite code");
      return;
    }

    try {
      await getApiClient().post(API_ENDPOINTS.TEAMS.JOIN, {
        inviteCode: inviteCode.trim(),
      });
      toast.success("Successfully joined team!");
      setShowJoinModal(false);
      setInviteCode("");
      fetchTeams();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to join team");
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Teams</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm flex items-center gap-2"
          >
            <UserPlus className="size-4" />
            Join Team
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md text-white text-sm flex items-center gap-2"
          >
            <Users className="size-4" />
            Create Team
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 size-5" />
        <input
          type="text"
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Teams List */}
      {filteredTeams.length === 0 ? (
        <NoContent
          title="No teams found"
          description={searchTerm ? "Try a different search term" : "No teams created yet. Be the first to create one!"}
        />
      ) : (
        <div className="space-y-2">
          {filteredTeams.map((team, _) => (
            <GradientCard key={team.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <div className="size-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Users className="size-6 text-purple-400" />
                    </div>
                    {team.rank && team.rank <= 3 && (
                      <div className="absolute -top-1 -right-1">
                        <Trophy className="size-5 text-yellow-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{team.name}</p>
                      {team.rank && (
                        <span className="text-xs text-slate-400">#{team.rank}</span>
                      )}
                    </div>
                    {team.description && (
                      <p className="text-sm text-slate-400 mt-1">{team.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Users className="size-3" />
                        {team.members?.length || 0}/{team.maxSize} members
                      </div>
                      {team.captain && (
                        <div className="flex items-center gap-1">
                          <Crown className="size-3" />
                          {team.captain.username}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {team.stats && (
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <p className="text-slate-400">Points</p>
                      <div className="flex items-center gap-1">
                        <Trophy className="size-4 text-yellow-400" />
                        <p className="font-semibold text-white">{team.stats.totalPoints}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400">Solved</p>
                      <p className="font-semibold text-white">{team.stats.challengesSolved}</p>
                    </div>
                  </div>
                )}
              </div>
            </GradientCard>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="mt-6"
      />

      {/* Join Team Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <GradientCard className="p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Join Team</h3>
            <input
              type="text"
              placeholder="Enter invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setInviteCode("");
                }}
                className="px-4 py-2 bg-white/10 rounded-md text-white hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinTeam}
                className="px-4 py-2 bg-blue-500 rounded-md text-white hover:bg-blue-600"
              >
                Join
              </button>
            </div>
          </GradientCard>
        </div>
      )}

      {/* Create Team Modal - Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <GradientCard className="p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Create Team</h3>
            <p className="text-slate-400 mb-4">
              Team creation form will be implemented here. For now, use the API directly.
            </p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-blue-500 rounded-md text-white hover:bg-blue-600"
            >
              Close
            </button>
          </GradientCard>
        </div>
      )}
    </div>
  );
}

export default Teams;
