import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, LogOut, Calendar, User, Shield, Users } from 'lucide-react';
import { useState } from 'react';
import logo from '@/assets/logo.png';

const Navbar = () => {
  const { user, signOut, userRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="Barbearia Lux" className="h-12 w-auto" />
            <span className="text-2xl font-serif font-bold text-gold">Lux</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-gold transition-smooth">
              Início
            </Link>
            <Link to="/servicos" className="text-foreground hover:text-gold transition-smooth">
              Serviços
            </Link>
            <Link to="/promocoes" className="text-foreground hover:text-gold transition-smooth">
              Promoções
            </Link>
            <Link to="/galeria" className="text-foreground hover:text-gold transition-smooth">
              Galeria
            </Link>
            <Link to="/contato" className="text-foreground hover:text-gold transition-smooth">
              Contato
            </Link>

            {user ? (
              <>
                <Link to="/agendamento">
                  <Button variant="outline" size="sm" className="border-gold text-gold hover:bg-gold hover:text-background">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar
                  </Button>
                </Link>
                
                {userRole === 'admin' && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="border-gold text-gold hover:bg-gold hover:text-background">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                
                {userRole === 'operador' && (
                  <Link to="/operador">
                    <Button variant="outline" size="sm" className="border-gold text-gold hover:bg-gold hover:text-background">
                      <Users className="w-4 h-4 mr-2" />
                      Operador
                    </Button>
                  </Link>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-muted-foreground hover:text-gold"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm" className="bg-gold text-background hover:bg-gold-dark">
                  <User className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border">
            <Link
              to="/"
              className="block text-foreground hover:text-gold transition-smooth"
              onClick={() => setMobileMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/servicos"
              className="block text-foreground hover:text-gold transition-smooth"
              onClick={() => setMobileMenuOpen(false)}
            >
              Serviços
            </Link>
            <Link
              to="/promocoes"
              className="block text-foreground hover:text-gold transition-smooth"
              onClick={() => setMobileMenuOpen(false)}
            >
              Promoções
            </Link>
            <Link
              to="/galeria"
              className="block text-foreground hover:text-gold transition-smooth"
              onClick={() => setMobileMenuOpen(false)}
            >
              Galeria
            </Link>
            <Link
              to="/contato"
              className="block text-foreground hover:text-gold transition-smooth"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contato
            </Link>

            {user ? (
              <>
                <Link to="/agendamento" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full border-gold text-gold">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar
                  </Button>
                </Link>
                
                {userRole === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full border-gold text-gold">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                
                {userRole === 'operador' && (
                  <Link to="/operador" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full border-gold text-gold">
                      <Users className="w-4 h-4 mr-2" />
                      Operador
                    </Button>
                  </Link>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-muted-foreground hover:text-gold"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" size="sm" className="w-full bg-gold text-background">
                  <User className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
