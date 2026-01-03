import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient, verifyToken, type ClerkClient } from '@clerk/backend';

/**
 * Clerk JWT Verification Service
 * 
 * Verifies Clerk JWTs using the official @clerk/backend SDK.
 * This is used by WebSocket gateway and other places that need
 * to verify Clerk tokens outside of Passport.js guards.
 * 
 * Uses Clerk's built-in JWKS verification.
 */
@Injectable()
export class ClerkJwtService {
  private readonly logger = new Logger(ClerkJwtService.name);
  private readonly clerk: ClerkClient;
  private readonly secretKey: string;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('CLERK_SECRET_KEY');
    if (!secretKey) {
      throw new Error('CLERK_SECRET_KEY is required for JWT verification');
    }
    this.secretKey = secretKey;
    this.clerk = createClerkClient({ secretKey });
    
    this.logger.log('Clerk JWT Service initialized');
  }

  /**
   * Verify a Clerk JWT token
   * @param token - JWT token string
   * @returns Decoded payload with user info, or null if invalid
   */
  async verifyToken(token: string): Promise<{ sub: string; [key: string]: any } | null> {
    try {
      const payload = await verifyToken(token, {
        secretKey: this.secretKey,
      });

      if (!payload?.sub) {
        this.logger.warn('JWT payload missing sub claim');
        return null;
      }

      return payload as { sub: string; [key: string]: any };
    } catch (error: any) {
      if (error?.reason === 'token-expired') {
        this.logger.debug('JWT token expired');
      } else if (error?.reason === 'token-invalid') {
        this.logger.warn('JWT token invalid');
      } else {
        this.logger.error('JWT verification error', error);
      }
      return null;
    }
  }

  /**
   * Extract user ID (Clerk ID) from token
   * @param token - JWT token string
   * @returns Clerk user ID or null if invalid
   */
  async extractUserId(token: string): Promise<string | null> {
    const payload = await this.verifyToken(token);
    return payload?.sub || null;
  }
}
