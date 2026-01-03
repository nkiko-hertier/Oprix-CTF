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
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../../common/decorators/auth.decorator';
import { RequestCertificateDto } from './dto/request-certificate.dto';
import { CertificateQueryDto } from './dto/certificate-query.dto';
import { UpdateCertificateStatusDto } from './dto/update-certificate.dto';
import { CertificateResponseDto, VerifyCertificateResponseDto } from './dto/certificate-response.dto';

@ApiTags('Certificates')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) { }

  /**
   * Request a certificate for a completed competition
   */
  @Post('request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Request a certificate for a completed competition',
    description: 'Users can request certificates after a competition ends. Requires at least one solved challenge.',
  })
  @ApiResponse({ status: 201, description: 'Certificate issued successfully', type: CertificateResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request or competition not completed' })
  @ApiResponse({ status: 404, description: 'Competition not found' })
  @ApiResponse({ status: 409, description: 'Certificate already exists' })
  async requestCertificate(
    @Body() dto: RequestCertificateDto,
    @CurrentUser() user: any,
  ): Promise<CertificateResponseDto> {
    return this.certificatesService.requestCertificate(dto, user.id);
  }

  /**
   * Get my certificates with optional filters
   */
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get my certificates',
    description: 'Retrieve all certificates earned by the authenticated user (individual and team-based)',
  })
  @ApiResponse({ status: 200, description: 'Certificates retrieved successfully' })
  async getMyCertificates(
    @Query() query: CertificateQueryDto,
    @CurrentUser() user: any,
  ): Promise<{ certificates: CertificateResponseDto[]; total: number; page: number; limit: number }> {
    return this.certificatesService.getMyCertificates(user.id, query);
  }

  /**
   * Get certificate by ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get certificate by ID',
    description: 'Retrieve a specific certificate by its ID (requires ownership)',
  })
  @ApiParam({ name: 'id', description: 'Certificate UUID' })
  @ApiResponse({ status: 200, description: 'Certificate retrieved successfully', type: CertificateResponseDto })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Certificate not found' })
  async getCertificateById(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<CertificateResponseDto> {
    return this.certificatesService.getCertificateById(id, user.id);
  }

  /**
   * Verify certificate by verification code
   */
  @Get('verify/:verificationCode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify certificate authenticity (PUBLIC)',
    description: 'Public endpoint to verify a certificate using its verification code. No authentication required.',
  })
  @ApiParam({ name: 'verificationCode', description: 'Certificate verification code (e.g., VRF-ABC123XYZ)' })
  @ApiResponse({ status: 200, description: 'Verification result', type: VerifyCertificateResponseDto })
  async verifyCertificate(
    @Param('verificationCode') verificationCode: string,
  ): Promise<VerifyCertificateResponseDto> {
    return this.certificatesService.verifyCertificate(verificationCode);
  }

  /**
   * List all certificates with filters
   */
  @Get('admin/list')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'List all certificates (Admin only)',
    description: 'Admin endpoint to view all certificates with advanced filtering',
  })
  @ApiResponse({ status: 200, description: 'Certificates retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async listCertificatesAdmin(
    @Query() query: CertificateQueryDto,
    @CurrentUser() user: any,
  ): Promise<{ certificates: CertificateResponseDto[]; total: number; page: number; limit: number }> {
    return this.certificatesService.listCertificatesAdmin(query, user.id);
  }

  /**
   * Manually trigger certificate generation for a competition
   */
  @Post('admin/generate/:competitionId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Manually trigger certificate generation for a competition (Admin only)',
    description: 'Generates certificates for all eligible participants in a completed competition',
  })
  @ApiParam({ name: 'competitionId', description: 'Competition UUID' })
  @ApiResponse({ status: 200, description: 'Certificate generation triggered' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Competition not found' })
  async generateCertificatesForCompetition(
    @Param('competitionId') competitionId: string,
  ): Promise<{ generated: number; skipped: number; message: string }> {
    const result = await this.certificatesService.autoGenerateCertificates(competitionId);
    return {
      ...result,
      message: `Certificate generation complete: ${result.generated} generated, ${result.skipped} skipped`,
    };
  }

  /**
   * Update certificate status
   */
  @Patch('admin/:id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update certificate status (Admin only)',
    description: 'Admin endpoint to approve, reject, or revoke certificates',
  })
  @ApiParam({ name: 'id', description: 'Certificate UUID' })
  @ApiResponse({ status: 200, description: 'Certificate status updated successfully', type: CertificateResponseDto })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Certificate not found' })
  async updateCertificateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCertificateStatusDto,
    @CurrentUser() user: any,
  ): Promise<CertificateResponseDto> {
    return this.certificatesService.updateCertificateStatus(id, dto, user.id);
  }
}
