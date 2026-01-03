import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for updating certificate status
 */
export class UpdateCertificateStatusDto {
  @ApiProperty({
    description: 'New status for the certificate',
    enum: ['PENDING', 'ISSUED', 'APPROVED', 'REJECTED', 'REVOKED'],
    example: 'APPROVED',
  })
  @IsEnum(['PENDING', 'ISSUED', 'APPROVED', 'REJECTED', 'REVOKED'])
  status: string;

  @ApiPropertyOptional({
    description: 'Reason for rejection or revocation',
    example: 'Did not meet minimum participation requirements',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
