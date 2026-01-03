import { Module } from '@nestjs/common';
import { LearningMaterialsController } from './learning-materials.controller';
import { LearningMaterialsService } from './learning-materials.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [LearningMaterialsController],
  providers: [LearningMaterialsService],
  exports: [LearningMaterialsService],
})
export class LearningMaterialsModule { }
