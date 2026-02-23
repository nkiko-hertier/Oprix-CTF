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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CompetitionsService } from './competitions.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import {
  UpdateCompetitionDto,
  UpdateCompetitionStatusDto,
  RegisterCompetitionDto,
} from './dto/update-competition.dto';
import { CompetitionQueryDto } from './dto/competition-query.dto';
import { JwtAuthGuard, OptionalAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../../common/decorators/auth.decorator';

/**
 * Competitions Controller
 * Handles competition management endpoints
 */
@ApiTags('competitions')
@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) { }

  /**
   * Create a new competition (Admin only)
   */
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new competition (Admin only)' })
  @ApiResponse({ status: 201, description: 'Competition created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or dates' })
  create(@Body() createCompetitionDto: CreateCompetitionDto, @CurrentUser() user: any) {
    return this.competitionsService.create(createCompetitionDto, user.id);
  }

  /**
   * Get all public competitions with filters
   */
  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all public competitions' })
  @ApiResponse({ status: 200, description: 'Competitions retrieved successfully' })
  findAll(@Query() query: Omit<CompetitionQueryDto, 'myCompetitions'>, @CurrentUser() user?: any) {
    return this.competitionsService.findAll(query, user?.id, user);
  }

  /**
   * Get user's registered competitions
   */
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get my registered competitions' })
  @ApiResponse({ status: 200, description: 'User competitions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  findMyCompetitions(@Query() query: Omit<CompetitionQueryDto, 'myCompetitions'>, @CurrentUser() user: any) {
    return this.competitionsService.findAll({ ...query, myCompetitions: true }, user.id, user);
  }

  /**
   * Get user's team for a competition (with invite code and stats)
   */
  @Get(':id/my-team')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: "Get my team for this competition (includes invite code)" })
  @ApiResponse({ status: 200, description: 'Team info retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Competition not found' })
  async getMyTeam(@Param('id') competitionId: string, @CurrentUser() user: any) {
    return this.competitionsService.getMyTeam(competitionId, user.id);
  }

  /**
   * Get a specific competition by ID
   */
  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  // @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get competition by ID' })
  @ApiResponse({ status: 200, description: 'Competition retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Competition not found' })
  findOne(@Param('id') id: string, @CurrentUser() user?: any) {
    return this.competitionsService.findOne(id, user?.id);
  }

  /**
    * Get a specific competition by ID users progress
    */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get my registered competitions progres by id' })
  @Get(':id/progress')
  async getProgress(@Param('id') competitionId: string, @CurrentUser() user?: any) {
    return this.competitionsService.getUserProgress(
      competitionId,
      user?.id,
    );
  }


  /**
   * Update competition details (Admin/Owner only)
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update competition (Admin/Owner only)' })
  @ApiResponse({ status: 200, description: 'Competition updated successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized to update this competition' })
  update(
    @Param('id') id: string,
    @Body() updateCompetitionDto: UpdateCompetitionDto,
    @CurrentUser() user: any,
  ) {
    return this.competitionsService.update(id, updateCompetitionDto, user.id);
  }

  /**
   * Update competition status (Admin/Owner only)
   */
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update competition status (Admin/Owner only)' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  updateStatus(
    @Param('id') id: string,
    @Body() statusDto: UpdateCompetitionStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.competitionsService.updateStatus(id, statusDto, user.id);
  }

  /**
   * Register for a competition (Authenticated users)
   */
  @Post(':id/register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register for a competition' })
  @ApiResponse({ status: 200, description: 'Registered successfully' })
  @ApiResponse({ status: 409, description: 'Already registered' })
  @ApiResponse({ status: 400, description: 'Competition is full or not open' })
  register(
    @Param('id') id: string,
    @Body() registerDto: RegisterCompetitionDto,
    @CurrentUser() user: any,
  ) {
    return this.competitionsService.register(id, registerDto, user.id);
  }

  /**
   * Unregister from a competition (Authenticated users)
   */
  @Delete(':id/register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unregister from a competition' })
  @ApiResponse({ status: 200, description: 'Unregistered successfully' })
  @ApiResponse({ status: 400, description: 'Cannot unregister from active/completed competition' })
  unregister(@Param('id') id: string, @CurrentUser() user: any) {
    return this.competitionsService.unregister(id, user.id);
  }

  /**
   * Delete a competition (Admin/Owner only)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete competition (Admin/Owner only)' })
  @ApiResponse({ status: 200, description: 'Competition deleted successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized to delete this competition' })
  @ApiResponse({ status: 400, description: 'Cannot delete active/completed competition' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.competitionsService.remove(id, user.id);
  }
}
