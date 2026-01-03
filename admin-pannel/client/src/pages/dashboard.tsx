import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, Send, UsersRound } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useState } from "react";

type DashboardResponse = {
  stats: {
    totalUsers: number;
    activeCompetitions: number;
    todaySubmissions: number;
    activeTeams: number;
    userGrowth: number;
    competitionGrowth: number;
    submissionGrowth: number;
    teamGrowth: number;
  };
  activityData: {
    date: string;
    submissions: number;
    users: number;
  }[];
  topUsers: {
    id: string;
    username: string;
    email: string;
    points: number;
    solvedChallenges: number;
    avatarUrl?: string;
  }[];
};

export default function Dashboard() {
  const [competitionFilter, setCompetitionFilter] = useState<string>("all");

  // 📌 Fetch competitions for filter dropdown
  const { data: competitionsData } = useQuery({
    queryKey: ["/api/v1/competitions"],
  });

  // Handle both array and object responses from API
  const competitions = Array.isArray(competitionsData)
    ? competitionsData
    : competitionsData?.data || [];

  
  const competitionOptions = {
    ...(competitionFilter !== "all" && { competitionId: competitionFilter }),
  }

  // 📌 Single endpoint with optional query param
  const { data, isLoading } = useQuery<DashboardResponse>({
    queryKey: ["/api/v1/dashboard/overview", competitionOptions],
  });

  const stats = data?.stats;
  const activityData = data?.activityData || [];
  const topUsers = data?.topUsers || [];

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      trend: stats?.userGrowth || 0,
      color: "text-blue-500",
      testId: "stat-total-users",
    },
    {
      title: "Active Competitions",
      value: stats?.activeCompetitions || 0,
      icon: Trophy,
      trend: stats?.competitionGrowth || 0,
      color: "text-emerald-500",
      testId: "stat-active-competitions",
    },
    {
      title: "Submissions Today",
      value: stats?.todaySubmissions || 0,
      icon: Send,
      trend: stats?.submissionGrowth || 0,
      color: "text-amber-500",
      testId: "stat-submissions-today",
    },
    {
      title: "Active Teams",
      value: stats?.activeTeams || 0,
      icon: UsersRound,
      trend: stats?.teamGrowth || 0,
      color: "text-purple-500",
      testId: "stat-active-teams",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="page-title">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome to the CTF Admin Platform</p>
        </div>

        {/* Competition Filter */}
        <Select
          value={competitionFilter}
          onValueChange={setCompetitionFilter}
        >
          <SelectTrigger className="w-[200px]" data-testid="select-competition-filter">
            <SelectValue placeholder="Competition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Competitions</SelectItem>
            {competitions?.map((comp: any) => (
              <SelectItem key={comp.id} value={comp.id}>
                {comp.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover-elevate" data-testid={stat.testId}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <>
                  <div className="text-3xl font-semibold">
                    {stat.value.toLocaleString()}
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      stat.trend >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {stat.trend >= 0 ? "+" : ""}
                    {stat.trend}% from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="submissions" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                  <Line type="monotone" dataKey="users" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Users */}
        <Card>
          <CardHeader>
            <CardTitle>Top Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : topUsers.length > 0 ? (
              <div className="space-y-3">
                {topUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-md bg-muted/50 hover-elevate"
                    data-testid={`top-user-${index}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{user.username}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{user.points}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.solvedChallenges} solved
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No users yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
