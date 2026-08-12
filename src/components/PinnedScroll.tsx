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
      
      {/* Background/Floating Images */}
      <div ref={img1Ref} className="absolute w-[25vw] max-w-[300px] aspect-[4/5] bg-[#1a1a1a] border border-gold/10 flex items-center justify-center opacity-40 z-0">
        <span className="text-cream/30 text-xs font-mono">[ FOTO ]</span>
      </div>
      <div ref={img2Ref} className="absolute w-[20vw] max-w-[240px] aspect-square bg-[#1a1a1a] border border-gold/10 flex items-center justify-center opacity-30 z-0">
        <span className="text-cream/30 text-xs font-mono">[ FOTO ]</span>
      </div>
      <div ref={img3Ref} className="absolute w-[18vw] max-w-[220px] aspect-[3/4] bg-[#1a1a1a] border border-gold/10 flex items-center justify-center opacity-40 z-0">
        <span className="text-cream/30 text-xs font-mono">[ FOTO ]</span>
      </div>
      <div ref={img4Ref} className="absolute w-[22vw] max-w-[260px] aspect-[4/5] bg-[#1a1a1a] border border-gold/10 flex items-center justify-center opacity-30 z-0">
        <span className="text-cream/30 text-xs font-mono">[ FOTO ]</span>
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
