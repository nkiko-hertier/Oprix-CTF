import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';
import { AuthModule } from '../auth/auth.module';

/**
 * WebSockets Module
 * Handles real-time events, notifications, and live updates for CTF platform
 * 
 * Uses ClerkJwtService from AuthModule for proper Clerk JWT verification
 */
@Module({
  imports: [AuthModule],
  providers: [EventsGateway, EventsService],
  exports: [EventsService, EventsGateway],
})
export class WebsocketsModule {}