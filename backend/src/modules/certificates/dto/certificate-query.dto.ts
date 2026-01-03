import { IsOptional, IsEnum, IsUUID, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO for querying certificates with filters
 */
export class CertificateQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by certificate status',
    enum: ['PENDING', 'ISSUED', 'APPROVED', 'REJECTED', 'REVOKED'],
  })
  @IsOptional()
  @IsEnum(['PENDING', 'ISSUED', 'APPROVED', 'REJECTED', 'REVOKED'])
  status?: string;

  @ApiPropertyOptional({
    description: 'Filter by competition ID',
    example: 'comp-uuid-123',
  })
  @IsOptional()
  @IsUUID()
  competitionId?: string;

  @ApiPropertyOptional({
    description: 'Filter by user ID (admin only)',
    example: 'user-uuid-456',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by team ID (admin only)',
    example: 'team-uuid-789',
  })
  @IsOptional()
  @IsUUID()
  teamId?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
