import { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ValueProposition } from './components/ValueProposition';
import { About } from './components/About';
import { PortfolioCarousel } from './components/PortfolioCarousel';
import { PinnedScroll } from './components/PinnedScroll';
import { Differentials } from './components/Differentials';
import { FAQ } from './components/FAQ';
import { BudgetForm } from './components/BudgetForm';
import { Footer } from './components/Footer';
import { CookieConsent } from './components/CookieConsent';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TestimonialsFullscreen } from './components/TestimonialsFullscreen';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function App() {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTestimonialsOpen, setIsTestimonialsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('depoimento')) return true;
    }
    return false;
  });

  const lenisRef = useRef<Lenis | null>(null);

  // Sync route on browser back/forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('depoimento')) {
        setIsTestimonialsOpen(true);
      } else {
        setIsTestimonialsOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initialize smooth scroll engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on('scroll', handleScroll);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.off('scroll', handleScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const handleOpenTestimonials = () => {
    window.history.pushState({}, '', '/depoimentos');
    setIsTestimonialsOpen(true);
  };

  const handleCloseTestimonials = () => {
    window.history.pushState({}, '', '/');
    setIsTestimonialsOpen(false);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 80);
  };

  const handleOpenBudgetFromTestimonials = () => {
    handleCloseTestimonials();
    setTimeout(() => {
      handleNavigateSection('budget');
    }, 150);
  };

  const handleNavigateSection = (sectionId?: string) => {
    const targetId = sectionId === 'contact' ? 'budget' : sectionId;
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(el, { duration: 1.2 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="bg-black min-h-screen text-cream font-sans">
      <Header 
        isTestimonialsOpen={isTestimonialsOpen} 
        onOpenTestimonials={handleOpenTestimonials} 
        onNavigateSection={handleNavigateSection} 
      />
      
      {/* Testimonials Fullscreen Overlay */}
      {isTestimonialsOpen && (
        <TestimonialsFullscreen 
          onClose={handleCloseTestimonials} 
          onOpenBudget={handleOpenBudgetFromTestimonials}
        />
      )}

      <main>
        <Hero />
        <ValueProposition />
        <About />
        <PortfolioCarousel />
        <PinnedScroll />
        <Differentials />
        <FAQ />
        <BudgetForm />
      </main>

      <Footer 
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)} 
        onOpenTestimonials={handleOpenTestimonials}
        onNavigateSection={handleNavigateSection}
      />
      
      {/* LGPD Cookie Consent Banner & Privacy Modal */}
      <CookieConsent onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)} />
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />
    </div>
  );
}
