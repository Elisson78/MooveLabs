import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { api } from '@/lib/api';

interface Template {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  icon: string | null;
}

const categoryLabels: Record<string, string> = {
  marketing: 'Marketing',
  sales: 'Vendas',
  support: 'Suporte',
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data } = await api.get<Template[]>('/templates');
      setTemplates(data);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAutomation = async (templateId: string, templateName: string) => {
    try {
      await api.post('/automations', {
        name: templateName,
        templateId,
      });
      navigate('/automations');
    } catch (error) {
      console.error('Erro ao criar automação:', error);
    }
  };

  const categories = [...new Set(templates.map((t) => t.category))];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          Templates de Automação
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Escolha um template para criar sua automação
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
            size="sm"
          >
            Todos
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {categoryLabels[category] || category}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => createAutomation(template.id, template.name)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{template.icon || '⚡'}</span>
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <span className="text-xs text-blue-600 font-medium">
                    {categoryLabels[template.category] || template.category}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {template.description || 'Sem descrição'}
              </CardDescription>
              <Button className="w-full" variant="outline">
                Usar este template
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum template encontrado</p>
        </div>
      )}
    </div>
  );
}

