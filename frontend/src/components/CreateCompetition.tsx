// src/components/CreateCompetition.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { competitionSchema } from "../schema/competitionSchema"; // Adjust path
import type { CompetitionFormValues } from "../schema/competitionSchema"; // Adjust path
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you installed this
import { Checkbox } from "@/components/ui/checkbox"; // Assuming you installed this
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Assuming you installed this
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";


export function CreateCompetition( { children }: any ) {
  const form = useForm<CompetitionFormValues>({
    resolver: zodResolver(competitionSchema),
    defaultValues: {
      name: "",
      description: "",
      startTime: "2025-07-01T00:00", // Use appropriate default for datetime-local
      endTime: "2025-07-03T23:59",
      type: "JEOPARDY",
      isTeamBased: true,
      isPublic: true,
      requireApproval: false,
      maxTeamSize: 4,
      maxParticipants: 100,
      allowedCategories: "WEB, CRYPTO, PWN",
      difficulty: "beginner",
      prizes: "Top 3 winners get prizes",
    },
  });

  const onSubmit = (values: CompetitionFormValues) => {
    // 💡 The values are now validated and type-safe!
    console.log("Competition Data:", values);
    
    // TODO: Send data to API and close dialog (set a state variable to false)
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ?? <Button>New Competition</Button>}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-sidebar">
        <DialogHeader>
          <DialogTitle>Create New Competition 🏆</DialogTitle>
          <DialogDescription>
            Enter the details for your CTF competition.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* 1. Name and Description */}
            <div className="grid gap-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Competition Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Summer CTF 2025" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="A brief description of the competition..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* 2. Start/End Time */}
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                                {/* Use type="datetime-local" for a combined date and time picker */}
                                <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
            </div>

            {/* 3. Type and Team Settings */}
            <div className="grid grid-cols-2 gap-4">
                {/* Competition Type */}
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select competition type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="JEOPARDY">Jeopardy (Standard CTF)</SelectItem>
                                    <SelectItem value="ATTACK_DEFENSE">Attack/Defense</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                {/* Max Team Size */}
                <FormField
                    control={form.control}
                    name="maxTeamSize"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max Team Size</FormLabel>
                            <FormControl>
                                {/* We use field.onChange for number inputs with RHF */}
                                <Input type="number" min={1} max={10} {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* 4. Boolean Settings (Checkboxes) */}
            <div className="grid grid-cols-3 gap-4">
                {/* Is Team Based */}
                <FormField
                    control={form.control}
                    name="isTeamBased"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2 border rounded-md">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Team Based</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                {/* Is Public */}
                <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2 border rounded-md">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Public Access</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                {/* Require Approval */}
                <FormField
                    control={form.control}
                    name="requireApproval"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2 border rounded-md">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Require Approval</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
            </div>
            
            {/* 5. Metadata/Additional Fields (Prizes & Categories) */}
            <div className="grid gap-4">
                <FormField
                    control={form.control}
                    name="prizes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prizes</FormLabel>
                            <FormControl>
                                <Input placeholder="Top 3 winners get prizes" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="allowedCategories"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Allowed Categories</FormLabel>
                            <FormControl>
                                <Input placeholder="WEB, CRYPTO, PWN, REV" {...field} />
                            </FormControl>
                            <FormDescription>Comma-separated list of challenge categories.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* 6. Footer (Submit Button) */}
            <DialogFooter className="mt-6">
              <Button type="submit">Create Competition</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}