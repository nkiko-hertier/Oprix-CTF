import { IsOptional, IsString, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class InstanceQueryDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Filter by user ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Filter by challenge ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  challengeId?: string;

  @ApiProperty({
    example: false,
    description: 'Filter by expiration status (true for expired, false for active)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isExpired?: boolean;

  @ApiProperty({
    example: 1,
    description: 'Page number for pagination',
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
