import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUrl,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Resource link DTO for additional materials
 */
export class ResourceLinkDto {
  @ApiProperty({ example: 'Official Documentation', description: 'Label for the resource' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  label: string;

  @ApiProperty({ example: 'https://docs.example.com', description: 'URL of the resource' })
  @IsUrl()
  url: string;
}

/**
 * DTO for creating a learning material
 */
export class CreateLearningMaterialDto {
  @ApiProperty({ example: 'Introduction to Web Security', description: 'Title of the material' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: 'A comprehensive guide to web security fundamentals',
    description: 'Description of the material',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({
    example: 'https://example.com/thumbnail.jpg',
    description: 'Thumbnail/wallpaper image URL',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({
    example: 'https://example.com/course',
    description: 'Primary link to the learning material',
  })
  @IsUrl()
  linkUrl: string;

  @ApiProperty({
    type: [ResourceLinkDto],
    description: 'Additional resource links',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourceLinkDto)
  @IsOptional()
  resources?: ResourceLinkDto[];

  @ApiProperty({
    example: true,
    description: 'Whether the material is visible to users',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}

/**
 * DTO for updating a learning material
 */
export class UpdateLearningMaterialDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  linkUrl?: string;

  @ApiProperty({ type: [ResourceLinkDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourceLinkDto)
  @IsOptional()
  resources?: ResourceLinkDto[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}

/**
 * Query DTO for listing learning materials
 */
export class LearningMaterialQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ required: false, description: 'Search by title or description' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false, description: 'Filter by creator user ID' })
  @IsString()
  @IsOptional()
  createdBy?: string;
}

/**
 * Response DTO for learning material
 */
export class LearningMaterialResponseDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'Introduction to Web Security' })
  title: string;

  @ApiProperty({ example: 'A comprehensive guide...', required: false })
  description?: string;

  @ApiProperty({ example: 'https://example.com/thumbnail.jpg', required: false })
  thumbnailUrl?: string;

  @ApiProperty({ example: 'https://example.com/course' })
  linkUrl: string;

  @ApiProperty({ type: [ResourceLinkDto], required: false })
  resources?: ResourceLinkDto[];

  @ApiProperty({ example: true })
  isVisible: boolean;

  @ApiProperty({ example: '2025-12-15T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-12-15T12:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ required: false })
  createdBy?: {
    id: string;
    username: string;
  };
}

/**
 * Response DTO for paginated learning materials list
 */
export class LearningMaterialListResponseDto {
  @ApiProperty({ type: [LearningMaterialResponseDto] })
  data: LearningMaterialResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}
