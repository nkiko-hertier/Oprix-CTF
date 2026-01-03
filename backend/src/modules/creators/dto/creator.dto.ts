import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for inviting a creator to a competition
 */
export class InviteCreatorDto {
  @ApiProperty({
    example: 'creator@example.com',
    description: 'Email of the person to invite as creator',
  })
  @IsEmail()
  email: string;
}

/**
 * DTO for accepting a creator invitation
 */
export class AcceptInviteDto {
  @ApiProperty({
    example: 'abc123token',
    description: 'Invitation token from the invite link',
  })
  @IsString()
  token: string;
}

/**
 * Response DTO for creator invitation
 */
export class InviteResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'https://oprix-frontend.com/creator-invite?token=abc123' })
  inviteLink: string;

  @ApiProperty({ example: 'creator@example.com' })
  email: string;

  @ApiProperty({ example: '2025-12-16T12:00:00Z' })
  expiresAt: Date;
}

/**
 * Response DTO for competition creator
 */
export class CompetitionCreatorResponseDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'uuid-here' })
  competitionId: string;

  @ApiProperty({ example: 'uuid-here' })
  creatorId: string;

  @ApiProperty({ enum: ['PENDING', 'APPROVED', 'REJECTED', 'REVOKED'] })
  status: string;

  @ApiProperty({ example: '2025-12-15T12:00:00Z' })
  invitedAt: Date;

  @ApiProperty({ example: '2025-12-15T13:00:00Z', required: false })
  approvedAt?: Date;

  @ApiProperty({ required: false })
  creator?: {
    id: string;
    username: string;
    email: string;
  };

  @ApiProperty({ required: false })
  competition?: {
    id: string;
    name: string;
  };
}

/**
 * Query DTO for listing creators
 */
export class CreatorQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'REVOKED'],
    required: false,
  })
  @IsEnum(['PENDING', 'APPROVED', 'REJECTED', 'REVOKED'])
  @IsOptional()
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';
}

/**
 * Response DTO for pending invites
 */
export class PendingInviteResponseDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'creator@example.com' })
  email: string;

  @ApiProperty({ example: '2025-12-16T12:00:00Z' })
  expiresAt: Date;

  @ApiProperty({ example: false })
  isUsed: boolean;

  @ApiProperty({ required: false })
  competition?: {
    id: string;
    name: string;
  };
}
