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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateProfileDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserRoleDto, ListUsersQueryDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SuperAdminGuard } from '../auth/guards/superadmin.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../../common/decorators/auth.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { InviteUserDto } from './dto/invite-user.dto';

/**
 * Users Controller
 * Handles user management endpoints
 */
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Get(':id/profile')
  async getDashboard(@Param('id') userId: string) {
    return this.usersService.getUserProfileAndStats(userId);
  }

  /**
   * Create a new user (SuperAdmin only)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  // @UseGuards(SuperAdminGuard)
  @Roles('SUPERADMIN')
  @ApiOperation({ summary: 'Create a new user (SuperAdmin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  
  /**
   * Toggle User Role (SuperAdmin only)
   */
  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles('SUPERADMIN')
  @ApiOperation({ summary: 'Toggle User Role (SuperAdmin only)' })
  @ApiResponse({ status: 201, description: 'User invited successfully' })
  @ApiResponse({ status: 409, description: 'User email already exists' })
  toggle(@Param('id') id: string) {
    return this.usersService.toggleUserStatus(id);
  }

  /**
   * Create a new user (SuperAdmin only)
   */
  @Post('invite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  // @UseGuards(SuperAdminGuard)
  @Roles('SUPERADMIN')
  @ApiOperation({ summary: 'Create a new user (SuperAdmin only)' })
  @ApiResponse({ status: 201, description: 'User invited successfully' })
  @ApiResponse({ status: 409, description: 'User email already exists' })
  inviteUser(@Body() createUserDto: InviteUserDto) {
    return this.usersService.inviteUser(createUserDto);
  }

  /**
   * Get all users with pagination and filters (Admin only)
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  // @UseGuards(AdminGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  findAll(@Query() query: ListUsersQueryDto) {
    return this.usersService.findAll(query);
  }

  /**
   * Get current authenticated user's profile
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  getMyProfile(@CurrentUser() user: any) {
    return this.usersService.findOne(user.id);
  }

  /**
   * Get current user's statistics
   */
  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  getMyStats(@CurrentUser() user: any) {
    return this.usersService.getUserStats(user.id);
  }

  /**
   * Update current user's profile
   */
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  updateMyProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  /**
   * Get a specific user by ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Get user statistics by ID
   */
  @Get(':id/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user statistics by ID' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserStats(@Param('id') id: string) {
    return this.usersService.getUserStats(id);
  }

  /**
   * Update user details (Admin only)
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Update user details (Admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Update user role (SuperAdmin only)
   */
  @Patch(':id/role')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(SuperAdminGuard)
  @Roles('SUPERADMIN')
  @ApiOperation({ summary: 'Update user role (SuperAdmin only)' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 403, description: 'Cannot modify SuperAdmin role' })
  updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateUserRoleDto,
    @CurrentUser() admin: any,
  ) {
    return this.usersService.updateRole(id, updateRoleDto, admin.id);
  }

  /**
   * Deactivate user (Admin only)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  @ApiResponse({ status: 403, description: 'Cannot delete SuperAdmin' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
