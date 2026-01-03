import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Users, Crown, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamDialog } from "@/components/dialogs/TeamDialog";
import type { TeamWithMembers } from "@shared/schema";

export default function Teams() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: teams, isLoading } = useQuery<TeamWithMembers[]>({
    queryKey: ["/api/v1/teams", { search }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="page-title">Teams</h1>
          <p className="text-muted-foreground mt-1">Manage competition teams</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-create-team">
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-card-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="input-search-teams"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams && teams.length > 0 ? (
                teams.map((team) => {
                  const initials = team.name.substring(0, 2).toUpperCase();
                  return (
                    <Card key={team.id} className="hover-elevate" data-testid={`team-card-${team.id}`}>
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                            <Users className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base line-clamp-1">{team.name}</CardTitle>
                            <CardDescription className="line-clamp-2 mt-1">
                              {team.description || "No description"}
                            </CardDescription>
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

                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            View
                          </Button>
                          <Button variant="ghost" size="icon">
                            <UserPlus className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No teams found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <TeamDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
