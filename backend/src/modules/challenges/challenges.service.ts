import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CryptoService } from '../../common/services/crypto.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import {
  UpdateChallengeDto,
  UpdateChallengeVisibilityDto,
  CreateHintDto,
  ChallengeQueryDto,
} from './dto/update-challenge.dto';

/**
 * Challenges Service
 * Handles all challenge-related operations with competition ownership
 */
@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);

  constructor(
    private prisma: PrismaService,
    private cryptoService: CryptoService,
  ) {}

  /**
   * Create a new challenge (Admin/Competition Owner only)
   */
  async create(
    createChallengeDto: CreateChallengeDto,
    userId: string,
    competitionId?: string,
  ) {
    if(competitionId){
      const competition = await this.verifyCompetitionOwnership(
        competitionId,
        userId,
      );
      
      if (
      competition.status === 'ACTIVE' ||
      competition.status === 'COMPLETED'
    ) {
      throw new BadRequestException(
        'Cannot add challenges to active or completed competition',
      );
    }
  }

    try {
      // Validate: at least one of flag or File_URL must be provided
      if (!createChallengeDto.flag && !createChallengeDto.File_URL) {
        throw new BadRequestException(
          'Either a flag or File_URL must be provided for the challenge',
        );
      }

      // Hash flag only if provided
      let flagHash: string | null = null;
      let flagSalt: string | null = null;
      if (createChallengeDto.flag) {
        const hashed = this.cryptoService.hashFlag(createChallengeDto.flag);
        flagHash = hashed.hash;
        flagSalt = hashed.salt;
      }

      const challenge = await this.prisma.challenge.create({
        data: {
          title: createChallengeDto.title,
          description: createChallengeDto.description,
          difficulty: createChallengeDto.difficulty,
          points: createChallengeDto.points,
          flagHash,
          flagSalt,
          File_URL: createChallengeDto.File_URL || null,
          caseSensitive: createChallengeDto.caseSensitive || false,
          normalizeFlag: createChallengeDto.normalizeFlag ?? true,
          competitionId: createChallengeDto.competitionId || null,
          hints: createChallengeDto.hints
            ? {
                create: createChallengeDto.hints.map((hint, index) => ({
                  content: hint,
                  cost: 0,
                  order: index + 1,
                  creatorId: userId,
                })),
              }
            : undefined,
        } as any,
        include: {
          hints: { orderBy: { order: 'asc' } },
          _count: { select: { submissions: true } },
        },
      });

      this.logger.log(
        `Challenge created: ${challenge.title} in competition ${competitionId}`,
      );
      return challenge;
    } catch (error) {
      this.logger.error('Failed to create challenge', error);
      throw new BadRequestException('Failed to create challenge');
    }
  }

  /**
   * Get all challenges in a competition
   */
  async findAll(
    competitionId: string,
    query: ChallengeQueryDto,
    userId?: string,
    role?: string,
  ) {
    // Verify competition exists
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
    });

    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    const where: any = { competitionId };

    // Check user permissions and registration
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      const isAdmin =
        user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
      const isOwner = competition.adminId === userId;
      let isApprovedCreator = false;

      if (user?.role === 'CREATOR') {
        const creatorAssignment =
          await this.prisma.competitionCreator.findUnique({
            where: {
              competitionId_creatorId: {
                competitionId,
                creatorId: userId,
              },
            },
          });
        isApprovedCreator =
          creatorAssignment?.status === 'APPROVED';
      }

      if (!isAdmin && !isOwner && !isApprovedCreator) {
        const registration =
          await this.prisma.registration.findFirst({
            where: {
              competitionId,
              userId,
              status: 'APPROVED',
            },
          });

        if (!registration) {
          throw new ForbiddenException(
            'You must be registered for this competition to view challenges',
          );
        }
        where.isVisible = true;
      }
    } else {
      where.isVisible = true;
    }

    if (query.category) where.category = query.category;
    if (query.difficulty) where.difficulty = query.difficulty;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        {
          description: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const challenges = await this.prisma.challenge.findMany({
      where,
      include: {
        hints: { orderBy: { order: 'asc' } },
        _count: { select: { submissions: true } },
        submissions: userId
          ? {
              where: { userId, isCorrect: true },
              select: { id: true, createdAt: true },
            }
          : false,
      },
      orderBy: [{ points: 'asc' }, { createdAt: 'asc' }],
    });

    return challenges.map((challenge: any) => ({
      ...challenge,
      isSolved: userId
        ? challenge.submissions?.length > 0
        : false,
      firstSolveAt:
        userId && challenge.submissions?.length > 0
          ? challenge.submissions[0].createdAt
          : null,
      submissions: undefined,
    }));
  }

  /**
   * Get all public challenges across public, active competitions
   */
  async findAllPublic(
    query: ChallengeQueryDto,
    userId?: string,
  ) {
    const where: any = {
      isVisible: true,
      competitionId: null
    };

    if (query.category) where.category = query.category;
    if (query.difficulty) where.difficulty = query.difficulty;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        {
          description: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const challenges = await this.prisma.challenge.findMany({
      where,
      include: {
        hints: { orderBy: { order: 'asc' } },
        _count: { select: { submissions: true } },
        submissions: userId
          ? {
              where: { userId, isCorrect: true },
              select: { id: true, createdAt: true },
            }
          : false,
      },
      orderBy: [{ points: 'asc' }, { createdAt: 'asc' }],
    });

    return challenges.map((challenge: any) => ({
      ...challenge,
      isSolved: userId
        ? challenge.submissions?.length > 0
        : false,
      firstSolveAt:
        userId && challenge.submissions?.length > 0
          ? challenge.submissions[0].createdAt
          : null,
      submissions: undefined,
    }));
  }

  /**
   * Get a single challenge
   */
  async findOne(
    challengeId: string,
    userId?: string,
  ) {
    const challenge = await this.prisma.challenge.findFirst({
      where: { id: challengeId},
      include: {
        competition: {
          select: {
            id: true,
            name: true,
            status: true,
            adminId: true,
          },
        },
        hints: { orderBy: { order: 'asc' } },
        files: {
          select: {
            id: true,
            fileName: true,
            fileSize: true,
            fileType: true,
          },
        },
        _count: { select: { submissions: true } },
        submissions: userId
          ? {
              where: { userId, isCorrect: true },
              select: { id: true, createdAt: true },
            }
          : false,
      },
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    if (!challenge.competition) {
      throw new NotFoundException('Competition not found');
    }

    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      const isAdmin =
        user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
      const isOwner =
        challenge.competition.adminId === userId;

      if (!isAdmin && !isOwner && !challenge.isVisible) {
        throw new ForbiddenException(
          'Challenge is not visible',
        );
      }
    } else if (!challenge.isVisible) {
      throw new ForbiddenException('Challenge is not visible');
    }

    const challengeAny = challenge as any;

    // Fetch instance data for dynamic challenges
    let instance = null;
    if (challengeAny.isDynamic && userId) {
      const userInstance = await this.prisma.instance.findUnique({
        where: {
          userId_challengeId: {
            userId,
            challengeId,
          },
        },
      });

      // Check if instance exists and is not expired
      if (userInstance) {
        const expirationTime = new Date(
          userInstance.createdAt.getTime() + userInstance.duration * 1000,
        );
        const isExpired = new Date() > expirationTime;

        if (!isExpired) {
          instance = {
            id: userInstance.id,
            challengeId: userInstance.challengeId,
            userId: userInstance.userId,
            duration: userInstance.duration,
            githubUrl: userInstance.githubUrl,
            createdAt: userInstance.createdAt,
            expiresAt: expirationTime,
            isExpired: false,
          };
        }
      }
    }

    return {
      ...challenge,
      isSolved: userId
        ? challengeAny.submissions?.length > 0
        : false,
      firstSolveAt:
        userId && challengeAny.submissions?.length > 0
          ? challengeAny.submissions[0].createdAt
          : null,
      hints:
        challengeAny.hints?.map((hint: any) => ({
          id: hint.id,
          cost: hint.cost,
          order: hint.order,
          isUnlocked: false,
          content: undefined,
        })) || [],
      instance,
      submissions: undefined,
      flag: undefined,
      flagHash: undefined,
      flagSalt: undefined,
    };
  }

  /**
   * Update challenge
   */
  async update(
    competitionId: string,
    challengeId: string,
    updateChallengeDto: UpdateChallengeDto,
    userId: string,
  ) {
    await this.verifyCompetitionOwnership(competitionId, userId);

    const challenge = await this.prisma.challenge.findFirst({
      where: { id: challengeId, competitionId },
      include: { competition: true },
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    if (!challenge.competition) {
      throw new NotFoundException('Competition not found');
    }

    // Prevent editing if competition is active or completed
    if (
      challenge.competition.status === 'ACTIVE' ||
      challenge.competition.status === 'COMPLETED'
    ) {
      throw new BadRequestException(
        'Cannot edit challenges in active or completed competition',
      );
    }

    try {
      // Extract hints from DTO to handle separately
      const { hints, ...updateData } = updateChallengeDto;

      // If flag is being updated, hash it and store hash/salt instead
      if (
        (updateData as any).flag &&
        (updateData as any).flag.trim() !== ''
      ) {
        const { hash: flagHash, salt: flagSalt } =
          this.cryptoService.hashFlag((updateData as any).flag || 'none');
        Object.assign(updateData as any, { flagHash, flagSalt });
      }
      // Never persist plain flag
      delete (updateData as any).flag;

      const updated = await this.prisma.challenge.update({
        where: { id: challengeId },
        data: updateData as any,
        include: {
          hints: { orderBy: { order: 'asc' } },
          _count: { select: { submissions: true } },
        },
      });

      this.logger.log(`Challenge updated: ${updated.title}`);
      return updated;
    } catch (error) {
      this.logger.error('Failed to update challenge', error);
      throw new BadRequestException('Failed to update challenge');
    }
  }

  /**
   * Delete challenge
   */
  async remove(
    competitionId: string,
    challengeId: string,
    userId: string,
  ) {
    await this.verifyCompetitionOwnership(
      competitionId,
      userId,
    );

    const challenge = await this.prisma.challenge.findFirst({
      where: { id: challengeId, competitionId },
      include: { competition: true },
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    if (!challenge.competition) {
      throw new NotFoundException('Competition not found');
    }

    if (
      challenge.competition.status === 'ACTIVE' ||
      challenge.competition.status === 'COMPLETED'
    ) {
      throw new BadRequestException(
        'Cannot delete challenges from active or completed competition',
      );
    }

    await this.prisma.challenge.delete({
      where: { id: challengeId },
    });

    return { message: 'Challenge deleted successfully' };
  }

  /**
   * Create hint
   */
  async createHint(
    competitionId: string,
    challengeId: string,
    createHintDto: CreateHintDto,
    userId: string,
  ) {
    await this.verifyCompetitionOwnership(
      competitionId,
      userId,
    );

    const challenge = await this.prisma.challenge.findFirst({
      where: { id: challengeId, competitionId },
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    return this.prisma.hint.create({
      data: {
        ...createHintDto,
        challengeId,
        creatorId: userId,
      },
    });
  }

  /**
   * Unlock hint (costs points)
   * @param competitionId - Competition ID
   * @param challengeId - Challenge ID
   * @param hintId - Hint ID
   * @param userId - User unlocking the hint
   */
  async unlockHint(competitionId: string, challengeId: string, hintId: string, userId: string) {
    // Verify user is registered
    const registration = await this.prisma.registration.findFirst({
      where: {
        competitionId,
        userId,
        status: 'APPROVED',
      },
    });

    if (!registration) {
      throw new ForbiddenException('You must be registered for this competition');
    }

    const hint = await this.prisma.hint.findFirst({
      where: { id: hintId, challengeId },
    });

    if (!hint) {
      throw new NotFoundException('Hint not found');
    }

    // For now, always allow hint unlocking (can implement proper unlock system later)
    // TODO: Implement hint unlock tracking system

    // Check if user has enough points
    const userScore = await this.prisma.score.aggregate({
      where: { userId, competitionId },
      _sum: { points: true },
    });

    const totalPoints = userScore._sum.points || 0;
    const hintCost = hint.cost || 0;
    if (totalPoints < hintCost) {
      throw new BadRequestException('Insufficient points to unlock hint');
    }

    try {
      // For now, just return the hint without deducting points
      // TODO: Implement proper hint unlock system with score tracking

      this.logger.log(`User ${userId} unlocked hint for ${hintCost} points`);
      return {
        hint: {
          id: hint.id,
          content: hint.content,
          cost: hintCost,
          order: hint.order,
        },
        pointsDeducted: hintCost,
      };
    } catch (error) {
      this.logger.error('Failed to unlock hint', error);
      throw new BadRequestException('Failed to unlock hint');
    }
  }

  /**
   * Verify competition ownership
   */
  private async verifyCompetitionOwnership(
    competitionId: string,
    userId: string,
  ) {
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
    });

    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    if (competition.adminId === userId) return competition;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (
      user?.role === 'ADMIN' ||
      user?.role === 'SUPERADMIN'
    ) {
      return competition;
    }

    if (user?.role === 'CREATOR') {
      const creatorAssignment =
        await this.prisma.competitionCreator.findUnique({
          where: {
            competitionId_creatorId: {
              competitionId,
              creatorId: userId,
            },
          },
        });

      if (creatorAssignment?.status === 'APPROVED') {
        return competition;
      }
    }

    throw new ForbiddenException(
      'Only competition owner, admins, or approved creators can perform this action',
    );
  }

  async isApprovedCreatorForCompetition(
    competitionId: string,
    userId: string,
  ): Promise<boolean> {
    const creatorAssignment =
      await this.prisma.competitionCreator.findUnique({
        where: {
          competitionId_creatorId: {
            competitionId,
            creatorId: userId,
          },
        },
      });

    return creatorAssignment?.status === 'APPROVED';
  }
}
