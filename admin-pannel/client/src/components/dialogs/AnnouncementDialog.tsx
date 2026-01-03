import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Checkbox,
  // CheckboxField,
} from "@/components/ui/checkbox";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import e from "express";

const announcementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  priority: z.enum(["NORMAL", "HIGH", "URGENT"]),
  competitionId: z.string().optional(),
  isVisible: z.boolean().default(true),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface AnnouncementWithDetails extends AnnouncementFormData {
  id: string;
}

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement?: AnnouncementWithDetails | undefined;
  defaultCompetitionId?: string;
}

export function AnnouncementDialog({
  open,
  onOpenChange,
  announcement,
  defaultCompetitionId
}: AnnouncementDialogProps) {

  const isEditing = Boolean(announcement);

  const { toast } = useToast();

  const { data: competitionsData } = useQuery({
    queryKey: ["/api/v1/competitions"],
  });

  // Handle both array and object responses from API
  const competitions = Array.isArray(competitionsData)
    ? competitionsData
    : competitionsData?.data || [];

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
      priority: "NORMAL",
      competitionId: defaultCompetitionId || "",
      isVisible: true,
    },
  });

  useEffect(() => {
    if (announcement) {
      form.reset({
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority,
        competitionId: announcement.competitionId || "",
        isVisible: announcement.isVisible,
      });
    } else {
      form.reset(
        {
          title: "",
          content: "",
          priority: "NORMAL",
          competitionId: defaultCompetitionId || "",
          isVisible: true,
        }
      );
    }
  }, [announcement, form]);


  const createMutation = useMutation({
    mutationFn: async (data: AnnouncementFormData) => {
      const url = isEditing ? `/api/v1/announcements/${announcement?.id}` : "/api/v1/announcements";
      const method = isEditing ? "PUT" : "POST";

      return apiRequest(method, url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/announcements"] });
      toast({ title: `Announcement ${isEditing ? 'updated' : 'created'} successfully` });
      form.reset();
      onOpenChange(false);
    },
  });

  const onSubmit = async (data: AnnouncementFormData) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="dialog-announcement">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Create'} Announcement</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update' : 'Post a new'} announcement to users
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Announcement title"
                      {...field}
                      data-testid="input-announcement-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Announcement content (supports markdown)"
                      className="min-h-24"
                      {...field}
                      data-testid="textarea-announcement-content"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger data-testid="select-priority">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NORMAL">Normal</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {
              (defaultCompetitionId || isEditing) ? null :
                <FormField
                  control={form.control}
                  name="competitionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competition (Optional)</FormLabel>
                      <Select value={field.value || ""} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger data-testid="select-competition">
                            <SelectValue placeholder="Select competition or leave blank for all" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* <SelectItem value="">All Users</SelectItem> */}
                          {competitions?.map((comp) => (
                            <SelectItem key={comp.id} value={comp.id}>
                              {comp.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            }

            <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Visible</FormLabel>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="checkbox-visible"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                data-testid="button-submit"
              >
                {createMutation.isPending ? "Posting..." : "Post Announcement"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
