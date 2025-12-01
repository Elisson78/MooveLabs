import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Zap, MoreVertical, Play, Pause, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';

interface Automation {
  id: string;
  name: string;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'PAUSED';
  executionCount: number;
  lastExecutedAt: string | null;
  template: { name: string; category: string; icon: string } | null;
}

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  ERROR: 'bg-red-100 text-red-800',
  PAUSED: 'bg-yellow-100 text-yellow-800',
};

const statusLabels = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  ERROR: 'Erro',
  PAUSED: 'Pausado',
};

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = async () => {
    try {
      const { data } = await api.get<Automation[]>('/automations');
      setAutomations(data);
    } catch (error) {
      console.error('Erro ao carregar automações:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      if (currentStatus === 'ACTIVE') {
        await api.post(`/automations/${id}/deactivate`);
      } else {
        await api.post(`/automations/${id}/activate`);
      }
      loadAutomations();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const deleteAutomation = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta automação?')) return;
    
    try {
      await api.delete(`/automations/${id}`);
      loadAutomations();
    } catch (error) {
      console.error('Erro ao excluir:', error);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Automações
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie suas automações ativas
          </p>
        </div>
        <Link to="/templates">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Automação
          </Button>
        </Link>
      </div>

      {/* Empty State */}
      {automations.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Zap className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma automação ainda
            </h3>
            <p className="text-gray-500 text-center mb-4">
              Comece criando sua primeira automação a partir de um template
            </p>
            <Link to="/templates">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar primeira automação
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Automations List */}
      <div className="grid gap-4">
        {automations.map((automation) => (
          <Card key={automation.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-2xl">
                  {automation.template?.icon || '⚡'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {automation.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {automation.template?.name || 'Automação personalizada'}
                    {automation.lastExecutedAt && (
                      <> · Última execução: {formatDateTime(automation.lastExecutedAt)}</>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusColors[automation.status]
                    }`}
                  >
                    {statusLabels[automation.status]}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {automation.executionCount} execuções
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleStatus(automation.id, automation.status)}
                  >
                    {automation.status === 'ACTIVE' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAutomation(automation.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

