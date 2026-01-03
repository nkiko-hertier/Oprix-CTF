import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Announcement Priority Levels
 */
export enum AnnouncementPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

/**
 * DTO for creating a new announcement
 */
export class CreateAnnouncementDto {
  @ApiProperty({
    description: 'Competition ID the announcement belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  competitionId: string;

  @ApiProperty({
    description: 'Announcement title',
    example: 'Important: Challenge Update',
    minLength: 3,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Announcement content/body',
    example: 'We have updated the hints for Challenge #5. Please refresh your page.',
    minLength: 10,
    maxLength: 5000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(5000)
  content: string;

  @ApiPropertyOptional({
    description: 'Priority level of the announcement',
    enum: AnnouncementPriority,
    default: AnnouncementPriority.NORMAL,
  })
  @IsOptional()
  @IsEnum(AnnouncementPriority)
  priority?: AnnouncementPriority;

  @ApiPropertyOptional({
    description: 'Whether the announcement is visible to participants',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}

/**
 * DTO for updating an existing announcement
 */
export class UpdateAnnouncementDto extends PartialType(CreateAnnouncementDto) {
  @ApiPropertyOptional({
    description: 'Announcement title',
    example: 'Updated: Challenge Hints Available',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    description: 'Announcement content/body',
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  content?: string;
}

/**
 * Query parameters for listing announcements
 */
export class AnnouncementQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by competition ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  competitionId?: string;

  @ApiPropertyOptional({
    description: 'Filter by priority',
    enum: AnnouncementPriority,
  })
  @IsOptional()
  @IsEnum(AnnouncementPriority)
  priority?: AnnouncementPriority;

  @ApiPropertyOptional({
    description: 'Filter by visibility status',
  })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
  })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 20,
  })
  @IsOptional()
  limit?: number;
}

/**
 * Response DTO for a single announcement
 */
export class AnnouncementResponseDto {
  @ApiProperty({ description: 'Announcement ID' })
  id: string;

  @ApiProperty({ description: 'Competition ID' })
  competitionId: string;

  @ApiProperty({ description: 'Announcement title' })
  title: string;

  @ApiProperty({ description: 'Announcement content' })
  content: string;

  @ApiProperty({ enum: AnnouncementPriority, description: 'Priority level' })
  priority: AnnouncementPriority;

  @ApiProperty({ description: 'Visibility status' })
  isVisible: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Competition details' })
  competition?: {
    id: string;
    name: string;
  };
}

/**
 * Paginated response for announcements list
 */
export class AnnouncementListResponseDto {
  @ApiProperty({ type: [AnnouncementResponseDto] })
  data: AnnouncementResponseDto[];

  @ApiProperty({ description: 'Total number of announcements' })
  total: number;

  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}
