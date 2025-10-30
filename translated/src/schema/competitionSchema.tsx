// src/schemas/competitionSchema.ts

import { z } from "zod";

export const competitionSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Please provide a brief description." }),
  
  // Date/Time fields (Assuming input as strings for now, will handle conversion later)
  startTime: z.string().min(1, { message: "Start time is required." }),
  endTime: z.string().min(1, { message: "End time is required." }),
  
  // Selection fields
  type: z.enum(["JEOPARDY", "ATTACK_DEFENSE"], { required_error: "Competition type is required." }),
  
  // Number fields (Converted to number using 'z.coerce.number()')
  maxTeamSize: z.coerce.number().min(1).max(10).default(4),
  maxParticipants: z.coerce.number().min(1).default(100),
  
  // Boolean fields
  isTeamBased: z.boolean().default(true),
  isPublic: z.boolean().default(true),
  requireApproval: z.boolean().default(false),
  
  // Array field (For simplicity, we'll use a single text input for now, but
  // a real implementation would use a specialized component like Multiple Select or Tag Input)
  allowedCategories: z.string().optional(), // e.g., "WEB, CRYPTO, PWN"
  
  // Nested/Metadata fields
  difficulty: z.string().optional(), // Assuming this is part of metadata
  prizes: z.string().optional(), // Assuming this is part of metadata
});

export type CompetitionFormValues = z.infer<typeof competitionSchema>;
