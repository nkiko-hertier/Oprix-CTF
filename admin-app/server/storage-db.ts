// Reference: blueprint:javascript_database
import { db } from "./db";
import { eq, like, and, or, desc, sql } from "drizzle-orm";
import {
  users,
  profiles,
  competitions,
  challenges,
  teams,
  teamMembers,
  submissions,
  scores,
  registrations,
  announcements,
  notifications,
  auditLogs,
  type User,
  type InsertUser,
  type Profile,
  type InsertProfile,
  type Competition,
  type InsertCompetition,
  type Challenge,
  type InsertChallenge,
  type Team,
  type InsertTeam,
  type Submission,
  type InsertSubmission,
  type Registration,
  type InsertRegistration,
  type Announcement,
  type InsertAnnouncement,
  type Notification,
  type InsertNotification,
  type AuditLog,
  type InsertAuditLog,
  type UserWithProfile,
  type CompetitionWithDetails,
  type ChallengeWithDetails,
  type TeamWithMembers,
  type LeaderboardEntry,
} from "@shared/schema";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByClerkId(clerkId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getAllUsers(filters?: { search?: string; role?: string; page?: number; limit?: number }): Promise<{ users: UserWithProfile[]; total: number }> {
    let whereConditions = [];
    
    if (filters?.search) {
      whereConditions.push(
        or(
          like(users.username, `%${filters.search}%`),
          like(users.email, `%${filters.search}%`)
        )
      );
    }

    if (filters?.role && filters.role !== "all") {
      whereConditions.push(eq(users.role, filters.role));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get total count first
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause);

    const total = Number(countResult[0]?.count || 0);

    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;

    // Use join to avoid N+1 query problem
    const usersWithProfiles = await db
      .select()
      .from(users)
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    const result: UserWithProfile[] = usersWithProfiles.map(row => ({
      ...row.users,
      profile: row.profiles || undefined
    }));

    return { users: result, total };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return user;
  }

  async updateUserRole(id: string, role: string): Promise<User | undefined> {
    return this.updateUser(id, { role: role as any });
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<User | undefined> {
    return this.updateUser(id, { isActive });
  }

  // Profiles
  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db.insert(profiles).values(insertProfile).returning();
    return profile;
  }

  async updateProfile(userId: string, data: Partial<Profile>): Promise<Profile | undefined> {
    const [profile] = await db.update(profiles).set({ ...data, updatedAt: new Date() }).where(eq(profiles.userId, userId)).returning();
    return profile;
  }

  // Competitions
  async getCompetition(id: string): Promise<Competition | undefined> {
    const [competition] = await db.select().from(competitions).where(eq(competitions.id, id));
    return competition;
  }

  async getAllCompetitions(filters?: { status?: string }): Promise<CompetitionWithDetails[]> {
    let whereConditions = [];

    if (filters?.status && filters.status !== "all") {
      whereConditions.push(eq(competitions.status, filters.status.toUpperCase()));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Use subqueries for aggregations to avoid N+1
    const allCompetitions = await db
      .select({
        competition: competitions,
        challengeCount: sql<number>`(SELECT COUNT(*) FROM ${challenges} WHERE ${challenges.competitionId} = ${competitions.id})`,
        teamCount: sql<number>`(SELECT COUNT(*) FROM ${teams} WHERE ${teams.competitionId} = ${competitions.id})`,
        registrationCount: sql<number>`(SELECT COUNT(*) FROM ${registrations} WHERE ${registrations.competitionId} = ${competitions.id})`,
      })
      .from(competitions)
      .where(whereClause)
      .orderBy(desc(competitions.createdAt));

    return allCompetitions.map(row => ({
      ...row.competition,
      challengeCount: Number(row.challengeCount || 0),
      teamCount: Number(row.teamCount || 0),
      registrationCount: Number(row.registrationCount || 0),
    }));
  }

  async createCompetition(insertCompetition: InsertCompetition): Promise<Competition> {
    const [competition] = await db.insert(competitions).values(insertCompetition).returning();
    return competition;
  }

  async updateCompetition(id: string, data: Partial<Competition>): Promise<Competition | undefined> {
    const [competition] = await db.update(competitions).set({ ...data, updatedAt: new Date() }).where(eq(competitions.id, id)).returning();
    return competition;
  }

  async deleteCompetition(id: string): Promise<boolean> {
    await db.delete(competitions).where(eq(competitions.id, id));
    return true;
  }

  // Challenges
  async getChallenge(id: string): Promise<Challenge | undefined> {
    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));
    return challenge;
  }

  async getAllChallenges(filters?: { search?: string; category?: string; difficulty?: string }): Promise<ChallengeWithDetails[]> {
    let whereConditions = [];

    if (filters?.search) {
      whereConditions.push(
        or(
          like(challenges.title, `%${filters.search}%`),
          like(challenges.description, `%${filters.search}%`)
        )
      );
    }

    if (filters?.category && filters.category !== "all") {
      whereConditions.push(eq(challenges.category, filters.category));
    }

    if (filters?.difficulty && filters.difficulty !== "all") {
      whereConditions.push(eq(challenges.difficulty, filters.difficulty.toUpperCase()));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Use join to avoid N+1 query problem
    const challengesWithCompetitions = await db
      .select()
      .from(challenges)
      .leftJoin(competitions, eq(challenges.competitionId, competitions.id))
      .where(whereClause)
      .orderBy(desc(challenges.createdAt));

    return challengesWithCompetitions.map(row => ({
      ...row.challenges,
      competition: row.competitions || undefined
    }));
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const [challenge] = await db.insert(challenges).values(insertChallenge).returning();
    return challenge;
  }

  async updateChallenge(id: string, data: Partial<Challenge>): Promise<Challenge | undefined> {
    const [challenge] = await db.update(challenges).set({ ...data, updatedAt: new Date() }).where(eq(challenges.id, id)).returning();
    return challenge;
  }

  async deleteChallenge(id: string): Promise<boolean> {
    await db.delete(challenges).where(eq(challenges.id, id));
    return true;
  }

  // Teams
  async getTeam(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async getAllTeams(filters?: { search?: string }): Promise<TeamWithMembers[]> {
    let whereConditions = [];

    if (filters?.search) {
      whereConditions.push(like(teams.name, `%${filters.search}%`));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Use subquery to get actual member count from teamMembers table
    const allTeams = await db
      .select({
        team: teams,
        memberCount: sql<number>`(SELECT COUNT(*) FROM ${teamMembers} WHERE ${teamMembers.teamId} = ${teams.id})`,
      })
      .from(teams)
      .where(whereClause)
      .orderBy(desc(teams.createdAt));

    return allTeams.map(row => ({
      ...row.team,
      memberCount: Number(row.memberCount || 0),
    }));
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const [team] = await db.insert(teams).values(insertTeam).returning();
    return team;
  }

  async updateTeam(id: string, data: Partial<Team>): Promise<Team | undefined> {
    const [team] = await db.update(teams).set({ ...data, updatedAt: new Date() }).where(eq(teams.id, id)).returning();
    return team;
  }

  // Submissions
  async getAllSubmissions(filters?: { search?: string; status?: string }): Promise<Submission[]> {
    const allSubmissions = await db
      .select()
      .from(submissions)
      .orderBy(desc(submissions.createdAt));

    return allSubmissions;
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const [submission] = await db.insert(submissions).values(insertSubmission).returning();
    return submission;
  }

  // Leaderboard
  async getLeaderboard(filters?: { competitionId?: string; type?: string }): Promise<LeaderboardEntry[]> {
    let whereConditions = [];

    if (filters?.competitionId) {
      whereConditions.push(eq(scores.competitionId, filters.competitionId));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Use join with aggregation to avoid N+1
    const leaderboardData = await db
      .select({
        userId: scores.userId,
        user: users,
        totalPoints: sql<number>`sum(${scores.points})`,
        solveCount: sql<number>`count(${scores.id})`,
        lastSolveAt: sql<Date>`max(${scores.createdAt})`,
      })
      .from(scores)
      .leftJoin(users, eq(scores.userId, users.id))
      .where(whereClause)
      .groupBy(scores.userId, users.id, users.clerkId, users.username, users.email, users.role, users.isActive, users.lastLoginAt, users.createdAt, users.updatedAt)
      .orderBy(desc(sql`sum(${scores.points})`))
      .limit(100);

    return leaderboardData.map((row, index) => ({
      rank: index + 1,
      user: row.user || null,
      teamId: null,
      totalPoints: Number(row.totalPoints || 0),
      solveCount: Number(row.solveCount || 0),
      lastSolveAt: row.lastSolveAt || new Date(),
    }));
  }

  // Registrations
  async getAllRegistrations(competitionId?: string): Promise<Registration[]> {
    let whereConditions = [];

    if (competitionId) {
      whereConditions.push(eq(registrations.competitionId, competitionId));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const allRegistrations = await db
      .select()
      .from(registrations)
      .where(whereClause)
      .orderBy(desc(registrations.registeredAt));

    return allRegistrations;
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const [registration] = await db.insert(registrations).values(insertRegistration).returning();
    return registration;
  }

  async updateRegistration(id: string, data: Partial<Registration>): Promise<Registration | undefined> {
    const [registration] = await db.update(registrations).set(data).where(eq(registrations.id, id)).returning();
    return registration;
  }

  // Announcements
  async getAllAnnouncements(): Promise<Announcement[]> {
    const allAnnouncements = await db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.createdAt));

    return allAnnouncements;
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const [announcement] = await db.insert(announcements).values(insertAnnouncement).returning();
    return announcement;
  }

  async updateAnnouncement(id: string, data: Partial<Announcement>): Promise<Announcement | undefined> {
    const [announcement] = await db.update(announcements).set({ ...data, updatedAt: new Date() }).where(eq(announcements.id, id)).returning();
    return announcement;
  }

  // Notifications
  async getAllNotifications(userId?: string): Promise<Notification[]> {
    let whereConditions = [];

    if (userId) {
      whereConditions.push(eq(notifications.userId, userId));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const allNotifications = await db
      .select()
      .from(notifications)
      .where(whereClause)
      .orderBy(desc(notifications.createdAt));

    return allNotifications;
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(insertNotification).returning();
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
  }

  // Audit Logs
  async getAllAuditLogs(filters?: { search?: string; action?: string }): Promise<AuditLog[]> {
    let whereConditions = [];

    if (filters?.search) {
      whereConditions.push(like(auditLogs.action, `%${filters.search}%`));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const logs = await db
      .select()
      .from(auditLogs)
      .where(whereClause)
      .orderBy(desc(auditLogs.createdAt));

    return logs;
  }

  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const [log] = await db.insert(auditLogs).values(insertLog).returning();
    return log;
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<any> {
    const totalUsersResult = await db.select({ count: sql<number>`count(*)` }).from(users);
    const activeCompetitionsResult = await db.select({ count: sql<number>`count(*)` }).from(competitions).where(eq(competitions.status, "ACTIVE"));
    const totalChallengesResult = await db.select({ count: sql<number>`count(*)` }).from(challenges);
    const totalSubmissionsResult = await db.select({ count: sql<number>`count(*)` }).from(submissions);

    return {
      totalUsers: Number(totalUsersResult[0]?.count || 0),
      activeCompetitions: Number(activeCompetitionsResult[0]?.count || 0),
      totalChallenges: Number(totalChallengesResult[0]?.count || 0),
      totalSubmissions: Number(totalSubmissionsResult[0]?.count || 0),
    };
  }

  async getActivityData(): Promise<any[]> {
    // Get last 7 days of submission/user activity
    const days = 7;
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      const submissionCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(submissions)
        .where(and(
          sql`${submissions.createdAt} >= ${startOfDay}`,
          sql`${submissions.createdAt} <= ${endOfDay}`
        ));

      const userCount = await db
        .select({ count: sql<number>`count(DISTINCT ${users.id})` })
        .from(users)
        .where(and(
          sql`${users.createdAt} >= ${startOfDay}`,
          sql`${users.createdAt} <= ${endOfDay}`
        ));
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        submissions: Number(submissionCount[0]?.count || 0),
        users: Number(userCount[0]?.count || 0),
      });
    }
    
    return data;
  }

  async getTopUsers(): Promise<any[]> {
    // Use join to avoid N+1 query problem
    const topUsers = await db
      .select({
        user: users,
        totalPoints: sql<number>`sum(${scores.points})`,
        solveCount: sql<number>`count(${scores.id})`,
      })
      .from(scores)
      .leftJoin(users, eq(scores.userId, users.id))
      .groupBy(users.id, users.clerkId, users.username, users.email, users.role, users.isActive, users.lastLoginAt, users.createdAt, users.updatedAt)
      .orderBy(desc(sql`sum(${scores.points})`))
      .limit(5);

    return topUsers.map((row, index) => ({
      id: row.user?.id || "",
      username: row.user?.username || "Unknown",
      email: row.user?.email || "",
      points: Number(row.totalPoints || 0),
      solvedChallenges: Number(row.solveCount || 0),
    }));
  }
}
