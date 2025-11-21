import { useEffect, useState } from 'react';
import getApiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { UserStats as UserStatsType, UserProfileResponse } from '@/types';
import { handleApiError } from '@/lib/error-handler';

// ⭐ Filled icons
import { 
  MdEmojiEvents,      // Trophy alternative (filled)
  MdTrackChanges,     // Target/Goal alternative
  MdTrendingUp,       // Submissions / growth
  MdGroups            // Participants / users
} from "react-icons/md";

interface UserStatsProps {
  userId?: string;
}

export function UserStats({ userId }: UserStatsProps) {
  const [stats, setStats] = useState<UserStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const endpoint = userId
          ? API_ENDPOINTS.USERS.STATS(userId)
          : API_ENDPOINTS.USERS.ME_STATS;

        const response = await getApiClient().get<UserProfileResponse>(endpoint);
        setStats(response.data.stats);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  // ----------------------------------------------------
  // ⭐ Skeleton Loader
  // ----------------------------------------------------
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-6 w-40" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-white/10 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="skeleton w-5 h-5 rounded" />
                <div className="skeleton h-4 w-24" />
              </div>
              <div className="skeleton h-7 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-400">
        No statistics available
      </div>
    );
  }

  // ----------------------------------------------------
  // ⭐ Stats Cards Configuration
  // ----------------------------------------------------
  const statsCards = [
    {
      label: 'Total Points',
      value: stats.totalPoints || 0,
      icon: MdEmojiEvents,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
    },
    {
      label: 'Challenges Solved',
      value: stats.solvedChallenges || 0,
      icon: MdTrackChanges,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      label: 'Total Submissions',
      value: stats.totalSubmissions || 0,
      icon: MdTrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      label: 'Competitions Participated',
      value: stats.participatedCompetitions || 0,
      icon: MdGroups,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Statistics</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} p-4 rounded-lg border border-white/10`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`${stat.color} w-6 h-6`} />
                <span className="text-sm text-gray-400">{stat.label}</span>
              </div>

              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserStats;
