import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { InstancesService } from './instances.service';
import { ClerkJwtService } from '../auth/services/clerk-jwt.service';
import { PrismaService } from '../../common/database/prisma.service';

interface ConnectedUserInfo {
  userId: string;
  username: string;
  role: string;
}

/**
 * WebSocket Gateway for real-time dynamic challenge instance updates
 * Handles instance creation, expiration, and filtering events
 */
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/instances',
})
export class InstancesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(InstancesGateway.name);
  private readonly connectedUsers = new Map<string, ConnectedUserInfo>();
  private expirationCheckInterval: NodeJS.Timeout;

  constructor(
    private instancesService: InstancesService,
    private clerkJwtService: ClerkJwtService,
    private prisma: PrismaService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Instances WebSocket Gateway initialized');

    // Start periodic check for expired instances (every 30 seconds)
    this.expirationCheckInterval = setInterval(async () => {
      await this.checkExpiredInstances();
    }, 30000);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn('Connection attempt without token');
        client.disconnect();
        return;
      }

      // Verify JWT using Clerk's JWKS
      const payload = await this.clerkJwtService.verifyToken(token);
      if (!payload) {
        this.logger.warn('Invalid token - disconnecting client');
        client.disconnect();
        return;
      }

      // Find user by Clerk ID
      const user = await this.prisma.user.findUnique({
        where: { clerkId: payload.sub },
        select: { id: true, username: true, role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        this.logger.warn('User not found or inactive - disconnecting');
        client.disconnect();
        return;
      }

      this.connectedUsers.set(client.id, {
        userId: user.id,
        username: user.username,
        role: user.role,
      });

      // Join user-specific room
      client.join(`user:${user.id}`);

      this.logger.log(
        `User ${user.username} connected to instances gateway (${client.id})`,
      );

      // Send initial connection confirmation
      client.emit('connected', {
        message: 'Connected to dynamic challenge instances',
        userId: user.id,
        username: user.username,
      });
    } catch (error) {
      this.logger.error('Connection authentication failed', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userInfo = this.connectedUsers.get(client.id);
    if (userInfo) {
      this.logger.log(
        `User ${userInfo.username} disconnected from instances gateway (${client.id})`,
      );
      this.connectedUsers.delete(client.id);
    }
  }

  /**
   * Client sends filter request and receives filtered instances
   */
  @SubscribeMessage('filter')
  async handleFilter(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      userId?: string;
      challengeId?: string;
      isExpired?: boolean;
      page?: number;
      limit?: number;
    },
  ) {
    try {
      const userInfo = this.connectedUsers.get(client.id);
      if (!userInfo) {
        client.emit('error', { message: 'User not authenticated' });
        return;
      }

      // Prevent users from viewing other users' instances (unless admin)
      if (
        data.userId &&
        data.userId !== userInfo.userId &&
        userInfo.role !== 'ADMIN' &&
        userInfo.role !== 'SUPERADMIN'
      ) {
        client.emit('error', {
          message: 'You can only view your own instances',
        });
        return;
      }

      const result = await this.instancesService.findAll(
        {
          userId: data.userId,
          challengeId: data.challengeId,
          isExpired: data.isExpired,
          page: data.page || 1,
          limit: data.limit || 10,
        },
        userInfo.userId,
        userInfo.role,
      );

      client.emit('instances', result);
    } catch (error) {
      this.logger.error('Error handling filter', error);
      client.emit('error', { message: 'Failed to fetch instances' });
    }
  }

  /**
   * Broadcast when a new instance is created
   */
  broadcastInstanceCreated(instanceId: string, userId: string, challengeId: string) {
    this.server.to(`user:${userId}`).emit('instanceCreated', {
      instanceId,
      userId,
      challengeId,
      createdAt: new Date(),
    });
  }

  /**
   * Broadcast when an instance expires
   */
  broadcastInstanceExpired(instanceId: string, userId: string, challengeId: string) {
    this.server.to(`user:${userId}`).emit('instanceExpired', {
      instanceId,
      userId,
      challengeId,
      expiredAt: new Date(),
    });
  }

  /**
   * Check for expired instances and notify users
   */
  private async checkExpiredInstances() {
    try {
      // Get all instances
      const instances = await this.prisma.instance.findMany();

      for (const instance of instances) {
        const expirationTime = new Date(
          instance.createdAt.getTime() + instance.duration * 1000,
        );
        if (new Date() > expirationTime) {
          this.broadcastInstanceExpired(
            instance.id,
            instance.userId,
            instance.challengeId,
          );
        }
      }
    } catch (error) {
      this.logger.error('Error checking expired instances', error);
    }
  }

  /**
   * Clean up on gateway destruction
   */
  onApplicationShutdown() {
    if (this.expirationCheckInterval) {
      clearInterval(this.expirationCheckInterval);
    }
  }
}
