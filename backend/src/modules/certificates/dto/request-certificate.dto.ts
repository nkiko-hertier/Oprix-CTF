import { IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for requesting a certificate
 */
export class RequestCertificateDto {
  @ApiProperty({
    description: 'Competition ID to request certificate for',
    example: 'abc123-def456-ghi789',
  })
  @IsUUID()
  competitionId: string;

  @ApiPropertyOptional({
    description: 'Team ID (if requesting team certificate)',
    example: 'team-uuid-123',
  })
  @IsOptional()
  @IsUUID()
  teamId?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata for the certificate',
    example: { achievements: ['Speed Demon', 'First Blood'] },
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
