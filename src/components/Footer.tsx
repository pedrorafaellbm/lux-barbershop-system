import { MapPin, Phone, Instagram, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-2xl font-bold text-gold mb-4">Barbearia Lux</h3>
            <p className="text-muted-foreground mb-4">
              Barba, cabelo e bigode. O seu estilo em primeiro lugar.
            </p>
            <a
              href="https://instagram.com/barbearialux"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-gold hover:text-gold-light transition-smooth"
            >
              <Instagram className="w-5 h-5 mr-2" />
              @barbearialux
            </a>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Horário de Funcionamento</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-start">
                <Clock className="w-5 h-5 mr-2 mt-0.5 text-gold" />
                <div>
                  <p>Segunda a Sábado</p>
                  <p className="font-semibold">10:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contato</h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 text-gold" />
                <p>Rua da Moda, 123 - Centro<br />São Paulo, SP</p>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-gold" />
                <a href="tel:+5511999999999" className="hover:text-gold transition-smooth">
                  (11) 99999-9999
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Barbearia Lux. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
