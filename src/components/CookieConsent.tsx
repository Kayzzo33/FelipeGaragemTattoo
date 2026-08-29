import { useState, useEffect } from 'react';
import { initMetaPixel } from '../lib/metaPixel';

interface CookieConsentProps {
  onOpenPrivacyPolicy: () => void;
}

export function CookieConsent({ onOpenPrivacyPolicy }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Show banner after brief delay
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    } else if (consent === 'granted') {
      initMetaPixel();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'granted');
    setShowBanner(false);
    initMetaPixel();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'denied');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <aside aria-label="Consentimento de Cookies e Termos" className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-[90] bg-zinc-950/95 border border-gold/30 text-cream p-5 shadow-2xl backdrop-blur-md">
      <div className="space-y-3">
        <p className="text-xs md:text-sm text-cream/80 font-light leading-relaxed">
          Utilizamos cookies e tecnologias de navegação para personalizar seu atendimento e melhorar sua experiência. Ao navegar, você aceita nossos{' '}
          <button
            type="button"
            onClick={onOpenPrivacyPolicy}
            className="text-gold underline hover:text-cream transition-colors text-xs md:text-sm font-medium"
          >
            Termos de Uso e Política de Privacidade (LGPD)
          </button>.
        </p>
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 bg-gold text-black hover:bg-cream transition-colors text-xs font-semibold py-2 px-4 uppercase tracking-wider text-center cursor-pointer shadow-md"
          >
            Aceitar Termos
          </button>
          <button
            type="button"
            onClick={handleDecline}
            className="flex-1 border border-cream/30 text-cream/80 hover:border-cream hover:text-cream transition-colors text-xs py-2 px-4 uppercase tracking-wider text-center cursor-pointer"
          >
            Recusar
          </button>
        </div>
      </div>
    </aside>
  );
}
