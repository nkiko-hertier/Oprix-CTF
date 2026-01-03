import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Response DTO for certificate data
 */
export class CertificateResponseDto {
  @ApiProperty({ description: 'Certificate UUID' })
  id: string;

  @ApiProperty({ description: 'Unique certificate number', example: 'OPRIX-CTF-2024-001234' })
  certificateNumber: string;

  @ApiPropertyOptional({ description: 'User ID (for individual certificates)' })
  userId?: string;

  @ApiPropertyOptional({ description: 'Team ID (for team certificates)' })
  teamId?: string;

  @ApiProperty({ description: 'Competition ID' })
  competitionId: string;

  @ApiPropertyOptional({ description: 'Final rank in competition' })
  finalRank?: number;

  @ApiProperty({ description: 'Total score earned' })
  totalScore: number;

  @ApiProperty({ description: 'Number of challenges solved' })
  challengesSolved: number;

  @ApiProperty({ description: 'Total challenges in competition' })
  totalChallenges: number;

  @ApiProperty({ description: 'Completion rate (percentage)' })
  completionRate: number;

  @ApiPropertyOptional({ description: 'Total participant count' })
  participantCount?: number;

  @ApiProperty({ description: 'Certificate status', enum: ['PENDING', 'ISSUED', 'APPROVED', 'REJECTED', 'REVOKED'] })
  status: string;

  @ApiProperty({ description: 'When certificate was issued' })
  issuedAt: Date;

  @ApiProperty({ description: 'Verification code for public verification' })
  verificationCode: string;

  @ApiProperty({ description: 'Whether certificate is revoked' })
  isRevoked: boolean;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  // Related data
  @ApiPropertyOptional({ description: 'User information' })
  user?: {
    id: string;
    username: string;
    email: string;
  };

  @ApiPropertyOptional({ description: 'Team information' })
  team?: {
    id: string;
    name: string;
  };

  @ApiProperty({ description: 'Competition information' })
  competition: {
    id: string;
    name: string;
    title: string;
    startDate: Date;
    endDate: Date;
  };

  @ApiProperty({ description: 'Certificate creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Certificate last update date' })
  updatedAt: Date;
}

/**
 * Response for certificate verification
 */
export class VerifyCertificateResponseDto {
  @ApiProperty({ description: 'Whether certificate is valid' })
  valid: boolean;

  @ApiPropertyOptional({ description: 'Certificate data if valid' })
  certificate?: {
    certificateNumber: string;
    recipientName: string; // username or team name
    competitionName: string;
    issuedAt: Date;
    finalRank?: number;
    totalScore: number;
    isRevoked: boolean;
  };

  @ApiPropertyOptional({ description: 'Error message if invalid' })
  message?: string;
}
