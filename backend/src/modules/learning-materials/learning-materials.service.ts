import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import {
  CreateLearningMaterialDto,
  UpdateLearningMaterialDto,
  LearningMaterialQueryDto,
  LearningMaterialResponseDto,
  LearningMaterialListResponseDto,
} from './dto/learning-material.dto';

@Injectable()
export class LearningMaterialsService {
  private readonly logger = new Logger(LearningMaterialsService.name);

  constructor(private prisma: PrismaService) { }

  /**
   * Create a new learning material (ADMIN or CREATOR only)
   */
  async create(
    dto: CreateLearningMaterialDto,
    userId: string,
  ): Promise<LearningMaterialResponseDto> {
    const material = await this.prisma.learningMaterial.create({
      data: {
        title: dto.title,
        description: dto.description,
        thumbnailUrl: dto.thumbnailUrl,
        linkUrl: dto.linkUrl,
        resources: (dto.resources || []) as any,
        isVisible: dto.isVisible ?? true,
        createdByUserId: userId,
      },
      include: {
        createdBy: {
          select: { id: true, username: true },
        },
      },
    });

    this.logger.log(`Learning material created: ${material.title} by user ${userId}`);

    return this.formatResponse(material);
  }

  /**
   * Get all learning materials with pagination
   * ADMIN and CREATOR can see all; regular users see onlt visible ones
   */
  async findAll(
    query: LearningMaterialQueryDto,
    userId: string,
    userRole: string,
  ): Promise<LearningMaterialListResponseDto> {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (userRole === 'USER') {
      where.isVisible = true;
    }

    if (query.createdBy) {
      where.createdByUserId = query.createdBy;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [materials, total] = await Promise.all([
      this.prisma.learningMaterial.findMany({
        where,
        include: {
          createdBy: {
            select: { id: true, username: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.learningMaterial.count({ where }),
    ]);

    return {
      data: materials.map((m) => this.formatResponse(m)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get a single learning material by ID
   */
  async findOne(
    id: string,
    userId: string,
    userRole: string,
  ): Promise<LearningMaterialResponseDto> {
    const material = await this.prisma.learningMaterial.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, username: true },
        },
      },
    });

    if (!material) {
      throw new NotFoundException(`Learning material with ID ${id} not found`);
    }

    // Regular users can only see visible materals
    if (userRole === 'USER' && !material.isVisible) {
      throw new NotFoundException(`Learning material with ID ${id} not found`);
    }

    return this.formatResponse(material);
  }

  /**
   * Update a learning material
   */
  async update(
    id: string,
    dto: UpdateLearningMaterialDto,
    userId: string,
    userRole: string,
  ): Promise<LearningMaterialResponseDto> {
    const material = await this.prisma.learningMaterial.findUnique({
      where: { id },
    });

    if (!material) {
      throw new NotFoundException(`Learning material with ID ${id} not found`);
    }

    if (userRole === 'CREATOR' && material.createdByUserId !== userId) {
      throw new ForbiddenException('You can only update your own learning materials');
    }

    if (userRole === 'USER') {
      throw new ForbiddenException('You do not have permission to update learning materials');
    }

    const updated = await this.prisma.learningMaterial.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.thumbnailUrl !== undefined && { thumbnailUrl: dto.thumbnailUrl }),
        ...(dto.linkUrl && { linkUrl: dto.linkUrl }),
        ...(dto.resources !== undefined && { resources: dto.resources as any }),
        ...(dto.isVisible !== undefined && { isVisible: dto.isVisible }),
      },
      include: {
        createdBy: {
          select: { id: true, username: true },
        },
      },
    });

    this.logger.log(`Learning material updated: ${updated.title}`);

    return this.formatResponse(updated);
  }

  /**
   * Delete a learning material
   */
  async remove(
    id: string,
    userId: string,
    userRole: string,
  ): Promise<{ success: boolean; message: string }> {
    const material = await this.prisma.learningMaterial.findUnique({
      where: { id },
    });

    if (!material) {
      throw new NotFoundException(`Learning material with ID ${id} not found`);
    }

    if (userRole === 'CREATOR' && material.createdByUserId !== userId) {
      throw new ForbiddenException('You can only delete your own learning materials');
    }

    if (userRole === 'USER') {
      throw new ForbiddenException('You do not have permission to delete learning materials');
    }

    await this.prisma.learningMaterial.delete({
      where: { id },
    });

    this.logger.log(`Learning material deleted: ${material.title}`);

    return {
      success: true,
      message: 'Learning material deleted successfully',
    };
  }

  /**
   * Toggle visibility of a learning material
   */
  async toggleVisibility(
    id: string,
    userId: string,
    userRole: string,
  ): Promise<LearningMaterialResponseDto> {
    const material = await this.prisma.learningMaterial.findUnique({
      where: { id },
    });

    if (!material) {
      throw new NotFoundException(`Learning material with ID ${id} not found`);
    }

    // Check permission
    if (userRole === 'CREATOR' && material.createdByUserId !== userId) {
      throw new ForbiddenException('You can only modify your own learning materials');
    }

    if (userRole === 'USER') {
      throw new ForbiddenException('You do not have permission to modify learning materials');
    }

    const updated = await this.prisma.learningMaterial.update({
      where: { id },
      data: { isVisible: !material.isVisible },
      include: {
        createdBy: {
          select: { id: true, username: true },
        },
      },
    });

    this.logger.log(`Learning material visibility toggled: ${updated.title} -> ${updated.isVisible}`);

    return this.formatResponse(updated);
  }

  /**
   * Get learning materials created by the current user
   */
  async getMyMaterials(
    userId: string,
    query: LearningMaterialQueryDto,
  ): Promise<LearningMaterialListResponseDto> {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { createdByUserId: userId };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [materials, total] = await Promise.all([
      this.prisma.learningMaterial.findMany({
        where,
        include: {
          createdBy: {
            select: { id: true, username: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.learningMaterial.count({ where }),
    ]);

    return {
      data: materials.map((m) => this.formatResponse(m)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Format response
   */
  private formatResponse(material: any): LearningMaterialResponseDto {
    return {
      id: material.id,
      title: material.title,
      description: material.description,
      thumbnailUrl: material.thumbnailUrl,
      linkUrl: material.linkUrl,
      resources: material.resources as any,
      isVisible: material.isVisible,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
      createdBy: material.createdBy,
    };
  }
}
