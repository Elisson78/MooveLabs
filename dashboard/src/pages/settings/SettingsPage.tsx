import { useEffect, useState } from 'react';
import { Building, User, CreditCard, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';

interface TenantData {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  subscription: {
    plan: {
      name: string;
      priceMonthly: number;
      maxWorkflows: number;
      maxExecutionsPerMonth: number;
      maxUsers: number;
    };
    status: string;
    currentPeriodEnd: string;
  } | null;
}

export default function SettingsPage() {
  const { user, tenant } = useAuthStore();
  const [tenantData, setTenantData] = useState<TenantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTenantData();
  }, []);

  const loadTenantData = async () => {
    try {
      const { data } = await api.get<TenantData>('/tenants/me');
      setTenantData(data);
      setCompanyName(data.name);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCompanySettings = async () => {
    setSaving(true);
    try {
      await api.patch('/tenants/me', { name: companyName });
      loadTenantData();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configurações
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gerencie as configurações da sua conta e empresa
        </p>
      </div>

      {/* Company Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle>Empresa</CardTitle>
              <CardDescription>Informações da sua empresa</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da empresa</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={tenantData?.slug || ''} disabled />
            <p className="text-xs text-gray-500">
              Identificador único da sua empresa (não pode ser alterado)
            </p>
          </div>
          <Button onClick={saveCompanySettings} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </CardContent>
      </Card>

      {/* User Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-purple-600" />
            <div>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>Seus dados pessoais</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={user?.name || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Cargo</Label>
            <Input
              value={
                user?.role === 'OWNER'
                  ? 'Proprietário'
                  : user?.role === 'ADMIN'
                  ? 'Administrador'
                  : 'Membro'
              }
              disabled
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-green-600" />
            <div>
              <CardTitle>Plano e Assinatura</CardTitle>
              <CardDescription>Detalhes do seu plano atual</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tenantData?.subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <h3 className="font-semibold text-lg">
                    Plano {tenantData.subscription.plan.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(Number(tenantData.subscription.plan.priceMonthly))}/mês
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    tenantData.subscription.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : tenantData.subscription.status === 'TRIALING'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {tenantData.subscription.status === 'TRIALING' ? 'Trial' : 'Ativo'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold">
                    {tenantData.subscription.plan.maxWorkflows}
                  </p>
                  <p className="text-xs text-gray-500">Workflows</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold">
                    {tenantData.subscription.plan.maxExecutionsPerMonth.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Execuções/mês</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold">
                    {tenantData.subscription.plan.maxUsers}
                  </p>
                  <p className="text-xs text-gray-500">Usuários</p>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Próxima renovação: {formatDate(tenantData.subscription.currentPeriodEnd)}
              </p>

              <Button variant="outline" className="w-full">
                Fazer upgrade do plano
              </Button>
            </div>
          ) : (
            <p className="text-gray-500">Nenhuma assinatura ativa</p>
          )}
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Key className="h-5 w-5 text-orange-600" />
            <div>
              <CardTitle>Chaves de API</CardTitle>
              <CardDescription>Gerencie suas chaves de acesso à API</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Use chaves de API para integrar suas automações com outros sistemas.
          </p>
          <Button variant="outline">Gerar nova chave</Button>
        </CardContent>
      </Card>
    </div>
  );
}

