import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

/**
 * Content Manager Guard
 */
@Injectable()
export class ContentManagerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const allowedRoles = ['ADMIN', 'SUPERADMIN', 'CREATOR'];
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Content management access required');
    }

    return true;
  }
}
