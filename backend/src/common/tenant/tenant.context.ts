import { AsyncLocalStorage } from 'async_hooks';

// Interface do contexto do tenant
export interface TenantContextData {
  tenantId: string;
  tenantSlug?: string;
  userId?: string;
  userRole?: string;
}

// AsyncLocalStorage para manter o contexto do tenant por request
export const tenantStorage = new AsyncLocalStorage<TenantContextData>();

/**
 * Obtém o tenantId do contexto atual
 */
export function getCurrentTenantId(): string {
  const context = tenantStorage.getStore();
  if (!context?.tenantId) {
    throw new Error('Tenant context not found. Ensure TenantInterceptor is applied.');
  }
  return context.tenantId;
}

/**
 * Obtém o contexto completo do tenant
 */
export function getTenantContext(): TenantContextData | undefined {
  return tenantStorage.getStore();
}

/**
 * Verifica se há um tenant no contexto
 */
export function hasTenantContext(): boolean {
  const context = tenantStorage.getStore();
  return !!context?.tenantId;
}

/**
 * Executa uma função com um tenant específico
 */
export function runWithTenant<T>(tenantId: string, fn: () => T): T {
  return tenantStorage.run({ tenantId }, fn);
}

/**
 * Executa uma função async com um tenant específico
 */
export async function runWithTenantAsync<T>(
  tenantId: string,
  fn: () => Promise<T>,
): Promise<T> {
  return tenantStorage.run({ tenantId }, fn);
}







