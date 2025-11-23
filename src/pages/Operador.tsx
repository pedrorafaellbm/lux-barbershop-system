import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar, Users, DollarSign } from 'lucide-react';

const Operador = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!user || userRole !== 'operador')) {
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
            Painel do <span className="text-gold">Operador</span>
          </h1>
          <p className="text-muted-foreground">
            Gerencie agendamentos e pagamentos
          </p>
        </div>

        <Tabs defaultValue="agendamentos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
            <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
            <TabsTrigger value="promocoes">Promoções</TabsTrigger>
          </TabsList>

          <TabsContent value="agendamentos" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gold" />
                  Agenda do Dia
                </CardTitle>
                <CardDescription>
                  Visualize e gerencie os agendamentos de hoje
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Funcionalidade de visualização de agendamentos em desenvolvimento
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Criar Novo Agendamento</CardTitle>
                <CardDescription>
                  Agende um horário para um cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Formulário de agendamento em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pagamentos" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-gold" />
                  Registrar Pagamento
                </CardTitle>
                <CardDescription>
                  Registre pagamentos dos serviços realizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sistema de registro de pagamentos em desenvolvimento
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Pagamentos de Hoje</CardTitle>
                <CardDescription>
                  Visualize os pagamentos realizados hoje
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Lista de pagamentos em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promocoes" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-gold" />
                  Promoções Ativas
                </CardTitle>
                <CardDescription>
                  Visualize cupons e planos disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Lista de promoções em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Operador;
