import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Percent, Gift } from 'lucide-react';

interface Cupom {
  id: string;
  codigo: string;
  desconto: number;
  valido_ate: string;
  ativo: boolean;
}

interface Plano {
  id: string;
  nome: string;
  desconto: number;
  duracao_meses: number;
  preco: number;
  ativo: boolean;
}

const Promocoes = () => {
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromocoes();
  }, []);

  const fetchPromocoes = async () => {
    try {
      const [cuponResult, planoResult] = await Promise.all([
        supabase.from('cupons').select('*').eq('ativo', true).gte('valido_ate', new Date().toISOString().split('T')[0]),
        supabase.from('planos').select('*').eq('ativo', true),
      ]);

      if (cuponResult.error) throw cuponResult.error;
      if (planoResult.error) throw planoResult.error;

      setCupons(cuponResult.data || []);
      setPlanos(planoResult.data || []);
    } catch (error) {
      console.error('Error fetching promocoes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold mb-4">
            <span className="text-gold">Promoções</span> e Descontos
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Aproveite nossas ofertas especiais e economize em nossos serviços premium
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando promoções...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Cupons */}
            <section>
              <div className="flex items-center mb-6">
                <Gift className="w-8 h-8 text-gold mr-3" />
                <h2 className="font-serif text-3xl font-bold">Cupons de Desconto</h2>
              </div>
              {cupons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cupons.map((cupom) => (
                    <Card key={cupom.id} className="bg-card border-gold hover:shadow-gold transition-smooth">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-2xl font-mono">{cupom.codigo}</CardTitle>
                          <Badge variant="secondary" className="bg-gold text-background">
                            {cupom.desconto}% OFF
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          Válido até {formatDate(cupom.valido_ate)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Use este código na hora do agendamento para receber o desconto
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">Nenhum cupom disponível no momento</p>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Planos */}
            <section>
              <div className="flex items-center mb-6">
                <Percent className="w-8 h-8 text-gold mr-3" />
                <h2 className="font-serif text-3xl font-bold">Planos de Assinatura</h2>
              </div>
              {planos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {planos.map((plano) => (
                    <Card key={plano.id} className="bg-card border-border hover:shadow-gold transition-smooth">
                      <CardHeader>
                        <CardTitle className="text-2xl">{plano.nome}</CardTitle>
                        <CardDescription>Válido por {plano.duracao_meses} meses</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center py-4">
                          <div className="text-4xl font-bold text-gold mb-2">
                            R$ {plano.preco.toFixed(2)}
                          </div>
                          <Badge variant="secondary" className="bg-gold-dark text-background">
                            {plano.desconto}% de desconto
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                          Economize em todos os serviços durante o período do plano
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">Nenhum plano disponível no momento</p>
                  </CardContent>
                </Card>
              )}
            </section>

            <div className="text-center mt-12">
              <Link to="/agendamento">
                <Button size="lg" className="bg-gold text-background hover:bg-gold-dark shadow-gold">
                  Agendar e Usar Promoção
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Promocoes;
