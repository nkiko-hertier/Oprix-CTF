import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CompetitionWithDetails } from "@shared/schema";
import { stat } from "node:fs";

const competitionSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startTime: z.string().refine((v) => !isNaN(Date.parse(v)), { message: "Invalid start date" }),
  endTime: z.string().refine((v) => !isNaN(Date.parse(v)), { message: "Invalid end date" }),
  isPublic: z.boolean(),
  // Only for create mode

  type: z.enum(["JEOPARDY", "ATTACK_DEFENSE"]).optional(),
  isTeamBased: z.boolean().optional(),
  maxTeamSize: z.number().min(1).optional(),
  maxParticipants: z.number().min(1).optional(),
  requireApproval: z.boolean().optional(),
  allowedCategories: z.array(z.enum(["WEB", "CRYPTO", "PWN", "FORENSICS", "REVERSE"])).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "REGISTRATION_OPEN", "PAUSED", "CANCELLED"]).optional(),
  metadata: z.object({
    difficulty: z.string().min(3),
    prizes: z.string().min(3),
  }).optional(),
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
          startTime: new Date(competition.startTime).toISOString().slice(0, 16),
          endTime: new Date(competition.endTime).toISOString().slice(0, 16),
          isPublic: competition.isPublic ?? true,
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

  // Reset form when competition changes (Edit mode)
  useEffect(() => {
    if (competition) {
      form.reset({
        name: competition.name,
        description: competition.description,
        startTime: new Date(competition.startTime).toISOString().slice(0, 16),
        endTime: new Date(competition.endTime).toISOString().slice(0, 16),
        isPublic: competition.isPublic ?? true,
        // status: competition.status,
      });
    }
  }, [competition]);

  const mutationFn = (data: CompetitionFormData) => {
    // Remove hidden fields for edit
    if (isEdit) {
      const blocked = ["maxTeamSize", "maxParticipants", "requireApproval", "isTeamBased", "allowedCategories", "metadata", "type"];
      data = Object.fromEntries(Object.entries(data).filter(([k]) => !blocked.includes(k)));
    }

    const payload = {
      ...data,
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
      toast({ title: isEdit ? "Competition updated successfully" : "Competition created successfully" });
      onOpenChange(false);
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

            {/* TYPE (only create) */}
            {!isEdit && (
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
            )}

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

            {/* CREATE MODE ONLY FIELDS */}
            {!isEdit && (
              <>
                {/* TEAM BASED */}
                <FormField
                  control={form.control}
                  name="isTeamBased"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Based?</FormLabel>
                      <Select value={String(field.value)} onValueChange={(v) => field.onChange(v === "true")}>
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

                {/* REQUIRE APPROVAL */}
                <FormField
                  control={form.control}
                  name="requireApproval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Require Approval?</FormLabel>
                      <Select value={String(field.value)} onValueChange={(v) => field.onChange(v === "true")}>
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
                      <Select value={field.value?.[0] ?? "WEB"} onValueChange={(v) => field.onChange([v])}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["WEB", "CRYPTO", "PWN", "FORENSICS", "REVERSE"].map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <FormMessage />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

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
