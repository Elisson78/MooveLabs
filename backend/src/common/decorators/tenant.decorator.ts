import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { SKIP_TENANT_CHECK } from '../tenant/tenant.guard';

/**
 * Decorator para obter o tenantId do usuário atual
 * Uso: @CurrentTenant() tenantId: string
 */
export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.tenantId) {
      throw new Error('Tenant not found in request. Ensure user is authenticated.');
    }

    return user.tenantId;
  },
);

/**
 * Decorator para obter o contexto completo do tenant
 * Uso: @TenantContext() context: { tenantId, tenantSlug, userId, userRole }
 */
export const TenantContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return {
      tenantId: user?.tenantId,
      tenantSlug: user?.tenantSlug,
      userId: user?.id || user?.sub,
      userRole: user?.role,
    };
  },
);

/**
 * Decorator para pular verificação de tenant em rotas específicas
 * Útil para rotas públicas ou administrativas
 * Uso: @SkipTenantCheck()
 */
export const SkipTenantCheck = () => SetMetadata(SKIP_TENANT_CHECK, true);







