// src/components/CreateChallenge.tsx

"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner"; // Using 'sonner' as per your provided component
import { Plus, X } from "lucide-react";

// --- 1. Define the Zod Schema for a New Challenge ---

// Define the schema for the 'hints' array
const hintSchema = z.object({
  value: z.string().min(1, "Hint content is required."),
});

const challengeSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.enum(["WEB", "CRYPTO", "PWN", "REV", "MISC"], {
    required_error: "Category is required.",
  }),
  difficulty: z.enum(["BEGINNER", "MEDIUM", "EXPERT"], {
    required_error: "Difficulty is required.",
  }),
  points: z.number().min(1, "Points must be at least 1."),
  flag: z.string().min(1, "Flag is required."),
  caseSensitive: z.boolean().default(false),
  normalizeFlag: z.boolean().default(true),
  isVisible: z.boolean().default(true),
  isDynamic: z.boolean().default(false),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  // Metadata fields are included directly in the form for simplicity
  author: z.string().optional(),
  source: z.string().optional(),
  docker_image: z.string().optional(),
  hints: z.array(hintSchema).default([]),
});

type ChallengeFormValues = z.infer<typeof challengeSchema>;

// --- 2. The CreateChallenge Component ---
export function CreateChallenge({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: "SQL Injection Basics",
      description: "Find the flag by exploiting SQL injection vulnerability",
      category: "WEB",
      difficulty: "MEDIUM",
      points: 100,
      flag: "flag{sql_1nj3ct10n_m4st3r}",
      caseSensitive: false,
      normalizeFlag: true,
      isVisible: true,
      isDynamic: false,
      url: "http://challenge.ctf.com:8080",
      author: "John Doe",
      source: "DefCon 2023",
      docker_image: "myctf/sqli:latest",
      hints: [
        { value: "Look for common SQL injection patterns" },
        { value: "Try UNION SELECT statements" },
      ],
    },
  });

  // Helper for dynamic 'hints' array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "hints",
  });

  const onSubmit = async (values: ChallengeFormValues) => {
    // 💡 Transform the flat form values into the structured API payload
    const apiPayload = {
      title: values.title,
      description: values.description,
      category: values.category,
      difficulty: values.difficulty,
      points: values.points,
      flag: values.flag,
      caseSensitive: values.caseSensitive,
      normalizeFlag: values.normalizeFlag,
      isVisible: values.isVisible,
      isDynamic: values.isDynamic,
      url: values.url || undefined, // Send undefined if empty string
      metadata: {
        author: values.author,
        source: values.source,
        docker_image: values.docker_image,
      },
      hints: values.hints.map(h => h.value), // Extract the string content from the array
    };

    console.log("Challenge API Payload:", apiPayload);

    try {
      // TODO: Replace with an actual secure API call to your backend
      // Your API route handles the secure challenge creation logic
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      toast("Challenge Created! 🎉", {
        description: `Challenge "${values.title}" (${values.category}) is ready.`,
      });

      form.reset();
      setIsOpen(false); 

    } catch (error) {
      console.error("Challenge creation failed:", error);
      // NOTE: Sonner's toast doesn't use a 'variant' prop directly like Shadcn's component.
      toast.error("Error Creating Challenge", {
        description: "An error occurred while saving the challenge.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ?? <Button>New Challenge</Button>}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-sidebar">
        <DialogHeader>
          <DialogTitle>Create New Challenge</DialogTitle>
          <DialogDescription>
            Configure the details and flag for your CTF challenge.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* 1. Core Details (Title, Category, Difficulty) */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input placeholder="SQL Injection Basics" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Category Select */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="WEB">WEB</SelectItem>
                        <SelectItem value="CRYPTO">CRYPTO</SelectItem>
                        <SelectItem value="PWN">PWN</SelectItem>
                        <SelectItem value="REV">REV</SelectItem>
                        <SelectItem value="MISC">MISC</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Difficulty Select */}
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select Difficulty" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BEGINNER">BEGINNER</SelectItem>
                        <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                        <SelectItem value="EXPERT">EXPERT</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Points Input */}
              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} placeholder="100" 
                        {...field} 
                        onChange={e => field.onChange(e.target.valueAsNumber)} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* 2. Description and Flag */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detailed description of the vulnerability..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flag</FormLabel>
                    <FormControl>
                      <Input placeholder="flag{...}" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 3. Settings and Metadata */}
            <h4 className="text-lg font-semibold border-b pb-2 mt-4">Configuration & Metadata</h4>
            <div className="grid grid-cols-2 gap-4">
              
              {/* URL */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Challenge URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="http://challenge.ctf.com:8080" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Docker Image */}
              <FormField
                control={form.control}
                name="docker_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Docker Image (Metadata)</FormLabel>
                    <FormControl>
                      <Input placeholder="myctf/sqli:latest" {...field} />
                    </FormControl>
                    <FormDescription>Used for environment deployment.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Author */}
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author (Metadata)</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Source */}
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source (Metadata)</FormLabel>
                    <FormControl>
                      <Input placeholder="DefCon 2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
            </div>

            {/* Checkboxes (Visiblity, Case Sensitivity, etc.) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {[
                { name: "isVisible", label: "Visible to Players" },
                { name: "caseSensitive", label: "Flag Case Sensitive" },
                { name: "normalizeFlag", label: "Normalize Flag" },
                { name: "isDynamic", label: "Dynamic Points" },
              ].map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof ChallengeFormValues}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md">
                      <FormControl>
                        <Checkbox 
                          checked={!!field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{label}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* 4. Hints (Dynamic Array) */}
            <h4 className="text-lg font-semibold border-b pb-2 mt-4">Hints</h4>
            <div className="space-y-3">
              {fields.map((item, index) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={`hints.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input placeholder={`Hint ${index + 1}`} {...field} />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          onClick={() => remove(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => append({ value: "" })}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Hint
              </Button>
            </div>

            {/* 5. Footer (Submit Button) */}
            <DialogFooter className="mt-6">
              <Button type="submit">Create Challenge</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}