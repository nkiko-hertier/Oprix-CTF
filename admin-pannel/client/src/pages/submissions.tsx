import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

type Submission = {
  id: string;
  user?: { id?: string; username?: string; email?: string };
  challenge?: { id?: string; title?: string; points?: number; competitionId?: string };
  team?: { id?: string; name?: string };
  isCorrect?: boolean;
  points?: number;
  attemptNumber?: number;
  submittedAt?: string;
  competitionId?: string;
};

type PaginatedResponse<T> = {
  data: T[];
  pagination?: {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  }
};

export default function SubmissionsAdminPage() {
  // Filters & UI state (choice B: competition + challenge + status + search)
  const [competitionFilter, setCompetitionFilter] = useState<string>("all");
  const [challengeFilter, setChallengeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "correct" | "incorrect">("all");

  // client-side search (note: submissions endpoint has no server-side search)
  const [search, setSearch] = useState<string>("");

  // pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);

  // challenge search (for fetching challenges per competition)
  const [challengeSearch, setChallengeSearch] = useState<string>("");
  const [debouncedChallengeSearch, setDebouncedChallengeSearch] = useState<string>("");

  // debounce challenge search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedChallengeSearch(challengeSearch.trim()), 300);
    return () => clearTimeout(t);
  }, [challengeSearch]);

  // Fetch competitions (list)
  const { data: competitionsResp, isLoading: competitionsLoading } = useQuery({
    queryKey: ["/api/v1/competitions"],
  });

  const competitions: { id: string; title?: string; name?: string }[] = Array.isArray(competitionsResp)
    ? competitionsResp
    : competitionsResp?.data ?? [];

  // Fetch challenges for selected competition (enabled only when competition chosen)
  const { data: challengesResp, isLoading: challengesLoading } = useQuery({
    queryKey: [
      `/api/v1/competitions/${competitionFilter}/challenges`,
      {search: debouncedChallengeSearch},
    ]
  });

  const challenges: { id: string; title?: string }[] = Array.isArray(challengesResp)
    ? challengesResp
    : challengesResp?.data ?? [];

  // Build server query params (no server-side 'search' per your note)
  const submissionQueryParams = useMemo(() => {
    const params: Record<string, any> = {
      page,
      limit,
      ...(competitionFilter !== "all" && { competitionId: competitionFilter }),
      ...(challengeFilter !== "all" && { challengeId: challengeFilter }),
      ...(statusFilter === "correct" && { correctOnly: true }),
      ...(statusFilter === "incorrect" && { incorrectOnly: true }),
    };
    return params;
  }, [page, limit, competitionFilter, challengeFilter, statusFilter]);

  // Fetch submissions (paginated)
  const {
    data: submissionsResp,
    isLoading: submissionsLoading,
    isFetching: submissionsFetching,
  } = useQuery<PaginatedResponse<Submission>>({
    queryKey: ["/api/v1/submissions/admin", submissionQueryParams]
  });

  // defaults & pagination meta
  const submissionsPage = submissionsResp?.pagination?.page ?? page;
  const submissionsLimit = submissionsResp?.pagination?.limit ?? limit;
  const submissionsTotal = submissionsResp?.pagination?.total ?? 20;
  const submissionsTotalPages = submissionsResp?.pagination?.totalPages ?? (submissionsTotal ? Math.ceil(submissionsTotal / submissionsLimit) : undefined);

  

  // Reset page to 1 when filters change (so users don't stay on page N after switching)
  useEffect(() => {
    setPage(1);
  }, [competitionFilter, challengeFilter, statusFilter]);

  // Normalize data & apply client-side search (since server has no search)
  const submissions: Submission[] = submissionsResp?.data ?? [];

  const filteredSubmissions = useMemo(() => {
    if (!search) return submissions;
    const q = search.trim().toLowerCase();
    return submissions.filter((s) => {
      // search username, challenge title or team name or flag content (if present)
      const username = s.user?.username?.toLowerCase() ?? "";
      const challengeTitle = s.challenge?.title?.toLowerCase() ?? "";
      const teamName = s.team?.name?.toLowerCase() ?? "";
      // if submission includes flag (admin only) it can be matched; otherwise skip
      const flag = (s as any).flag ? String((s as any).flag).toLowerCase() : "";
      return (
        username.includes(q) ||
        challengeTitle.includes(q) ||
        teamName.includes(q) ||
        (flag && flag.includes(q))
      );
    });
  }, [submissions, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="page-title">Submissions</h1>
        <p className="text-muted-foreground mt-1">Track flag submission attempts and results</p>
      </div>

      <Card>
        <CardHeader className="border-b border-card-border">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Competition select */}
            <Select
              value={competitionFilter}
              onValueChange={(v) => {
                setCompetitionFilter(v);
                setChallengeFilter("all");
              }}
            >
              <SelectTrigger className="w-[240px]" data-testid="select-competition-filter">
                <SelectValue placeholder="Select competition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Competitions</SelectItem>
                {competitions.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title ?? c.name ?? c.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Challenge select (disabled until competition chosen) */}
            <div className="flex items-center gap-2">
              <Select
                value={challengeFilter}
                onValueChange={(v) => setChallengeFilter(v)}
                disabled={competitionFilter === "all"}
              >
                <SelectTrigger className="w-[260px]" data-testid="select-challenge-filter">
                  <SelectValue placeholder={competitionFilter === "all" ? "Select a competition first" : "Select challenge"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Challenges</SelectItem>
                  {challengesLoading ? (
                    <div className="p-3 text-sm text-muted-foreground">Loading challenges...</div>
                  ) : (
                    challenges.map((ch) => (
                      <SelectItem key={ch.id} value={ch.id}>
                        {ch.title ?? ch.id}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {/* small challenge search input (debounced) */}
              <Input
                value={challengeSearch}
                onChange={(e) => setChallengeSearch(e.target.value)}
                placeholder="Search challenges..."
                className="w-[200px] hidden"
                disabled={competitionFilter === "all"}
                data-testid="input-challenge-search"
              />
            </div>

            {/* Status filter */}
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-[160px]" data-testid="select-status-filter">
                <SelectValue placeholder="Result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="correct">Correct</SelectItem>
                <SelectItem value="incorrect">Incorrect</SelectItem>
              </SelectContent>
            </Select>

            {/* Client-side search (over current page results) */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                placeholder="Search username, challenge, team (current page)"
                data-testid="input-search-submissions"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {submissionsLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
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
                  {filteredSubmissions && filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id} className="hover-elevate" data-testid={`submission-row-${submission.id}`}>
                        <TableCell className="font-medium">
                          {submission.user?.username ?? "Unknown"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {submission.challenge?.title ?? "Unknown"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {submission.team?.name ?? "-"}
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
                          {(submission.points ?? submission.challenge?.points ?? 0) > 0
                            ? `+${submission.points ?? submission.challenge?.points ?? 0}`
                            : (submission.points ?? submission.challenge?.points ?? 0)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {submission.attemptNumber ?? "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {submission.submittedAt ? format(new Date(submission.submittedAt), "MMM d, yyyy HH:mm") : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        No submissions found{competitionFilter !== "all" ? " for this competition" : ""}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-card-border">
                <div className="text-sm text-muted-foreground">
                  {submissionsTotal !== undefined ? (
                    <>Showing page {submissionsPage} of {submissionsTotalPages ?? "?"} — {submissionsTotal} total</>
                  ) : (
                    <>Page {submissionsPage}{submissionsFetching ? " (loading...)" : ""} {submissionsTotalPages}</>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={submissionsPage <= 1}
                    className="px-3 py-1 rounded-md border"
                  >
                    Prev
                  </button>

                  <button
                    onClick={() => {
                      if (submissionsTotalPages && page >= submissionsTotalPages) return;
                      setPage((p) => p + 1);
                    }}
                    disabled={submissionsTotalPages ? page >= submissionsTotalPages : false}
                    className="px-3 py-1 rounded-md border"
                  >
                    Next
                  </button>

                  <select
                    value={limit}
                    onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                    className="ml-4 rounded-md border px-2 py-1"
                    aria-label="Items per page"
                  >
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                    <option value={50}>50 / page</option>
                    <option value={100}>100 / page</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
