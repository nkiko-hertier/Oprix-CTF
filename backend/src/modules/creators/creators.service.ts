import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/database/prisma.service';
import { CryptoService } from '../../common/services/crypto.service';
import {
  InviteCreatorDto,
  AcceptInviteDto,
  CreatorQueryDto,
  CompetitionCreatorResponseDto,
  InviteResponseDto,
  PendingInviteResponseDto,
} from './dto/creator.dto';

@Injectable()
export class CreatorsService {
  private readonly logger = new Logger(CreatorsService.name);
  private readonly INVITE_EXPIRY_HOURS = 24;

  constructor(
    private prisma: PrismaService,
    private cryptoService: CryptoService,
    private configService: ConfigService,
  ) { }

  /**
   * Invite a creator to a competition
   */
  async inviteCreator(
    competitionId: string,
    dto: InviteCreatorDto,
    adminId: string,
  ): Promise<InviteResponseDto> {
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      select: { id: true, name: true, adminId: true },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${competitionId} not found`);
    }

    if (competition.adminId !== adminId) {
      throw new ForbiddenException('Only the competition owner can invite creators');
    }

    // Check if there's already an active invite for this email
    const existingInvite = await this.prisma.creatorInvite.findFirst({
      where: {
        competitionId,
        email: dto.email.toLowerCase(),
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvite) {
      throw new ConflictException('An active invitation already exists for this email');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      const existingCreator = await this.prisma.competitionCreator.findUnique({
        where: {
          competitionId_creatorId: {
            competitionId,
            creatorId: existingUser.id,
          },
        },
      });

      if (existingCreator && existingCreator.status !== 'REVOKED') {
        throw new ConflictException('This user is already a creator for this competition');
      }
    }

    // Generate secure token
    const token = this.cryptoService.generateUrlSafeToken(32);
    const tokenHash = this.cryptoService.hashSensitiveData(token);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.INVITE_EXPIRY_HOURS);

    // Create invite
    await this.prisma.creatorInvite.create({
      data: {
        competitionId,
        email: dto.email.toLowerCase(),
        tokenHash,
        expiresAt,
        createdByAdminId: adminId,
      },
    });

    // Build invite link
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const inviteLink = `${frontendUrl}/creator-invite?token=${token}`;

    this.logger.log(`Creator invite sent for ${dto.email} to competition ${competition.name}`);

    return {
      success: true,
      inviteLink,
      email: dto.email.toLowerCase(),
      expiresAt,
    };
  }

  /**
   * Accept a creator invitation
   */
  async acceptInvite(
    dto: AcceptInviteDto,
    userId: string,
    userEmail: string,
  ): Promise<CompetitionCreatorResponseDto> {
    const tokenHash = this.cryptoService.hashSensitiveData(dto.token);

    const invite = await this.prisma.creatorInvite.findUnique({
      where: { tokenHash },
      include: {
        competition: {
          select: { id: true, name: true },
        },
      },
    });

    if (!invite) {
      throw new NotFoundException('Invalid or expired invitation');
    }

    if (invite.usedAt) {
      throw new BadRequestException('This invitation has already been used');
    }

    if (invite.expiresAt < new Date()) {
      throw new BadRequestException('This invitation has expired');
    }

    if (invite.email.toLowerCase() !== userEmail.toLowerCase()) {
      throw new ForbiddenException('This invitation was sent to a different email address');
    }

    // Check if already a creator for this competition
    const existingCreator = await this.prisma.competitionCreator.findUnique({
      where: {
        competitionId_creatorId: {
          competitionId: invite.competitionId,
          creatorId: userId,
        },
      },
    });

    if (existingCreator && existingCreator.status !== 'REVOKED') {
      throw new ConflictException('You are already a creator for this competition');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.creatorInvite.update({
        where: { id: invite.id },
        data: {
          usedAt: new Date(),
          acceptedByUserId: userId,
        },
      });

      const user = await tx.user.findUnique({ where: { id: userId } });
      if (user && user.role === 'USER') {
        await tx.user.update({
          where: { id: userId },
          data: { role: 'CREATOR' },
        });
      }

      let creator;
      if (existingCreator) {
        // Reactivate revoked creator
        creator = await tx.competitionCreator.update({
          where: { id: existingCreator.id },
          data: {
            status: 'PENDING',
            revokedAt: null,
          },
          include: {
            creator: {
              select: { id: true, username: true, email: true },
            },
            competition: {
              select: { id: true, name: true },
            },
          },
        });
      } else {
        creator = await tx.competitionCreator.create({
          data: {
            competitionId: invite.competitionId,
            creatorId: userId,
            status: 'PENDING',
          },
          include: {
            creator: {
              select: { id: true, username: true, email: true },
            },
            competition: {
              select: { id: true, name: true },
            },
          },
        });
      }

      return creator;
    });

    this.logger.log(`Creator ${userEmail} accepted invite for competition ${invite.competition.name}`);

    return this.formatCreatorResponse(result);
  }

  /**
   * Approve a pending creator
   */
  async approveCreator(
    competitionId: string,
    creatorId: string,
    adminId: string,
  ): Promise<CompetitionCreatorResponseDto> {
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      select: { id: true, name: true, adminId: true },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${competitionId} not found`);
    }

    if (competition.adminId !== adminId) {
      throw new ForbiddenException('Only the competition owner can approve creators');
    }

    const creator = await this.prisma.competitionCreator.findUnique({
      where: {
        competitionId_creatorId: {
          competitionId,
          creatorId,
        },
      },
    });

    if (!creator) {
      throw new NotFoundException('Creator assignment not found');
    }

    if (creator.status === 'APPROVED') {
      throw new BadRequestException('Creator is already approved');
    }

    if (creator.status === 'REVOKED') {
      throw new BadRequestException('Cannot approve a revoked creator. Send a new invitation.');
    }

    const updated = await this.prisma.competitionCreator.update({
      where: { id: creator.id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
      },
      include: {
        creator: {
          select: { id: true, username: true, email: true },
        },
        competition: {
          select: { id: true, name: true },
        },
      },
    });

    this.logger.log(`Creator ${creatorId} approved for competition ${competition.name}`);

    return this.formatCreatorResponse(updated);
  }

  /**
   * Reject a pending creator
   */
  async rejectCreator(
    competitionId: string,
    creatorId: string,
    adminId: string,
  ): Promise<CompetitionCreatorResponseDto> {
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      select: { id: true, name: true, adminId: true },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${competitionId} not found`);
    }

    if (competition.adminId !== adminId) {
      throw new ForbiddenException('Only the competition owner can reject creators');
    }

    const creator = await this.prisma.competitionCreator.findUnique({
      where: {
        competitionId_creatorId: {
          competitionId,
          creatorId,
        },
      },
    });

    if (!creator) {
      throw new NotFoundException('Creator assignment not found');
    }

    if (creator.status !== 'PENDING') {
      throw new BadRequestException('Can only reject pending creators');
    }

    const updated = await this.prisma.competitionCreator.update({
      where: { id: creator.id },
      data: { status: 'REJECTED' },
      include: {
        creator: {
          select: { id: true, username: true, email: true },
        },
        competition: {
          select: { id: true, name: true },
        },
      },
    });

    this.logger.log(`Creator ${creatorId} rejected for competition ${competition.name}`);

    return this.formatCreatorResponse(updated);
  }

  /**
   * Revoke an approved creator's access
   */
  async revokeCreator(
    competitionId: string,
    creatorId: string,
    adminId: string,
  ): Promise<CompetitionCreatorResponseDto> {
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      select: { id: true, name: true, adminId: true },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${competitionId} not found`);
    }

    if (competition.adminId !== adminId) {
      throw new ForbiddenException('Only the competition owner can revoke creators');
    }

    const creator = await this.prisma.competitionCreator.findUnique({
      where: {
        competitionId_creatorId: {
          competitionId,
          creatorId,
        },
      },
    });

    if (!creator) {
      throw new NotFoundException('Creator assignment not found');
    }

    if (creator.status === 'REVOKED') {
      throw new BadRequestException('Creator access is already revoked');
    }

    const updated = await this.prisma.competitionCreator.update({
      where: { id: creator.id },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
      },
      include: {
        creator: {
          select: { id: true, username: true, email: true },
        },
        competition: {
          select: { id: true, name: true },
        },
      },
    });

    this.logger.log(`Creator ${creatorId} revoked for competition ${competition.name}`);

    return this.formatCreatorResponse(updated);
  }

  /**
   * List creators for a competition
   */
  async listCreators(
    competitionId: string,
    query: CreatorQueryDto,
    adminId: string,
  ): Promise<{ data: CompetitionCreatorResponseDto[]; total: number; page: number; limit: number }> {
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      select: { id: true, adminId: true },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${competitionId} not found`);
    }

    if (competition.adminId !== adminId) {
      throw new ForbiddenException('Only the competition owner can view creators');
    }

    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { competitionId };
    if (query.status) {
      where.status = query.status;
    }

    const [creators, total] = await Promise.all([
      this.prisma.competitionCreator.findMany({
        where,
        include: {
          creator: {
            select: { id: true, username: true, email: true },
          },
          competition: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.competitionCreator.count({ where }),
    ]);

    return {
      data: creators.map((c) => this.formatCreatorResponse(c)),
      total,
      page,
      limit,
    };
  }

  /**
   * List pending invites for a competition
   */
  async listPendingInvites(
    competitionId: string,
    adminId: string,
  ): Promise<PendingInviteResponseDto[]> {
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      select: { id: true, name: true, adminId: true },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${competitionId} not found`);
    }

    if (competition.adminId !== adminId) {
      throw new ForbiddenException('Only the competition owner can view pending invites');
    }

    const invites = await this.prisma.creatorInvite.findMany({
      where: {
        competitionId,
        usedAt: null,
      },
      include: {
        competition: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return invites.map((invite) => ({
      id: invite.id,
      email: invite.email,
      expiresAt: invite.expiresAt,
      isUsed: !!invite.usedAt,
      competition: invite.competition,
    }));
  }

  /**
   * Get competitions where user is an approved creator
   */
  async getMyCreatorCompetitions(userId: string): Promise<CompetitionCreatorResponseDto[]> {
    const assignments = await this.prisma.competitionCreator.findMany({
      where: {
        creatorId: userId,
        status: 'APPROVED',
      },
      include: {
        competition: {
          select: { id: true, name: true },
        },
        creator: {
          select: { id: true, username: true, email: true },
        },
      },
      orderBy: { approvedAt: 'desc' },
    });

    return assignments.map((a) => this.formatCreatorResponse(a));
  }

  /**
   * Check if user is an approved creator for a competition
   */
  async isApprovedCreator(competitionId: string, userId: string): Promise<boolean> {
    const creator = await this.prisma.competitionCreator.findUnique({
      where: {
        competitionId_creatorId: {
          competitionId,
          creatorId: userId,
        },
      },
    });

    return creator?.status === 'APPROVED';
  }

  /**
   * Format creator response
   */
  private formatCreatorResponse(creator: any): CompetitionCreatorResponseDto {
    return {
      id: creator.id,
      competitionId: creator.competitionId,
      creatorId: creator.creatorId,
      status: creator.status,
      invitedAt: creator.invitedAt,
      approvedAt: creator.approvedAt,
      creator: creator.creator,
      competition: creator.competition,
    };
  }
}
