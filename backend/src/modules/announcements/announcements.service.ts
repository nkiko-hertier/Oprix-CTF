import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { EventsService } from '../websockets/events.service';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
  AnnouncementQueryDto,
  AnnouncementListResponseDto,
  AnnouncementResponseDto,
} from './dto/announcement.dto';

/**
 * Announcements Service
 */
@Injectable()
export class AnnouncementsService {
  private readonly logger = new Logger(AnnouncementsService.name);

  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
  ) { }

  /**
   * Create a new announcement for a competition
   */
  async create(
    dto: CreateAnnouncementDto,
    userId: string,
    userRole: string,
    broadcast: boolean = true,
  ): Promise<AnnouncementResponseDto> {
    // Verify competition exists and user has access
    const competition = await this.prisma.competition.findUnique({
      where: { id: dto.competitionId },
      select: { id: true, name: true, adminId: true },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${dto.competitionId} not found`);
    }

    // Only the admin who owns this competition can create announcements
    if (competition.adminId !== userId) {
      throw new ForbiddenException('You can only create announcements for your own competitions');
    }

    // Create the announcement
    const announcement = await this.prisma.announcement.create({
      data: {
        competitionId: dto.competitionId,
        title: dto.title,
        content: dto.content,
        priority: dto.priority || 'NORMAL',
        isVisible: dto.isVisible ?? true,
      },
      include: {
        competition: {
          select: { id: true, name: true },
        },
      },
    });

    this.logger.log(`Announcement created: ${announcement.id} for competition ${dto.competitionId}`);

    // Broadcast to connected clients in real-time
    if (broadcast && announcement.isVisible) {
      await this.broadcastAnnouncement(announcement);
    }

    return this.formatResponse(announcement);
  }

  /**
   * Get all announcements with optional filters
   */
  async findAll(
    query: AnnouncementQueryDto,
    userId: string,
    userRole: string,
  ): Promise<AnnouncementListResponseDto> {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.competitionId) {
      where.competitionId = query.competitionId;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    // Role-based filtering
    if (userRole === 'ADMIN') {
      const ownCompetitions = await this.prisma.competition.findMany({
        where: { adminId: userId },
        select: { id: true },
      });
      const competitionIds = ownCompetitions.map(c => c.id);

      if (query.competitionId) {
        // Verify the requested competition is owned by the admin
        if (!competitionIds.includes(query.competitionId)) {
          throw new ForbiddenException('You can only view announcements for your own competitions');
        }
      } else {
        where.competitionId = { in: competitionIds };
      }

      if (query.isVisible !== undefined) {
        where.isVisible = query.isVisible;
      }
    } else {
      const registrations = await this.prisma.registration.findMany({
        where: { userId, status: 'APPROVED' },
        select: { competitionId: true },
      });
      const registeredCompetitionIds = registrations.map(r => r.competitionId);

      if (query.competitionId) {
        if (!registeredCompetitionIds.includes(query.competitionId)) {
          throw new ForbiddenException('You can only view announcements for competitions you are registered in');
        }
      } else {
        where.competitionId = { in: registeredCompetitionIds };
      }

      // Users only see visible announcements
      where.isVisible = true;
    }

    // Fetch announcements with pagination
    const [announcements, total] = await Promise.all([
      this.prisma.announcement.findMany({
        where,
        include: {
          competition: {
            select: { id: true, name: true },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      this.prisma.announcement.count({ where }),
    ]);

    return {
      data: announcements.map(a => this.formatResponse(a)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get a single announcement by ID
   */
  async findOne(
    id: string,
    userId: string,
    userRole: string,
  ): Promise<AnnouncementResponseDto> {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      include: {
        competition: {
          select: { id: true, name: true, adminId: true },
        },
      },
    });

    if (!announcement) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }

    // Access control
    await this.checkReadAccess(announcement, userId, userRole);

    return this.formatResponse(announcement);
  }

  /**
   * Get announcements for a specific competition
   * Public endpoint for participants to view visible announcements
   */
  async findByCompetition(
    competitionId: string,
    userId: string,
    userRole: string,
    includeHidden: boolean = false,
  ): Promise<AnnouncementResponseDto[]> {
    // Verify competition exists
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      select: { id: true, name: true, adminId: true },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${competitionId} not found`);
    }

    const where: any = { competitionId };

    if (userRole === 'ADMIN') {
      if (competition.adminId !== userId) {
        where.isVisible = true;
      } else if (!includeHidden) {
        where.isVisible = true;
      }
    } else {
      where.isVisible = true;

      const registration = await this.prisma.registration.findFirst({
        where: { userId, competitionId, status: 'APPROVED' },
      });

      if (!registration) {
        throw new ForbiddenException('You must be registered for this competition to view announcements');
      }
    }

    const announcements = await this.prisma.announcement.findMany({
      where,
      include: {
        competition: {
          select: { id: true, name: true },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return announcements.map(a => this.formatResponse(a));
  }

  /**
   * Update an existing announcement
   */
  async update(
    id: string,
    dto: UpdateAnnouncementDto,
    userId: string,
    userRole: string,
  ): Promise<AnnouncementResponseDto> {
    const existing = await this.prisma.announcement.findUnique({
      where: { id },
      include: {
        competition: {
          select: { id: true, name: true, adminId: true },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }

    await this.checkWriteAccess(existing, userId, userRole);

    const { competitionId, ...updateData } = dto;
    if (competitionId && competitionId !== existing.competitionId) {
      throw new BadRequestException('Cannot change the competition of an announcement');
    }

    const updated = await this.prisma.announcement.update({
      where: { id },
      data: updateData,
      include: {
        competition: {
          select: { id: true, name: true },
        },
      },
    });

    this.logger.log(`Announcement updated: ${id}`);

    // If visibility changed to visible, broadcast
    if (!existing.isVisible && updated.isVisible) {
      await this.broadcastAnnouncement(updated);
    }

    return this.formatResponse(updated);
  }

  /**
   * Delete an announcement
   */
  async remove(
    id: string,
    userId: string,
    userRole: string,
  ): Promise<{ success: boolean; message: string }> {
    const existing = await this.prisma.announcement.findUnique({
      where: { id },
      include: {
        competition: {
          select: { adminId: true },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }

    // Check write access
    await this.checkWriteAccess(existing, userId, userRole);

    await this.prisma.announcement.delete({ where: { id } });

    this.logger.log(`Announcement deleted: ${id}`);

    return {
      success: true,
      message: 'Announcement deleted successfully',
    };
  }

  /**
   * Toggle visibility of an announcement
   */
  async toggleVisibility(
    id: string,
    userId: string,
    userRole: string,
  ): Promise<AnnouncementResponseDto> {
    const existing = await this.prisma.announcement.findUnique({
      where: { id },
      include: {
        competition: {
          select: { id: true, name: true, adminId: true },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }

    await this.checkWriteAccess(existing, userId, userRole);

    const updated = await this.prisma.announcement.update({
      where: { id },
      data: { isVisible: !existing.isVisible },
      include: {
        competition: {
          select: { id: true, name: true },
        },
      },
    });

    this.logger.log(`Announcement visibility toggled: ${id} -> ${updated.isVisible}`);

    // Broadcast if now visible
    if (updated.isVisible) {
      await this.broadcastAnnouncement(updated);
    }

    return this.formatResponse(updated);
  }

  /**
   * Broadcast announcement via WebSocket to all connected competition participants
   */
  private async broadcastAnnouncement(announcement: any): Promise<void> {
    try {
      await this.eventsService.notifyCompetitionAnnouncement(
        announcement.competitionId,
        {
          id: announcement.id,
          title: announcement.title,
          content: announcement.content,
          priority: announcement.priority,
          createdAt: announcement.createdAt,
          competition: announcement.competition,
        },
      );

      this.logger.log(`Announcement broadcast: ${announcement.id} to competition ${announcement.competitionId}`);
    } catch (error) {
      this.logger.error(`Failed to broadcast announcement ${announcement.id}`, error);
    }
  }

  /**
   * Check if user has read access to an announcement
   */
  private async checkReadAccess(
    announcement: any,
    userId: string,
    userRole: string,
  ): Promise<void> {
    if (userRole === 'ADMIN') {
      if (announcement.competition.adminId === userId) {
        return; // Own competition
      }
      if (announcement.isVisible) {
        return;
      }
      throw new ForbiddenException('You do not have access to this announcement');
    }

    // Regular user
    if (!announcement.isVisible) {
      throw new ForbiddenException('This announcement is not available');
    }

    // Check registration
    const registration = await this.prisma.registration.findFirst({
      where: {
        userId,
        competitionId: announcement.competitionId,
        status: 'APPROVED',
      },
    });

    if (!registration) {
      throw new ForbiddenException('You must be registered for this competition');
    }
  }

  /**
   * Check if user has write access to an announcement
   */
  private async checkWriteAccess(
    announcement: any,
    userId: string,
    userRole: string,
  ): Promise<void> {
    if (userRole === 'ADMIN') {
      if (announcement.competition.adminId === userId) {
        return; // Own competition
      }
      throw new ForbiddenException('You can only modify announcements for your own competitions');
    }

    throw new ForbiddenException('You do not have permission to modify announcements');
  }

  /**
   * Format announcement for response
   */
  private formatResponse(announcement: any): AnnouncementResponseDto {
    return {
      id: announcement.id,
      competitionId: announcement.competitionId,
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      isVisible: announcement.isVisible,
      createdAt: announcement.createdAt,
      updatedAt: announcement.updatedAt,
      competition: announcement.competition
        ? {
          id: announcement.competition.id,
          name: announcement.competition.name,
        }
        : undefined,
    };
  }

  /**
   * Get announcement statistics for a competition
   */
  async getStats(
    competitionId: string,
    userId: string,
    userRole: string,
  ): Promise<{
    total: number;
    visible: number;
    hidden: number;
    byPriority: Record<string, number>;
  }> {
    // Verify access
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      select: { id: true, adminId: true },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${competitionId} not found`);
    }

    // Only the admin who owns this competition can view stats
    if (competition.adminId !== userId) {
      throw new ForbiddenException('You can only view stats for your own competitions');
    }

    const [total, visible, byPriority] = await Promise.all([
      this.prisma.announcement.count({ where: { competitionId } }),
      this.prisma.announcement.count({ where: { competitionId, isVisible: true } }),
      this.prisma.announcement.groupBy({
        by: ['priority'],
        where: { competitionId },
        _count: { id: true },
      }),
    ]);

    const priorityStats: Record<string, number> = {};
    byPriority.forEach(p => {
      priorityStats[p.priority] = p._count.id;
    });

    return {
      total,
      visible,
      hidden: total - visible,
      byPriority: priorityStats,
    };
  }
}
