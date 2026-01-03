import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

/**
 * Query DTO for dashboard overview
 */
export class DashboardQueryDto {
  @ApiPropertyOptional({ description: 'Filter by specific competition ID (must be owned by admin)' })
  @IsOptional()
  @IsUUID()
  competitionId?: string;
}

/**
 * Stats summary response
 */
export class DashboardStatsDto {
  @ApiProperty({ description: 'Total users (players) count' })
  totalUsers: number;

  @ApiProperty({ description: 'Active competitions count' })
  activeCompetitions: number;

  @ApiProperty({ description: 'Submissions made today' })
  todaySubmissions: number;

  @ApiProperty({ description: 'Active teams count' })
  activeTeams: number;

  @ApiProperty({ description: 'User growth percentage in last 30 days' })
  userGrowth: number;

  @ApiProperty({ description: 'Competition growth percentage in last 30 days' })
  competitionGrowth: number;

  @ApiProperty({ description: 'Submission growth percentage in last 30 days' })
  submissionGrowth: number;

  @ApiProperty({ description: 'Team growth percentage in last 30 days' })
  teamGrowth: number;
}

/**
 * Activity data point for charts
 */
export class ActivityDataPointDto {
  @ApiProperty({ description: 'Date in YYYY-MM-DD format' })
  date: string;

  @ApiProperty({ description: 'Number of submissions on this date' })
  submissions: number;

  @ApiProperty({ description: 'Number of new users on this date' })
  users: number;
}

/**
 * Top user entry
 */
export class TopUserDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'Total points earned' })
  points: number;

  @ApiProperty({ description: 'Number of challenges solved' })
  solvedChallenges: number;

  @ApiProperty({ description: 'Avatar URL' })
  avatarUrl: string;
}

/**
 * Complete dashboard overview response
 */
export class DashboardOverviewResponseDto {
  @ApiProperty({ type: DashboardStatsDto, description: 'Summary statistics' })
  stats: DashboardStatsDto;

  @ApiProperty({ type: [ActivityDataPointDto], description: 'Activity data for last 7 days' })
  activityData: ActivityDataPointDto[];

  @ApiProperty({ type: [TopUserDto], description: 'Top 5 users by points' })
  topUsers: TopUserDto[];
}
