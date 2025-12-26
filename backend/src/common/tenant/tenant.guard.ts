import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const SKIP_TENANT_CHECK = 'skipTenantCheck';

/**
 * Guard que valida se o usuário tem acesso ao tenant
 * Usa após o JwtAuthGuard
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Verifica se a rota deve pular a verificação de tenant
    const skipTenantCheck = this.reflector.getAllAndOverride<boolean>(
      SKIP_TENANT_CHECK,
      [context.getHandler(), context.getClass()],
    );

    if (skipTenantCheck) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Se não há usuário, deixa o JwtAuthGuard lidar
    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    // Verifica se o usuário tem tenantId
    if (!user.tenantId) {
      throw new ForbiddenException(
        'Usuário não está associado a nenhuma empresa',
      );
    }

    // Verifica tenant no path params (se houver)
    const tenantIdFromParams = request.params?.tenantId;
    if (tenantIdFromParams && tenantIdFromParams !== user.tenantId) {
      throw new ForbiddenException(
        'Você não tem acesso a esta empresa',
      );
    }

    // Verifica tenant no query params (se houver)
    const tenantIdFromQuery = request.query?.tenantId;
    if (tenantIdFromQuery && tenantIdFromQuery !== user.tenantId) {
      throw new ForbiddenException(
        'Você não tem acesso a esta empresa',
      );
    }

    return true;
  }
}







