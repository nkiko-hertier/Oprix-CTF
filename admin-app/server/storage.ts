import { DatabaseStorage } from "./storage-db";
import type {
  User,
  InsertUser,
  Profile,
  InsertProfile,
  Competition,
  InsertCompetition,
  Challenge,
  InsertChallenge,
  Team,
  InsertTeam,
  Submission,
  InsertSubmission,
  Score,
  InsertScore,
  Registration,
  InsertRegistration,
  Announcement,
  InsertAnnouncement,
  Notification,
  InsertNotification,
  AuditLog,
  InsertAuditLog,
  UserWithProfile,
  CompetitionWithDetails,
  ChallengeWithDetails,
  TeamWithMembers,
  LeaderboardEntry,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByClerkId(clerkId: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(filters?: { search?: string; role?: string; page?: number; limit?: number }): Promise<{ users: UserWithProfile[]; total: number }>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  updateUserRole(id: string, role: string): Promise<User | undefined>;
  updateUserStatus(id: string, isActive: boolean): Promise<User | undefined>;

  // Profiles
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, data: Partial<Profile>): Promise<Profile | undefined>;

  // Competitions
  getCompetition(id: string): Promise<Competition | undefined>;
  getAllCompetitions(filters?: { status?: string }): Promise<CompetitionWithDetails[]>;
  createCompetition(competition: InsertCompetition): Promise<Competition>;
  updateCompetition(id: string, data: Partial<Competition>): Promise<Competition | undefined>;
  deleteCompetition(id: string): Promise<boolean>;

  // Challenges
  getChallenge(id: string): Promise<Challenge | undefined>;
  getAllChallenges(filters?: { search?: string; category?: string; difficulty?: string }): Promise<ChallengeWithDetails[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallenge(id: string, data: Partial<Challenge>): Promise<Challenge | undefined>;
  deleteChallenge(id: string): Promise<boolean>;

  // Teams
  getTeam(id: string): Promise<Team | undefined>;
  getAllTeams(filters?: { search?: string }): Promise<TeamWithMembers[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: string, data: Partial<Team>): Promise<Team | undefined>;

  // Submissions
  getAllSubmissions(filters?: { search?: string; status?: string }): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;

  // Scores & Leaderboard
  getLeaderboard(filters?: { competitionId?: string; type?: string }): Promise<LeaderboardEntry[]>;

  // Registrations
  getAllRegistrations(competitionId?: string): Promise<Registration[]>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  updateRegistration(id: string, data: Partial<Registration>): Promise<Registration | undefined>;

  // Announcements
  getAllAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: string, data: Partial<Announcement>): Promise<Announcement | undefined>;

  // Notifications
  getAllNotifications(userId?: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
  markAllNotificationsAsRead(userId: string): Promise<void>;

  // Audit Logs
  getAllAuditLogs(filters?: { search?: string; action?: string }): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;

  // Dashboard Stats
  getDashboardStats(): Promise<any>;
  getActivityData(): Promise<any[]>;
  getTopUsers(): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private profiles: Map<string, Profile>;
  private competitions: Map<string, Competition>;
  private challenges: Map<string, Challenge>;
  private teams: Map<string, Team>;
  private submissions: Map<string, Submission>;
  private scores: Map<string, Score>;
  private registrations: Map<string, Registration>;
  private announcements: Map<string, Announcement>;
  private notifications: Map<string, Notification>;
  private auditLogs: Map<string, AuditLog>;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.competitions = new Map();
    this.challenges = new Map();
    this.teams = new Map();
    this.submissions = new Map();
    this.scores = new Map();
    this.registrations = new Map();
    this.announcements = new Map();
    this.notifications = new Map();
    this.auditLogs = new Map();
    
    // Seed some initial data
    this.seedData();
  }

  private seedData() {
    // Seed some mock data for demonstration
    const userId1 = randomUUID();
    const userId2 = randomUUID();
    
    this.users.set(userId1, {
      id: userId1,
      clerkId: "clerk_admin_1",
      username: "admin",
      email: "admin@example.com",
      role: "ADMIN",
      isActive: true,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.users.set(userId2, {
      id: userId2,
      clerkId: "clerk_superadmin_1",
      username: "superadmin",
      email: "superadmin@example.com",
      role: "SUPERADMIN",
      isActive: true,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByClerkId(clerkId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.clerkId === clerkId);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async getAllUsers(filters?: { search?: string; role?: string; page?: number; limit?: number }): Promise<{ users: UserWithProfile[]; total: number }> {
    let users = Array.from(this.users.values());

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      users = users.filter(u => 
        u.username.toLowerCase().includes(search) || 
        u.email.toLowerCase().includes(search)
      );
    }

    if (filters?.role && filters.role !== "all") {
      users = users.filter(u => u.role === filters.role);
    }

    const usersWithProfiles: UserWithProfile[] = users.map(u => ({
      ...u,
      profile: this.profiles.get(u.id),
    }));

    return { users: usersWithProfiles, total: usersWithProfiles.length };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      clerkId: insertUser.clerkId,
      username: insertUser.username,
      email: insertUser.email,
      role: insertUser.role || "USER",
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updated = { ...user, ...data, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  async updateUserRole(id: string, role: string): Promise<User | undefined> {
    return this.updateUser(id, { role: role as any });
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<User | undefined> {
    return this.updateUser(id, { isActive });
  }

  // Profiles
  async getProfile(userId: string): Promise<Profile | undefined> {
    return this.profiles.get(userId);
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const profile: Profile = {
      id,
      userId: insertProfile.userId,
      firstName: insertProfile.firstName || null,
      lastName: insertProfile.lastName || null,
      bio: insertProfile.bio || null,
      avatarUrl: insertProfile.avatarUrl || null,
      country: insertProfile.country || null,
      website: insertProfile.website || null,
      github: insertProfile.github || null,
      linkedin: insertProfile.linkedin || null,
      skills: (insertProfile.skills as string[]) || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.profiles.set(insertProfile.userId, profile);
    return profile;
  }

  async updateProfile(userId: string, data: Partial<Profile>): Promise<Profile | undefined> {
    const profile = this.profiles.get(userId);
    if (!profile) return undefined;
    
    const updated = { ...profile, ...data, updatedAt: new Date() };
    this.profiles.set(userId, updated);
    return updated;
  }

  // Competitions
  async getCompetition(id: string): Promise<Competition | undefined> {
    return this.competitions.get(id);
  }

  async getAllCompetitions(filters?: { status?: string }): Promise<CompetitionWithDetails[]> {
    let comps = Array.from(this.competitions.values());

    if (filters?.status && filters.status !== "all") {
      comps = comps.filter(c => c.status.toLowerCase() === filters.status!.toLowerCase());
    }

    return comps.map(c => ({
      ...c,
      admin: this.users.get(c.adminId),
      challengeCount: Array.from(this.challenges.values()).filter(ch => ch.competitionId === c.id).length,
      registrationCount: Array.from(this.registrations.values()).filter(r => r.competitionId === c.id).length,
    }));
  }

  async createCompetition(insertCompetition: InsertCompetition): Promise<Competition> {
    const id = randomUUID();
    const competition: Competition = {
      id,
      name: insertCompetition.name,
      title: insertCompetition.title,
      description: insertCompetition.description,
      startTime: insertCompetition.startTime,
      endTime: insertCompetition.endTime,
      adminId: insertCompetition.adminId,
      status: insertCompetition.status || "DRAFT",
      isPublic: insertCompetition.isPublic ?? true,
      isTeamBased: insertCompetition.isTeamBased ?? false,
      maxTeams: insertCompetition.maxTeams || null,
      maxUsers: insertCompetition.maxUsers || null,
      registrationDeadline: insertCompetition.registrationDeadline || null,
      rules: insertCompetition.rules || null,
      prizes: insertCompetition.prizes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.competitions.set(id, competition);
    return competition;
  }

  async updateCompetition(id: string, data: Partial<Competition>): Promise<Competition | undefined> {
    const comp = this.competitions.get(id);
    if (!comp) return undefined;
    
    const updated = { ...comp, ...data, updatedAt: new Date() };
    this.competitions.set(id, updated);
    return updated;
  }

  async deleteCompetition(id: string): Promise<boolean> {
    return this.competitions.delete(id);
  }

  // Challenges
  async getChallenge(id: string): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async getAllChallenges(filters?: { search?: string; category?: string; difficulty?: string }): Promise<ChallengeWithDetails[]> {
    let challenges = Array.from(this.challenges.values());

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      challenges = challenges.filter(c => 
        c.title.toLowerCase().includes(search) || 
        c.description.toLowerCase().includes(search)
      );
    }

    if (filters?.category && filters.category !== "all") {
      challenges = challenges.filter(c => c.category === filters.category);
    }

    if (filters?.difficulty && filters.difficulty !== "all") {
      challenges = challenges.filter(c => c.difficulty === filters.difficulty);
    }

    return challenges.map(c => ({
      ...c,
      competition: this.competitions.get(c.competitionId),
    }));
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = randomUUID();
    const challenge: Challenge = {
      id,
      title: insertChallenge.title,
      description: insertChallenge.description,
      category: insertChallenge.category || null,
      points: insertChallenge.points,
      flagHash: insertChallenge.flagHash,
      caseSensitive: insertChallenge.caseSensitive ?? false,
      normalizeFlag: insertChallenge.normalizeFlag ?? true,
      competitionId: insertChallenge.competitionId,
      difficulty: insertChallenge.difficulty || "MEDIUM",
      solveCount: 0,
      maxAttempts: insertChallenge.maxAttempts || null,
      timeLimit: insertChallenge.timeLimit || null,
      isActive: insertChallenge.isActive ?? true,
      isVisible: insertChallenge.isVisible ?? true,
      isDynamic: insertChallenge.isDynamic ?? false,
      url: insertChallenge.url || null,
      metadata: insertChallenge.metadata || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.challenges.set(id, challenge);
    return challenge;
  }

  async updateChallenge(id: string, data: Partial<Challenge>): Promise<Challenge | undefined> {
    const challenge = this.challenges.get(id);
    if (!challenge) return undefined;
    
    const updated = { ...challenge, ...data, updatedAt: new Date() };
    this.challenges.set(id, updated);
    return updated;
  }

  async deleteChallenge(id: string): Promise<boolean> {
    return this.challenges.delete(id);
  }

  // Teams
  async getTeam(id: string): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async getAllTeams(filters?: { search?: string }): Promise<TeamWithMembers[]> {
    let teams = Array.from(this.teams.values());

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      teams = teams.filter(t => t.name.toLowerCase().includes(search));
    }

    return teams.map(t => ({
      ...t,
      captain: this.users.get(t.captainId),
      memberCount: 1, // Simplified
    }));
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const id = randomUUID();
    const team: Team = {
      id,
      name: insertTeam.name,
      description: insertTeam.description || null,
      competitionId: insertTeam.competitionId,
      captainId: insertTeam.captainId,
      isActive: insertTeam.isActive ?? true,
      maxSize: insertTeam.maxSize || 4,
      inviteCode: insertTeam.inviteCode || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.teams.set(id, team);
    return team;
  }

  async updateTeam(id: string, data: Partial<Team>): Promise<Team | undefined> {
    const team = this.teams.get(id);
    if (!team) return undefined;
    
    const updated = { ...team, ...data, updatedAt: new Date() };
    this.teams.set(id, updated);
    return updated;
  }

  // Submissions
  async getAllSubmissions(filters?: { search?: string; status?: string }): Promise<Submission[]> {
    let submissions = Array.from(this.submissions.values());

    if (filters?.status && filters.status !== "all") {
      const isCorrect = filters.status === "correct";
      submissions = submissions.filter(s => s.isCorrect === isCorrect);
    }

    return submissions;
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = randomUUID();
    const submission: Submission = {
      id,
      userId: insertSubmission.userId,
      challengeId: insertSubmission.challengeId,
      teamId: insertSubmission.teamId || null,
      competitionId: insertSubmission.competitionId,
      isCorrect: insertSubmission.isCorrect,
      points: insertSubmission.points || 0,
      attemptNumber: insertSubmission.attemptNumber || 1,
      ipAddress: insertSubmission.ipAddress || null,
      userAgent: insertSubmission.userAgent || null,
      submittedAt: insertSubmission.submittedAt || new Date(),
      createdAt: new Date(),
    };
    this.submissions.set(id, submission);
    return submission;
  }

  // Leaderboard
  async getLeaderboard(filters?: { competitionId?: string; type?: string }): Promise<LeaderboardEntry[]> {
    // Simplified implementation
    return [];
  }

  // Registrations
  async getAllRegistrations(competitionId?: string): Promise<Registration[]> {
    let regs = Array.from(this.registrations.values());
    if (competitionId) {
      regs = regs.filter(r => r.competitionId === competitionId);
    }
    return regs;
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const id = randomUUID();
    const registration: Registration = {
      id,
      userId: insertRegistration.userId || null,
      teamId: insertRegistration.teamId || null,
      competitionId: insertRegistration.competitionId,
      status: insertRegistration.status || "PENDING",
      registeredAt: new Date(),
      approvedAt: insertRegistration.approvedAt || null,
      rejectedAt: insertRegistration.rejectedAt || null,
      rejectionReason: insertRegistration.rejectionReason || null,
    };
    this.registrations.set(id, registration);
    return registration;
  }

  async updateRegistration(id: string, data: Partial<Registration>): Promise<Registration | undefined> {
    const reg = this.registrations.get(id);
    if (!reg) return undefined;
    
    const updated = { ...reg, ...data };
    this.registrations.set(id, updated);
    return updated;
  }

  // Announcements
  async getAllAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values());
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = randomUUID();
    const announcement: Announcement = {
      id,
      competitionId: insertAnnouncement.competitionId,
      title: insertAnnouncement.title,
      content: insertAnnouncement.content,
      priority: insertAnnouncement.priority || "NORMAL",
      isVisible: insertAnnouncement.isVisible ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.announcements.set(id, announcement);
    return announcement;
  }

  async updateAnnouncement(id: string, data: Partial<Announcement>): Promise<Announcement | undefined> {
    const ann = this.announcements.get(id);
    if (!ann) return undefined;
    
    const updated = { ...ann, ...data, updatedAt: new Date() };
    this.announcements.set(id, updated);
    return updated;
  }

  // Notifications
  async getAllNotifications(userId?: string): Promise<Notification[]> {
    let notifs = Array.from(this.notifications.values());
    if (userId) {
      notifs = notifs.filter(n => n.userId === userId);
    }
    return notifs;
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = {
      id,
      userId: insertNotification.userId || null,
      competitionId: insertNotification.competitionId || null,
      title: insertNotification.title,
      content: insertNotification.content,
      type: insertNotification.type,
      isRead: false,
      createdAt: new Date(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const notif = this.notifications.get(id);
    if (notif) {
      this.notifications.set(id, { ...notif, isRead: true });
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const entries = Array.from(this.notifications.entries());
    for (const [id, notif] of entries) {
      if (notif.userId === userId) {
        this.notifications.set(id, { ...notif, isRead: true });
      }
    }
  }

  // Audit Logs
  async getAllAuditLogs(filters?: { search?: string; action?: string }): Promise<AuditLog[]> {
    let logs = Array.from(this.auditLogs.values());

    if (filters?.action && filters.action !== "all") {
      logs = logs.filter(l => l.action === filters.action);
    }

    return logs;
  }

  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const id = randomUUID();
    const log: AuditLog = {
      id,
      userId: insertLog.userId || null,
      action: insertLog.action,
      entityType: insertLog.entityType,
      entityId: insertLog.entityId || null,
      details: insertLog.details || null,
      ipAddress: insertLog.ipAddress || null,
      userAgent: insertLog.userAgent || null,
      createdAt: new Date(),
    };
    this.auditLogs.set(id, log);
    return log;
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<any> {
    return {
      totalUsers: this.users.size,
      activeCompetitions: Array.from(this.competitions.values()).filter(c => c.status === "ACTIVE").length,
      todaySubmissions: Array.from(this.submissions.values()).filter(s => {
        const today = new Date();
        const subDate = new Date(s.createdAt);
        return subDate.toDateString() === today.toDateString();
      }).length,
      activeTeams: Array.from(this.teams.values()).filter(t => t.isActive).length,
      userGrowth: 12.5,
      competitionGrowth: 8.3,
      submissionGrowth: 23.7,
      teamGrowth: 5.2,
    };
  }

  async getActivityData(): Promise<any[]> {
    const days = 7;
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        submissions: Math.floor(Math.random() * 50) + 10,
        users: Math.floor(Math.random() * 15) + 5,
      });
    }
    
    return data;
  }

  async getTopUsers(): Promise<any[]> {
    const users = Array.from(this.users.values()).slice(0, 5);
    return users.map((u, i) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      points: 1000 - (i * 150),
      solvedChallenges: 25 - (i * 3),
    }));
  }
}

// Use DatabaseStorage for production, MemStorage for development if needed
export const storage = new DatabaseStorage();
