"use client";

import React, { useEffect, useState } from "react";
import { Search, Ban, CheckCircle, User, Trophy, Calendar } from "lucide-react";
import { GradientCard } from "@/components/HomeCards";
import getApiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api.config";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";
import NoContent from "@/components/NoContent";
import Pagination from "@/components/ui/pagination";

interface Player {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  competition?: {
    id: string;
    name: string;
    status: string;
  };
  registeredAt?: string;
}

function PlayerManagement() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [competitionFilter, setCompetitionFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [banning, setBanning] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayers();
  }, [page, competitionFilter]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (competitionFilter) {
        params.append("competitionId", competitionFilter);
      }

      const res = await getApiClient().get(
        `${API_ENDPOINTS.ADMIN.PLAYERS}?${params.toString()}`
      );

      const data = res.data?.players || res.data?.data || res.data || [];
      setPlayers(data);

      if (res.data?.pagination) {
        setTotalPages(res.data.pagination.totalPages || 1);
      } else {
        setTotalPages(1);
      }
    } catch (error: any) {
      toast.error("Failed to load players");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (userId: string, competitionId: string, isBanned: boolean) => {
    const action = isBanned ? "unban" : "ban";
    if (!window.confirm(`Are you sure you want to ${action} this player?`)) {
      return;
    }

    try {
      setBanning(userId);
      await getApiClient().patch(
        `${API_ENDPOINTS.ADMIN.BAN_PLAYER(userId)}?competitionId=${competitionId}`
      );
      toast.success(`Player ${action}ned successfully`);
      fetchPlayers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${action} player`);
    } finally {
      setBanning(null);
    }
  };

  const filteredPlayers = players.filter((player) =>
    player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Player Management</h1>
        <p className="text-slate-400">Manage players in your competitions</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 size-5" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <input
          type="text"
          placeholder="Filter by Competition ID (optional)"
          value={competitionFilter}
          onChange={(e) => setCompetitionFilter(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Players List */}
      {filteredPlayers.length === 0 ? (
        <NoContent
          title="No players found"
          description={searchTerm ? "Try a different search term" : "No players registered yet"}
        />
      ) : (
        <div className="space-y-3">
          {filteredPlayers.map((player) => (
            <GradientCard key={player.id} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <div className="size-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <User className="size-6 text-blue-400" />
                    </div>
                    {!player.isActive && (
                      <div className="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full border-2 border-slate-900" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-white">{player.username}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          player.isActive
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {player.isActive ? "Active" : "Banned"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{player.email}</p>
                    {player.competition && (
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Trophy className="size-3" />
                          {player.competition.name}
                        </div>
                        {player.registeredAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            Joined {new Date(player.registeredAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {player.competition && (
                  <button
                    onClick={() =>
                      handleToggleBan(
                        player.id,
                        player.competition!.id,
                        !player.isActive
                      )
                    }
                    disabled={banning === player.id}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50 ${
                      player.isActive
                        ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                        : "bg-green-500/20 hover:bg-green-500/30 text-green-400"
                    }`}
                  >
                    {banning === player.id ? (
                      <LoadingSpinner size="sm" />
                    ) : player.isActive ? (
                      <>
                        <Ban className="size-4" />
                        Ban
                      </>
                    ) : (
                      <>
                        <CheckCircle className="size-4" />
                        Unban
                      </>
                    )}
                  </button>
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
      />
    </div>
  );
}

export default PlayerManagement;

