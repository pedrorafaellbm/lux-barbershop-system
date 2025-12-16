import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contato = () => {
  const whatsappNumber = '5511999999999';
  const whatsappMessage = 'Olá! Gostaria de mais informações sobre os serviços da Barbearia Lux.';

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold mb-4">
            <span className="text-gold">Contato</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Entre em contato conosco para tirar dúvidas ou agendar seu horário
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Informações de Contato */}
          <div className="space-y-6">
            <Card className="bg-card border-border hover:shadow-gold transition-smooth">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Endereço</h3>
                    <p className="text-muted-foreground">
                      Rua da Moda, 123 - Centro<br />
                      São Paulo, SP<br />
                      CEP: 01000-000
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-gold transition-smooth">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Telefone</h3>
                    <p className="text-muted-foreground">
                      <a href="tel:+5511999999999" className="hover:text-gold transition-smooth">
                        (11) 99999-9999
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-gold transition-smooth">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Horário de Funcionamento</h3>
                    <p className="text-muted-foreground">
                      Segunda a Sábado<br />
                      <span className="font-semibold text-foreground">10:00 - 18:00</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-gold hover:shadow-gold transition-smooth">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <MessageCircle className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-3">Ajuda ao Cliente</h3>
                    <p className="text-muted-foreground mb-4">
                      Precisa de ajuda? Fale diretamente com nosso atendimento pelo WhatsApp
                    </p>
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-gold text-background hover:bg-gold-dark w-full">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Abrir WhatsApp
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mapa */}
          <div>
            <Card className="bg-card border-border h-full overflow-hidden">
              <CardContent className="p-0 h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0977908791394!2d-46.63349368502205!3d-23.56458098468238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59b3f7b6c7b7%3A0x7e1b3b1b7b1b7b1b!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '500px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização Barbearia Lux"
                ></iframe>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contato;
