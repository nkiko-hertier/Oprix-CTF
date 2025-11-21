"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Users, Target, TrendingUp, Award } from "lucide-react";
import { GradientCard } from "../HomeCards";
import getApiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api.config";
import { toast } from "sonner";
import LoadingSpinner from "../ui/loading-spinner";

interface CompetitionStatsData {
  overview: {
    totalParticipants: number;
    totalSubmissions: number;
    totalChallenges: number;
    solvedChallenges: number;
  };
  participation: {
    registered: number;
    active: number;
    completed: number;
  };
  challengeStats: Array<{
    challengeId: string;
    challengeTitle: string;
    totalAttempts: number;
    solveCount: number;
    solveRate: string;
  }>;
  topParticipants: Array<{
    userId: string;
    username: string;
    score: number;
    solvedChallenges: number;
  }>;
}

interface CompetitionStatsProps {
  competitionId: string;
}

function CompetitionStats({ competitionId }: CompetitionStatsProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CompetitionStatsData | null>(null);

  useEffect(() => {
    fetchStats();
  }, [competitionId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getApiClient().get(
        API_ENDPOINTS.ADMIN.COMPETITION_STATS(competitionId)
      );
      setStats(res.data);
    } catch (error: any) {
      toast.error("Failed to load competition statistics");
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

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No statistics available</p>
      </div>
    );
  }

  const { overview, participation, challengeStats, topParticipants } = stats;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Competition Statistics</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GradientCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Participants</p>
              <p className="text-2xl font-bold text-white">{overview.totalParticipants}</p>
            </div>
            <Users className="size-8 text-blue-400" />
          </div>
        </GradientCard>

        <GradientCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Submissions</p>
              <p className="text-2xl font-bold text-white">{overview.totalSubmissions}</p>
            </div>
            <Target className="size-8 text-green-400" />
          </div>
        </GradientCard>

        <GradientCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Challenges</p>
              <p className="text-2xl font-bold text-white">
                {overview.solvedChallenges}/{overview.totalChallenges}
              </p>
            </div>
            <Trophy className="size-8 text-yellow-400" />
          </div>
        </GradientCard>

        <GradientCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Solve Rate</p>
              <p className="text-2xl font-bold text-white">
                {overview.totalChallenges > 0
                  ? Math.round((overview.solvedChallenges / overview.totalChallenges) * 100)
                  : 0}
                %
              </p>
            </div>
            <TrendingUp className="size-8 text-purple-400" />
          </div>
        </GradientCard>
      </div>

      {/* Participation Stats */}
      <GradientCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Participation</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{participation.registered}</p>
            <p className="text-sm text-slate-400 mt-1">Registered</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">{participation.active}</p>
            <p className="text-sm text-slate-400 mt-1">Active</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">{participation.completed}</p>
            <p className="text-sm text-slate-400 mt-1">Completed</p>
          </div>
        </div>
      </GradientCard>

      {/* Challenge Statistics */}
      {challengeStats && challengeStats.length > 0 && (
        <GradientCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Challenge Performance</h3>
          <div className="space-y-3">
            {challengeStats.map((challenge) => (
              <div key={challenge.challengeId} className="p-4 bg-white/5 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{challenge.challengeTitle}</h4>
                  <span className="text-sm text-slate-400">{challenge.solveRate}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>{challenge.solveCount} solves</span>
                  <span>{challenge.totalAttempts} attempts</span>
                </div>
                <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (challenge.solveCount / Math.max(challenge.totalAttempts, 1)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GradientCard>
      )}

      {/* Top Participants */}
      {topParticipants && topParticipants.length > 0 && (
        <GradientCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="size-5" />
            Top Participants
          </h3>
          <div className="space-y-2">
            {topParticipants.slice(0, 10).map((participant, index) => (
              <div
                key={participant.userId}
                className="flex items-center justify-between p-3 bg-white/5 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{participant.username}</p>
                    <p className="text-xs text-slate-400">
                      {participant.solvedChallenges} challenges solved
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-yellow-400">{participant.score} pts</p>
                </div>
              </div>
            ))}
          </div>
        </GradientCard>
      )}
    </div>
  );
}

export default CompetitionStats;

