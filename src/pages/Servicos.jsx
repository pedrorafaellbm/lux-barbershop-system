import { useEffect, useState } from 'react';
import { servicosApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Servicos = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    try {
      const data = await servicosApi.getAll();
      const ativos = (data || []).filter(s => s.ativo).sort((a, b) => a.preco - b.preco);
      setServicos(ativos);
    } catch (error) {
      console.error('Error fetching servicos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando serviços...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold mb-4">
            Nossos <span className="text-gold">Serviços</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conheça todos os serviços oferecidos pela Barbearia Lux
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicos.map((servico) => (
            <Card key={servico.id} className="bg-card border-border hover:shadow-gold transition-smooth">
              <CardHeader>
                <CardTitle className="text-xl">{servico.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gold">
                    <DollarSign className="w-5 h-5 mr-1" />
                    <span className="text-2xl font-bold">R$ {servico.preco.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{servico.duracao} min</span>
                  </div>
                </div>
                <Link to="/agendamento">
                  <Button className="w-full bg-gold text-background hover:bg-gold-dark">
                    Agendar Horário
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {servicos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum serviço disponível no momento</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Servicos;
