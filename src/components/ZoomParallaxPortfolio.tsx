import React, { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useScroll, useTransform, motion } from 'framer-motion';

interface Image {
  src: string;
  alt?: string;
}

// 7 featured images strictly for the Zoom Parallax scroll animation
const parallaxFeaturedImages: Image[] = [
  { src: 'https://lh3.googleusercontent.com/d/19HTOZIBjfMKO4D48T5pwD5rabkDFqRWt=w800', alt: 'Tatuagem Autoral Felipe Garagem 1' },
  { src: 'https://lh3.googleusercontent.com/d/1l1EVBsBdP9l2T5j8fk7OAmaBfmegga4P=w800', alt: 'Tatuagem Autoral Felipe Garagem 2' },
  { src: 'https://lh3.googleusercontent.com/d/1k_mi28dypIf50rON5H7cawet7Xp-LvdL=w800', alt: 'Tatuagem Autoral Felipe Garagem 3' },
  { src: 'https://lh3.googleusercontent.com/d/1OIgeefreNRXoXdwZN-o8w_8Fzp_mXuAU=w800', alt: 'Tatuagem Autoral Felipe Garagem 4' },
  { src: 'https://lh3.googleusercontent.com/d/18Mx99tKzCwJoKFUry3-t3_BrBSBVuvJK=w800', alt: 'Tatuagem Autoral Felipe Garagem 5' },
  { src: 'https://lh3.googleusercontent.com/d/11SIWqc_Nl8jL2t-pA_jEQ_dN1g9Ew-KA=w800', alt: 'Tatuagem Autoral Felipe Garagem 6' },
  { src: 'https://lh3.googleusercontent.com/d/17xp-pdpOwrDLqRTl96BrCW_QXhpFLsVB=w800', alt: 'Tatuagem Autoral Felipe Garagem 7' },
];

// All images for the full gallery below the animation
const allGalleryImages: Image[] = [
  { src: 'https://lh3.googleusercontent.com/d/19HTOZIBjfMKO4D48T5pwD5rabkDFqRWt=w800', alt: 'Tatuagem Autoral Felipe Garagem 1' },
  { src: 'https://lh3.googleusercontent.com/d/1l1EVBsBdP9l2T5j8fk7OAmaBfmegga4P=w800', alt: 'Tatuagem Autoral Felipe Garagem 2' },
  { src: 'https://lh3.googleusercontent.com/d/1k_mi28dypIf50rON5H7cawet7Xp-LvdL=w800', alt: 'Tatuagem Autoral Felipe Garagem 3' },
  { src: 'https://lh3.googleusercontent.com/d/1OIgeefreNRXoXdwZN-o8w_8Fzp_mXuAU=w800', alt: 'Tatuagem Autoral Felipe Garagem 4' },
  { src: 'https://lh3.googleusercontent.com/d/18Mx99tKzCwJoKFUry3-t3_BrBSBVuvJK=w800', alt: 'Tatuagem Autoral Felipe Garagem 5' },
  { src: 'https://lh3.googleusercontent.com/d/11SIWqc_Nl8jL2t-pA_jEQ_dN1g9Ew-KA=w800', alt: 'Tatuagem Autoral Felipe Garagem 6' },
  { src: 'https://lh3.googleusercontent.com/d/17xp-pdpOwrDLqRTl96BrCW_QXhpFLsVB=w800', alt: 'Tatuagem Autoral Felipe Garagem 7' },
  { src: 'https://lh3.googleusercontent.com/d/1Kiezu-yADC_w7Fi7tkMVQNvTFTZFlImt=w800', alt: 'Tatuagem Autoral Felipe Garagem 8' },
  { src: 'https://lh3.googleusercontent.com/d/1DnoZ88Aes7dpX4g-AOsw2neamPn1ph-O=w800', alt: 'Tatuagem Autoral Felipe Garagem 9' },
  { src: 'https://lh3.googleusercontent.com/d/1ZqLIPK_0ZR9J7pRKDFqZELoLdMmVY04K=w800', alt: 'Tatuagem Autoral Felipe Garagem 10' },
  { src: 'https://lh3.googleusercontent.com/d/1TTV9UxN8b1aaJqmoaTPKI5jcJSnua5vT=w800', alt: 'Tatuagem Autoral Felipe Garagem 11' },
  { src: 'https://lh3.googleusercontent.com/d/15dgz_AomJ8y1y3pa7_cdtim_CILD80Hq=w800', alt: 'Tatuagem Autoral Felipe Garagem 12' },
  { src: 'https://lh3.googleusercontent.com/d/1QCitxQY16XcqjUWuunmXS3BIVnLkIabZ=w800', alt: 'Tatuagem Autoral Felipe Garagem 13' },
  { src: 'https://lh3.googleusercontent.com/d/1d3kt_gn0t6VCmfJCr2Mg1ic-19XY6F2V=w800', alt: 'Tatuagem Autoral Felipe Garagem 14' },
  { src: 'https://res.cloudinary.com/utnt7lxo/image/upload/f_auto,q_auto,w_800/v1787833589/SaveInta.com_722811092_18342891163222512_8932647788294634271_n.jpg', alt: 'Tatuagem Autoral Felipe Garagem 15' },
  { src: 'https://res.cloudinary.com/utnt7lxo/image/upload/f_auto,q_auto,w_800/v1787833588/SaveInta.com_722857951_18342891217222512_4495888547910363933_n.jpg', alt: 'Tatuagem Autoral Felipe Garagem 16' },
  { src: 'https://res.cloudinary.com/utnt7lxo/image/upload/f_auto,q_auto,w_800/v1787833588/SaveInta.com_730833702_18344639554222512_8739277124004208338_n.jpg', alt: 'Tatuagem Autoral Felipe Garagem 17' },
  { src: 'https://res.cloudinary.com/utnt7lxo/image/upload/f_auto,q_auto,w_800/v1787833587/SaveInta.com_726740248_18343902325222512_607946578019983492_n.jpg', alt: 'Tatuagem Autoral Felipe Garagem 18' },
  { src: 'https://res.cloudinary.com/utnt7lxo/image/upload/f_auto,q_auto,w_800/v1787833587/SaveInta.com_726963333_18343902289222512_8569434307896407217_n.jpg', alt: 'Tatuagem Autoral Felipe Garagem 19' },
  { src: 'https://res.cloudinary.com/utnt7lxo/image/upload/f_auto,q_auto,w_800/v1787833586/SaveInta.com_724143105_18342891115222512_4299431308795477052_n.jpg', alt: 'Tatuagem Autoral Felipe Garagem 20' },
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
              <div className="relative h-[25vh] w-[25vw] bg-zinc-950 overflow-hidden">
                <img
                  src={src || '/placeholder.svg'}
                  alt={alt || `Parallax image ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!mounted) return null;

  return (
    <div ref={scrollRef} data-lenis-prevent="true" className="fixed inset-0 bg-black text-cream font-sans z-[100] overflow-y-auto overflow-x-hidden">
      <button 
        onClick={onClose} 
        className="fixed top-6 right-6 md:top-8 md:right-8 z-[110] text-cream hover:text-gold transition-colors flex items-center gap-2 text-sm font-semibold tracking-widest bg-black/50 p-2 rounded-full backdrop-blur-sm uppercase cursor-pointer"
      >
        <span className="hidden md:inline-block">Voltar</span> <X size={24} />
      </button>

      <main className="min-h-screen w-full">
        <div className="relative flex h-[50vh] items-center justify-center">
          <h1 className="text-center text-4xl md:text-5xl lg:text-7xl font-serif text-cream z-10">
            Portfólio <span className="text-gold italic font-light">Completo</span>
          </h1>
        </div>
        
        {/* The 7-image Zoom Parallax Animation */}
        <ZoomParallax images={parallaxFeaturedImages} scrollContainer={scrollRef} />
        
        {/* Full Gallery Grid that displays smoothly right after the animation */}
        <div className="min-h-screen bg-black pt-32 pb-48 px-6 md:px-12 max-w-[1600px] mx-auto z-10 relative">
          <h2 className="text-2xl font-serif text-gold mb-16 text-center border-b border-gold/20 pb-8 tracking-wider uppercase">
            Galeria de Obras
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allGalleryImages.map((img, i) => (
              <div key={i} className="aspect-[3/4] bg-[#1a1a1a] border border-gold/20 flex items-center justify-center group relative overflow-hidden">
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
