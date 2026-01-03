import { Module, forwardRef } from '@nestjs/common';
import { CompetitionsController } from './competitions.controller';
import { CompetitionsService } from './competitions.service';
import { AuthModule } from '../auth/auth.module';
import { CertificatesModule } from '../certificates/certificates.module';

/**
 * Competitions Module
*/
@Module({
  imports: [
    AuthModule,
    forwardRef(() => CertificatesModule),
  ],
  controllers: [CompetitionsController],
  providers: [CompetitionsService],
  exports: [CompetitionsService],
})
export class CompetitionsModule { }
