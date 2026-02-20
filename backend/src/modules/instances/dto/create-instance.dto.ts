import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInstanceDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The challenge ID for which to create an instance',
  })
  @IsString()
  @IsUUID()
  challengeId: string;
}
