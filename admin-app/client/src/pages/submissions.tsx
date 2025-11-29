import { useState } from "react";
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
import type { Submission } from "@shared/schema";
import { format } from "date-fns";

type SubmissionWithDetails = Submission & {
  user?: { username: string };
  challenge?: { title: string };
  team?: { name: string };
};

export default function Submissions() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const submissionQueryOptions: Record<string, any>  = {
    ...((statusFilter == 'correct') && {correctOnly: true}),
    ...((statusFilter == 'incorrect') && {incorrectOnly: true})
  }

  const { data: submission, isLoading } = useQuery<any>({
    // queryKey: ["/api/v1/submissions", { search, status: statusFilter }],
    queryKey: ["/api/v1/submissions/admin",  submissionQueryOptions],
  });

  const submissions: SubmissionWithDetails[] = submission?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="page-title">Submissions</h1>
        <p className="text-muted-foreground mt-1">Track flag submission attempts and results</p>
      </div>

      <Card>
        <CardHeader className="border-b border-card-border">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search submissions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="input-search-submissions"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
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
          {isLoading ? (
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
                      No submissions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
