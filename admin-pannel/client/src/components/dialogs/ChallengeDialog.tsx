import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ChallengeWithDetails } from "@shared/schema";
import { useEffect } from "react";

const challengeSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(["WEB", "CRYPTO", "PWN", "REVERSE", "FORENSICS", "MISC"]),
  difficulty: z.enum(["TRIVIAL", "EASY", "MEDIUM", "HARD", "INSANE"]),
  points: z.number().min(1).max(5000),
  competitionId: z.string().optional(),
  flag: z.string().optional(),
  caseSensitive: z.boolean().default(false),
  normalizeFlag: z.boolean().default(true),
  isVisible: z.boolean().default(true),
  isDynamic: z.boolean().default(false),
  url: z.string().url(),
  metadata: z.object({
    author: z.string().min(1),
    source: z.string().min(1),
    docker_image: z.string().min(1),
  }),
  hints: z.array(z.string().min(1)).default([]),
});

type ChallengeFormData = z.infer<typeof challengeSchema>;

interface ChallengeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challenge?: ChallengeWithDetails;
  defaultCompetitionId?: string;
}

export function ChallengeDialog({
  open,
  onOpenChange,
  challenge,
  defaultCompetitionId,
}: ChallengeDialogProps) {
  const { toast } = useToast();
  const isEdit = !!challenge;

  const { data: competitionsData } = useQuery({
    queryKey: ["/api/v1/competitions"],
  });

  const competitions = Array.isArray(competitionsData)
    ? competitionsData
    : competitionsData?.data || [];

  const form = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: challenge
      ? {
        title: challenge.title,
        description: challenge.description,
        category: challenge.category as any,
        difficulty: challenge.difficulty as any,
        points: challenge.points,
        competitionId: challenge.competitionId,
        flag: challenge.flag || "",
        caseSensitive: challenge.caseSensitive ?? false,
        normalizeFlag: challenge.normalizeFlag ?? true,
        isVisible: challenge.isVisible ?? true,
        isDynamic: challenge.isDynamic ?? false,
        url: challenge.url || "",
        metadata: challenge.metadata || { author: "", source: "", docker_image: "" },
        // hints: challenge.hints || [],
        hints: challenge.hints?.map((h) => h.content) || [],
      }
      : {
        title: "",
        description: "",
        category: "WEB",
        difficulty: "MEDIUM",
        points: 100,
        competitionId: defaultCompetitionId || "",
        flag: "",
        caseSensitive: false,
        normalizeFlag: true,
        isVisible: true,
        isDynamic: false,
        url: "",
        metadata: { author: "", source: "", docker_image: "" },
        hints: [],
      },
  });

  useEffect(() => {
    if (challenge) {
      form.reset({
        title: challenge.title,
        description: challenge.description,
        category: challenge.category as any,
        difficulty: challenge.difficulty as any,
        points: challenge.points,
        competitionId: challenge.competitionId,
        flag: challenge.flag || "",
        caseSensitive: challenge.caseSensitive ?? false,
        normalizeFlag: challenge.normalizeFlag ?? true,
        isVisible: challenge.isVisible ?? true,
        isDynamic: challenge.isDynamic ?? false,
        url: challenge.url || "",
        metadata: challenge.metadata || { author: "", source: "", docker_image: "" },
        // hints: challenge.hints || [],
        hints: challenge.hints?.map((h) => h.content) || [],
      });
    } else {
      form.reset({
        title: "",
        description: "",
        category: "WEB",
        difficulty: "MEDIUM",
        points: 100,
        competitionId: defaultCompetitionId || "",
        flag: "",
        caseSensitive: false,
        normalizeFlag: true,
        isVisible: true,
        isDynamic: false,
        url: "",
        metadata: { author: "", source: "", docker_image: "" },
        hints: [],
      })
    }
  }, [challenge, form]);

  const createMutation = useMutation({
    mutationFn: async (data: ChallengeFormData) => apiRequest("POST", `/api/v1/challenges/create`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/v1/challenges/create`] });
      toast({ title: "Challenge created successfully" });
      form.reset();
      onOpenChange(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ChallengeFormData) =>
      apiRequest("PUT", `/api/v1/competitions/${challenge!.competitionId}/challenges/${challenge!.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/challenges"] });
      toast({ title: "Challenge updated successfully" });
      onOpenChange(false);
    },
  });

  const onSubmit = (data: ChallengeFormData) => {
    console.log("Submitting data:", data);
    if(!data.competitionId) delete data.competitionId;
    if (isEdit) updateMutation.mutate(data);
    else createMutation.mutate(data);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="dialog-challenge">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Challenge" : "Create Challenge"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update challenge details" : "Create a new CTF challenge"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl><Input {...field} placeholder="Challenge title" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea {...field} placeholder="Challenge description" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {
              defaultCompetitionId ? null :
              <FormField control={form.control} name="competitionId" render={({ field }) => (
              <FormItem>
                <FormLabel>Competition</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a competition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {competitions?.map((comp: any) => (
                      <SelectItem key={comp.id} value={comp.id}>
                        {comp.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />}


            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="WEB">Web</SelectItem>
                    <SelectItem value="CRYPTO">Crypto</SelectItem>
                    <SelectItem value="PWN">Pwn</SelectItem>
                    <SelectItem value="REVERSE">Reverse</SelectItem>
                    <SelectItem value="FORENSICS">Forensics</SelectItem>
                    <SelectItem value="MISC">Misc</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="difficulty" render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="TRIVIAL">Trivial</SelectItem>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                    <SelectItem value="INSANE">Insane</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="points" render={({ field }) => (
              <FormItem>
                <FormLabel>Points</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="flag" render={({ field }) => (
              <FormItem>
                <FormLabel>Flag</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="url" render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="metadata.author" render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="metadata.source" render={({ field }) => (
              <FormItem>
                <FormLabel>Source</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="metadata.docker_image" render={({ field }) => (
              <FormItem>
                <FormLabel>Docker Image</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="hints" render={({ field }) => (
              <FormItem>
                <FormLabel>Hints (comma separated)</FormLabel>
                <FormControl>
                  <Input
                    value={field.value.join(", ")}
                    onChange={(e) =>
                      field.onChange(e.target.value.split(",").map(s => s.trim()))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />


            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : isEdit ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
