import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { Menu, X, Calendar } from 'lucide-react';

interface HeaderProps {
  isTestimonialsOpen?: boolean;
  onOpenTestimonials?: () => void;
  onNavigateSection?: (sectionId?: string) => void;
}

export function Header({ isTestimonialsOpen = false, onOpenTestimonials, onNavigateSection }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const targetId = sectionId === 'contact' ? 'budget' : (sectionId || 'root');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleDepoimentosClick = () => {
    setIsMobileMenuOpen(false);
    if (onOpenTestimonials) {
      onOpenTestimonials();
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled 
            ? 'py-3 sm:py-3.5 bg-black/95 backdrop-blur-md border-b border-gold/15 shadow-[0_4px_25px_rgba(0,0,0,0.8)]' 
            : 'py-4 sm:py-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent'
        )}
      >
        <div className="w-full flex justify-between items-center px-4 sm:px-6 md:px-10">
          {/* Logo */}
          <div 
            className="font-serif text-lg sm:text-xl font-bold tracking-widest cursor-pointer text-[#EFCFA1] hover:text-white transition-colors flex items-center gap-2" 
            onClick={() => handleNavClick()}
          >
            <span>FELIPE GARAGEM</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-9 text-sm font-medium text-cream/75">
            <button onClick={() => handleNavClick('portfolio')} className="hover:text-gold transition-colors cursor-pointer">Portfólio</button>
            <button onClick={() => handleNavClick('about')} className="hover:text-gold transition-colors cursor-pointer">Sobre</button>
            <button 
              onClick={handleDepoimentosClick} 
              className={cn(
                'transition-all duration-300 font-medium text-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.4)] hover:text-white hover:drop-shadow-[0_0_12px_rgba(197,160,89,0.7)] cursor-pointer flex items-center gap-1.5',
                isTestimonialsOpen ? 'text-white font-semibold underline underline-offset-4 decoration-gold' : ''
              )}
            >
              <span>Depoimentos</span>
              <span className="text-[10px] bg-gold/20 text-gold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">Vídeos</span>
            </button>
            <button onClick={() => handleNavClick('faq')} className="hover:text-gold transition-colors cursor-pointer">FAQ</button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Desktop Agendar Button - Original design restored */}
            <button 
              onClick={() => handleNavClick('budget')}
              className="hidden md:inline-block border border-cream/30 text-cream px-6 py-2 rounded-full text-xs font-semibold tracking-wider hover:bg-cream hover:text-black transition-colors duration-300 uppercase cursor-pointer"
            >
              Agendar
            </button>

            {/* Mobile Agendar Button - Hollow design matching desktop with calendar icon */}
            <button 
              onClick={() => handleNavClick('budget')}
              className="md:hidden inline-flex items-center gap-1.5 border border-cream/30 text-cream hover:bg-cream hover:text-black px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-colors duration-300 uppercase cursor-pointer active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendar</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button 
              className="md:hidden text-cream hover:text-gold p-1.5 rounded-lg border border-cream/20 bg-transparent active:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isMobileMenuOpen ? <X size={22} className="text-gold" /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Modal (Fixed Fullscreen Overlay, independent of scroll) */}
      <div 
        data-lenis-prevent="true"
        className={cn(
          'fixed inset-0 bg-[#080808]/98 backdrop-blur-2xl z-[90] flex flex-col justify-between p-6 pt-24 pb-12 transition-all duration-300 md:hidden overflow-y-auto',
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-4'
        )}
      >
        {/* Mobile Header Bar inside Modal */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center border-b border-white/10 pb-3">
          <span className="font-serif text-lg font-bold tracking-widest text-[#EFCFA1]">FELIPE GARAGEM</span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-cream/70 hover:text-gold rounded-full border border-white/10 bg-white/5"
            aria-label="Fechar menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col items-center justify-center gap-7 my-auto">
          <button 
            onClick={() => handleNavClick('portfolio')} 
            className="font-serif text-2xl sm:text-3xl text-cream hover:text-gold transition-colors tracking-wider py-1.5"
          >
            Portfólio
          </button>
          <button 
            onClick={() => handleNavClick('about')} 
            className="font-serif text-2xl sm:text-3xl text-cream hover:text-gold transition-colors tracking-wider py-1.5"
          >
            Sobre
          </button>
          <button 
            onClick={handleDepoimentosClick} 
            className="font-serif text-2xl sm:text-3xl text-gold drop-shadow-[0_0_10px_rgba(197,160,89,0.5)] hover:text-cream transition-colors tracking-wider py-1.5 flex items-center gap-2"
          >
            <span>Depoimentos</span>
          </button>
          <button 
            onClick={() => handleNavClick('faq')} 
            className="font-serif text-2xl sm:text-3xl text-cream hover:text-gold transition-colors tracking-wider py-1.5"
          >
            FAQ
          </button>
        </div>

        {/* Bottom CTA in Mobile Menu */}
        <div className="w-full flex flex-col items-center gap-3 pt-6 border-t border-white/10">
          <button 
            onClick={() => handleNavClick('budget')}
            className="w-full max-w-xs bg-gradient-to-r from-gold to-[#dfbb73] text-black font-semibold py-3.5 rounded-full uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(197,160,89,0.35)] active:scale-95 transition-transform"
          >
            Agendar Horário
          </button>
          <p className="text-[11px] font-mono text-cream/40 uppercase tracking-widest text-center">
            Estúdio Privativo • Atibaia / SP
          </p>
        </div>
      </div>
    </>
  );
}
