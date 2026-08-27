import { useState } from 'react';
import { ZoomParallaxPortfolio } from './ZoomParallaxPortfolio';

export function PortfolioCarousel() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Updated images with Google Drive high-res CDN links & Cloudinary links
  const row1Images = [
    { src: 'https://lh3.googleusercontent.com/d/19HTOZIBjfMKO4D48T5pwD5rabkDFqRWt', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://lh3.googleusercontent.com/d/1l1EVBsBdP9l2T5j8fk7OAmaBfmegga4P', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://lh3.googleusercontent.com/d/1k_mi28dypIf50rON5H7cawet7Xp-LvdL', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://lh3.googleusercontent.com/d/1OIgeefreNRXoXdwZN-o8w_8Fzp_mXuAU', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://lh3.googleusercontent.com/d/18Mx99tKzCwJoKFUry3-t3_BrBSBVuvJK', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://lh3.googleusercontent.com/d/11SIWqc_Nl8jL2t-pA_jEQ_dN1g9Ew-KA', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://lh3.googleusercontent.com/d/17xp-pdpOwrDLqRTl96BrCW_QXhpFLsVB', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://lh3.googleusercontent.com/d/1Kiezu-yADC_w7Fi7tkMVQNvTFTZFlImt', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://lh3.googleusercontent.com/d/1DnoZ88Aes7dpX4g-AOsw2neamPn1ph-O', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://lh3.googleusercontent.com/d/1ZqLIPK_0ZR9J7pRKDFqZELoLdMmVY04K', alt: 'Tatuagem Autoral Felipe Garagem' },
  ];

  const row2Images = [
    { src: 'https://lh3.googleusercontent.com/d/1TTV9UxN8b1aaJqmoaTPKI5jcJSnua5vT', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://lh3.googleusercontent.com/d/15dgz_AomJ8y1y3pa7_cdtim_CILD80Hq', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://lh3.googleusercontent.com/d/1QCitxQY16XcqjUWuunmXS3BIVnLkIabZ', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://lh3.googleusercontent.com/d/1d3kt_gn0t6VCmfJCr2Mg1ic-19XY6F2V', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://res.cloudinary.com/utnt7lxo/image/upload/v1787833589/SaveInta.com_722811092_18342891163222512_8932647788294634271_n.jpg', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://res.cloudinary.com/utnt7lxo/image/upload/v1787833588/SaveInta.com_722857951_18342891217222512_4495888547910363933_n.jpg', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://res.cloudinary.com/utnt7lxo/image/upload/v1787833588/SaveInta.com_730833702_18344639554222512_8739277124004208338_n.jpg', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://res.cloudinary.com/utnt7lxo/image/upload/v1787833587/SaveInta.com_726740248_18343902325222512_607946578019983492_n.jpg', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://res.cloudinary.com/utnt7lxo/image/upload/v1787833587/SaveInta.com_726963333_18343902289222512_8569434307896407217_n.jpg', alt: 'Tatuagem Autoral Felipe Garagem' },
    { src: 'https://res.cloudinary.com/utnt7lxo/image/upload/v1787833586/SaveInta.com_724143105_18342891115222512_4299431308795477052_n.jpg', alt: 'Tatuagem Autoral Felipe Garagem' },
  ];

  // Duplicate items to create a seamless loop
  const duplicatedRow1 = [...row1Images, ...row1Images];
  const duplicatedRow2 = [...row2Images, ...row2Images];

  return (
    <>
      {isExpanded && <ZoomParallaxPortfolio onClose={() => setIsExpanded(false)} />}
      
      <section id="portfolio" className="bg-black py-32 overflow-hidden flex flex-col">
        <div className="px-6 md:px-12 mb-16 flex justify-between items-end">
          <h3 className="text-cream text-3xl md:text-5xl font-sans font-light tracking-tight">
            Confira alguns trabalhos <span className="text-gold">↓</span>
          </h3>
          <button 
            onClick={() => setIsExpanded(true)} 
            className="hidden md:inline-block text-gold hover:text-cream transition-colors text-lg font-sans font-light border-b border-gold hover:border-cream pb-1 cursor-pointer"
          >
            Ver mais →
          </button>
        </div>
        
        <div className="flex flex-col gap-6">
          
          {/* Row 1: Animates Left */}
          <div className="flex w-[200%] animate-marquee-left gap-6">
            {duplicatedRow1.map((img, i) => (
              <div key={`row1-${i}`} className="w-[280px] sm:w-[320px] md:w-[380px] aspect-[3/4] bg-[#151515] border border-gold/20 flex-shrink-0 relative overflow-hidden group">
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
              </div>
            ))}
          </div>
          
          {/* Row 2: Animates Right */}
          <div className="flex w-[200%] animate-marquee-right gap-6 -ml-[10%]">
            {duplicatedRow2.map((img, i) => (
              <div key={`row2-${i}`} className="w-[280px] sm:w-[320px] md:w-[380px] aspect-[4/5] bg-[#151515] border border-gold/20 flex-shrink-0 relative overflow-hidden group">
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

        <div className="px-6 mt-12 md:hidden flex justify-end">
          <button 
            onClick={() => setIsExpanded(true)} 
            className="text-gold hover:text-cream transition-colors text-lg font-sans font-light border-b border-gold hover:border-cream pb-1 cursor-pointer"
          >
            Ver mais →
          </button>
        </div>
      </section>
    </>
  );
}
