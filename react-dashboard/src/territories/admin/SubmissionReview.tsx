"use client";

import React, { useEffect, useState } from "react";
import { Search, Filter, CheckCircle, XCircle, Download, Calendar } from "lucide-react";
import { GradientCard } from "@/components/HomeCards";
import getApiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api.config";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";
import NoContent from "@/components/NoContent";
import Pagination from "@/components/ui/pagination";
import type { Submission } from "@/types";

function SubmissionReview() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [competitionFilter, setCompetitionFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSubmissions();
  }, [page, competitionFilter, statusFilter]);

  const fetchSubmissions = async () => {
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
        `${API_ENDPOINTS.ADMIN.SUBMISSIONS}?${params.toString()}`
      );

      const data = res.data?.data || res.data?.submissions || res.data || [];
      
      // Filter by status if needed
      let filtered = data;
      if (statusFilter !== "all") {
        filtered = data.filter((sub: Submission) => {
          if (statusFilter === "correct") return sub.isCorrect;
          if (statusFilter === "incorrect") return !sub.isCorrect;
          return true;
        });
      }

      setSubmissions(filtered);

      if (res.data?.pagination) {
        setTotalPages(res.data.pagination.pages || 1);
      } else {
        setTotalPages(1);
      }
    } catch (error: any) {
      toast.error("Failed to load submissions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ["ID", "User ID", "Challenge ID", "Flag", "Status", "Points", "Submitted At"];
    const rows = submissions.map((sub) => [
      sub.id,
      sub.userId,
      sub.challengeId,
      sub.flag,
      sub.isCorrect ? "Correct" : "Incorrect",
      sub.pointsEarned.toString(),
      new Date(sub.submittedAt).toISOString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `submissions-${new Date().toISOString()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast.success("Submissions exported successfully");
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (!searchTerm) return true;
    return (
      sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.challengeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.flag.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
          <h1 className="text-3xl font-bold text-white mb-2">Submission Review</h1>
          <p className="text-slate-400">Review and manage all submissions</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md text-white flex items-center gap-2"
        >
          <Download className="size-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 size-5" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <input
          type="text"
          placeholder="Competition ID (optional)"
          value={competitionFilter}
          onChange={(e) => setCompetitionFilter(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="correct">Correct</option>
          <option value="incorrect">Incorrect</option>
        </select>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <NoContent
          title="No submissions found"
          description={searchTerm ? "Try a different search term" : "No submissions yet"}
        />
      ) : (
        <div className="space-y-3">
          {filteredSubmissions.map((submission) => (
            <GradientCard key={submission.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        submission.isCorrect
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {submission.isCorrect ? (
                        <CheckCircle className="size-3" />
                      ) : (
                        <XCircle className="size-3" />
                      )}
                      {submission.isCorrect ? "Correct" : "Incorrect"}
                    </span>
                    {submission.pointsEarned > 0 && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                        +{submission.pointsEarned} pts
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400 mb-1">User ID</p>
                      <p className="text-white font-mono text-xs">{submission.userId}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">Challenge ID</p>
                      <p className="text-white font-mono text-xs">{submission.challengeId}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">Flag</p>
                      <p className="text-white font-mono text-xs break-all">{submission.flag}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">Submitted</p>
                      <div className="flex items-center gap-1 text-white text-xs">
                        <Calendar className="size-3" />
                        {new Date(submission.submittedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
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

export default SubmissionReview;

