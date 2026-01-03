import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Users as UsersIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { LeaderboardEntry } from "@shared/schema";

// Helper function to fetch data
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function Leaderboards() {
  const [competitionId, setCompetitionId] = useState("all");
  const [leaderboardType, setLeaderboardType] = useState<"users" | "teams">("users");
  const [limit, setLimit] = useState(50);

  // Fetch competitions
  const { data: competitionsData } = useQuery({
    queryKey: ["/api/v1/competitions"],
  });

  const competitions = Array.isArray(competitionsData)
    ? competitionsData
    : competitionsData?.data || [];

  // Compute the API URL dynamically
  const getLeaderboardUrl = () => {
    if (competitionId === "all") {
      // Global leaderboard
      return `/api/v1/leaderboard/global?limit=${limit}`;
    } else if (leaderboardType === "users") {
      // Individual leaderboard for competition
      return `/api/v1/leaderboard/competition/${competitionId}?limit=${limit}`;
    } else {
      // Team leaderboard for competition
      return `/api/v1/leaderboard/competition/${competitionId}/team?limit=${limit}`;
    }
  };

  // Fetch leaderboard data
  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: [getLeaderboardUrl()],
    keepPreviousData: true,
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-slate-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-700" />;
      default:
        return (
          <div className="w-5 h-5 flex items-center justify-center text-sm font-semibold text-muted-foreground">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="page-title">
          Leaderboards 
        </h1>
        <p className="text-muted-foreground mt-1">Top performers and rankings</p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <Select value={competitionId} onValueChange={setCompetitionId}>
          <SelectTrigger className="w-[280px]" data-testid="select-competition">
            <SelectValue placeholder="Select competition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Competitions</SelectItem>
            {competitions?.map((comp) => (
              <SelectItem key={comp.id} value={comp.id}>
                {comp.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Optional: Limit selector */}
        <Select value={limit.toString()} onValueChange={(val) => setLimit(Number(val))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Limit" />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={leaderboardType} onValueChange={setLeaderboardType}>
        <TabsList>
          <TabsTrigger value="users" data-testid="tab-users">
            <UsersIcon className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="teams" data-testid="tab-teams">
            <UsersIcon className="w-4 h-4 mr-2" />
            Teams
          </TabsTrigger>
        </TabsList>

        <TabsContent value={leaderboardType} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{leaderboardType === "users" ? "Top Users" : "Top Teams"}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : leaderboard && leaderboard.length > 0 ? (
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => {
                    const initials = entry.username.substring(0, 2).toUpperCase();
                    const rank = entry.rank ?? index + 1; // fallback rank
                    return (
                      <div
                        key={entry.id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover-elevate"
                        data-testid={`leaderboard-entry-${rank}`}
                      >
                        <div className="shrink-0">{getRankIcon(rank)}</div>
                        <Avatar className="w-12 h-12" >
                          <AvatarImage src={entry.avatarUrl} alt={entry.username} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">{entry.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.solvedCount ?? 0} challenges solved
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{entry.totalPoints ?? 0}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">No entries yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
