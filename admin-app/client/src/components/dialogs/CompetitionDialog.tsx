import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
  FormDescription,
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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CompetitionWithDetails } from "@shared/schema";

const competitionSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),

  // Local datetime format from the browser: "2025-07-01T00:00"
  startTime: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Invalid start date",
  }),
  endTime: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Invalid end date",
  }),

  type: z.enum(["JEOPARDY", "ATTACK_DEFENSE"]),
  isTeamBased: z.boolean(),
  maxTeamSize: z.number().min(1),
  maxParticipants: z.number().min(1),
  requireApproval: z.boolean(),
  isPublic: z.boolean(),

  allowedCategories: z.array(
    z.enum(["WEB", "CRYPTO", "PWN", "FORENSICS", "REVERSE"])
  ),

  metadata: z.object({
    difficulty: z.string().min(3),
    prizes: z.string().min(3),
  }),
});


type CompetitionFormData = z.infer<typeof competitionSchema>;

interface CompetitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  competition?: CompetitionWithDetails;
}

export function CompetitionDialog({ open, onOpenChange, competition }: CompetitionDialogProps) {
  const { toast } = useToast();
  const isEdit = !!competition;

  const form = useForm<CompetitionFormData>({
    resolver: zodResolver(competitionSchema),
    defaultValues: competition
      ? {
        name: competition.name,
        description: competition.description,

        // Convert ISO → local datetime for browser input
        startTime: new Date(competition.startTime).toISOString().slice(0, 16),
        endTime: new Date(competition.endTime).toISOString().slice(0, 16),

        type: competition.type,
        isTeamBased: competition.isTeamBased ?? false,
        maxTeamSize: competition.maxTeamSize ?? 4,            // 👈 FIX
        maxParticipants: competition.maxParticipants ?? 100,  // 👈 FIX
        requireApproval: competition.requireApproval ?? false, // 👈 FIX
        isPublic: competition.isPublic ?? true,

        allowedCategories: competition.allowedCategories ?? [], // 👈 FIX
        metadata: {
        },
      }
      : {
        name: "",
        description: "",
        startTime: new Date().toISOString().slice(0, 16),
        endTime: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 16),

        type: "JEOPARDY",
        isTeamBased: false,
        maxTeamSize: 4,
        maxParticipants: 100,
        requireApproval: false,
        isPublic: true,
        allowedCategories: [],
        metadata: { difficulty: "", prizes: "" },
      },
  });

  const mutationFn = (data: CompetitionFormData) => {
    const payload = {
      ...data,
      // Convert local datetime → ISO before sending to API
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
    };

    return isEdit
      ? apiRequest("PUT", `/api/v1/competitions/${competition!.id}`, payload)
      : apiRequest("POST", "/api/v1/competitions", payload);
  };

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/competitions"] });
      toast({
        title: isEdit ? "Competition updated successfully" : "Competition created successfully",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Failed to save competition",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">

        <Form {...form}>
          <form onSubmit={form.handleSubmit(mutation.mutate)} className="space-y-4">

            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TYPE */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competition Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="JEOPARDY">Jeopardy</SelectItem>
                      <SelectItem value="ATTACK_DEFENSE">Attack-Defense</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* START TIME */}
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* END TIME */}
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TEAM SETTINGS */}
            <FormField
              control={form.control}
              name="isTeamBased"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Based?</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(v === "true")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* MAX TEAM SIZE */}
            <FormField
              control={form.control}
              name="maxTeamSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Team Size</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* MAX PARTICIPANTS */}
            <FormField
              control={form.control}
              name="maxParticipants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Participants</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* IS PUBLIC */}
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public Competition?</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(v === "true")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* ALLOWED CATEGORIES */}
            <FormField
              control={form.control}
              name="allowedCategories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowed Categories</FormLabel>
                  <FormControl>
                    <Select value={"WEB"} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                         {["WEB", "CRYPTO", "PWN", "FORENSICS", "REVERSE"].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                        
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* METADATA */}
            <FormField
              control={form.control}
              name="metadata.difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata.prizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prizes</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : isEdit ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  );
}

