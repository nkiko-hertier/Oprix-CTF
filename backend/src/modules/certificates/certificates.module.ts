import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { AuthModule } from '../auth/auth.module';

/**
 * Certificates Module
 */
@Module({
  imports: [AuthModule],
  controllers: [CertificatesController],
  providers: [CertificatesService],
  exports: [CertificatesService],
})
export class CertificatesModule { }
