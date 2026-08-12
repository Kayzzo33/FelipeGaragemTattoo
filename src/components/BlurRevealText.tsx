import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BlurRevealTextProps {
  text: string;
  className?: string;
  elementType?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
}

export function BlurRevealText({ text, className = '', elementType: Element = 'div' }: BlurRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = containerRef.current?.querySelectorAll('.word');
      if (!words || words.length === 0) return;

      gsap.fromTo(words, 
        { filter: 'blur(12px)', opacity: 0, y: 10 },
        {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          stagger: 0.04,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'center 40%',
            scrub: 1,
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [text]);

  const words = text.split(' ').map((word, i) => (
    <span key={i} className="word inline-block mr-[0.25em] will-change-[filter,opacity,transform]">
      {word}
    </span>
  ));

  return (
    <Element ref={containerRef} className={className}>
      {words}
    </Element>
  );
}
