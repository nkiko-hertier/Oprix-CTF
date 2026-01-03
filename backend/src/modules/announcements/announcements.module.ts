import { Module } from '@nestjs/common';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { AuthModule } from '../auth/auth.module';
import { WebsocketsModule } from '../websockets/events.module';

@Module({
  imports: [
    AuthModule,
    WebsocketsModule,
  ],
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule { }
