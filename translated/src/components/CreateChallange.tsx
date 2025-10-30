"use client"

import type React from "react"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Plus, X, Loader2 } from "lucide-react"
import { challengeService } from "@/services/challengeService"

// --- 1. Define the Zod Schema for a New Challenge ---

// Define the schema for the 'hints' array
const hintSchema = z.object({
  value: z.string().min(1, "Hint content is required."),
})

const challengeSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.string().min(1, "Category is required."),
  difficulty: z.enum(["Easy", "Medium", "Hard"], {
    required_error: "Difficulty is required.",
  }),
  points: z.number().min(1, "Points must be at least 1."),
  flag: z.string().min(1, "Flag is required."),
  isActive: z.boolean().default(true),
  hints: z.array(hintSchema).default([]),
})

type ChallengeFormValues = z.infer<typeof challengeSchema>

// --- 2. The CreateChallenge Component ---
export function CreateChallenge({
  children,
  competitionId,
  onSuccess,
}: {
  children?: React.ReactNode
  competitionId: string
  onSuccess?: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "WEB",
      difficulty: "Medium",
      points: 100,
      flag: "",
      isActive: true,
      hints: [],
    },
  })

  // Helper for dynamic 'hints' array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "hints",
  })

  const onSubmit = async (values: ChallengeFormValues) => {
    try {
      setIsSubmitting(true)
      console.log("[v0] Creating challenge:", values)

      const apiPayload = {
        title: values.title,
        description: values.description,
        category: values.category,
        difficulty: values.difficulty,
        points: values.points,
        flag: values.flag,
        isActive: values.isActive,
        hints: values.hints.map((h) => h.value),
        order: 0,
      }

      await challengeService.createChallenge(competitionId, apiPayload)

      toast("Challenge Created! 🎉", {
        description: `Challenge "${values.title}" (${values.category}) is ready.`,
      })

      form.reset()
      setIsOpen(false)

      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error("[v0] Challenge creation failed:", error)
      toast.error("Error Creating Challenge", {
        description: error.response?.data?.message || "An error occurred while saving the challenge.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children ?? <Button>New Challenge</Button>}</DialogTrigger>

      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-sidebar">
        <DialogHeader>
          <DialogTitle>Create New Challenge</DialogTitle>
          <DialogDescription>Configure the details and flag for your CTF challenge.</DialogDescription>
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
                    <FormControl>
                      <Input placeholder="SQL Injection Basics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category Input */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="WEB, CRYPTO, PWN..." {...field} />
                    </FormControl>
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select Difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
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
                      <Input
                        type="number"
                        min={1}
                        placeholder="100"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
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

            {/* Active Checkbox */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md">
                  <FormControl>
                    <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active (Visible to Players)</FormLabel>
                  </div>
                </FormItem>
              )}
            />

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
                        <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="button" variant="secondary" onClick={() => append({ value: "" })} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Hint
              </Button>
            </div>

            {/* 5. Footer (Submit Button) */}
            <DialogFooter className="mt-6">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={16} />
                    Creating...
                  </>
                ) : (
                  "Create Challenge"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
