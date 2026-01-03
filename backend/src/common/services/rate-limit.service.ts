import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createClient,
  RedisClientType,
  RedisDefaultModules,
} from 'redis';

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);

  // Proper Redis typing
  private readonly redis: RedisClientType<RedisDefaultModules>;

  private isReady = false;

  constructor(private configService: ConfigService) {
    const redisHost = this.configService.get<string>('redis.host', 'localhost');
    const redisPort = this.configService.get<number>('redis.port', 6379);
    const redisPassword = this.configService.get<string>('redis.password');
    const redisDb = this.configService.get<number>('redis.db', 0);

    this.logger.log(`Connecting to Redis at ${redisHost}:${redisPort}`);

    this.redis = createClient({
      socket: { host: redisHost, port: redisPort },
      password: redisPassword,
      database: redisDb,
    }) as RedisClientType<RedisDefaultModules>;

    // Logging
    this.redis.on('error', (err) => {
      this.logger.error('Redis connection error', err);
    });

    this.redis.on('ready', () => {
      this.isReady = true;
      this.logger.log('Redis is ready.');
    });

    this.redis.on('connect', () => {
      this.logger.log('Redis connected successfully');
    });

    // Connect
    this.redis.connect().catch((err) => {
      this.logger.error('Redis failed to connect:', err);
    });
  }

  // Ensure Redis is connected
  private ensureReady() {
    if (!this.isReady) {
      throw new BadRequestException('Redis client is not ready');
    }
  }

  /**
   * Check submission rate limit (5 submissions per minute)
   */
  async checkSubmissionRateLimit(userId: string): Promise<void> {
    this.ensureReady();

    const key = `rate_limit:submissions:${userId}`;
    const window = 60;
    const limit = 5;

    const current = (await this.redis.incr(key)) as number;

    if (current === 1) {
      await this.redis.expire(key, window);
    }

    if (current > limit) {
      const ttl = (await this.redis.ttl(key)) as number;
      this.logger.warn(
        `Rate limit exceeded for user ${userId}. Current: ${current}, TTL: ${ttl}s`,
      );

      throw new BadRequestException(
        `Rate limit exceeded. You can make ${limit} submissions per minute. Please wait ${ttl} seconds.`,
      );
    }

    this.logger.debug(`Rate limit OK for user ${userId}: ${current}/${limit}`);
  }

  /**
   * Check submission timeout after 3 fails
   */
  async checkSubmissionTimeout(
    userId: string,
    challengeId: string,
  ): Promise<void> {
    this.ensureReady();

    const key = `submission_timeout:${userId}:${challengeId}`;
    const timeoutEnd = await this.redis.get(key);

    if (timeoutEnd) {
      const remainingSeconds =
        parseInt(timeoutEnd) - Math.floor(Date.now() / 1000);

      if (remainingSeconds > 0) {
        const remainingMinutes = Math.ceil(remainingSeconds / 60);

        throw new BadRequestException(
          `Submission timeout active. Please wait ${remainingMinutes} minutes after 3 consecutive wrong submissions.`,
        );
      }

      await this.redis.del(key);
    }
  }

  /**
   * Track wrong attempts
   */
  async trackSubmissionAttempt(
    userId: string,
    challengeId: string,
    isCorrect: boolean,
  ): Promise<void> {
    this.ensureReady();

    const failsKey = `consecutive_fails:${userId}:${challengeId}`;
    const timeoutKey = `submission_timeout:${userId}:${challengeId}`;

    if (isCorrect) {
      await this.redis.del(failsKey);
      await this.redis.del(timeoutKey);
      return;
    }

    const consecutive = (await this.redis.incr(failsKey)) as number;

    await this.redis.expire(failsKey, 3600);

    if (consecutive >= 3) {
      const timeoutEnd = Math.floor(Date.now() / 1000) + 300;
      await this.redis.setEx(timeoutKey, 300, timeoutEnd.toString());
    }
  }

  /**
   * Generic rate limiting
   */
  async checkGenericRateLimit(
    key: string,
    limit: number,
    windowSeconds: number,
  ): Promise<void> {
    this.ensureReady();

    const current = (await this.redis.incr(key)) as number;

    if (current === 1) {
      await this.redis.expire(key, windowSeconds);
    }

    if (current > limit) {
      const ttl = (await this.redis.ttl(key)) as number;

      throw new BadRequestException(
        `Rate limit exceeded. Maximum ${limit} requests per ${windowSeconds} seconds. Please wait ${ttl} seconds.`,
      );
    }
  }

  /**
   * Check if solved
   */
  async isChallengeSolved(
    userId: string,
    challengeId: string,
  ): Promise<boolean> {
    this.ensureReady();
    const key = `solved:${userId}:${challengeId}`;
    return (await this.redis.get(key)) === '1';
  }

  async markChallengeSolved(
    userId: string,
    challengeId: string,
  ): Promise<void> {
    this.ensureReady();
    await this.redis.set(`solved:${userId}:${challengeId}`, '1');
  }

  /**
   * Cleanup maintenance
   */
  async cleanupExpiredKeys(): Promise<void> {
    this.ensureReady();

    try {
      const keys = await this.redis.keys('rate_limit:*');

      const expired: string[] = [];

      for (const key of keys) {
        const ttl = (await this.redis.ttl(key)) as number;
        if (ttl === -1) expired.push(key);
      }

      if (expired.length > 0) {
        await this.redis.del(expired);
      }
    } catch (e) {
      this.logger.error('Cleanup failed', e);
    }
  }

  async getRemainingTime(key: string): Promise<number> {
    this.ensureReady();
    const ttl = (await this.redis.ttl(key)) as number;
    return Math.max(0, ttl);
  }

  async onModuleDestroy() {
    if (this.redis.isOpen) {
      await this.redis.quit();
    }
  }
}
