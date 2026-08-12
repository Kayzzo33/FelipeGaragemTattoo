import { useState } from 'react';
import { ZoomParallaxPortfolio } from './ZoomParallaxPortfolio';

export function PortfolioCarousel() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Original 8 images for the carousel
  const carouselImages = [
    { src: 'https://drive.google.com/thumbnail?sz=w1000&id=1k_mi28dypIf50rON5H7cawet7Xp-LvdL', alt: 'Tattoo 1' },
    { src: 'https://drive.google.com/thumbnail?sz=w1000&id=19HTOZIBjfMKO4D48T5pwD5rabkDFqRWt', alt: 'Tattoo 2' },
    { src: 'https://drive.google.com/thumbnail?sz=w1000&id=1l1EVBsBdP9l2T5j8fk7OAmaBfmegga4P', alt: 'Tattoo 3' },
    { src: 'https://drive.google.com/thumbnail?sz=w1000&id=1OIgeefreNRXoXdwZN-o8w_8Fzp_mXuAU', alt: 'Tattoo 4' },
    { src: 'https://drive.google.com/thumbnail?sz=w1000&id=18Mx99tKzCwJoKFUry3-t3_BrBSBVuvJK', alt: 'Tattoo 5' },
    { src: 'https://drive.google.com/thumbnail?sz=w1000&id=1ZqLIPK_0ZR9J7pRKDFqZELoLdMmVY04K', alt: 'Tattoo 6' },
    { src: 'https://drive.google.com/thumbnail?sz=w1000&id=1TTV9UxN8b1aaJqmoaTPKI5jcJSnua5vT', alt: 'Tattoo 7' },
    { src: 'https://drive.google.com/thumbnail?sz=w1000&id=15dgz_AomJ8y1y3pa7_cdtim_CILD80Hq', alt: 'Tattoo 8' },
  ];

  // Duplicate items to create a seamless loop
  const duplicatedItems = [...carouselImages, ...carouselImages];

  return (
    <>
      {isExpanded && <ZoomParallaxPortfolio onClose={() => setIsExpanded(false)} />}
      
      <section id="portfolio" className="bg-black py-32 overflow-hidden flex flex-col">
        <div className="px-6 md:px-12 mb-16 flex justify-between items-end">
          <h3 className="text-cream text-3xl md:text-5xl font-sans font-light tracking-tight">Confira alguns trabalhos <span className="text-gold">↓</span></h3>
          <button onClick={() => setIsExpanded(true)} className="hidden md:inline-block text-gold hover:text-cream transition-colors text-lg font-sans font-light border-b border-gold hover:border-cream pb-1 cursor-pointer">
            Ver mais →
          </button>
        </div>
        
        <div className="flex flex-col gap-6">
          
          {/* Row 1: Animates Left */}
          <div className="flex w-[200%] animate-marquee-left gap-6">
            {duplicatedItems.map((img, i) => (
              <div key={`row1-${i}`} className="w-[300px] md:w-[400px] aspect-[3/4] bg-[#151515] border border-gold/20 flex-shrink-0 relative overflow-hidden group">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          
          {/* Row 2: Animates Right */}
          <div className="flex w-[200%] animate-marquee-right gap-6 -ml-[10%]">
            {duplicatedItems.map((img, i) => (
              <div key={`row2-${i}`} className="w-[300px] md:w-[400px] aspect-[4/5] bg-[#151515] border border-gold/20 flex-shrink-0 relative overflow-hidden group">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

        </div>

        <div className="px-6 mt-12 md:hidden flex justify-end">
          <button onClick={() => setIsExpanded(true)} className="text-gold hover:text-cream transition-colors text-lg font-sans font-light border-b border-gold hover:border-cream pb-1 cursor-pointer">
            Ver mais →
          </button>
        </div>
      </section>
    </>
  );
}
