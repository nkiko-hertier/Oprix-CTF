// Seed script for development database
import { db } from "./db";
import { users, profiles, competitions, challenges, teams, teamMembers, scores, submissions, registrations, announcements, notifications, auditLogs } from "@shared/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data (in development only!)
  console.log("Clearing existing data...");
  await db.delete(auditLogs);
  await db.delete(notifications);
  await db.delete(announcements);
  await db.delete(scores);
  await db.delete(submissions);
  await db.delete(registrations);
  await db.delete(teamMembers);
  await db.delete(teams);
  await db.delete(challenges);
  await db.delete(competitions);
  await db.delete(profiles);
  await db.delete(users);
  console.log("Data cleared.");

  // Create admin users
  const adminUser = await db.insert(users).values({
    id: randomUUID(),
    clerkId: "clerk_admin_1",
    username: "admin",
    email: "admin@example.com",
    role: "ADMIN",
    isActive: true,
    lastLoginAt: null,
  }).returning();

  const superAdminUser = await db.insert(users).values({
    id: randomUUID(),
    clerkId: "clerk_superadmin_1",
    username: "superadmin",
    email: "superadmin@example.com",
    role: "SUPERADMIN",
    isActive: true,
    lastLoginAt: null,
  }).returning();

  // Create profiles for admins
  await db.insert(profiles).values({
    id: randomUUID(),
    userId: adminUser[0].id,
    firstName: "Admin",
    lastName: "User",
    bio: "Platform administrator",
    avatarUrl: null,
    country: "USA",
    website: null,
    github: null,
    linkedin: null,
    skills: ["administration", "management"],
  });

  await db.insert(profiles).values({
    id: randomUUID(),
    userId: superAdminUser[0].id,
    firstName: "Super",
    lastName: "Admin",
    bio: "Platform super administrator",
    avatarUrl: null,
    country: "USA",
    website: null,
    github: null,
    linkedin: null,
    skills: ["administration", "security", "management"],
  });

  // Create sample regular users
  const regularUsers = [];
  for (let i = 1; i <= 5; i++) {
    const user = await db.insert(users).values({
      id: randomUUID(),
      clerkId: `clerk_user_${i}`,
      username: `user${i}`,
      email: `user${i}@example.com`,
      role: "USER",
      isActive: true,
      lastLoginAt: null,
    }).returning();

    regularUsers.push(user[0]);

    await db.insert(profiles).values({
      id: randomUUID(),
      userId: user[0].id,
      firstName: `User`,
      lastName: `${i}`,
      bio: `CTF enthusiast #${i}`,
      avatarUrl: null,
      country: "USA",
      website: null,
      github: `user${i}`,
      linkedin: null,
      skills: ["web", "crypto", "reverse"],
    });
  }

  // Create sample competitions
  const competition1 = await db.insert(competitions).values({
    id: randomUUID(),
    name: "spring-ctf-2024",
    title: "Spring CTF 2024",
    description: "Annual spring capture the flag competition",
    startTime: new Date("2024-03-01"),
    endTime: new Date("2024-03-31"),
    adminId: adminUser[0].id,
    status: "ACTIVE",
    isPublic: true,
    isTeamBased: true,
    maxTeams: 50,
    maxUsers: 200,
    registrationDeadline: new Date("2024-02-28"),
    rules: "Follow standard CTF rules",
    prizes: "$5000 in prizes",
  }).returning();

  const competition2 = await db.insert(competitions).values({
    id: randomUUID(),
    name: "summer-ctf-2024",
    title: "Summer CTF 2024",
    description: "Summer cybersecurity challenge",
    startTime: new Date("2024-06-01"),
    endTime: new Date("2024-06-30"),
    adminId: adminUser[0].id,
    status: "DRAFT",
    isPublic: true,
    isTeamBased: false,
    maxTeams: null,
    maxUsers: 100,
    registrationDeadline: new Date("2024-05-31"),
    rules: "Individual competition",
    prizes: "$3000 in prizes",
  }).returning();

  // Create sample challenges
  const challenge1 = await db.insert(challenges).values({
    id: randomUUID(),
    title: "Web Challenge 1",
    description: "Find the hidden flag in the web application",
    category: "web",
    points: 100,
    flagHash: await bcrypt.hash("FLAG{web_vuln_found}", 10),
    caseSensitive: true,
    normalizeFlag: true,
    competitionId: competition1[0].id,
    difficulty: "EASY",
    solveCount: 0,
    maxAttempts: null,
    timeLimit: null,
    isActive: true,
    isVisible: true,
    isDynamic: false,
    url: "http://challenge1.example.com",
    metadata: null,
  }).returning();

  const challenge2 = await db.insert(challenges).values({
    id: randomUUID(),
    title: "Crypto Challenge 1",
    description: "Decrypt the message to get the flag",
    category: "crypto",
    points: 200,
    flagHash: await bcrypt.hash("FLAG{crypto_solved}", 10),
    caseSensitive: true,
    normalizeFlag: true,
    competitionId: competition1[0].id,
    difficulty: "MEDIUM",
    solveCount: 0,
    maxAttempts: null,
    timeLimit: null,
    isActive: true,
    isVisible: true,
    isDynamic: false,
    url: null,
    metadata: null,
  }).returning();

  const challenge3 = await db.insert(challenges).values({
    id: randomUUID(),
    title: "Reverse Engineering Challenge",
    description: "Reverse the binary to find the flag",
    category: "reverse",
    points: 300,
    flagHash: await bcrypt.hash("FLAG{reversed_successfully}", 10),
    caseSensitive: true,
    normalizeFlag: true,
    competitionId: competition1[0].id,
    difficulty: "HARD",
    solveCount: 0,
    maxAttempts: null,
    timeLimit: null,
    isActive: true,
    isVisible: true,
    isDynamic: false,
    url: null,
    metadata: null,
  }).returning();

  // Create sample team
  const team1 = await db.insert(teams).values({
    id: randomUUID(),
    name: "Elite Hackers",
    description: "Top cybersecurity team",
    competitionId: competition1[0].id,
    captainId: regularUsers[0].id,
    isActive: true,
    maxSize: 4,
    inviteCode: "ELITE2024",
  }).returning();

  // Create team members (captain + 2 additional members)
  await db.insert(teamMembers).values({
    id: randomUUID(),
    teamId: team1[0].id,
    userId: regularUsers[0].id, // Captain
    role: "CAPTAIN",
    joinedAt: new Date(),
  });

  await db.insert(teamMembers).values({
    id: randomUUID(),
    teamId: team1[0].id,
    userId: regularUsers[1].id,
    role: "MEMBER",
    joinedAt: new Date(),
  });

  await db.insert(teamMembers).values({
    id: randomUUID(),
    teamId: team1[0].id,
    userId: regularUsers[2].id,
    role: "MEMBER",
    joinedAt: new Date(),
  });

  // Create sample registrations
  for (let i = 0; i < regularUsers.length; i++) {
    const user = regularUsers[i];
    
    await db.insert(registrations).values({
      id: randomUUID(),
      userId: user.id,
      teamId: i < 3 ? team1[0].id : null,
      competitionId: competition1[0].id,
      status: "APPROVED",
      registeredAt: new Date(),
      approvedAt: new Date(),
      rejectedAt: null,
      rejectionReason: null,
    });
  }

  // Create sample submissions first (needed for scores)
  const submissionsData = [];
  for (let i = 0; i < regularUsers.length; i++) {
    const user = regularUsers[i];
    
    const submission = await db.insert(submissions).values({
      id: randomUUID(),
      userId: user.id,
      challengeId: challenge1[0].id,
      teamId: i < 2 ? team1[0].id : null,
      competitionId: competition1[0].id,
      isCorrect: i < 3,
      points: i < 3 ? 100 : 0,
      attemptNumber: 1,
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0",
      submittedAt: new Date(),
    }).returning();
    
    submissionsData.push(submission[0]);
  }

  // Create sample scores (linked to submissions)
  for (let i = 0; i < regularUsers.length; i++) {
    const user = regularUsers[i];
    const points = 300 - (i * 50);
    
    await db.insert(scores).values({
      id: randomUUID(),
      userId: user.id,
      challengeId: challenge1[0].id,
      competitionId: competition1[0].id,
      teamId: i < 2 ? team1[0].id : null,
      submissionId: submissionsData[i].id,
      points: points,
      solvedAt: new Date(),
    });
  }

  // Create sample announcements
  await db.insert(announcements).values({
    id: randomUUID(),
    competitionId: competition1[0].id,
    title: "Welcome to Spring CTF!",
    content: "The competition has officially started. Good luck to all participants!",
    priority: "HIGH",
    isVisible: true,
  });

  await db.insert(announcements).values({
    id: randomUUID(),
    competitionId: competition1[0].id,
    title: "Maintenance Notice",
    content: "Challenge servers will undergo brief maintenance at 2 PM UTC.",
    priority: "NORMAL",
    isVisible: true,
  });

  // Create sample notifications
  for (const user of regularUsers) {
    await db.insert(notifications).values({
      id: randomUUID(),
      userId: user.id,
      competitionId: competition1[0].id,
      title: "Competition Started",
      content: "Spring CTF 2024 has begun. Visit the challenges page to get started!",
      type: "INFO",
      isRead: false,
    });
  }

  // Create sample audit logs
  await db.insert(auditLogs).values({
    id: randomUUID(),
    userId: adminUser[0].id,
    action: "CREATE",
    entityType: "competition",
    entityId: competition1[0].id,
    details: "Created Spring CTF 2024 competition",
    ipAddress: "127.0.0.1",
    userAgent: "Mozilla/5.0",
  });

  await db.insert(auditLogs).values({
    id: randomUUID(),
    userId: superAdminUser[0].id,
    action: "UPDATE",
    entityType: "user",
    entityId: regularUsers[0].id,
    details: "Updated user role to ADMIN",
    ipAddress: "127.0.0.1",
    userAgent: "Mozilla/5.0",
  });

  console.log("✅ Database seeded successfully!");
  console.log(`Created ${regularUsers.length + 2} users`);
  console.log(`Created 2 competitions`);
  console.log(`Created 3 challenges`);
  console.log(`Created 1 team with 3 members`);
  console.log(`Created ${regularUsers.length} registrations`);
  console.log(`Created ${regularUsers.length} scores`);
  console.log(`Created ${regularUsers.length} submissions`);
  console.log(`Created 2 announcements`);
  console.log(`Created ${regularUsers.length} notifications`);
  console.log(`Created 2 audit logs`);

  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
