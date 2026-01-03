import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { LearningMaterialsService } from './learning-materials.service';
import {
  CreateLearningMaterialDto,
  UpdateLearningMaterialDto,
  LearningMaterialQueryDto,
  LearningMaterialResponseDto,
  LearningMaterialListResponseDto,
} from './dto/learning-material.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/auth.decorator';

@ApiTags('learning-materials')
@ApiBearerAuth('JWT-auth')
@Controller('learning-materials')
@UseGuards(JwtAuthGuard)
export class LearningMaterialsController {
  constructor(private readonly learningMaterialsService: LearningMaterialsService) { }

  /**
   * Create a new learning material
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'CREATOR', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create a new learning material (Admin/Creator/SuperAdmin only)' })
  @ApiResponse({
    status: 201,
    description: 'Learning material created successfully',
    type: LearningMaterialResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN or CREATOR role' })
  async create(
    @Body() dto: CreateLearningMaterialDto,
    @CurrentUser() user: any,
  ): Promise<LearningMaterialResponseDto> {
    return this.learningMaterialsService.create(dto, user.id);
  }

  /**
   * Get all learning materials
   */
  @Get()
  @ApiOperation({ summary: 'Get all learning materials' })
  @ApiResponse({
    status: 200,
    description: 'List of learning materials',
    type: LearningMaterialListResponseDto,
  })
  async findAll(
    @Query() query: LearningMaterialQueryDto,
    @CurrentUser() user: any,
  ): Promise<LearningMaterialListResponseDto> {
    return this.learningMaterialsService.findAll(query, user.id, user.role);
  }

  /**
   * Get my learning materials
   */
  @Get('my')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'CREATOR', 'SUPERADMIN')
  @ApiOperation({ summary: 'Get learning materials created by current user' })
  @ApiResponse({
    status: 200,
    description: 'List of your learning materials',
    type: LearningMaterialListResponseDto,
  })
  async getMyMaterials(
    @Query() query: LearningMaterialQueryDto,
    @CurrentUser() user: any,
  ): Promise<LearningMaterialListResponseDto> {
    return this.learningMaterialsService.getMyMaterials(user.id, query);
  }

  /**
   * Get a single learning material by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a learning material by ID' })
  @ApiParam({ name: 'id', description: 'Learning material ID' })
  @ApiResponse({
    status: 200,
    description: 'Learning material details',
    type: LearningMaterialResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Learning material not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ): Promise<LearningMaterialResponseDto> {
    return this.learningMaterialsService.findOne(id, user.id, user.role);
  }

  /**
   * Update a learning material
   */
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'CREATOR', 'SUPERADMIN')
  @ApiOperation({ summary: 'Update a learning material (Admin or Creator who created it)' })
  @ApiParam({ name: 'id', description: 'Learning material ID' })
  @ApiResponse({
    status: 200,
    description: 'Learning material updated successfully',
    type: LearningMaterialResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Learning material not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLearningMaterialDto,
    @CurrentUser() user: any,
  ): Promise<LearningMaterialResponseDto> {
    return this.learningMaterialsService.update(id, dto, user.id, user.role);
  }

  /**
   * Toggle visibility of a learning material
   */
  @Patch(':id/visibility')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'CREATOR', 'SUPERADMIN')
  @ApiOperation({ summary: 'Toggle learning material visibility' })
  @ApiParam({ name: 'id', description: 'Learning material ID' })
  @ApiResponse({
    status: 200,
    description: 'Visibility toggled successfully',
    type: LearningMaterialResponseDto,
  })
  async toggleVisibility(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ): Promise<LearningMaterialResponseDto> {
    return this.learningMaterialsService.toggleVisibility(id, user.id, user.role);
  }

  /**
   * Delete a learning material
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'CREATOR', 'SUPERADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a learning material (Admin or Creator who created it)' })
  @ApiParam({ name: 'id', description: 'Learning material ID' })
  @ApiResponse({
    status: 200,
    description: 'Learning material deleted successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Learning material not found' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ): Promise<{ success: boolean; message: string }> {
    return this.learningMaterialsService.remove(id, user.id, user.role);
  }
}
