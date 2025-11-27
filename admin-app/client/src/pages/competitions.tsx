import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, Target, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CompetitionDialog } from "@/components/dialogs/CompetitionDialog";
import type { CompetitionWithDetails } from "@shared/schema";
import { format } from "date-fns";

export default function Competitions() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<CompetitionWithDetails | undefined>();
  const { toast } = useToast();

  // const { data: competitions, isLoading } = useQuery<CompetitionWithDetails[]>({
  const { data: competitions, isLoading } = useQuery<any>({
    // queryKey: ["/api/v1/competitions", { status: statusFilter }],
    queryKey: ["/api/v1/competitions"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/v1/competitions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/competitions"] });
      toast({ title: "Competition deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete competition", variant: "destructive" });
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

  let filteredCompetitions: CompetitionWithDetails[] | [] = [];
  if(competitions) {
    const competitionsData: CompetitionWithDetails[] = competitions.data;

    filteredCompetitions = competitionsData.filter(comp => {
    if (statusFilter === "all") return true;
    return comp.status.toLowerCase() === statusFilter.toLowerCase();
  });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="page-title">Competitions</h1>
          <p className="text-muted-foreground mt-1">Manage CTF competitions and events</p>
        </div>
        <Button
          onClick={() => {
            setEditingCompetition(undefined);
            setDialogOpen(true);
          }}
          data-testid="button-create-competition"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Competition
        </Button>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
          <TabsTrigger value="draft" data-testid="tab-draft">Draft</TabsTrigger>
          <TabsTrigger value="active" data-testid="tab-active">Active</TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitions && filteredCompetitions.length > 0 ? (
            filteredCompetitions.map((competition) => (
              <Card key={competition.id} className="hover-elevate" data-testid={`competition-card-${competition.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-1">{competition.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1.5">
                        {competition.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0" data-testid={`button-actions-${competition.id}`}>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingCompetition(competition);
                            setDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteMutation.mutate(competition.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(competition.status)} data-testid={`badge-status-${competition.id}`}>
                      {competition.status.replace("_", " ")}
                    </Badge>
                    {competition.isTeamBased && (
                      <Badge variant="outline">Team-based</Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(competition.startTime), "MMM d, yyyy")} -{" "}
                        {format(new Date(competition.endTime), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Target className="w-4 h-4" />
                      <span>{competition.challengeCount || 0} Challenges</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{competition.registrationCount || 0} Registered</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`button-view-${competition.id}`}>
                      View Details
                    </Button>
                    <Button variant="default" size="sm" className="flex-1">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No competitions found</p>
              <Button variant="outline" className="mt-4" data-testid="button-create-first">
                <Plus className="w-4 h-4 mr-2" />
                Create your first competition
              </Button>
            </div>
          )}
        </div>
      )}

      <CompetitionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        competition={editingCompetition}
      />
    </div>
  );
}
