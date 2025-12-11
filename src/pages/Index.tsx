import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Scissors, Star, Clock, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import logo from '@/assets/logo.png';

const Index = () => {
  const servicos = [
    { nome: 'Corte simples', preco: 'R$ 35', duracao: '30 min' },
    { nome: 'Barba simples', preco: 'R$ 20', duracao: '30 min' },
    { nome: 'Corte degradê', preco: 'R$ 35', duracao: '30 min' },
    { nome: 'Combo Corte + Barba', preco: 'R$ 50', duracao: '30 min' },
  ];

  const depoimentos = [
    {
      nome: 'Carlos Silva',
      texto: 'Excelente atendimento! Os barbeiros são muito profissionais e o ambiente é top.',
      nota: 5,
    },
    {
      nome: 'João Pedro',
      texto: 'Melhor barbearia da região. Sempre saio satisfeito com o resultado.',
      nota: 5,
    },
    {
      nome: 'Ricardo Santos',
      texto: 'Ótima experiência! Recomendo a todos que buscam qualidade e profissionalismo.',
      nota: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient relative py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <img src={logo} alt="Barbearia Lux Logo" className="h-40 md:h-56 w-auto mx-auto mb-6 animate-fade-in" />
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-foreground animate-fade-in">
              Barbearia <span className="text-gold">Lux</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Barba, cabelo e bigode.<br />
              <span className="text-gold">O seu estilo em primeiro lugar.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/agendamento">
                <Button size="lg" className="bg-gold text-background hover:bg-gold-dark shadow-gold">
                  Agendar Horário
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/servicos">
                <Button size="lg" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-background">
                  Ver Serviços
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-background border-border hover:border-gold transition-smooth">
              <CardContent className="pt-6 text-center">
                <Scissors className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Profissionalismo</h3>
                <p className="text-sm text-muted-foreground">Barbeiros experientes e qualificados</p>
              </CardContent>
            </Card>
            <Card className="bg-background border-border hover:border-gold transition-smooth">
              <CardContent className="pt-6 text-center">
                <Clock className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Pontualidade</h3>
                <p className="text-sm text-muted-foreground">Horários respeitados e organizados</p>
              </CardContent>
            </Card>
            <Card className="bg-background border-border hover:border-gold transition-smooth">
              <CardContent className="pt-6 text-center">
                <Star className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Qualidade</h3>
                <p className="text-sm text-muted-foreground">Produtos premium e serviços de excelência</p>
              </CardContent>
            </Card>
            <Card className="bg-background border-border hover:border-gold transition-smooth">
              <CardContent className="pt-6 text-center">
                <Shield className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Confiança</h3>
                <p className="text-sm text-muted-foreground">Ambiente seguro e acolhedor</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Serviços em Destaque */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-center mb-12">
            Nossos <span className="text-gold">Serviços</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {servicos.map((servico, index) => (
              <Card key={index} className="bg-card border-border hover:shadow-gold transition-smooth">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2">{servico.nome}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gold">{servico.preco}</span>
                    <span className="text-sm text-muted-foreground">{servico.duracao}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link to="/servicos">
              <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-background">
                Ver Todos os Serviços
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-center mb-12">
            O que <span className="text-gold">dizem</span> nossos clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {depoimentos.map((depoimento, index) => (
              <Card key={index} className="bg-background border-border">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(depoimento.nota)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{depoimento.texto}"</p>
                  <p className="font-semibold text-gold">— {depoimento.nome}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 dark-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold mb-6">
            Pronto para <span className="text-gold">transformar</span> seu visual?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Agende seu horário agora e experimente o melhor atendimento
          </p>
          <Link to="/agendamento">
            <Button size="lg" className="bg-gold text-background hover:bg-gold-dark shadow-gold">
              Agendar Agora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
