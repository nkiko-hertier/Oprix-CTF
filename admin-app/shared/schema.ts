import { pgTable, text, varchar, boolean, timestamp, integer, uuid, json, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["SUPERADMIN", "ADMIN", "USER"]);
export const competitionStatusEnum = pgEnum("competition_status", ["DRAFT", "REGISTRATION_OPEN", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"]);
export const difficultyEnum = pgEnum("difficulty", ["TRIVIAL", "EASY", "MEDIUM", "HARD", "INSANE"]);
export const teamRoleEnum = pgEnum("team_role", ["CAPTAIN", "MEMBER"]);
export const registrationStatusEnum = pgEnum("registration_status", ["PENDING", "APPROVED", "REJECTED", "WAITLISTED"]);
export const announcementPriorityEnum = pgEnum("announcement_priority", ["LOW", "NORMAL", "HIGH", "URGENT"]);
export const notificationTypeEnum = pgEnum("notification_type", ["INFO", "SUCCESS", "WARNING", "ERROR", "COMPETITION", "SUBMISSION"]);
export const auditActionEnum = pgEnum("audit_action", ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "ROLE_CHANGE", "STATUS_CHANGE"]);

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 255 }).unique().notNull(),
  username: varchar("username", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  role: roleEnum("role").default("USER").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Profiles table
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).unique().notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  country: varchar("country", { length: 100 }),
  website: text("website"),
  github: varchar("github", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  skills: json("skills").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Competitions table
export const competitions = pgTable("competitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  adminId: uuid("admin_id").references(() => users.id).notNull(),
  status: competitionStatusEnum("status").default("DRAFT").notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
  isTeamBased: boolean("is_team_based").default(false).notNull(),
  maxTeams: integer("max_teams"),
  maxUsers: integer("max_users"),
  registrationDeadline: timestamp("registration_deadline"),
  rules: text("rules"),
  prizes: json("prizes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Challenges table
export const challenges = pgTable("challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }),
  points: integer("points").notNull(),
  flagHash: text("flag_hash").notNull(),
  caseSensitive: boolean("case_sensitive").default(false).notNull(),
  normalizeFlag: boolean("normalize_flag").default(true).notNull(),
  competitionId: uuid("competition_id").references(() => competitions.id, { onDelete: "cascade" }).notNull(),
  difficulty: difficultyEnum("difficulty").default("MEDIUM").notNull(),
  solveCount: integer("solve_count").default(0).notNull(),
  maxAttempts: integer("max_attempts"),
  timeLimit: integer("time_limit"),
  isActive: boolean("is_active").default(true).notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
  isDynamic: boolean("is_dynamic").default(false).notNull(),
  url: text("url"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Teams table
export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).unique().notNull(),
  description: text("description"),
  competitionId: uuid("competition_id").references(() => competitions.id, { onDelete: "cascade" }).notNull(),
  captainId: uuid("captain_id").references(() => users.id).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  maxSize: integer("max_size").default(4).notNull(),
  inviteCode: varchar("invite_code", { length: 255 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Team members table
export const teamMembers = pgTable("team_members", {
  teamId: uuid("team_id").references(() => teams.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  role: teamRoleEnum("role").default("MEMBER").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Submissions table
export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  challengeId: uuid("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
  teamId: uuid("team_id").references(() => teams.id),
  competitionId: uuid("competition_id").references(() => competitions.id).notNull(),
  isCorrect: boolean("is_correct").notNull(),
  points: integer("points").default(0).notNull(),
  attemptNumber: integer("attempt_number").default(1).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Scores table
export const scores = pgTable("scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  teamId: uuid("team_id").references(() => teams.id),
  challengeId: uuid("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
  competitionId: uuid("competition_id").references(() => competitions.id, { onDelete: "cascade" }).notNull(),
  submissionId: uuid("submission_id").references(() => submissions.id, { onDelete: "cascade" }).unique().notNull(),
  points: integer("points").notNull(),
  solvedAt: timestamp("solved_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Registrations table
export const registrations = pgTable("registrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  teamId: uuid("team_id").references(() => teams.id),
  competitionId: uuid("competition_id").references(() => competitions.id, { onDelete: "cascade" }).notNull(),
  status: registrationStatusEnum("status").default("PENDING").notNull(),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  rejectionReason: text("rejection_reason"),
});

// Announcements table
export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  competitionId: uuid("competition_id").references(() => competitions.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  priority: announcementPriorityEnum("priority").default("NORMAL").notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  competitionId: uuid("competition_id").references(() => competitions.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: notificationTypeEnum("type").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Hints table
export const hints = pgTable("hints", {
  id: uuid("id").primaryKey().defaultRandom(),
  challengeId: uuid("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  cost: integer("cost").default(0).notNull(),
  creatorId: uuid("creator_id").references(() => users.id).notNull(),
  order: integer("order").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Files table
export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  challengeId: uuid("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: varchar("file_type", { length: 100 }).notNull(),
  fileSize: integer("file_size").notNull(),
  checksum: varchar("checksum", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Audit logs table
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  action: auditActionEnum("action").notNull(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: uuid("entity_id"),
  details: json("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCompetitionSchema = createInsertSchema(competitions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertChallengeSchema = createInsertSchema(challenges).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ id: true, createdAt: true });
export const insertScoreSchema = createInsertSchema(scores).omit({ id: true, createdAt: true });
export const insertRegistrationSchema = createInsertSchema(registrations).omit({ id: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertHintSchema = createInsertSchema(hints).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFileSchema = createInsertSchema(files).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Competition = typeof competitions.$inferSelect;
export type InsertCompetition = z.infer<typeof insertCompetitionSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Score = typeof scores.$inferSelect;
export type InsertScore = z.infer<typeof insertScoreSchema>;
export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Hint = typeof hints.$inferSelect;
export type InsertHint = z.infer<typeof insertHintSchema>;
export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

// Additional types for API responses
export type UserWithProfile = User & { profile?: Profile | null };
export type CompetitionWithDetails = Competition & {
  admin?: User;
  challengeCount?: number;
  registrationCount?: number;
};
export type ChallengeWithDetails = Challenge & {
  competition?: Competition;
  hints?: Hint[];
  files?: File[];
};
export type TeamWithMembers = Team & {
  captain?: User;
  members?: Array<{ user: User; role: string; joinedAt: Date }>;
  memberCount?: number;
};
export type LeaderboardEntry = {
  id: string;
  name: string;
  totalPoints: number;
  solvedChallenges: number;
  lastSolveTime: Date;
  rank: number;
  isTeam: boolean;
};
