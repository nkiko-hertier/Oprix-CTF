import { IsString, IsUUID, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInstanceDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The challenge ID for which to create an instance',
  })
  @IsString()
  @IsUUID()
  challengeId: string;

  @ApiProperty({
    example: 8080,
    description: 'The port number where the instance is running',
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  port?: number;

  @ApiProperty({
    example: 'localhost',
    description: 'The hostname where the instance is running',
    required: false,
  })
  @IsString()
  @IsOptional()
  hostname?: string;
}
