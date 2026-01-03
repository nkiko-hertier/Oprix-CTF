import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

/**
 * JWT Authentication Guard
 * Protects routes requiring authentication
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Add custom authentication logic here if needed
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // Handle authentication errors
    if (err || !user) {
      throw err || new UnauthorizedException(`Invalid credentials`);
    }

    return user;
  }
}


@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    // If no Authorization header → skip JWT entirely (public request)
    if (!req.headers.authorization) {
      return true;
    }

    // Else, validate token
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // If token invalid or expired → treat as "not logged in"
    if (err || !user) {
      console.log("can't find tocken")
      return null;
    }

    console.log("User AUTH was found...")

    return user;
  }
}
