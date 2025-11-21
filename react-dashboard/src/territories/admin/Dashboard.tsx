"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Users, FileText, Calendar, TrendingUp, Award } from "lucide-react";
import { GradientCard } from "@/components/HomeCards";
import getApiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api.config";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Link } from "react-router-dom";
import type { Competition } from "@/types";

interface DashboardData {
  overview: {
    totalCompetitions: number;
    activeCompetitions: number;
    totalPlayers: number;
    totalSubmissions: number;
  };
  recentCompetitions: Competition[];
}

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getApiClient().get(API_ENDPOINTS.ADMIN.DASHBOARD);
      setDashboardData(res.data);
    } catch (error: any) {
      toast.error("Failed to load dashboard data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No data available</p>
      </div>
    );
  }

  const { overview, recentCompetitions } = dashboardData;

  const statCards = [
    {
      title: "Total Competitions",
      value: overview.totalCompetitions,
      icon: <Trophy className="size-6" />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Active Competitions",
      value: overview.activeCompetitions,
      icon: <TrendingUp className="size-6" />,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Players",
      value: overview.totalPlayers,
      icon: <Users className="size-6" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Submissions",
      value: overview.totalSubmissions,
      icon: <FileText className="size-6" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/20 text-green-400";
      case "REGISTRATION_OPEN":
        return "bg-blue-500/20 text-blue-400";
      case "PAUSED":
        return "bg-yellow-500/20 text-yellow-400";
      case "COMPLETED":
        return "bg-slate-500/20 text-slate-400";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">Overview of your competitions and platform activity</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <GradientCard key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </GradientCard>
        ))}
      </div>

      {/* Recent Competitions */}
      <GradientCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Calendar className="size-5" />
            Recent Competitions
          </h2>
          <Link
            to="/dashboard/competitions"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            View All →
          </Link>
        </div>

        {recentCompetitions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No competitions yet</p>
            <Link
              to="/dashboard/competitions"
              className="text-blue-400 hover:text-blue-300 mt-2 inline-block"
            >
              Create your first competition
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentCompetitions.map((competition) => (
              <Link
                key={competition.id}
                to={`/dashboard/competitions/${competition.id}`}
                className="block p-4 bg-white/5 rounded-md hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{competition.name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          competition.status
                        )}`}
                      >
                        {competition.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Users className="size-4" />
                        {competition._count?.registrations || 0} participants
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="size-4" />
                        {competition._count?.challenges || 0} challenges
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        {new Date(competition.startTime).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </GradientCard>
    </div>
  );
}

export default Dashboard;

