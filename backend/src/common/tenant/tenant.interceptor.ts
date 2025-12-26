import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tenantStorage, TenantContextData } from './tenant.context';

/**
 * Interceptor que injeta o contexto do tenant em cada request
 * Deve ser aplicado globalmente ou nas rotas que precisam de multi-tenant
 */
@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Se não há usuário autenticado, continua sem tenant
    if (!user?.tenantId) {
      return next.handle();
    }

    // Cria o contexto do tenant
    const tenantContext: TenantContextData = {
      tenantId: user.tenantId,
      tenantSlug: user.tenantSlug,
      userId: user.id || user.sub,
      userRole: user.role,
    };

    // Executa o handler dentro do contexto do tenant
    return new Observable((subscriber) => {
      tenantStorage.run(tenantContext, () => {
        next.handle().subscribe({
          next: (value) => subscriber.next(value),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete(),
        });
      });
    });
  }
}







