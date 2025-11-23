import { Card, CardContent } from '@/components/ui/card';
import { Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Galeria = () => {
  const imagens = [
    {
      url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800',
      alt: 'Corte de cabelo masculino premium',
    },
    {
      url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800',
      alt: 'Barba bem feita',
    },
    {
      url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800',
      alt: 'Corte degradê',
    },
    {
      url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800',
      alt: 'Cliente satisfeito',
    },
    {
      url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800',
      alt: 'Ambiente da barbearia',
    },
    {
      url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800',
      alt: 'Produtos premium',
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold mb-4">
            Nossa <span className="text-gold">Galeria</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Veja alguns dos nossos melhores trabalhos e o ambiente acolhedor da Barbearia Lux
          </p>
          <a
            href="https://instagram.com/barbearialux"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-background">
              <Instagram className="w-5 h-5 mr-2" />
              Siga no Instagram
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imagens.map((imagem, index) => (
            <Card
              key={index}
              className="bg-card border-border overflow-hidden hover:shadow-gold transition-smooth group"
            >
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={imagem.url}
                    alt={imagem.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-slow"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-4">
                    <p className="text-foreground font-semibold">{imagem.alt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Siga-nos no Instagram para ver mais fotos e ficar por dentro das novidades
          </p>
          <a
            href="https://instagram.com/barbearialux"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="bg-gold text-background hover:bg-gold-dark shadow-gold">
              <Instagram className="w-5 h-5 mr-2" />
              Acessar Instagram
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Galeria;
