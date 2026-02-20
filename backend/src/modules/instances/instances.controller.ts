import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InstancesService } from './instances.service';
import { CreateInstanceDto } from './dto/create-instance.dto';
import { InstanceQueryDto } from './dto/instance-query.dto';
import { InstanceResponseDto } from './dto/instance-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../../common/decorators/auth.decorator';

@ApiTags('instances')
@Controller('instances')
export class InstancesController {
  constructor(private readonly instancesService: InstancesService) {}

  /**
   * Create a new dynamic challenge instance for the current user
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new dynamic challenge instance' })
  @ApiResponse({
    status: 201,
    description: 'Instance created successfully',
    type: InstanceResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Challenge not dynamic or invalid' })
  @ApiResponse({ status: 404, description: 'Challenge not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createInstanceDto: CreateInstanceDto,
    @CurrentUser() user: any,
  ) {
    return this.instancesService.create(createInstanceDto, user.id);
  }

  /**
   * Get instances with filtering and pagination
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get dynamic challenge instances' })
  @ApiResponse({
    status: 200,
    description: 'Instances retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Query() query: InstanceQueryDto,
    @CurrentUser() user: any,
  ) {
    return this.instancesService.findAll(query, user.id, user.role);
  }

  /**
   * Delete expired instances (Admin only)
   */
  @Delete('delete-expired')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete all expired instances (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Expired instances deleted',
    schema: {
      example: { deletedCount: 5 },
    },
  })
  @ApiResponse({ status: 403, description: 'Only admins can delete expired instances' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteExpired() {
    return this.instancesService.deleteExpired();
  }
}
