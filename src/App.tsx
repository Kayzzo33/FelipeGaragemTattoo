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
import { TestimonialsPage } from './pages/TestimonialsPage';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Route = 'home' | 'depoimentos';

export default function App() {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<Route>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('depoimento')) return 'depoimentos';
    }
    return 'home';
  });

  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('depoimento')) {
        setCurrentRoute('depoimentos');
      } else {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [currentRoute]);

  const handleNavigate = (route: Route, sectionId?: string) => {
    if (route === 'depoimentos') {
      window.history.pushState({}, '', '/depoimentos');
      setCurrentRoute('depoimentos');
      window.scrollTo(0, 0);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 50);
    } else {
      const targetPath = sectionId ? `/#${sectionId}` : '/';
      window.history.pushState({}, '', targetPath);
      setCurrentRoute('home');

      if (sectionId) {
        setTimeout(() => {
          let el = document.getElementById(sectionId);
          if (!el && (sectionId === 'contact' || sectionId === 'budget')) {
            el = document.getElementById('budget') || document.getElementById('contact');
          }
          if (el) {
            if (lenisRef.current) {
              lenisRef.current.scrollTo(el, { duration: 1.2 });
            } else {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }
          ScrollTrigger.refresh();
        }, 100);
      } else {
        window.scrollTo(0, 0);
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
        }
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 50);
      }
    }
  };

  return (
    <div className="bg-black min-h-screen text-cream font-sans">
      <Header currentPage={currentRoute} onNavigate={handleNavigate} />
      
      {currentRoute === 'home' ? (
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
      ) : (
        <main>
          <TestimonialsPage onNavigateHome={(sectionId) => handleNavigate('home', sectionId)} />
        </main>
      )}

      <Footer 
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)} 
        onNavigate={handleNavigate}
      />
      
      {/* LGPD Cookie Consent Banner & Privacy Modal across all pages */}
      <CookieConsent onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)} />
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />
    </div>
  );
}
