import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BlurRevealTextProps {
  text: string;
  className?: string;
  elementType?: 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span';
  direction?: 'up' | 'left' | 'right';
  start?: string;
  end?: string;
  scrub?: number | boolean;
}

export function BlurRevealText({ 
  text, 
  className = '', 
  elementType: Element = 'div',
  direction = 'up',
  start = 'top 85%',
  end = 'center 40%',
  scrub = 1
}: BlurRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = containerRef.current?.querySelectorAll('.word');
      if (!words || words.length === 0) return;

      const initialFrom = direction === 'left' 
        ? { filter: 'blur(14px)', opacity: 0, x: -30, y: 0 }
        : direction === 'right'
        ? { filter: 'blur(14px)', opacity: 0, x: 30, y: 0 }
        : { filter: 'blur(12px)', opacity: 0, y: 10, x: 0 };

      gsap.fromTo(words, 
        initialFrom,
        {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          x: 0,
          stagger: 0.04,
          scrollTrigger: {
            trigger: containerRef.current,
            start,
            end,
            scrub,
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [text, direction, start, end, scrub]);

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
