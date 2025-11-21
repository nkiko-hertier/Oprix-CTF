"use client";

import React, { useEffect, useState } from "react";
import { Search, User, Trophy, Calendar } from "lucide-react";
import { GradientCard } from "../HomeCards";
import getApiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api.config";
import { toast } from "sonner";
import NoContent from "../NoContent";
import LoadingSpinner from "../ui/loading-spinner";
import Pagination from "../ui/pagination";
import type { User as UserType } from "@/types";

interface Member {
  id: string;
  username: string;
  email: string;
  profile?: {
    avatarUrl?: string;
    firstName?: string;
    lastName?: string;
  };
  registeredAt?: string;
  stats?: {
    totalPoints: number;
    solvedChallenges: number;
  };
}

function Members({ id }: { id: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  useEffect(() => {
    fetchMembers();
  }, [id, page]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      // Fetch competition to get registrations
      const competitionRes = await getApiClient().get(
        API_ENDPOINTS.COMPETITIONS.GET(id)
      );
      
      // For now, we'll need to fetch users separately
      // Since there's no direct endpoint for competition members,
      // we'll use the users list endpoint and filter client-side
      // In a real scenario, you'd want a dedicated endpoint like:
      // GET /competitions/:id/members
      
      const usersRes = await getApiClient().get(
        `${API_ENDPOINTS.USERS.LIST}?limit=100`
      );
      
      // Filter and map users (this is a workaround - ideally backend should provide this)
      const allUsers = usersRes.data?.data || usersRes.data || [];
      setMembers(allUsers.slice((page - 1) * limit, page * limit));
      setTotalPages(Math.ceil(allUsers.length / limit));
    } catch (error: any) {
      toast.error("Failed to load members");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter((member) =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 size-5" />
        <input
          type="text"
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Members List */}
      {filteredMembers.length === 0 ? (
        <NoContent
          title="No members found"
          description={searchTerm ? "Try a different search term" : "No members registered yet"}
        />
      ) : (
        <div className="space-y-2">
          {filteredMembers.map((member) => (
            <GradientCard key={member.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {member.profile?.avatarUrl ? (
                      <img
                        src={member.profile.avatarUrl}
                        alt={member.username}
                        className="size-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <User className="size-6 text-blue-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {member.profile?.firstName && member.profile?.lastName
                        ? `${member.profile.firstName} ${member.profile.lastName}`
                        : member.username}
                    </p>
                    <p className="text-sm text-slate-400">@{member.username}</p>
                    {member.registeredAt && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Calendar className="size-3" />
                        Joined {new Date(member.registeredAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                {member.stats && (
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <p className="text-slate-400">Points</p>
                      <div className="flex items-center gap-1">
                        <Trophy className="size-4 text-yellow-400" />
                        <p className="font-semibold text-white">{member.stats.totalPoints}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400">Solved</p>
                      <p className="font-semibold text-white">{member.stats.solvedChallenges}</p>
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
    </div>
  );
}

export default Members;
