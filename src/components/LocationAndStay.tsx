import React from 'react';
import { BlurRevealText } from './BlurRevealText';

export function LocationAndStay() {
  return (
    <section id="location" className="py-24 md:py-36 px-6 md:px-12 bg-black border-t border-gold/15 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-14 md:space-y-20">
        
        {/* Header & Typography with clean Blur Reveal */}
        <div className="space-y-8">
          <div className="text-gold text-xs sm:text-sm tracking-[0.3em] uppercase font-medium">
            Localização & Hospedagem
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-cream font-light leading-tight tracking-tight">
            Sobre nossa <span className="text-gold italic">Localização</span> e Hospedagem
          </h2>

          <div className="space-y-6 pt-2">
            <BlurRevealText
              text="Estamos localizados em Atibaia-SP em média a 50 min do aeroporto de Guarulhos."
              className="text-cream text-lg sm:text-xl md:text-2xl font-serif font-light leading-relaxed"
              direction="up"
              start="top 85%"
              end="center 60%"
            />

            <BlurRevealText
              text="A cidade de Atibaia é conhecida pela sua rica gastronomia, podendo assim, além de tatuar, desfrutar de outras experiências por aqui, existem Airbnbs, pousadas e hotéis."
              className="text-cream/70 text-base sm:text-lg md:text-xl font-sans font-light leading-relaxed"
              direction="up"
              start="top 80%"
              end="center 55%"
            />
          </div>
        </div>

        {/* Minimalist & Premium Map Container */}
        <div className="relative rounded-lg overflow-hidden border border-gold/20 bg-zinc-950 shadow-2xl">
          
          {/* Subtle top status bar */}
          <div className="px-6 py-3.5 bg-zinc-950/90 border-b border-gold/15 flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-cream/70 font-light">
              Atibaia — SP • Brasil
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Atibaia+SP"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-widest text-gold hover:text-white transition-colors underline underline-offset-4 font-medium"
            >
              Abrir no Maps →
            </a>
          </div>

          {/* Clean Dark Embedded Map */}
          <div className="w-full h-[320px] sm:h-[400px] relative bg-zinc-950">
            <iframe
              title="Localização em Atibaia - SP"
              src="https://maps.google.com/maps?q=Atibaia%2C%20SP%2C%20Brasil&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ 
                border: 0, 
                filter: 'invert(90%) hue-rotate(180deg) contrast(95%) grayscale(25%)' 
              }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
