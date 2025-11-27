import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Megaphone } from "lucide-react";
import { AnnouncementDialog } from "@/components/dialogs/AnnouncementDialog";
import type { Announcement } from "@shared/schema";
import { format } from "date-fns";

type AnnouncementWithDetails = Announcement & {
  competition?: { title: string };
};

export default function Announcements() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: announcements, isLoading } = useQuery<AnnouncementWithDetails[]>({
    queryKey: ["/api/v1/announcements"],
  });

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="page-title">Announcements</h1>
          <p className="text-muted-foreground mt-1">Create and manage competition announcements</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-create-announcement">
          <Plus className="w-4 h-4 mr-2" />
          New Announcement
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Competition</TableHead>
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
                      <TableCell className="text-muted-foreground">
                        {announcement.competition?.title || "N/A"}
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
                        <Button variant="ghost" size="sm" data-testid={`button-edit-${announcement.id}`}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No announcements found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AnnouncementDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
