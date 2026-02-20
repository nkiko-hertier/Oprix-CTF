import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CreateInstanceDto } from './dto/create-instance.dto';
import { InstanceQueryDto } from './dto/instance-query.dto';
import { InstanceResponseDto } from './dto/instance-response.dto';

@Injectable()
export class InstancesService {
  private readonly logger = new Logger(InstancesService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Check if an instance has expired
   */
  private isExpired(instance: { createdAt: Date; duration: number }): boolean {
    const expirationTime = new Date(instance.createdAt.getTime() + instance.duration * 1000);
    return new Date() > expirationTime;
  }

  /**
   * Calculate expiration time for an instance
   */
  private getExpiresAt(instance: { createdAt: Date; duration: number }): Date {
    return new Date(instance.createdAt.getTime() + instance.duration * 1000);
  }

  /**
   * Convert instance to response DTO
   */
  private toResponseDto(instance: any): InstanceResponseDto {
    return {
      id: instance.id,
      challengeId: instance.challengeId,
      userId: instance.userId,
      duration: instance.duration,
      githubUrl: instance.githubUrl,
      port: instance.port || null,
      hostname: instance.hostname || null,
      createdAt: instance.createdAt,
      expiresAt: this.getExpiresAt(instance),
      isExpired: this.isExpired(instance),
    };
  }

  /**
   * Validate that challenge exists and is marked as dynamic
   */
  private async validateChallenge(challengeId: string): Promise<any> {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
      select: {
        id: true,
        title: true,
        isDynamic: true,
        timeLimit: true,
        url: true,
        isActive: true,
      },
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    if (!challenge.isDynamic) {
      throw new BadRequestException('This challenge is not a dynamic challenge');
    }

    if (!challenge.isActive) {
      throw new BadRequestException('This challenge is not active');
    }

    if (!challenge.timeLimit) {
      throw new BadRequestException(
        'This dynamic challenge does not have a time limit set',
      );
    }

    return challenge;
  }

  /**
   * Create a new instance for a user on a challenge
   */
  async create(
    createInstanceDto: CreateInstanceDto,
    userId: string,
  ): Promise<InstanceResponseDto> {
    try {
      const challenge = await this.validateChallenge(
        createInstanceDto.challengeId,
      );

      // Check if user already has an active instance for this challenge
      const existingInstance = await this.prisma.instance.findUnique({
        where: {
          userId_challengeId: {
            userId,
            challengeId: createInstanceDto.challengeId,
          },
        },
      });

      if (existingInstance && !this.isExpired(existingInstance)) {
        // Return existing active instance
        this.logger.log(
          `User ${userId} already has an active instance for challenge ${createInstanceDto.challengeId}`,
        );
        return this.toResponseDto(existingInstance);
      }

      // Create new instance
      const instance = await this.prisma.instance.create({
        data: {
          userId,
          challengeId: createInstanceDto.challengeId,
          duration: challenge.timeLimit,
          githubUrl: challenge.url,
          port: createInstanceDto.port || null,
          hostname: createInstanceDto.hostname || null,
        },
      });

      this.logger.log(
        `Created instance ${instance.id} for user ${userId} on challenge ${createInstanceDto.challengeId}`,
      );

      return this.toResponseDto(instance);
    } catch (error) {
      this.logger.error(
        `Failed to create instance for user ${userId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get instances with filtering and pagination
   */
  async findAll(
    query: InstanceQueryDto,
    userId?: string,
    role?: string,
  ): Promise<{
    data: InstanceResponseDto[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    try {
      const where: any = {};

      // Apply filters
      if (query.userId) {
        // Users can only see their own instances unless they're admins
        if (userId !== query.userId && role !== 'ADMIN' && role !== 'SUPERADMIN') {
          throw new ForbiddenException(
            'You can only view your own instances',
          );
        }
        where.userId = query.userId;
      }

      if (query.challengeId) {
        where.challengeId = query.challengeId;
      }

      if (query.port) {
        where.port = query.port;
      }

      if (query.hostname) {
        where.hostname = {
          contains: query.hostname,
          mode: 'insensitive',
        };
      }

      // Get total count before pagination
      const total = await this.prisma.instance.count({ where });

      // Get paginated results
      const page = query.page || 1;
      const limit = query.limit || 10;
      const skip = (page - 1) * limit;

      const instances = await this.prisma.instance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      // Filter by expiration status if requested
      let filtered = instances;
      if (query.isExpired !== undefined) {
        filtered = instances.filter((inst) => this.isExpired(inst) === query.isExpired);
      }

      return {
        data: filtered.map((inst) => this.toResponseDto(inst)),
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Failed to fetch instances', error);
      throw error;
    }
  }

  /**
   * Get instance by ID
   */
  async findById(instanceId: string, userId?: string): Promise<InstanceResponseDto> {
    try {
      const instance = await this.prisma.instance.findUnique({
        where: { id: instanceId },
      });

      if (!instance) {
        throw new NotFoundException('Instance not found');
      }

      // Check permissions - users can only view their own instances
      if (userId && instance.userId !== userId) {
        throw new ForbiddenException('You can only view your own instances');
      }

      return this.toResponseDto(instance);
    } catch (error) {
      this.logger.error(`Failed to fetch instance ${instanceId}`, error);
      throw error;
    }
  }

  /**
   * Delete expired instances
   */
  async deleteExpired(): Promise<{ deletedCount: number }> {
    try {
      // Get all instances
      const allInstances = await this.prisma.instance.findMany();

      // Filter expired ones
      const expiredIds = allInstances
        .filter((inst) => this.isExpired(inst))
        .map((inst) => inst.id);

      // Delete expired instances
      const result = await this.prisma.instance.deleteMany({
        where: {
          id: { in: expiredIds },
        },
      });

      this.logger.log(`Deleted ${result.count} expired instances`);

      return { deletedCount: result.count };
    } catch (error) {
      this.logger.error('Failed to delete expired instances', error);
      throw error;
    }
  }

  /**
   * Get active instance for a user on a specific challenge
   */
  async getActiveInstance(
    userId: string,
    challengeId: string,
  ): Promise<InstanceResponseDto | null> {
    try {
      const instance = await this.prisma.instance.findUnique({
        where: {
          userId_challengeId: { userId, challengeId },
        },
      });

      if (!instance || this.isExpired(instance)) {
        return null;
      }

      return this.toResponseDto(instance);
    } catch (error) {
      this.logger.error(
        `Failed to get active instance for user ${userId} and challenge ${challengeId}`,
        error,
      );
      return null;
    }
  }
}
