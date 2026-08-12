import React, { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useScroll, useTransform, motion } from 'framer-motion';

interface Image {
  src: string;
  alt?: string;
}

const images: Image[] = [
  { src: 'https://drive.google.com/thumbnail?sz=w1000&id=1k_mi28dypIf50rON5H7cawet7Xp-LvdL', alt: 'Tattoo 1' },
  { src: 'https://drive.google.com/thumbnail?sz=w1000&id=19HTOZIBjfMKO4D48T5pwD5rabkDFqRWt', alt: 'Tattoo 2' },
  { src: 'https://drive.google.com/thumbnail?sz=w1000&id=1l1EVBsBdP9l2T5j8fk7OAmaBfmegga4P', alt: 'Tattoo 3' },
  { src: 'https://drive.google.com/thumbnail?sz=w1000&id=1OIgeefreNRXoXdwZN-o8w_8Fzp_mXuAU', alt: 'Tattoo 4' },
  { src: 'https://drive.google.com/thumbnail?sz=w1000&id=18Mx99tKzCwJoKFUry3-t3_BrBSBVuvJK', alt: 'Tattoo 5' },
  { src: 'https://drive.google.com/thumbnail?sz=w1000&id=1ZqLIPK_0ZR9J7pRKDFqZELoLdMmVY04K', alt: 'Tattoo 6' },
  { src: 'https://drive.google.com/thumbnail?sz=w1000&id=1TTV9UxN8b1aaJqmoaTPKI5jcJSnua5vT', alt: 'Tattoo 7' },
];

const allImages: Image[] = [
  ...images,
  { src: 'https://drive.google.com/thumbnail?sz=w1000&id=15dgz_AomJ8y1y3pa7_cdtim_CILD80Hq', alt: 'Tattoo 8' },
  { src: 'https://drive.google.com/thumbnail?sz=w1000&id=1QCitxQY16XcqjUWuunmXS3BIVnLkIabZ', alt: 'Tattoo 9' },
  { src: 'https://drive.google.com/thumbnail?sz=w1000&id=1d3kt_gn0t6VCmfJCr2Mg1ic-19XY6F2V', alt: 'Tattoo 10' },
];

function ZoomParallax({ images, scrollContainer }: { images: Image[], scrollContainer: React.RefObject<HTMLDivElement> }) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    container: scrollContainer,
    offset: ['start start', 'end end'],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];

          return (
            <motion.div
              key={index}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]' : ''} `}
            >
              <div className="relative h-[25vh] w-[25vw]">
                <img
                  src={src || '/placeholder.svg'}
                  alt={alt || `Parallax image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function ZoomParallaxPortfolio({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Prevent scrolling on the body while modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  if (!mounted) return null;

  return (
    <div ref={scrollRef} data-lenis-prevent="true" className="fixed inset-0 bg-black text-cream font-sans z-[100] overflow-y-auto overflow-x-hidden">
      <button 
        onClick={onClose} 
        className="fixed top-6 right-6 md:top-8 md:right-8 z-[110] text-cream hover:text-gold transition-colors flex items-center gap-2 text-sm font-semibold tracking-widest bg-black/50 p-2 rounded-full backdrop-blur-sm uppercase"
      >
        <span className="hidden md:inline-block">Voltar</span> <X size={24} />
      </button>

      <main className="min-h-screen w-full">
        <div className="relative flex h-[50vh] items-center justify-center">
          <h1 className="text-center text-4xl md:text-5xl lg:text-7xl font-serif text-cream z-10">
            Portfólio <span className="text-gold italic font-light">Completo</span>
          </h1>
        </div>
        
        <ZoomParallax images={images} scrollContainer={scrollRef} />
        
        <div className="min-h-screen bg-black pt-32 pb-48 px-6 md:px-12 max-w-[1600px] mx-auto z-10 relative">
          <h2 className="text-2xl font-serif text-gold mb-16 text-center border-b border-gold/20 pb-8">Mais Obras</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allImages.map((img, i) => (
              <div key={i} className="aspect-[3/4] bg-[#1a1a1a] flex items-center justify-center group relative overflow-hidden">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
