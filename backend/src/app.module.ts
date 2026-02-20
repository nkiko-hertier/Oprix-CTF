import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { SuperadminModule } from './modules/superadmin/superadmin.module';
import { AdminModule } from './modules/admin/admin.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CompetitionsModule } from './modules/competitions/competitions.module';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { UsersModule } from './modules/users/users.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { TeamsModule } from './modules/teams/teams.module';
import { FilesModule } from './modules/files/files.module';
import { WebsocketsModule } from './modules/websockets/events.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { LearningMaterialsModule } from './modules/learning-materials/learning-materials.module';
import { InstancesModule } from './modules/instances/instances.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UsersModule,
    DashboardModule,
    CompetitionsModule,
    ChallengesModule,
    SubmissionsModule,
    LeaderboardModule,
    TeamsModule,
    FilesModule,
    WebsocketsModule,
    JobsModule,
    AdminModule,
    SuperadminModule,
    MonitoringModule,
    CertificatesModule,
    AnnouncementsModule,
    LearningMaterialsModule,
    InstancesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
