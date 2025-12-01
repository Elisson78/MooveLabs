import { useEffect, useState } from 'react';
import { Zap, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';

interface Stats {
  users: number;
  automations: { total: number; active: number };
  executions: { thisMonth: number; limit: number; percentUsed: number };
  plan: string;
  subscription: { status: string; currentPeriodEnd: string } | null;
}

export default function DashboardPage() {
  const { tenant } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await api.get<Stats>('/tenants/me/stats');
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar stats:', error);
    } finally {
      setLoading(false);
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Olá, bem-vindo ao {tenant?.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Aqui está um resumo das suas automações
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Automações Ativas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Automações Ativas
            </CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.automations.active || 0}</div>
            <p className="text-xs text-gray-500">
              de {stats?.automations.total || 0} total
            </p>
          </CardContent>
        </Card>

        {/* Execuções do Mês */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Execuções do Mês
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.executions.thisMonth || 0}</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min(stats?.executions.percentUsed || 0, 100)}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {stats?.executions.percentUsed || 0}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Limite: {stats?.executions.limit?.toLocaleString() || 0}
            </p>
          </CardContent>
        </Card>

        {/* Plano Atual */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Plano Atual
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.plan || 'Free'}</div>
            <p className="text-xs text-gray-500">
              {stats?.subscription?.status === 'TRIALING' && '🎁 Trial ativo'}
              {stats?.subscription?.status === 'ACTIVE' && '✅ Assinatura ativa'}
            </p>
          </CardContent>
        </Card>

        {/* Usuários */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Usuários
            </CardTitle>
            <svg
              className="h-4 w-4 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users || 1}</div>
            <p className="text-xs text-gray-500">membro(s) na equipe</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert if near limit */}
      {(stats?.executions.percentUsed || 0) > 80 && (
        <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="flex items-center gap-4 py-4">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Você está perto do limite de execuções
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Considere fazer upgrade do seu plano para evitar interrupções.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Criar nova automação</h3>
              <p className="text-sm text-gray-500">
                Configure uma nova automação a partir de um template
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Ver execuções recentes</h3>
              <p className="text-sm text-gray-500">
                Acompanhe o histórico de execuções das suas automações
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

