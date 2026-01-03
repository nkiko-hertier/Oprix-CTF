import {
  Controller,
  Get,
  Post,
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
import { CreatorsService } from './creators.service';
import {
  InviteCreatorDto,
  AcceptInviteDto,
  CreatorQueryDto,
  CompetitionCreatorResponseDto,
  InviteResponseDto,
  PendingInviteResponseDto,
} from './dto/creator.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../../common/decorators/auth.decorator';

@ApiTags('creators')
@Controller()
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) {}

  /**
   * Invite a creator to a competition
   */
  @Post('competitions/:competitionId/creators/invite')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Invite a creator to a competition (Admin/Owner only)' })
  @ApiParam({ name: 'competitionId', description: 'Competition ID' })
  @ApiResponse({
    status: 201,
    description: 'Invitation created successfully',
    type: InviteResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Only competition owner can invite' })
  @ApiResponse({ status: 404, description: 'Competition not found' })
  @ApiResponse({ status: 409, description: 'Active invitation already exists' })
  async inviteCreator(
    @Param('competitionId', ParseUUIDPipe) competitionId: string,
    @Body() dto: InviteCreatorDto,
    @CurrentUser() user: any,
  ): Promise<InviteResponseDto> {
    return this.creatorsService.inviteCreator(competitionId, dto, user.id);
  }

  /**
   * Accept a creator invitation
   */
  @Post('creator-invites/accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept a creator invitation' })
  @ApiResponse({
    status: 200,
    description: 'Invitation accepted successfully',
    type: CompetitionCreatorResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired invitation' })
  @ApiResponse({ status: 403, description: 'Email mismatch' })
  async acceptInvite(
    @Body() dto: AcceptInviteDto,
    @CurrentUser() user: any,
  ): Promise<CompetitionCreatorResponseDto> {
    return this.creatorsService.acceptInvite(dto, user.id, user.email);
  }

  /**
   * Approve a pending creator
   */
  @Patch('competitions/:competitionId/creators/:creatorId/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Approve a pending creator (Admin/Owner only)' })
  @ApiParam({ name: 'competitionId', description: 'Competition ID' })
  @ApiParam({ name: 'creatorId', description: 'Creator user ID' })
  @ApiResponse({
    status: 200,
    description: 'Creator approved successfully',
    type: CompetitionCreatorResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Only competition owner can approve' })
  @ApiResponse({ status: 404, description: 'Creator assignment not found' })
  async approveCreator(
    @Param('competitionId', ParseUUIDPipe) competitionId: string,
    @Param('creatorId', ParseUUIDPipe) creatorId: string,
    @CurrentUser() user: any,
  ): Promise<CompetitionCreatorResponseDto> {
    return this.creatorsService.approveCreator(competitionId, creatorId, user.id);
  }

  /**
   * Reject a pending creator
   */
  @Patch('competitions/:competitionId/creators/:creatorId/reject')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reject a pending creator (Admin/Owner only)' })
  @ApiParam({ name: 'competitionId', description: 'Competition ID' })
  @ApiParam({ name: 'creatorId', description: 'Creator user ID' })
  @ApiResponse({
    status: 200,
    description: 'Creator rejected successfully',
    type: CompetitionCreatorResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Only competition owner can reject' })
  @ApiResponse({ status: 404, description: 'Creator assignment not found' })
  async rejectCreator(
    @Param('competitionId', ParseUUIDPipe) competitionId: string,
    @Param('creatorId', ParseUUIDPipe) creatorId: string,
    @CurrentUser() user: any,
  ): Promise<CompetitionCreatorResponseDto> {
    return this.creatorsService.rejectCreator(competitionId, creatorId, user.id);
  }

  /**
   * Revoke an approved creator's access
   */
  @Patch('competitions/:competitionId/creators/:creatorId/revoke')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Revoke creator access (Admin/Owner only)' })
  @ApiParam({ name: 'competitionId', description: 'Competition ID' })
  @ApiParam({ name: 'creatorId', description: 'Creator user ID' })
  @ApiResponse({
    status: 200,
    description: 'Creator access revoked successfully',
    type: CompetitionCreatorResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Only competition owner can revoke' })
  @ApiResponse({ status: 404, description: 'Creator assignment not found' })
  async revokeCreator(
    @Param('competitionId', ParseUUIDPipe) competitionId: string,
    @Param('creatorId', ParseUUIDPipe) creatorId: string,
    @CurrentUser() user: any,
  ): Promise<CompetitionCreatorResponseDto> {
    return this.creatorsService.revokeCreator(competitionId, creatorId, user.id);
  }

  /**
   * List creators for a competition
   */
  @Get('competitions/:competitionId/creators')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List creators for a competition (Admin/Owner only)' })
  @ApiParam({ name: 'competitionId', description: 'Competition ID' })
  @ApiResponse({
    status: 200,
    description: 'List of creators',
  })
  async listCreators(
    @Param('competitionId', ParseUUIDPipe) competitionId: string,
    @Query() query: CreatorQueryDto,
    @CurrentUser() user: any,
  ) {
    return this.creatorsService.listCreators(competitionId, query, user.id);
  }

  /**
   * List pending invites for a competition
   */
  @Get('competitions/:competitionId/creators/invites')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List pending invites for a competition (Admin/Owner only)' })
  @ApiParam({ name: 'competitionId', description: 'Competition ID' })
  @ApiResponse({
    status: 200,
    description: 'List of pending invites',
    type: [PendingInviteResponseDto],
  })
  async listPendingInvites(
    @Param('competitionId', ParseUUIDPipe) competitionId: string,
    @CurrentUser() user: any,
  ): Promise<PendingInviteResponseDto[]> {
    return this.creatorsService.listPendingInvites(competitionId, user.id);
  }

  /**
   * Get competitions where current user is an approved creator
   */
  @Get('creators/my-competitions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get competitions where you are an approved creator' })
  @ApiResponse({
    status: 200,
    description: 'List of competition assignments',
    type: [CompetitionCreatorResponseDto],
  })
  async getMyCreatorCompetitions(
    @CurrentUser() user: any,
  ): Promise<CompetitionCreatorResponseDto[]> {
    return this.creatorsService.getMyCreatorCompetitions(user.id);
  }
}
