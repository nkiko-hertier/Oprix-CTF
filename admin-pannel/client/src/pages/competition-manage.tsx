import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  Users,
  Target,
  Trophy,
  Megaphone,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Crown,
  Medal,
  Award,
} from "lucide-react";
import { ChallengeDialog } from "@/components/dialogs/ChallengeDialog";
import { TeamDialog } from "@/components/dialogs/TeamDialog";
import { AnnouncementDialog } from "@/components/dialogs/AnnouncementDialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type {
  Competition,
  ChallengeWithDetails,
  TeamWithMembers,
  Submission,
  LeaderboardEntry,
  Announcement,
} from "@shared/schema";
import { format } from "date-fns";
import { AvatarImage } from "@radix-ui/react-avatar";
import { z } from "zod";
import { Certificate } from "crypto";
import CertificatesPage from "./Certificates";

type SubmissionWithDetails = Submission & {
  user?: { username: string };
  challenge?: { title: string };
  team?: { name: string };
};

type AnnouncementWithDetails = Announcement & {
  competition?: { title: string };
};

const announcementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  priority: z.enum(["NORMAL", "HIGH", "URGENT"]),
  competitionId: z.string().optional(),
  isVisible: z.boolean().default(true),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface AnnouncementWithDetails2 extends AnnouncementFormData {
  id: string;
}

export default function CompetitionManage() {
  const params = useParams();
  const competitionId = params.id as string;
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementWithDetails2 | undefined>(undefined);
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("challenges");
  const { toast } = useToast();

  const [challengeSearch, setChallengeSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [teamSearch, setTeamSearch] = useState("");
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState("all");
  const [leaderboardType, setLeaderboardType] = useState("users");

  const [challengeDialogOpen, setChallengeDialogOpen] = useState(false);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<ChallengeWithDetails | undefined>();

  const { data: competition, isLoading: competitionLoading } = useQuery<Competition>({
    queryKey: [`/api/v1/competitions/${competitionId}`],
  });

  const { data: allChallenges, isLoading: challengesLoading } = useQuery<ChallengeWithDetails[]>({
    queryKey: [`/api/v1/competitions/${competitionId}/challenges`],
    enabled: activeTab === "challenges",
  });

  interface Teams {
    data: TeamWithMembers[];
  }

  const { data: allTeams, isLoading: teamsLoading } = useQuery<Teams>({
    queryKey: ["/api/v1/teams"],
    enabled: activeTab === "teams",
  });

  interface SubmissionsResponse {
    data: SubmissionWithDetails[];
  }

  const { data: allSubmissions, isLoading: submissionsLoading } = useQuery<SubmissionsResponse>({
    queryKey: [`/api/v1/submissions/admin`, {competitionId}],
    enabled: activeTab === "submissions",
  });

  const CreateLeaderBoardPath = (competitionId: string, type: string) => {
    return type === "users"
      ? `/api/v1/leaderboard/competition/${competitionId}`
      : `/api/v1/leaderboard/competition/${competitionId}/team`;
  }

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: [CreateLeaderBoardPath(competitionId, leaderboardType)],
    enabled: activeTab === "leaderboard",
  });

  interface AnnouncementsResponse {
    data: AnnouncementWithDetails[];
  }

  const { data: allAnnouncements, isLoading: announcementsLoading } = useQuery<AnnouncementsResponse>({
    queryKey: ["/api/v1/announcements"],
    enabled: activeTab === "announcements",
  });

  const deleteChallengeMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/v1/challenges/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/challenges"] });
      toast({ title: "Challenge deleted successfully" });
    },
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "REGISTRATION_OPEN":
        return "secondary";
      case "COMPLETED":
        return "outline";
      case "DRAFT":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "TRIVIAL":
        return "text-emerald-600 dark:text-emerald-400";
      case "EASY":
        return "text-blue-600 dark:text-blue-400";
      case "MEDIUM":
        return "text-amber-600 dark:text-amber-400";
      case "HARD":
        return "text-orange-600 dark:text-orange-400";
      case "INSANE":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-slate-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-700" />;
      default:
        return <div className="w-5 h-5 flex items-center justify-center text-sm font-semibold text-muted-foreground">{rank}</div>;
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "destructive";
      case "HIGH":
        return "default";
      case "NORMAL":
        return "secondary";
      default:
        return "outline";
    }
  };

  const challenges = allChallenges?.filter((c) => {
    if (c.competitionId !== competitionId) return false;
    if (challengeSearch && !c.title.toLowerCase().includes(challengeSearch.toLowerCase())) return false;
    if (categoryFilter !== "all" && c.category !== categoryFilter) return false;
    if (difficultyFilter !== "all" && c.difficulty !== difficultyFilter) return false;
    return true;
  });

  const teams = allTeams?.data?.filter((t) => {
    if (t.competitionId !== competitionId) return false;
    if (teamSearch && !t.name.toLowerCase().includes(teamSearch.toLowerCase())) return false;
    return true;
  });

  const submissions = allSubmissions?.data?.filter((s) => {
    if (s.competitionId !== competitionId) return false;
    if (submissionStatusFilter !== "all") {
      const isCorrect = submissionStatusFilter === "correct";
      if (s.isCorrect !== isCorrect) return false;
    }
    return true;
  });

  const announcements = allAnnouncements?.data?.filter((a) => {
    return a.competitionId === competitionId;
  });

  if (competitionLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Competition not found</p>
        <Button variant="outline" className="mt-4" onClick={() => setLocation("/competitions")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Competitions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 flex-wrap">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/competitions")} data-testid="button-back">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-semibold" data-testid="page-title">{competition.title}</h1>
            <Badge variant={getStatusBadgeVariant(competition.status)} data-testid="badge-status">
              {competition.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{competition.description}</p>
          <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(competition.startTime), "MMM d, yyyy")} -{" "}
                {format(new Date(competition.endTime), "MMM d, yyyy")}
              </span>
            </div>
            {competition.isTeamBased && (
              <Badge variant="outline">Team-based</Badge>
            )}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="challenges" data-testid="tab-challenges">
            <Target className="w-4 h-4 mr-2" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="teams" data-testid="tab-teams">
            <Users className="w-4 h-4 mr-2" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="certificates" data-testid="tab-teams">
            <Users className="w-4 h-4 mr-2" />
            Certificate
          </TabsTrigger>
          <TabsTrigger value="submissions" data-testid="tab-submissions">
            <CheckCircle className="w-4 h-4 mr-2" />
            Submissions
          </TabsTrigger>
          <TabsTrigger value="leaderboard" data-testid="tab-leaderboard">
            <Trophy className="w-4 h-4 mr-2" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="announcements" data-testid="tab-announcements">
            <Megaphone className="w-4 h-4 mr-2" />
            Announcements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="mt-6">
          <CertificatesPage  />
        </TabsContent>

        <TabsContent value="challenges" className="mt-6">
          <Card>
            <CardHeader className="border-b border-card-border">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4 flex-wrap flex-1">
                  <div className="relative min-w-[200px] max-w-md flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search challenges..."
                      value={challengeSearch}
                      onChange={(e) => setChallengeSearch(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-challenges"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[150px]" data-testid="select-category">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Web">Web</SelectItem>
                      <SelectItem value="Crypto">Crypto</SelectItem>
                      <SelectItem value="Pwn">Pwn</SelectItem>
                      <SelectItem value="Reverse">Reverse</SelectItem>
                      <SelectItem value="Forensics">Forensics</SelectItem>
                      <SelectItem value="Misc">Misc</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="w-[150px]" data-testid="select-difficulty">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulty</SelectItem>
                      <SelectItem value="TRIVIAL">Trivial</SelectItem>
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HARD">Hard</SelectItem>
                      <SelectItem value="INSANE">Insane</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => {
                    setEditingChallenge(undefined);
                    setChallengeDialogOpen(true);
                  }}
                  data-testid="button-add-challenge"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Challenge
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {challengesLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Challenge</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Solves</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {challenges && challenges.length > 0 ? (
                      challenges.map((challenge) => (
                        <TableRow key={challenge.id} className="hover-elevate" data-testid={`challenge-row-${challenge.id}`}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-muted-foreground shrink-0" />
                              <span className="font-medium">{challenge.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{challenge.category || "Uncategorized"}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                              {challenge.difficulty}
                            </span>
                          </TableCell>
                          <TableCell className="font-semibold">{challenge.points}</TableCell>
                          <TableCell className="text-muted-foreground">{challenge.solveCount}</TableCell>
                          <TableCell>
                            {challenge.isActive ? (
                              <Badge variant="default" className="gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <XCircle className="w-3 h-3" />
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" data-testid={`button-actions-${challenge.id}`}>
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingChallenge(challenge);
                                    setChallengeDialogOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => deleteChallengeMutation.mutate(challenge.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                          No challenges found for this competition
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <Card>
            <CardHeader className="border-b border-card-border">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="relative min-w-[200px] max-w-md flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search teams..."
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-teams"
                  />
                </div>
                <Button onClick={() => setTeamDialogOpen(true)} data-testid="button-add-team">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {teamsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-48" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teams && teams.length > 0 ? (
                    teams.map((team) => (
                      <Card key={team.id} className="hover-elevate" data-testid={`team-card-${team.id}`}>
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                              <Users className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base line-clamp-1">{team.name}</CardTitle>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {team.description || "No description"}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Badge variant={team.isActive ? "default" : "secondary"}>
                              {team.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {team.memberCount || 0}/{team.maxSize} members
                            </span>
                          </div>
                          {team.captain && (
                            <div className="flex items-center gap-2">
                              <Crown className="w-4 h-4 text-amber-500" />
                              <span className="text-sm text-muted-foreground">
                                Captain: {team.captain.username}
                              </span>
                            </div>
                          )}
                          {team.inviteCode && (
                            <div className="p-2 bg-muted rounded-md">
                              <p className="text-xs text-muted-foreground mb-1">Invite Code</p>
                              <code className="text-sm font-mono">{team.inviteCode}</code>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      No teams found for this competition
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="mt-6">
          <Card>
            <CardHeader className="border-b border-card-border">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="relative min-w-[200px] max-w-md flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search submissions..."
                    className="pl-10"
                    data-testid="input-search-submissions"
                  />
                </div>
                <Select value={submissionStatusFilter} onValueChange={setSubmissionStatusFilter}>
                  <SelectTrigger className="w-[180px]" data-testid="select-status">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="correct">Correct</SelectItem>
                    <SelectItem value="incorrect">Incorrect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {submissionsLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Challenge</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Attempt #</TableHead>
                      <TableHead>Submitted At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions && submissions.length > 0 ? (
                      submissions.map((submission) => (
                        <TableRow key={submission.id} className="hover-elevate" data-testid={`submission-row-${submission.id}`}>
                          <TableCell className="font-medium">
                            {submission.user?.username || "Unknown"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {submission.challenge?.title || "Unknown"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {submission.team?.name || "-"}
                          </TableCell>
                          <TableCell>
                            {submission.isCorrect ? (
                              <Badge variant="default" className="gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Correct
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <XCircle className="w-3 h-3" />
                                Incorrect
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-semibold">
                            {submission.points > 0 ? `+${submission.points}` : submission.points}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {submission.attemptNumber}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(submission.submittedAt), "MMM d, yyyy HH:mm")}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                          No submissions found for this competition
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <div className="space-y-4">
            <Tabs value={leaderboardType} onValueChange={setLeaderboardType}>
              <TabsList>
                <TabsTrigger value="users" data-testid="tab-leaderboard-users">
                  <Users className="w-4 h-4 mr-2" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="teams" data-testid="tab-leaderboard-teams">
                  <Users className="w-4 h-4 mr-2" />
                  Teams
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>
                  {leaderboardType === "users" ? "Top Users" : "Top Teams"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboardLoading ? (
                  <div className="space-y-3">
                    {[...Array(10)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {leaderboard && leaderboard.length > 0 ? (
                      leaderboard.map((entry) => {
                        let initials = "N/A";
                        if (entry.username){
                          initials = entry.username.substring(0, 2).toUpperCase();
                        }
                        return (
                          <div
                            key={entry.id}
                            className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover-elevate"
                            data-testid={`leaderboard-entry-${entry.rank}`}
                          >
                            <div className="shrink-0">
                              {getRankIcon(entry.rank)}
                            </div>
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={entry.avatarUrl || ""} alt={entry.username} />  
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground">{entry.username}</p>
                              <p className="text-sm text-muted-foreground">
                                {entry.solvedCount} challenges solved
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">{entry.totalPoints}</p>
                              <p className="text-xs text-muted-foreground">points</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        No entries yet
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          <Card>
            <CardHeader className="border-b border-card-border">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <CardTitle>Competition Announcements</CardTitle>
                <Button onClick={() => setAnnouncementDialogOpen(true)} data-testid="button-add-announcement">
                  <Plus className="w-4 h-4 mr-2" />
                  New Announcement
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {announcementsLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {announcements && announcements.length > 0 ? (
                      announcements.map((announcement) => (
                        <TableRow key={announcement.id} className="hover-elevate" data-testid={`announcement-row-${announcement.id}`}>
                          <TableCell>
                            <div className="flex items-start gap-2">
                              <Megaphone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                              <div>
                                <p className="font-medium">{announcement.title}</p>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                  {announcement.content}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getPriorityBadgeVariant(announcement.priority)}>
                              {announcement.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={announcement.isVisible ? "default" : "secondary"}>
                              {announcement.isVisible ? "Visible" : "Hidden"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(announcement.createdAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                            onClick={()=> {
                            setEditingAnnouncement(announcement);
                            setAnnouncementDialogOpen(true);
                          }}
                            variant="ghost" 
                            size="sm" 
                            data-testid={`button-edit-${announcement.id}`}>
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          No announcements for this competition
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ChallengeDialog
        open={challengeDialogOpen}
        onOpenChange={setChallengeDialogOpen}
        challenge={editingChallenge}
        defaultCompetitionId={competitionId}
      />
      {/*
      <TeamDialog
        open={teamDialogOpen}
        onOpenChange={setTeamDialogOpen}
        defaultCompetitionId={competitionId}
      />
*/}
      <AnnouncementDialog
        open={announcementDialogOpen}
        onOpenChange={setAnnouncementDialogOpen}
        announcement={editingAnnouncement}
        defaultCompetitionId={competitionId}
      /> 
    </div>
  );
}
