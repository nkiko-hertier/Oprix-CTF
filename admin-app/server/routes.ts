import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard Stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/dashboard/activity", async (req, res) => {
    try {
      const activity = await storage.getActivityData();
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activity data" });
    }
  });

  app.get("/api/dashboard/top-users", async (req, res) => {
    try {
      const topUsers = await storage.getTopUsers();
      res.json(topUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top users" });
    }
  });

  // Users
  app.get("/api/users", async (req, res) => {
    try {
      const { page, search, role } = req.query;
      const result = await storage.getAllUsers({
        search: search as string,
        role: role as string,
        page: page ? parseInt(page as string) : 1,
        limit: 20,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const profile = await storage.getProfile(user.id);
      res.json({ ...user, profile });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.patch("/api/users/:id/role", async (req, res) => {
    try {
      const { role } = req.body;
      const user = await storage.updateUserRole(req.params.id, role);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user role" });
    }
  });

  app.patch("/api/users/:id/status", async (req, res) => {
    try {
      const { isActive } = req.body;
      const user = await storage.updateUserStatus(req.params.id, isActive);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user status" });
    }
  });

  // Competitions
  app.get("/api/competitions", async (req, res) => {
    try {
      const { status } = req.query;
      const competitions = await storage.getAllCompetitions({ status: status as string });
      res.json(competitions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch competitions" });
    }
  });

  app.get("/api/competitions/list", async (req, res) => {
    try {
      const competitions = await storage.getAllCompetitions();
      const list = competitions.map(c => ({ id: c.id, title: c.title }));
      res.json(list);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch competition list" });
    }
  });

  app.get("/api/competitions/:id", async (req, res) => {
    try {
      const competition = await storage.getCompetition(req.params.id);
      if (!competition) {
        return res.status(404).json({ error: "Competition not found" });
      }
      res.json(competition);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch competition" });
    }
  });

  app.post("/api/competitions", async (req, res) => {
    try {
      const competition = await storage.createCompetition(req.body);
      res.status(201).json(competition);
    } catch (error) {
      res.status(500).json({ error: "Failed to create competition" });
    }
  });

  app.put("/api/competitions/:id", async (req, res) => {
    try {
      const competition = await storage.updateCompetition(req.params.id, req.body);
      if (!competition) {
        return res.status(404).json({ error: "Competition not found" });
      }
      res.json(competition);
    } catch (error) {
      res.status(500).json({ error: "Failed to update competition" });
    }
  });

  app.delete("/api/competitions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCompetition(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Competition not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete competition" });
    }
  });

  // Challenges
  app.get("/api/challenges", async (req, res) => {
    try {
      const { search, category, difficulty } = req.query;
      const challenges = await storage.getAllChallenges({
        search: search as string,
        category: category as string,
        difficulty: difficulty as string,
      });
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch challenges" });
    }
  });

  app.get("/api/challenges/:id", async (req, res) => {
    try {
      const challenge = await storage.getChallenge(req.params.id);
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch challenge" });
    }
  });

  app.post("/api/challenges", async (req, res) => {
    try {
      const challenge = await storage.createChallenge(req.body);
      res.status(201).json(challenge);
    } catch (error) {
      res.status(500).json({ error: "Failed to create challenge" });
    }
  });

  app.put("/api/challenges/:id", async (req, res) => {
    try {
      const challenge = await storage.updateChallenge(req.params.id, req.body);
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ error: "Failed to update challenge" });
    }
  });

  app.delete("/api/challenges/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteChallenge(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Challenge not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete challenge" });
    }
  });

  // Teams
  app.get("/api/teams", async (req, res) => {
    try {
      const { search } = req.query;
      const teams = await storage.getAllTeams({ search: search as string });
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getTeam(req.params.id);
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team" });
    }
  });

  app.post("/api/teams", async (req, res) => {
    try {
      const team = await storage.createTeam(req.body);
      res.status(201).json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to create team" });
    }
  });

  // Submissions
  app.get("/api/submissions", async (req, res) => {
    try {
      const { search, status } = req.query;
      const submissions = await storage.getAllSubmissions({
        search: search as string,
        status: status as string,
      });
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.post("/api/submissions", async (req, res) => {
    try {
      const submission = await storage.createSubmission(req.body);
      res.status(201).json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to create submission" });
    }
  });

  // Leaderboards
  app.get("/api/leaderboards", async (req, res) => {
    try {
      const { competitionId, type } = req.query;
      const leaderboard = await storage.getLeaderboard({
        competitionId: competitionId as string,
        type: type as string,
      });
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Registrations
  app.get("/api/registrations", async (req, res) => {
    try {
      const { competitionId } = req.query;
      const registrations = await storage.getAllRegistrations(competitionId as string);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch registrations" });
    }
  });

  app.post("/api/registrations", async (req, res) => {
    try {
      const registration = await storage.createRegistration(req.body);
      res.status(201).json(registration);
    } catch (error) {
      res.status(500).json({ error: "Failed to create registration" });
    }
  });

  app.patch("/api/registrations/:id", async (req, res) => {
    try {
      const registration = await storage.updateRegistration(req.params.id, req.body);
      if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
      }
      res.json(registration);
    } catch (error) {
      res.status(500).json({ error: "Failed to update registration" });
    }
  });

  // Announcements
  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await storage.getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });

  app.post("/api/announcements", async (req, res) => {
    try {
      const announcement = await storage.createAnnouncement(req.body);
      res.status(201).json(announcement);
    } catch (error) {
      res.status(500).json({ error: "Failed to create announcement" });
    }
  });

  app.put("/api/announcements/:id", async (req, res) => {
    try {
      const announcement = await storage.updateAnnouncement(req.params.id, req.body);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      res.status(500).json({ error: "Failed to update announcement" });
    }
  });

  // Notifications
  app.get("/api/notifications", async (req, res) => {
    try {
      const { userId } = req.query;
      const notifications = await storage.getAllNotifications(userId as string);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notification = await storage.createNotification(req.body);
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ error: "Failed to create notification" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  app.patch("/api/notifications/mark-all-read", async (req, res) => {
    try {
      const { userId } = req.body;
      await storage.markAllNotificationsAsRead(userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });

  // Audit Logs
  app.get("/api/audit-logs", async (req, res) => {
    try {
      const { search, action } = req.query;
      const logs = await storage.getAllAuditLogs({
        search: search as string,
        action: action as string,
      });
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  app.post("/api/audit-logs", async (req, res) => {
    try {
      const log = await storage.createAuditLog(req.body);
      res.status(201).json(log);
    } catch (error) {
      res.status(500).json({ error: "Failed to create audit log" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
