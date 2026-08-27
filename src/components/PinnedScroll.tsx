import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function PinnedScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const img3Ref = useRef<HTMLDivElement>(null);
  const img4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=250%',
        pin: true,
        scrub: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=250%',
          scrub: true,
        }
      });

      // Images start off-screen bottom and move up while rotating/scaling slightly
      tl.fromTo(img1Ref.current, { y: '150vh', x: '-10vw', rotation: -5 }, { y: '-50vh', x: '-5vw', rotation: 2, ease: 'none' }, 0)
        .fromTo(img2Ref.current, { y: '180vh', x: '15vw', rotation: 10 }, { y: '-30vh', x: '10vw', rotation: -2, ease: 'none' }, 0.1)
        .fromTo(img3Ref.current, { y: '160vh', x: '-30vw', rotation: -8 }, { y: '20vh', x: '-35vw', rotation: 4, ease: 'none' }, 0.2)
        .fromTo(img4Ref.current, { y: '200vh', x: '30vw', rotation: 5 }, { y: '10vh', x: '25vw', rotation: -5, ease: 'none' }, 0.15);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="h-screen w-full bg-black relative overflow-hidden flex items-center justify-center">
      
      {/* Background/Floating Images with real authorial artwork */}
      <div ref={img1Ref} className="absolute w-[32vw] sm:w-[25vw] max-w-[320px] aspect-[4/5] bg-zinc-900 border border-gold/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden rounded-sm opacity-60 hover:opacity-90 transition-opacity z-0">
        <img 
          src="https://res.cloudinary.com/utnt7lxo/image/upload/v1787832229/25c36363-9a1e-49cf-b8b2-9563037f28c6.jpg" 
          alt="Arte Autoral 1 - Felipe Garagem" 
          className="w-full h-full object-cover grayscale contrast-125 brightness-90 hover:grayscale-0 transition-all duration-500" 
          loading="eager"
          referrerPolicy="no-referrer"
        />
      </div>
      <div ref={img2Ref} className="absolute w-[28vw] sm:w-[22vw] max-w-[280px] aspect-square bg-zinc-900 border border-gold/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden rounded-sm opacity-55 hover:opacity-90 transition-opacity z-0">
        <img 
          src="https://res.cloudinary.com/utnt7lxo/image/upload/v1787833589/SaveInta.com_722811092_18342891163222512_8932647788294634271_n.jpg" 
          alt="Arte Autoral 2 - Felipe Garagem" 
          className="w-full h-full object-cover grayscale contrast-125 brightness-90 hover:grayscale-0 transition-all duration-500" 
          loading="eager"
          referrerPolicy="no-referrer"
        />
      </div>
      <div ref={img3Ref} className="absolute w-[26vw] sm:w-[20vw] max-w-[250px] aspect-[3/4] bg-zinc-900 border border-gold/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden rounded-sm opacity-60 hover:opacity-90 transition-opacity z-0">
        <img 
          src="https://res.cloudinary.com/utnt7lxo/image/upload/v1787833587/SaveInta.com_726740248_18343902325222512_607946578019983492_n.jpg" 
          alt="Arte Autoral 3 - Felipe Garagem" 
          className="w-full h-full object-cover grayscale contrast-125 brightness-90 hover:grayscale-0 transition-all duration-500" 
          loading="eager"
          referrerPolicy="no-referrer"
        />
      </div>
      <div ref={img4Ref} className="absolute w-[30vw] sm:w-[24vw] max-w-[290px] aspect-[4/5] bg-zinc-900 border border-gold/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden rounded-sm opacity-55 hover:opacity-90 transition-opacity z-0">
        <img 
          src="https://res.cloudinary.com/utnt7lxo/image/upload/v1787833586/SaveInta.com_724143105_18342891115222512_4299431308795477052_n.jpg" 
          alt="Arte Autoral 4 - Felipe Garagem" 
          className="w-full h-full object-cover grayscale contrast-125 brightness-90 hover:grayscale-0 transition-all duration-500" 
          loading="eager"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Center Text */}
      <div className="relative z-10 text-center max-w-5xl px-6 py-12 mix-blend-difference">
        <h2 ref={textRef} className="text-4xl md:text-7xl lg:text-8xl font-sans font-light tracking-tight text-cream leading-[1.1]">
          Arte Autoral <br/>
          <span className="text-gold italic font-light">desde 2018</span>
        </h2>
      </div>

    </section>
  );
}
