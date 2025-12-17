import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign, Calendar, Users, Scissors, Image } from 'lucide-react';
import AdminAgendamentos from '@/components/admin/AdminAgendamentos';
import AdminFinanceiro from '@/components/admin/AdminFinanceiro';
import AdminBarbeiros from '@/components/admin/AdminBarbeiros';
import AdminServicos from '@/components/admin/AdminServicos';
import AdminGaleria from '@/components/admin/AdminGaleria';

const Admin = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    receita: 0,
    agendamentosHoje: 0,
    totalClientes: 0,
    servicosAtivos: 0,
  });

  useEffect(() => {
    if (!authLoading && (!user || userRole !== 'admin')) {
      navigate('/');
    }
  }, [user, userRole, authLoading, navigate]);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchStats();
    }
  }, [userRole]);

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const [agendamentosRes, servicosRes, profilesRes, pagamentosRes] = await Promise.all([
        supabase.from('agendamentos').select('id').eq('data', today),
        supabase.from('servicos').select('id').eq('ativo', true),
        supabase.from('profiles').select('id'),
        supabase.from('pagamentos').select('valor'),
      ]);

      const receitaTotal = (pagamentosRes.data || []).reduce((acc, p) => acc + Number(p.valor), 0);

      setStats({
        receita: receitaTotal,
        agendamentosHoje: agendamentosRes.data?.length || 0,
        totalClientes: profilesRes.data?.length || 0,
        servicosAtivos: servicosRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2">
            Painel <span className="text-gold">Administrativo</span>
          </h1>
          <p className="text-muted-foreground">
            Gerencie todos os aspectos da Barbearia Lux
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="barbeiros">Barbeiros</TabsTrigger>
            <TabsTrigger value="servicos">Serviços</TabsTrigger>
            <TabsTrigger value="galeria">Galeria</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gold">R$ {stats.receita.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Total acumulado</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
                  <Calendar className="h-4 w-4 text-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.agendamentosHoje}</div>
                  <p className="text-xs text-muted-foreground">Hoje</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                  <Users className="h-4 w-4 text-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalClientes}</div>
                  <p className="text-xs text-muted-foreground">Total</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Serviços</CardTitle>
                  <Scissors className="h-4 w-4 text-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.servicosAtivos}</div>
                  <p className="text-xs text-muted-foreground">Ativos</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Funcionalidades do Admin</CardTitle>
                <CardDescription>Acesse as diferentes áreas de gestão</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  • <strong>Agendamentos:</strong> Visualize e cancele agendamentos de todos os clientes<br />
                  • <strong>Financeiro:</strong> Controle financeiro completo com histórico mensal e anual<br />
                  • <strong>Barbeiros:</strong> Adicione, edite e remova barbeiros<br />
                  • <strong>Serviços:</strong> Configure serviços, preços e disponibilidade<br />
                  • <strong>Galeria:</strong> Gerencie as fotos exibidas na galeria
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agendamentos" className="space-y-4">
            <AdminAgendamentos />
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-4">
            <AdminFinanceiro />
          </TabsContent>

          <TabsContent value="barbeiros" className="space-y-4">
            <AdminBarbeiros />
          </TabsContent>

          <TabsContent value="servicos" className="space-y-4">
            <AdminServicos />
          </TabsContent>

          <TabsContent value="galeria" className="space-y-4">
            <AdminGaleria />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
