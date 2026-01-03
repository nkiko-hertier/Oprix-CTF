import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
} from 'class-validator';

/**
 * DTO for creating a new user
 * Used only by SuperAdmin for manual user creation
 */
export class InviteUserDto {

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: ['ADMIN', 'CREATOR'], default: 'USER' })
  @IsEnum(['ADMIN', 'CREATOR'])
  @IsOptional()
  role?: 'ADMIN' | 'CREATOR';
}
