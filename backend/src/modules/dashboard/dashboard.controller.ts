import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/auth.decorator';
import { Role } from '@prisma/client';
import { DashboardQueryDto, DashboardOverviewResponseDto } from './dto/dashboard.dto';

/**
 * Dashboard Controller
 */
@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Get dashboard overview
   * 
   * Returns analytics summary based on user role:
   * - SUPERADMIN: All platform data
   * - ADMIN: Only their own competitions' data
   * 
   * Optional competitionId filter to get competition-specific analytics
   */
  @Get('overview')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({
    summary: 'Get dashboard overview analytics',
    description: 'Returns dashboard analytics based on user role',
  })
  @ApiQuery({
    name: 'competitionId',
    required: false,
    description: 'Filter analytics by specific competition ID (Admin can only filter by their own competitions)',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard overview retrieved successfully',
    type: DashboardOverviewResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/SuperAdmin role required or competition not owned' })
  async getOverview(
    @Query() query: DashboardQueryDto,
    @CurrentUser() user: any,
  ): Promise<DashboardOverviewResponseDto> {
    return this.dashboardService.getOverview(
      user.id,
      user.role,
      query.competitionId,
    );
  }
}
