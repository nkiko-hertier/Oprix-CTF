import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import {
  DashboardOverviewResponseDto,
  DashboardStatsDto,
  ActivityDataPointDto,
  TopUserDto,
} from './dto/dashboard.dto';

/**
 * Dashboard Service
 * 
 * Provides unified dashboard analytics that work differently based on user role:
 * - SUPERADMIN: Platform-wide statistics (all competitions, all users)
 * - ADMIN: Only their own competitions and registered players
 * 
 */
@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get dashboard overview based on user role
   * 
   * @param userId - The authenticated user's ID
   * @param userRole - The user's role (ADMIN or SUPERADMIN)
   * @param competitionId - Optional filter for specific competition
   */
  async getOverview(
    userId: string,
    userRole: string,
    competitionId?: string,
  ): Promise<DashboardOverviewResponseDto> {
    // Determine competition scope based on role
    const competitionIds = await this.getCompetitionScope(userId, userRole, competitionId);

    // Fetch all dashboard data in parallel
    const [stats, activityData, topUsers] = await Promise.all([
      this.getStats(competitionIds, userRole),
      this.getActivityData(competitionIds),
      this.getTopUsers(competitionIds),
    ]);

    return {
      stats,
      activityData,
      topUsers,
    };
  }

  /**
   * Determine which competitions to include based on role
   */
  private async getCompetitionScope(
    userId: string,
    userRole: string,
    competitionId?: string,
  ): Promise<string[] | null> {
    // SUPERADMIN: Access to all competitions
    if (userRole === 'SUPERADMIN') {
      if (competitionId) {
        // Verify competition exists
        const comp = await this.prisma.competition.findUnique({
          where: { id: competitionId },
          select: { id: true },
        });
        return comp ? [competitionId] : [];
      }
      return null; // If no fitler, return all competitions
    }

    // ADMIN: Only their own competitions
    if (userRole === 'ADMIN') {
      const adminCompetitions = await this.prisma.competition.findMany({
        where: {
          adminId: userId,
          ...(competitionId ? { id: competitionId } : {}),
        },
        select: { id: true },
      });

      // If filtering by competitionId, verify ownership
      if (competitionId && adminCompetitions.length === 0) {
        throw new ForbiddenException('Competition not found or access denied');
      }

      return adminCompetitions.map(c => c.id);
    }

    // Other roles shouldn't access this endpoint
    throw new ForbiddenException('Access denied');
  }

  /**
   * Get summary statistics
   */
  private async getStats(
    competitionIds: string[] | null,
    userRole: string,
  ): Promise<DashboardStatsDto> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date(today);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Build where clause based on competition scope
    const competitionFilter = competitionIds ? { competitionId: { in: competitionIds } } : {};
    const competitionFilterForTeams = competitionIds ? { competitionId: { in: competitionIds } } : {};

    // For users count, we need to count users registered in these competitions
    let totalUsers: number;
    let usersLast30Days: number;
    let usersPrevious30Days: number;

    if (competitionIds === null) {
      // SUPERADMIN: Count all users
      [totalUsers, usersLast30Days, usersPrevious30Days] = await Promise.all([
        this.prisma.user.count({ where: { role: 'USER' } }),
        this.prisma.user.count({
          where: { role: 'USER', createdAt: { gte: thirtyDaysAgo } },
        }),
        this.prisma.user.count({
          where: {
            role: 'USER',
            createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
          },
        }),
      ]);
    } else {
      // ADMIN: Count unique users registered in their competitions
      const [currentUsers, last30Users, prev30Users] = await Promise.all([
        this.prisma.registration.findMany({
          where: { ...competitionFilter, status: 'APPROVED' },
          select: { userId: true },
          distinct: ['userId'],
        }),
        this.prisma.registration.findMany({
          where: {
            ...competitionFilter,
            status: 'APPROVED',
            registeredAt: { gte: thirtyDaysAgo },
          },
          select: { userId: true },
          distinct: ['userId'],
        }),
        this.prisma.registration.findMany({
          where: {
            ...competitionFilter,
            status: 'APPROVED',
            registeredAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
          },
          select: { userId: true },
          distinct: ['userId'],
        }),
      ]);
      totalUsers = currentUsers.length;
      usersLast30Days = last30Users.length;
      usersPrevious30Days = prev30Users.length;
    }

    // Competition counts
    const competitionWhere = competitionIds
      ? { id: { in: competitionIds } }
      : {};

    const [
      activeCompetitions,
      competitionsLast30Days,
      competitionsPrevious30Days,
    ] = await Promise.all([
      this.prisma.competition.count({
        where: { ...competitionWhere, status: 'ACTIVE' },
      }),
      this.prisma.competition.count({
        where: { ...competitionWhere, createdAt: { gte: thirtyDaysAgo } },
      }),
      this.prisma.competition.count({
        where: {
          ...competitionWhere,
          createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        },
      }),
    ]);

    // Submission counts
    const submissionWhere = competitionIds
      ? { competitionId: { in: competitionIds } }
      : {};

    const [
      todaySubmissions,
      submissionsLast30Days,
      submissionsPrevious30Days,
    ] = await Promise.all([
      this.prisma.submission.count({
        where: { ...submissionWhere, createdAt: { gte: today } },
      }),
      this.prisma.submission.count({
        where: { ...submissionWhere, createdAt: { gte: thirtyDaysAgo } },
      }),
      this.prisma.submission.count({
        where: {
          ...submissionWhere,
          createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        },
      }),
    ]);

    // Team counts
    const teamWhere = competitionIds
      ? { competitionId: { in: competitionIds } }
      : {};

    const [activeTeams, teamsLast30Days, teamsPrevious30Days] = await Promise.all([
      this.prisma.team.count({ where: teamWhere }),
      this.prisma.team.count({
        where: { ...teamWhere, createdAt: { gte: thirtyDaysAgo } },
      }),
      this.prisma.team.count({
        where: {
          ...teamWhere,
          createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        },
      }),
    ]);

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      totalUsers,
      activeCompetitions,
      todaySubmissions,
      activeTeams,
      userGrowth: calculateGrowth(usersLast30Days, usersPrevious30Days),
      competitionGrowth: calculateGrowth(competitionsLast30Days, competitionsPrevious30Days),
      submissionGrowth: calculateGrowth(submissionsLast30Days, submissionsPrevious30Days),
      teamGrowth: calculateGrowth(teamsLast30Days, teamsPrevious30Days),
    };
  }

  /**
   * Get activity data for the last 7 days
   */
  private async getActivityData(
    competitionIds: string[] | null,
  ): Promise<ActivityDataPointDto[]> {
    const activityData: ActivityDataPointDto[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const dateStr = startOfDay.toISOString().split('T')[0];

      // Submission count for this day
      const submissionWhere = competitionIds
        ? { competitionId: { in: competitionIds }, createdAt: { gte: startOfDay, lt: endOfDay } }
        : { createdAt: { gte: startOfDay, lt: endOfDay } };

      const submissions = await this.prisma.submission.count({ where: submissionWhere });

      // User count for this day
      let users: number;
      if (competitionIds === null) {
        // SUPERADMIN: New users created on this day
        users = await this.prisma.user.count({
          where: {
            role: 'USER',
            createdAt: { gte: startOfDay, lt: endOfDay },
          },
        });
      } else {
        // ADMIN: New registrations on this day
        const registrations = await this.prisma.registration.findMany({
          where: {
            competitionId: { in: competitionIds },
            registeredAt: { gte: startOfDay, lt: endOfDay },
          },
          select: { userId: true },
          distinct: ['userId'],
        });
        users = registrations.length;
      }

      activityData.push({
        date: dateStr,
        submissions,
        users,
      });
    }

    return activityData;
  }

  /**
   * Get top 5 users by points
   */
  private async getTopUsers(competitionIds: string[] | null): Promise<TopUserDto[]> {
    // Get scores grouped by user
    const scoreWhere = competitionIds
      ? { competitionId: { in: competitionIds } }
      : {};

    const userScores = await this.prisma.score.groupBy({
      by: ['userId'],
      where: scoreWhere,
      _sum: { points: true },
      orderBy: { _sum: { points: 'desc' } },
      take: 5,
    });

    // Get user details and solve counts
    const topUsers: TopUserDto[] = [];

    for (const score of userScores) {
      if (!score.userId) continue;

      const user = await this.prisma.user.findUnique({
        where: { id: score.userId },
        select: {
          id: true,
          username: true,
          email: true,
          profile: {
            select: { avatarUrl: true },
          },
        },
      });

      if (!user) continue;

      // Count solved challenges
      const solveWhere = competitionIds
        ? { userId: score.userId, competitionId: { in: competitionIds }, isCorrect: true }
        : { userId: score.userId, isCorrect: true };

      const solvedChallenges = await this.prisma.submission.count({
        where: solveWhere,
      });

      // Generate avatar URL if not set
      const avatarUrl = user.profile?.avatarUrl || 
        `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.username)}`;

      topUsers.push({
        id: user.id,
        username: user.username,
        email: user.email,
        points: score._sum.points || 0,
        solvedChallenges,
        avatarUrl,
      });
    }

    return topUsers;
  }
}
