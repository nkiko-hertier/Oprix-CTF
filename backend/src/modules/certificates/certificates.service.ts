import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { RequestCertificateDto } from './dto/request-certificate.dto';
import { CertificateQueryDto } from './dto/certificate-query.dto';
import { UpdateCertificateStatusDto } from './dto/update-certificate.dto';
import { CertificateResponseDto, VerifyCertificateResponseDto } from './dto/certificate-response.dto';
import { customAlphabet } from 'nanoid';

@Injectable()
export class CertificatesService {
  private readonly logger = new Logger(CertificatesService.name);

  constructor(private prisma: PrismaService) { }

  /**
   * Auto-generate certificates for all eligible participants when competition ends
   * Called automatically when competition status changes to COMPLETED
   */
  async autoGenerateCertificates(competitionId: string): Promise<{ generated: number; skipped: number }> {
    this.logger.log(`Auto-generating certificates for competition ${competitionId}`);

    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      select: { isTeamBased: true },
    });

    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    let generated = 0;
    let skipped = 0;

    if (competition.isTeamBased) {
      // Generate team certificates
      const result = await this.generateTeamCertificates(competitionId);
      generated += result.generated;
      skipped += result.skipped;
    } else {
      // Generate individual certificates
      const result = await this.generateIndividualCertificates(competitionId);
      generated += result.generated;
      skipped += result.skipped;
    }

    this.logger.log(`Certificate generation complete: ${generated} generated, ${skipped} skipped`);

    return { generated, skipped };
  }

  /**
   * Generate certificates for all eligible individual participants
   */
  private async generateIndividualCertificates(
    competitionId: string,
  ): Promise<{ generated: number; skipped: number }> {
    let generated = 0;
    let skipped = 0;

    // Get all approved registrations
    const registrations = await this.prisma.registration.findMany({
      where: {
        competitionId,
        status: 'APPROVED',
        userId: { not: null },
      },
      select: { userId: true },
    });

    for (const registration of registrations) {
      if (!registration.userId) continue;

      try {
        // Check if certificate already exists
        const existing = await this.prisma.certificate.findFirst({
          where: {
            competitionId,
            userId: registration.userId,
          },
        });

        if (existing) {
          skipped++;
          continue;
        }

        // Check eligibility
        const eligibility = await this.checkEligibility(competitionId, registration.userId);
        if (!eligibility.eligible) {
          skipped++;
          continue;
        }

        // Generate certificate
        const metrics = await this.calculateMetrics(competitionId, registration.userId);
        const certificateNumber = await this.generateCertificateNumber(competitionId);
        const verificationCode = await this.generateVerificationCode();

        await this.prisma.certificate.create({
          data: {
            certificateNumber,
            verificationCode,
            userId: registration.userId,
            competitionId,
            finalRank: metrics.finalRank ?? undefined,
            totalScore: metrics.totalScore,
            challengesSolved: metrics.challengesSolved,
            totalChallenges: metrics.totalChallenges,
            completionRate: metrics.completionRate,
            participantCount: metrics.participantCount ?? undefined,
            status: 'ISSUED',
          },
        });

        generated++;
        this.logger.log(`Certificate generated for user ${registration.userId}`);
      } catch (error) {
        this.logger.error(`Failed to generate certificate for user ${registration.userId}`, error);
        skipped++;
      }
    }

    return { generated, skipped };
  }

  /**
   * Generate certificates for all eligible teams
   */
  private async generateTeamCertificates(
    competitionId: string,
  ): Promise<{ generated: number; skipped: number }> {
    let generated = 0;
    let skipped = 0;

    // Get all approved team registrations
    const registrations = await this.prisma.registration.findMany({
      where: {
        competitionId,
        status: 'APPROVED',
        teamId: { not: null },
      },
      select: { teamId: true },
    });

    for (const registration of registrations) {
      if (!registration.teamId) continue;

      try {
        // Check if certificate already exists
        const existing = await this.prisma.certificate.findFirst({
          where: {
            competitionId,
            teamId: registration.teamId,
          },
        });

        if (existing) {
          skipped++;
          continue;
        }

        // Check eligibility
        const team = await this.prisma.team.findUnique({
          where: { id: registration.teamId },
          include: { members: { where: { isActive: true }, take: 1 } },
        });

        if (!team || !team.members || team.members.length === 0) {
          skipped++;
          continue;
        }

        const eligibility = await this.checkEligibility(competitionId, team.members[0].userId, registration.teamId);
        if (!eligibility.eligible) {
          skipped++;
          continue;
        }

        // Generate certificate
        const metrics = await this.calculateMetrics(competitionId, team.members[0].userId, registration.teamId);
        const certificateNumber = await this.generateCertificateNumber(competitionId);
        const verificationCode = await this.generateVerificationCode();

        await this.prisma.certificate.create({
          data: {
            certificateNumber,
            verificationCode,
            teamId: registration.teamId,
            competitionId,
            finalRank: metrics.finalRank ?? undefined,
            totalScore: metrics.totalScore,
            challengesSolved: metrics.challengesSolved,
            totalChallenges: metrics.totalChallenges,
            completionRate: metrics.completionRate,
            participantCount: metrics.participantCount ?? undefined,
            status: 'ISSUED',
          },
        });

        generated++;
        this.logger.log(`Certificate generated for team ${registration.teamId}`);
      } catch (error) {
        this.logger.error(`Failed to generate certificate for team ${registration.teamId}`, error);
        skipped++;
      }
    }

    return { generated, skipped };
  }

  /**
   * Request a certificate for a completed competition (Manual fallback)
   */
  async requestCertificate(
    dto: RequestCertificateDto,
    userId: string,
  ): Promise<CertificateResponseDto> {
    // Verify competition exists and is completed
    const competition = await this.prisma.competition.findUnique({
      where: { id: dto.competitionId },
    });

    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    if (competition.status !== 'COMPLETED') {
      throw new BadRequestException('Certificates can only be requested for completed competitions');
    }

    // Check eligibility
    const eligibility = await this.checkEligibility(dto.competitionId, userId, dto.teamId);
    if (!eligibility.eligible) {
      throw new BadRequestException(eligibility.reason);
    }

    // Check if certificate already exists
    const existingCertificate = await this.prisma.certificate.findFirst({
      where: {
        competitionId: dto.competitionId,
        ...(dto.teamId ? { teamId: dto.teamId } : { userId }),
      },
    });

    if (existingCertificate) {
      throw new ConflictException('Certificate already exists for this competition');
    }

    // Calculate performance metrics
    const metrics = await this.calculateMetrics(dto.competitionId, userId, dto.teamId);

    // Generate unique certificate number and verification code
    const certificateNumber = await this.generateCertificateNumber(dto.competitionId);
    const verificationCode = await this.generateVerificationCode();

    // Create certificate
    const certificate = await this.prisma.certificate.create({
      data: {
        certificateNumber,
        verificationCode,
        userId: dto.teamId ? null : userId,
        teamId: dto.teamId || null,
        competitionId: dto.competitionId,
        finalRank: metrics.finalRank ?? undefined,
        totalScore: metrics.totalScore,
        challengesSolved: metrics.challengesSolved,
        totalChallenges: metrics.totalChallenges,
        completionRate: metrics.completionRate,
        participantCount: metrics.participantCount ?? undefined,
        status: 'ISSUED', // Automatically issued unless approval is required
        metadata: dto.metadata ? dto.metadata : undefined,
      },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
        team: {
          select: { id: true, name: true },
        },
        competition: {
          select: { id: true, name: true, title: true, startDate: true, endDate: true },
        },
      },
    });

    this.logger.log(`Certificate issued: ${certificateNumber} for user ${userId} in competition ${dto.competitionId}`);

    return this.formatCertificateResponse(certificate);
  }

  /**
   * Get user's certificates with optional filters
   */
  async getMyCertificates(
    userId: string,
    query: CertificateQueryDto,
  ): Promise<{ certificates: CertificateResponseDto[]; total: number; page: number; limit: number }> {
    const { status, competitionId, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      OR: [
        { userId },
        { team: { members: { some: { userId, isActive: true } } } },
      ],
    };

    if (status) {
      where.status = status;
    }

    if (competitionId) {
      where.competitionId = competitionId;
    }

    const [certificates, total] = await Promise.all([
      this.prisma.certificate.findMany({
        where,
        include: {
          user: {
            select: { id: true, username: true, email: true,
              profile: { select: { firstName: true, lastName: true } },
            }
          },
          team: {
            select: { id: true, name: true },
          },
          competition: {
            select: { id: true, name: true, title: true, startDate: true, endDate: true,
              admin: { select: { id: true, username: true, } },
            },
          },
        },
        orderBy: { issuedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.certificate.count({ where }),
    ]);

    return {
      certificates: certificates.map((cert) => this.formatCertificateResponse(cert)),
      total,
      page,
      limit,
    };
  }

  /**
   * Get certificate by ID (with ownership check)
   */
  async getCertificateById(certificateId: string, userId: string): Promise<CertificateResponseDto> {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
        team: {
          select: { id: true, name: true, members: { where: { userId, isActive: true } } },
        },
        competition: {
          select: { id: true, name: true, title: true, startDate: true, endDate: true },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    // Check ownership
    const isOwner = certificate.userId === userId || (certificate.team?.members && certificate.team.members.length > 0);
    if (!isOwner) {
      throw new ForbiddenException('You do not have access to this certificate');
    }

    return this.formatCertificateResponse(certificate);
  }

  /**
   * Verify certificate by verification code (public endpoint)
   */
  async verifyCertificate(verificationCode: string): Promise<VerifyCertificateResponseDto> {
    const certificate = await this.prisma.certificate.findUnique({
      where: { verificationCode },
      include: {
        user: { select: { username: true } },
        team: { select: { name: true } },
        competition: { select: { name: true, title: true } },
      },
    });

    if (!certificate) {
      return {
        valid: false,
        message: 'Invalid verification code',
      };
    }

    if (certificate.isRevoked) {
      return {
        valid: false,
        message: 'Certificate has been revoked',
      };
    }

    return {
      valid: true,
      certificate: {
        certificateNumber: certificate.certificateNumber,
        recipientName: certificate.user?.username || certificate.team?.name || 'Unknown',
        competitionName: certificate.competition.title || certificate.competition.name,
        issuedAt: certificate.issuedAt,
        finalRank: certificate.finalRank ?? undefined,
        totalScore: certificate.totalScore,
        isRevoked: certificate.isRevoked,
      },
    };
  }

  /**
   * Admin: List all certificates with filters
   */
  async listCertificatesAdmin(
    query: CertificateQueryDto,
    userId: string,
  ): Promise<{ certificates: CertificateResponseDto[]; total: number; page: number; limit: number }> {
    const { status, competitionId, userId: filterUserId, teamId, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Apply filters
    if (status) where.status = status;
    if (competitionId) where.competitionId = competitionId;
    if (filterUserId) where.userId = filterUserId;
    if (teamId) where.teamId = teamId;

    // Only show certificates for competitions administered by this admin
    where.competition = {
      adminId: userId,
    }

    const [certificates, total] = await Promise.all([
      this.prisma.certificate.findMany({
        where,
        include: {
          user: {
            select: { id: true, username: true, email: true },
          },
          team: {
            select: { id: true, name: true },
          },
          competition: {
            select: { id: true, name: true, title: true, startDate: true, endDate: true },
          },
        },
        orderBy: { issuedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.certificate.count({ where }),
    ]);

    return {
      certificates: certificates.map((cert) => this.formatCertificateResponse(cert)),
      total,
      page,
      limit,
    };
  }

  /**
   * Admin: Update certificate status (approve, reject, revoke)
   */
  async updateCertificateStatus(
    certificateId: string,
    dto: UpdateCertificateStatusDto,
    adminId: string,
  ): Promise<CertificateResponseDto> {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certificateId },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    const updateData: any = {
      status: dto.status,
    };

    // Handle status-specific updates
    if (dto.status === 'APPROVED') {
      updateData.approvedBy = adminId;
      updateData.approvedAt = new Date();
    } else if (dto.status === 'REJECTED') {
      updateData.rejectedAt = new Date();
      updateData.rejectionReason = dto.reason || 'Rejected by admin';
    } else if (dto.status === 'REVOKED') {
      updateData.isRevoked = true;
      updateData.revokedBy = adminId;
      updateData.revokedAt = new Date();
      updateData.revokedReason = dto.reason || 'Revoked by admin';
    }

    const updated = await this.prisma.certificate.update({
      where: { id: certificateId },
      data: updateData,
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
        team: {
          select: { id: true, name: true },
        },
        competition: {
          select: { id: true, name: true, title: true, startDate: true, endDate: true },
        },
      },
    });

    this.logger.log(`Certificate ${certificateId} status updated to ${dto.status} by admin ${adminId}`);

    return this.formatCertificateResponse(updated);
  }

  /**
   * Check if user/team is eligible for certificate
   */
  private async checkEligibility(
    competitionId: string,
    userId: string,
    teamId?: string,
  ): Promise<{ eligible: boolean; reason?: string }> {
    // Check if user/team is registered
    const registration = await this.prisma.registration.findFirst({
      where: {
        competitionId,
        ...(teamId
          ? { teamId, team: { members: { some: { userId, isActive: true } } } }
          : { userId }),
        status: 'APPROVED',
      },
    });

    if (!registration) {
      return {
        eligible: false,
        reason: 'You are not registered for this competition',
      };
    }

    // Check if user/team has at least one solved challenge
    const solveCount = await this.prisma.score.count({
      where: {
        competitionId,
        ...(teamId ? { teamId } : { userId }),
      },
    });

    if (solveCount === 0) {
      return {
        eligible: false,
        reason: 'You must solve at least one challenge to receive a certificate',
      };
    }

    return { eligible: true };
  }

  /**
   * Calculate performance metrics for certificate
   */
  private async calculateMetrics(
    competitionId: string,
    userId: string,
    teamId?: string,
  ): Promise<{
    finalRank: number | null;
    totalScore: number;
    challengesSolved: number;
    totalChallenges: number;
    completionRate: number;
    participantCount: number;
  }> {
    // Get total challenges in competition
    const totalChallenges = await this.prisma.challenge.count({
      where: { competitionId, isVisible: true, isActive: true },
    });

    // Get user/team scores
    const scores = await this.prisma.score.findMany({
      where: {
        competitionId,
        ...(teamId ? { teamId } : { userId }),
      },
    });

    const totalScore = scores.reduce((sum, score) => sum + score.points, 0);
    const challengesSolved = scores.length;
    const completionRate = totalChallenges > 0 ? (challengesSolved / totalChallenges) * 100 : 0;

    // Calculate rank
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      select: { isTeamBased: true },
    });

    let finalRank: number | null = null;
    let participantCount = 0;

    if (competition?.isTeamBased && teamId) {
      // Team-based ranking
      const teamScores = await this.prisma.score.groupBy({
        by: ['teamId'],
        where: { competitionId, teamId: { not: null } },
        _sum: { points: true },
      });

      participantCount = teamScores.length;
      const sortedTeams = teamScores
        .map((ts) => ({ teamId: ts.teamId, totalPoints: ts._sum.points || 0 }))
        .sort((a, b) => b.totalPoints - a.totalPoints);

      finalRank = sortedTeams.findIndex((t) => t.teamId === teamId) + 1;
    } else {
      // Individual ranking
      const userScores = await this.prisma.score.groupBy({
        by: ['userId'],
        where: { competitionId, userId: { not: null } },
        _sum: { points: true },
      });

      participantCount = userScores.length;
      const sortedUsers = userScores
        .map((us) => ({ userId: us.userId, totalPoints: us._sum.points || 0 }))
        .sort((a, b) => b.totalPoints - a.totalPoints);

      finalRank = sortedUsers.findIndex((u) => u.userId === userId) + 1;
    }

    return {
      finalRank: finalRank > 0 ? finalRank : null,
      totalScore,
      challengesSolved,
      totalChallenges,
      completionRate: parseFloat(completionRate.toFixed(2)),
      participantCount,
    };
  }

  /**
 * Generate a unique certificate number without collisions
 */
nano = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

private async generateCertificateNumber(competitionId: string): Promise<string> {
  const competition = await this.prisma.competition.findUnique({
    where: { id: competitionId },
    select: { startDate: true },
  });

  const year = competition
    ? new Date(competition.startDate).getFullYear()
    : new Date().getFullYear();

  const code = this.nano(); // Example: 2F9KD83A

  return `OPRIX-CTF-${year}-${code}`;
}


  /**
   * Generate unique verification code
   */
  private async generateVerificationCode(): Promise<string> {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding ambiguous characters
    let code: string;
    let isUnique = false;

    do {
      code = 'VRF-';
      for (let i = 0; i < 12; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      // Check uniqueness
      const existing = await this.prisma.certificate.findUnique({
        where: { verificationCode: code },
      });
      isUnique = !existing;
    } while (!isUnique);

    return code;
  }

  /**
   * Format certificate response
   */
  private formatCertificateResponse(certificate: any): CertificateResponseDto {
    return {
      id: certificate.id,
      certificateNumber: certificate.certificateNumber,
      userId: certificate.userId,
      teamId: certificate.teamId,
      competitionId: certificate.competitionId,
      finalRank: certificate.finalRank ?? undefined,
      totalScore: certificate.totalScore,
      challengesSolved: certificate.challengesSolved,
      totalChallenges: certificate.totalChallenges,
      completionRate: certificate.completionRate,
      participantCount: certificate.participantCount ?? undefined,
      status: certificate.status,
      issuedAt: certificate.issuedAt,
      verificationCode: certificate.verificationCode,
      isRevoked: certificate.isRevoked,
      metadata: certificate.metadata ?? undefined,
      user: certificate.user,
      team: certificate.team,
      competition: certificate.competition,
      createdAt: certificate.createdAt,
      updatedAt: certificate.updatedAt,
    };
  }
}
