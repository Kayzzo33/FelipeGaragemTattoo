import { useEffect } from 'react';
import { cn } from '../lib/utils';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentPage?: 'home' | 'depoimentos';
  onNavigate?: (route: 'home' | 'depoimentos', sectionId?: string) => void;
}

export function Header({ currentPage = 'home', onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (sectionId?: string) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate('home', sectionId);
    } else if (sectionId) {
      const target = document.getElementById(sectionId) || (sectionId === 'contact' ? document.getElementById('budget') : null);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleDepoimentosClick = () => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate('depoimentos');
    } else {
      window.location.href = '/depoimentos';
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 text-cream',
        isScrolled ? 'py-4 bg-black/80 backdrop-blur-md mix-blend-normal' : 'py-6 bg-transparent',
        isMobileMenuOpen ? 'mix-blend-normal' : (!isScrolled && 'mix-blend-difference')
      )}
    >
      <div className="w-full flex justify-between items-center px-6 md:px-8 relative z-50">
        <div className="flex items-center space-x-12">
          {/* Logo */}
          <div 
            className="hidden md:block font-serif text-xl font-bold tracking-widest cursor-pointer hover:text-gold transition-colors" 
            onClick={() => handleNavClick()}
          >
            FELIPE GARAGEM
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-cream/70">
            <button onClick={() => handleNavClick('portfolio')} className="hover:text-cream transition-opacity opacity-100 hover:opacity-70">Portfólio</button>
            <button onClick={() => handleNavClick('about')} className="hover:text-cream transition-opacity opacity-100 hover:opacity-70">Sobre</button>
            <button onClick={() => handleNavClick('differentials')} className="hover:text-cream transition-opacity opacity-100 hover:opacity-70">Diferenciais</button>
            <button 
              onClick={handleDepoimentosClick} 
              className={cn(
                'transition-all duration-300 font-medium tracking-normal text-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.45)] hover:text-cream hover:drop-shadow-[0_0_12px_rgba(197,160,89,0.7)]',
                currentPage === 'depoimentos' ? 'text-cream drop-shadow-[0_0_12px_rgba(197,160,89,0.8)] font-semibold' : ''
              )}
            >
              Depoimentos
            </button>
            <button onClick={() => handleNavClick('faq')} className="hover:text-cream transition-opacity opacity-100 hover:opacity-70">FAQ</button>
          </nav>
        </div>

        {/* Contact / Agendar Button */}
        <button 
          onClick={() => handleNavClick('budget')}
          className="hidden md:inline-block border border-cream/30 text-cream px-6 py-2 rounded-full text-xs font-semibold tracking-wider hover:bg-cream hover:text-black transition-colors duration-300 uppercase"
        >
          Agendar
        </button>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-cream p-2 -mr-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div 
        data-lenis-prevent="true"
        className={cn(
          'fixed inset-0 bg-black/70 backdrop-blur-xl mix-blend-normal z-40 flex flex-col items-center justify-center gap-6 transition-opacity duration-500 md:hidden',
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <button onClick={() => handleNavClick('portfolio')} className="font-serif text-2xl hover:text-gold transition-colors text-cream">Portfólio</button>
        <button onClick={() => handleNavClick('about')} className="font-serif text-2xl hover:text-gold transition-colors text-cream">Sobre</button>
        <button onClick={() => handleNavClick('differentials')} className="font-serif text-2xl hover:text-gold transition-colors text-cream">Diferenciais</button>
        <button 
          onClick={handleDepoimentosClick} 
          className={cn(
            'font-serif text-2xl transition-all duration-300',
            'text-gold drop-shadow-[0_0_10px_rgba(197,160,89,0.5)] hover:text-cream',
            currentPage === 'depoimentos' ? 'text-cream drop-shadow-[0_0_14px_rgba(197,160,89,0.8)] font-medium' : ''
          )}
        >
          Depoimentos
        </button>
        <button onClick={() => handleNavClick('faq')} className="font-serif text-2xl hover:text-gold transition-colors text-cream">FAQ</button>
        <button 
          onClick={() => handleNavClick('budget')}
          className="text-gold border border-gold/30 px-8 py-3 rounded-full hover:bg-gold/10 transition-colors uppercase tracking-widest text-sm font-medium mt-4"
        >
          Agendar
        </button>
      </div>
    </header>
  );
}
