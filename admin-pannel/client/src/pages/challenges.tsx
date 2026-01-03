import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Target, CheckCircle, XCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { ChallengeDialog } from "@/components/dialogs/ChallengeDialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ChallengeWithDetails } from "@shared/schema";

export default function Challenges() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [competitionFilter, setCompetitionFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<ChallengeWithDetails | undefined>();
  const { toast } = useToast();

  const { data: competitionsData } = useQuery({
    queryKey: ["/api/v1/competitions"],
  });

  // Handle both array and object responses from API
  const competitions = Array.isArray(competitionsData)
    ? competitionsData
    : competitionsData?.data || [];

  const challengeQueryOptions: Record<string, any> = {
    ...((categoryFilter && categoryFilter !== 'all' ) && { category: categoryFilter }),
    ...((difficultyFilter && difficultyFilter !== 'all' ) && { difficulty: difficultyFilter }),
    ...(search && { search }),
  };

  const queryPath = (competitionFilter == 'all') ? `/api/v1/challenges/public` : `/api/v1/competitions/${competitionFilter}/challenges`;

  const queryKey = [
    queryPath,
    challengeQueryOptions,
  ];

  const { data: challenges, isLoading } = useQuery<ChallengeWithDetails[]>({
    queryKey,
  });


  const deleteMutation = useMutation({
  mutationFn: async ({ id, competitionId }: { id: string; competitionId: string }) => {
    return apiRequest(
      "DELETE",
      `/api/v1/competitions/${competitionId}/challenges/${id}`
    );
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/v1/challenges"] });
    toast({ title: "Challenge deleted successfully" });
  },
});


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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="page-title">Challenges</h1>
          <p className="text-muted-foreground mt-1">Manage CTF challenges and flags</p>
        </div>
        <Button
          onClick={() => {
            setEditingChallenge(undefined);
            setDialogOpen(true);
          }}
          data-testid="button-create-challenge"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Challenge
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-card-border">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search challenges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="input-search-challenges"
              />
            </div>
            <Select value={competitionFilter} onValueChange={setCompetitionFilter}>
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
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]" data-testid="select-category-filter">
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
              <SelectTrigger className="w-[180px]" data-testid="select-difficulty-filter">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulty</SelectItem>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
                <SelectItem value="EXPERT">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(8)].map((_, i) => (
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
                  <TableHead>Competition</TableHead>
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
                      <TableCell className="text-muted-foreground">
                        {challenge.competition?.title || "N/A"}
                      </TableCell>
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
                                setDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deleteMutation.mutate({id: challenge.id, competitionId: challenge.competitionId})}
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
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      {'No challenges found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ChallengeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        challenge={editingChallenge}
        // defaultCompetitionId={competitionFilter !== "all" ? competitionFilter : undefined}
      />
    </div>
  );
}
