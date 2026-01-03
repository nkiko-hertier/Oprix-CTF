import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateFileDto, FileQueryDto } from './dto/create-file.dto';
import { createHash } from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly uploadPath: string;
  private readonly maxFileSize: number;
  private readonly allowedTypes: string[];

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.uploadPath =
      this.configService.get<string>('files.uploadPath') || './uploads';
    this.maxFileSize =
      this.configService.get<number>('files.maxSize') || 50 * 1024 * 1024;

    this.allowedTypes =
      this.configService.get<string[]>('files.allowedTypes') || [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/zip',
        'application/octet-stream',
        'text/plain',
      ];

    this.ensureUploadDirectory();
  }

  /* -------------------------------------------------------------------------- */
  /*                                UPLOAD FILE                                 */
  /* -------------------------------------------------------------------------- */

  async uploadFile(file: any, dto: CreateFileDto, userId: string) {
    this.validateFile(file);

    const challenge = await this.prisma.challenge.findUnique({
      where: { id: dto.challengeId },
      include: { competition: true },
    });

    if (!challenge || !challenge.competition) {
      throw new NotFoundException('Challenge or competition not found');
    }

    const competition = challenge.competition;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (
      user?.role !== 'SUPERADMIN' &&
      competition.adminId !== userId
    ) {
      throw new ForbiddenException('Only competition admin can upload files');
    }

    const fileExt = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}${fileExt}`;

    const filePath = path.join(this.uploadPath, uniqueName);
    const checksum = createHash('sha256').update(file.buffer).digest('hex');

    try {
      await fs.writeFile(filePath, file.buffer);

      return await this.prisma.file.create({
        data: {
          challengeId: dto.challengeId,
          fileName: uniqueName,
          originalName: file.originalname,
          fileUrl: `/api/v1/files/${uniqueName}`,
          fileType: file.mimetype,
          fileSize: file.size,
          checksum,
        },
      });
    } catch (err) {
      await fs.unlink(filePath).catch(() => {});
      throw new BadRequestException('Failed to upload file');
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                FIND ONE FILE                                */
  /* -------------------------------------------------------------------------- */

  async findOne(id: string, userId: string) {
    const file = await this.prisma.file.findUnique({
      where: { id },
      include: {
        challenge: {
          include: { competition: true },
        },
      },
    });

    if (!file || !file.challenge.competition) {
      throw new NotFoundException('File or competition not found');
    }

    const competition = file.challenge.competition;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (
      user?.role !== 'SUPERADMIN' &&
      competition.adminId !== userId &&
      !competition.isPublic
    ) {
      const reg = await this.prisma.registration.findFirst({
        where: {
          userId,
          competitionId: competition.id,
          status: 'APPROVED',
        },
      });

      if (!reg) throw new ForbiddenException('Access denied');
    }

    return file;
  }

  /* -------------------------------------------------------------------------- */
  /*                               DOWNLOAD FILE                                 */
  /* -------------------------------------------------------------------------- */

  async downloadFile(fileName: string, userId: string) {
    const file = await this.prisma.file.findFirst({
      where: { fileName },
      include: {
        challenge: { include: { competition: true } },
      },
    });

    if (!file || !file.challenge.competition) {
      throw new NotFoundException('File or competition not found');
    }

    const competition = file.challenge.competition;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (
      user?.role !== 'SUPERADMIN' &&
      competition.adminId !== userId &&
      !(competition.isPublic && competition.status === 'ACTIVE')
    ) {
      const reg = await this.prisma.registration.findFirst({
        where: {
          userId,
          competitionId: competition.id,
          status: 'APPROVED',
        },
      });

      if (!reg) throw new ForbiddenException('Access denied');
    }

    const filePath = path.join(this.uploadPath, file.fileName);
    await fs.access(filePath).catch(() => {
      throw new NotFoundException('File missing on server');
    });

    return {
      filePath,
      fileName: file.originalName,
      fileType: file.fileType,
      fileSize: file.fileSize, 
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                DELETE FILE                                  */
  /* -------------------------------------------------------------------------- */

  async remove(id: string, userId: string) {
    const file = await this.prisma.file.findUnique({
      where: { id },
      include: {
        challenge: { include: { competition: true } },
      },
    });

    if (!file || !file.challenge.competition) {
      throw new NotFoundException('File or competition not found');
    }

    const competition = file.challenge.competition;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (
      user?.role !== 'SUPERADMIN' &&
      competition.adminId !== userId
    ) {
      throw new ForbiddenException('Not allowed');
    }

    if (competition.status === 'ACTIVE') {
      throw new BadRequestException(
        'Cannot delete files during active competition',
      );
    }

    await this.prisma.file.delete({ where: { id } });

    await fs.unlink(path.join(this.uploadPath, file.fileName)).catch(() => {});

    return { message: 'File deleted successfully' };
  }

  /* -------------------------------------------------------------------------- */
  /*                               CHALLENGE FILES                               */
  /* -------------------------------------------------------------------------- */

  async getChallengFiles(challengeId: string, userId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
      include: { competition: true },
    });

    if (!challenge || !challenge.competition) {
      throw new NotFoundException('Challenge or competition not found');
    }

    const competition = challenge.competition;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (
      user?.role !== 'SUPERADMIN' &&
      competition.adminId !== userId &&
      !(competition.isPublic && competition.status === 'ACTIVE')
    ) {
      const reg = await this.prisma.registration.findFirst({
        where: {
          userId,
          competitionId: competition.id,
          status: 'APPROVED',
        },
      });

      if (!reg) throw new ForbiddenException('Access denied');
    }

    return this.prisma.file.findMany({
      where: { challengeId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              FILE VALIDATION                                */
  /* -------------------------------------------------------------------------- */

  private validateFile(file: any) {
    if (!file) throw new BadRequestException('No file provided');
    if (file.size > this.maxFileSize)
      throw new BadRequestException('File too large');
    if (!this.allowedTypes.includes(file.mimetype))
      throw new BadRequestException('Invalid file type');
  }

  private async ensureUploadDirectory() {
    await fs.mkdir(this.uploadPath, { recursive: true });
  }
}
