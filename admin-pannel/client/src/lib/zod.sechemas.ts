
import { z } from "zod";

export const competitionSchema = z.object({
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
  maxTeamSize: z.number().int().min(1),
  maxParticipants: z.number().int().min(1),
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
