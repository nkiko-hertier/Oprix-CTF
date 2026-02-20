import { Module } from '@nestjs/common';
import { InstancesService } from './instances.service';
import { InstancesController } from './instances.controller';
import { InstancesGateway } from './instances.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [InstancesController],
  providers: [InstancesService, InstancesGateway],
  exports: [InstancesService, InstancesGateway],
})
export class InstancesModule {}
