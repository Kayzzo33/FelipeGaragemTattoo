import { useEffect } from 'react';
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
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function App() {
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

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return (
    <div className="bg-black min-h-screen text-cream font-sans">
      <Header />
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
      <Footer />
    </div>
  );
}

