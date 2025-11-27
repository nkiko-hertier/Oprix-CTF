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
  BarChart,
  Bar,
} from "recharts";

type DashboardStats = {
  totalUsers: number;
  activeCompetitions: number;
  todaySubmissions: number;
  activeTeams: number;
  userGrowth: number;
  competitionGrowth: number;
  submissionGrowth: number;
  teamGrowth: number;
};

type ActivityData = {
  date: string;
  submissions: number;
  users: number;
};

type TopUser = {
  id: string;
  username: string;
  email: string;
  points: number;
  solvedChallenges: number;
};

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/v1/competitions"],
  });

  const { data: activityData, isLoading: activityLoading } = useQuery<ActivityData[]>({
    queryKey: ["/api/v1/users"],
  });

  const { data: topUsers, isLoading: topUsersLoading } = useQuery<TopUser[]>({
    queryKey: ["/api/v1/users/me/stats"],
  });

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      trend: stats?.userGrowth || 0,
      color: "text-blue-500",
      testId: "stat-total-users"
    },
    {
      title: "Active Competitions",
      value: stats?.activeCompetitions || 0,
      icon: Trophy,
      trend: stats?.competitionGrowth || 0,
      color: "text-emerald-500",
      testId: "stat-active-competitions"
    },
    {
      title: "Submissions Today",
      value: stats?.todaySubmissions || 0,
      icon: Send,
      trend: stats?.submissionGrowth || 0,
      color: "text-amber-500",
      testId: "stat-submissions-today"
    },
    {
      title: "Active Teams",
      value: stats?.activeTeams || 0,
      icon: UsersRound,
      trend: stats?.teamGrowth || 0,
      color: "text-purple-500",
      testId: "stat-active-teams"
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground" data-testid="page-title">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to the CTF Admin Platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover-elevate" data-testid={stat.testId}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <>
                  <div className="text-3xl font-semibold">{stat.value.toLocaleString()}</div>
                  <p className={`text-xs mt-1 ${stat.trend >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                    {stat.trend >= 0 ? "+" : ""}{stat.trend}% from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs text-muted-foreground"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis 
                    className="text-xs text-muted-foreground"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="submissions" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                    name="Submissions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    name="New Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Users</CardTitle>
          </CardHeader>
          <CardContent>
            {topUsersLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {topUsers && topUsers.length > 0 ? (
                  topUsers.map((user, index) => (
                    <div key={user.id} className="flex items-center gap-3 p-3 rounded-md bg-muted/50 hover-elevate" data-testid={`top-user-${index}`}>
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user.username}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{user.points}</p>
                        <p className="text-xs text-muted-foreground">{user.solvedChallenges} solved</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No users yet
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
