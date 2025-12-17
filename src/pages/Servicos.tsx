import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Servico {
  id: string;
  nome: string;
  preco: number;
  duracao: number;
  ativo: boolean;
}

const Servicos = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    try {
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .eq('ativo', true)
        .order('preco', { ascending: true });

      if (error) throw error;
      setServicos(data || []);
    } catch (error) {
      console.error('Error fetching servicos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold mb-4">
            Nossos <span className="text-gold">Serviços</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Serviços premium com profissionais qualificados para cuidar do seu visual
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando serviços...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {servicos.map((servico) => (
                <Card key={servico.id} className="bg-card border-border hover:shadow-gold transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-xl">{servico.nome}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground">
                          <DollarSign className="w-5 h-5 mr-2 text-gold" />
                          <span>Preço</span>
                        </div>
                        <span className="text-2xl font-bold text-gold">
                          R$ {servico.preco.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-5 h-5 mr-2 text-gold" />
                          <span>Duração</span>
                        </div>
                        <span className="font-semibold">{servico.duracao} min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link to="/agendamento">
                <Button size="lg" className="bg-gold text-background hover:bg-gold-dark shadow-gold">
                  Agendar Horário
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Servicos;
