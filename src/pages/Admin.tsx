import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign, Calendar, Users, Scissors } from 'lucide-react';

const Admin = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!user || userRole !== 'admin')) {
      navigate('/');
    }
  }, [user, userRole, authLoading, navigate]);

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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="barbeiros">Barbeiros</TabsTrigger>
            <TabsTrigger value="servicos">Serviços</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                  <DollarSign className="h-4 w-4 text-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gold">R$ 0,00</div>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
                  <Calendar className="h-4 w-4 text-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Hoje</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                  <Users className="h-4 w-4 text-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Total</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Serviços</CardTitle>
                  <Scissors className="h-4 w-4 text-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">Ativos</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Funcionalidades</CardTitle>
                <CardDescription>Acesse as diferentes áreas de gestão</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  • Visualize e gerencie todos os agendamentos<br />
                  • Controle financeiro completo com histórico mensal e anual<br />
                  • Gerencie barbeiros e suas disponibilidades<br />
                  • Configure serviços e preços<br />
                  • Defina promoções e cupons de desconto<br />
                  • Gerencie planos de assinatura
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agendamentos" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Gerenciar Agendamentos</CardTitle>
                <CardDescription>
                  Visualize, edite e cancele agendamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Funcionalidade de gestão de agendamentos em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Controle Financeiro</CardTitle>
                <CardDescription>
                  Acompanhe receitas, pagamentos e histórico financeiro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Painel financeiro em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="barbeiros" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Gerenciar Barbeiros</CardTitle>
                <CardDescription>
                  Adicione, edite e gerencie a disponibilidade dos barbeiros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gestão de barbeiros em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servicos" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Gerenciar Serviços</CardTitle>
                <CardDescription>
                  Configure serviços, preços e disponibilidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gestão de serviços em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
