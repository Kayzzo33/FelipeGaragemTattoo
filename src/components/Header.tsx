import { useEffect } from 'react';
import { cn } from '../lib/utils';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
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

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
          <div className="hidden md:block font-serif text-xl font-bold tracking-widest cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            FELIPE GARAGEM
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-cream/70">
            <button onClick={() => scrollTo('portfolio')} className="hover:text-cream transition-opacity opacity-100 hover:opacity-70">Portfólio</button>
            <button onClick={() => scrollTo('about')} className="hover:text-cream transition-opacity opacity-100 hover:opacity-70">Sobre</button>
            <button onClick={() => scrollTo('contact')} className="hover:text-cream transition-opacity opacity-100 hover:opacity-70">Contato</button>
          </nav>
        </div>

        {/* Contact Button */}
        <button 
          onClick={() => scrollTo('budget')}
          className="hidden md:inline-block border border-cream/30 text-cream px-6 py-2 rounded-full text-xs font-semibold tracking-wider hover:bg-cream hover:text-black transition-colors duration-300 uppercase"
        >
          Agendar
        </button>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-cream p-2 -mr-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div 
        data-lenis-prevent="true"
        className={cn(
          'fixed inset-0 bg-black/70 backdrop-blur-xl mix-blend-normal z-40 flex flex-col items-center justify-center gap-8 transition-opacity duration-500 md:hidden',
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <button onClick={() => scrollTo('portfolio')} className="font-serif text-3xl hover:text-gold transition-colors text-cream">Portfólio</button>
        <button onClick={() => scrollTo('about')} className="font-serif text-3xl hover:text-gold transition-colors text-cream">Sobre</button>
        <button onClick={() => scrollTo('contact')} className="font-serif text-3xl hover:text-gold transition-colors text-cream">Contato</button>
        <button 
            onClick={() => scrollTo('budget')}
            className="text-gold border border-gold/30 px-8 py-3 rounded-full hover:bg-gold/10 transition-colors uppercase tracking-widest text-sm font-medium mt-4"
          >
            Agendar
          </button>
      </div>
    </header>
  );
}
