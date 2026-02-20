import { ApiProperty } from '@nestjs/swagger';

export class InstanceResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique instance identifier',
  })
  id: string;

  @ApiProperty({
    example: 'https://github.com/example/challenge',
    description: 'GitHub URL for the challenge (from challenge.url)',
  })
  githubUrl: string | null;

  @ApiProperty({
    example: 3600,
    description: 'Duration in seconds (from challenge.timeLimit)',
  })
  duration: number;

  @ApiProperty({
    example: '2024-02-20T10:30:00Z',
    description: 'When this instance was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-02-20T14:30:00Z',
    description: 'When this instance expires (createdAt + duration)',
  })
  expiresAt: Date;

  @ApiProperty({
    example: false,
    description: 'Whether this instance has expired',
  })
  isExpired: boolean;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Challenge ID',
  })
  challengeId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'User ID who created this instance',
  })
  userId: string;

  @ApiProperty({
    example: 8080,
    description: 'The port number where the instance is running',
    required: false,
  })
  port: number | null;

  @ApiProperty({
    example: 'localhost',
    description: 'The hostname where the instance is running',
    required: false,
  })
  hostname: string | null;
}
