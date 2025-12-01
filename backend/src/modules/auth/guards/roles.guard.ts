import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Se não tem roles definidas, permite acesso
    }

    const { user } = context.switchToHttp().getRequest();
    
    // OWNER tem acesso a tudo
    if (user.role === 'OWNER') {
      return true;
    }

    return requiredRoles.includes(user.role);
  }
}

