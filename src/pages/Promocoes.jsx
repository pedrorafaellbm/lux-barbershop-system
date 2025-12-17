import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Percent, Gift, Loader2 } from 'lucide-react';
import { cuponsApi, planosApi } from '@/lib/api';

const Promocoes = () => {
  const [cupons, setCupons] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cuponsData, planosData] = await Promise.all([
          cuponsApi.getAll(),
          planosApi.getAll()
        ]);
        setCupons(cuponsData || []);
        setPlanos(planosData || []);
      } catch (error) {
        console.error('Erro ao buscar promoções:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatDate = (date) => {
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
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
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
                            R$ {Number(plano.preco).toFixed(2)}
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
