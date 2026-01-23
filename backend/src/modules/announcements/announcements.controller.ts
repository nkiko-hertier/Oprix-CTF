import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AnnouncementsService } from './announcements.service';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
  AnnouncementQueryDto,
  AnnouncementResponseDto,
  AnnouncementListResponseDto,
} from './dto/announcement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/auth.decorator';
import { AdminGuard } from '../auth/guards/admin.guard';

/**
 * Announcements Controller
 */
@ApiTags('Announcements')
@ApiBearerAuth()
@Controller('announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) { }

  /**
   * Create a new announcement
   */
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Create a new announcement' })
  @ApiResponse({
    status: 201,
    description: 'Announcement created successfully',
    type: AnnouncementResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden - No access to competition' })
  @ApiResponse({ status: 404, description: 'Competition not found' })
  async create(
    @Body() dto: CreateAnnouncementDto,
    @CurrentUser() user: any,
  ): Promise<AnnouncementResponseDto> {
    return this.announcementsService.create(dto, user.id, user.role);
  }

  /**
   * Get all announcements with filters
   */
  @Get()
  @ApiOperation({ summary: 'Get all announcements with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'List of announcements',
    type: AnnouncementListResponseDto,
  })
  async findAll(
    @Query() query: AnnouncementQueryDto,
    @CurrentUser() user: any,
  ): Promise<AnnouncementListResponseDto> {
    return this.announcementsService.findAll(query, user.id, user.role);
  }

  /**
   * Get a single announcement by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get an announcement by ID' })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  @ApiResponse({
    status: 200,
    description: 'Announcement details',
    type: AnnouncementResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Announcement not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ): Promise<AnnouncementResponseDto> {
    return this.announcementsService.findOne(id, user.id, user.role);
  }

  /**
   * Get announcements for a specific competition
   */
  @Get('competition/:competitionId')
  @ApiOperation({ summary: 'Get all announcements for a competition' })
  @ApiParam({ name: 'competitionId', description: 'Competition ID' })
  @ApiQuery({
    name: 'includeHidden',
    required: false,
    description: 'Include hidden announcements (admin only for own competitions)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of announcements for the competition',
    type: [AnnouncementResponseDto],
  })
  async findByCompetition(
    @Param('competitionId', ParseUUIDPipe) competitionId: string,
    @Query('includeHidden') includeHidden: string,
    @CurrentUser() user: any,
  ): Promise<AnnouncementResponseDto[]> {
    return this.announcementsService.findByCompetition(
      competitionId,
      user.id,
      user.role,
      includeHidden === 'true',
    );
  }

  /**
   * Update an announcement
   */
  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update an announcement' })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  @ApiResponse({
    status: 200,
    description: 'Announcement updated successfully',
    type: AnnouncementResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Announcement not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAnnouncementDto,
    @CurrentUser() user: any,
  ): Promise<AnnouncementResponseDto> {
    return this.announcementsService.update(id, dto, user.id, user.role);
  }

  /**
   * Toggle announcement visibility
   */
  @Patch(':id/visibility')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Toggle announcement visibility' })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  @ApiResponse({
    status: 200,
    description: 'Visibility toggled successfully',
    type: AnnouncementResponseDto,
  })
  async toggleVisibility(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ): Promise<AnnouncementResponseDto> {
    return this.announcementsService.toggleVisibility(id, user.id, user.role);
  }

  /**
   * Delete an announcement
   */
  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an announcement' })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  @ApiResponse({
    status: 200,
    description: 'Announcement deleted successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Announcement not found' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ): Promise<{ success: boolean; message: string }> {
    return this.announcementsService.remove(id, user.id, user.role);
  }

  /**
   * Get announcement statistics for a competition
   */
  @Get('competition/:competitionId/stats')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get announcement statistics for a competition' })
  @ApiParam({ name: 'competitionId', description: 'Competition ID' })
  @ApiResponse({
    status: 200,
    description: 'Announcement statistics',
  })
  async getStats(
    @Param('competitionId', ParseUUIDPipe) competitionId: string,
    @CurrentUser() user: any,
  ): Promise<{
    total: number;
    visible: number;
    hidden: number;
    byPriority: Record<string, number>;
  }> {
    return this.announcementsService.getStats(competitionId, user.id, user.role);
  }
}
