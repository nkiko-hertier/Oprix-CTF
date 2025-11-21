"use client";

import React, { useEffect, useState } from "react";
import { Search, Edit, Trash2, Play, Pause, CheckCircle, XCircle, Plus, BarChart3 } from "lucide-react";
import { GradientCard } from "@/components/HomeCards";
import getApiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api.config";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";
import NoContent from "@/components/NoContent";
import Pagination from "@/components/ui/pagination";
import CompetitionStats from "@/components/admin/CompetitionStats";
import { Link } from "react-router-dom";
import type { Competition } from "@/types";

function CompetitionManagement() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [viewingStats, setViewingStats] = useState<string | null>(null);

  useEffect(() => {
    fetchCompetitions();
  }, [page]);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const res = await getApiClient().get(
        `${API_ENDPOINTS.COMPETITIONS.MY}?page=${page}&limit=10`
      );
      
      const data = res.data?.data || res.data || [];
      setCompetitions(data);
      
      if (res.data?.pagination) {
        setTotalPages(res.data.pagination.pages || 1);
      } else {
        setTotalPages(1);
      }
    } catch (error: any) {
      toast.error("Failed to load competitions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (competitionId: string, newStatus: string) => {
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      return;
    }

    try {
      setUpdatingStatus(competitionId);
      await getApiClient().patch(
        API_ENDPOINTS.COMPETITIONS.UPDATE_STATUS(competitionId),
        { status: newStatus }
      );
      toast.success("Status updated successfully");
      fetchCompetitions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async (competitionId: string, competitionName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${competitionName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await getApiClient().delete(API_ENDPOINTS.COMPETITIONS.DELETE(competitionId));
      toast.success("Competition deleted successfully");
      fetchCompetitions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete competition");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "REGISTRATION_OPEN":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "PAUSED":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "COMPLETED":
        return "bg-slate-500/20 text-slate-400 border-slate-500/50";
      case "DRAFT":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  const filteredCompetitions = competitions.filter((comp) =>
    comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.description.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Competition Management</h1>
          <p className="text-slate-400">Manage your competitions</p>
        </div>
        <Link
          to="/dashboard/competitions/new"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white flex items-center gap-2"
        >
          <Plus className="size-4" />
          Create Competition
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 size-5" />
        <input
          type="text"
          placeholder="Search competitions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Competitions List */}
      {filteredCompetitions.length === 0 ? (
        <NoContent
          title="No competitions found"
          description={searchTerm ? "Try a different search term" : "Create your first competition to get started"}
        />
      ) : (
        <div className="space-y-3">
          {filteredCompetitions.map((competition) => (
            <GradientCard key={competition.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{competition.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        competition.status
                      )}`}
                    >
                      {competition.status}
                    </span>
                  </div>
                  <p className="text-slate-400 mb-3">{competition.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>
                      Starts: {new Date(competition.startTime).toLocaleString()}
                    </span>
                    <span>
                      Ends: {new Date(competition.endTime).toLocaleString()}
                    </span>
                    <span>{competition._count?.registrations || 0} participants</span>
                    <span>{competition._count?.challenges || 0} challenges</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {/* Status Update Buttons */}
                  {competition.status === "DRAFT" && (
                    <button
                      onClick={() => handleStatusUpdate(competition.id, "REGISTRATION_OPEN")}
                      disabled={updatingStatus === competition.id}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-md text-blue-400 disabled:opacity-50"
                      title="Open Registration"
                    >
                      <Play className="size-4" />
                    </button>
                  )}
                  {competition.status === "REGISTRATION_OPEN" && (
                    <button
                      onClick={() => handleStatusUpdate(competition.id, "ACTIVE")}
                      disabled={updatingStatus === competition.id}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-md text-green-400 disabled:opacity-50"
                      title="Start Competition"
                    >
                      <CheckCircle className="size-4" />
                    </button>
                  )}
                  {competition.status === "ACTIVE" && (
                    <button
                      onClick={() => handleStatusUpdate(competition.id, "PAUSED")}
                      disabled={updatingStatus === competition.id}
                      className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-md text-yellow-400 disabled:opacity-50"
                      title="Pause Competition"
                    >
                      <Pause className="size-4" />
                    </button>
                  )}
                  {competition.status === "PAUSED" && (
                    <button
                      onClick={() => handleStatusUpdate(competition.id, "ACTIVE")}
                      disabled={updatingStatus === competition.id}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-md text-green-400 disabled:opacity-50"
                      title="Resume Competition"
                    >
                      <Play className="size-4" />
                    </button>
                  )}

                  {/* Edit Button */}
                  <Link
                    to={`/dashboard/competitions/${competition.id}/edit`}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-md text-blue-400"
                    title="Edit Competition"
                  >
                    <Edit className="size-4" />
                  </Link>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(competition.id, competition.name)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-md text-red-400"
                    title="Delete Competition"
                  >
                    <Trash2 className="size-4" />
                  </button>

                  {/* View Stats */}
                  <button
                    onClick={() => setViewingStats(viewingStats === competition.id ? null : competition.id)}
                    className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-md text-green-400 text-sm flex items-center gap-1"
                  >
                    <BarChart3 className="size-4" />
                    Stats
                  </button>

                  {/* View Challenges */}
                  <Link
                    to={`/dashboard/challenges/${competition.id}`}
                    className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-md text-purple-400 text-sm"
                  >
                    Manage Challenges
                  </Link>
                </div>
              </div>
              
              {/* Competition Stats */}
              {viewingStats === competition.id && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <CompetitionStats competitionId={competition.id} />
                </div>
              )}
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

export default CompetitionManagement;

