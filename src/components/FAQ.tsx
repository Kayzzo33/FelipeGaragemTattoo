import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { cn } from '../lib/utils';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  { q: 'Dói muito?', a: 'A dor varia de pessoa para pessoa e de acordo com o local do corpo. No entanto, o ambiente, a técnica e a possibilidade de usar um amenizador 3D (aprovado pela ANVISA) ajudam a tornar o processo muito mais confortável.' },
  { q: 'Posso parcelar?', a: 'Sim. Todos os trabalhos podem ser parcelados em até 10x no cartão, ou você ganha 10% de desconto para pagamentos à vista.' },
  { q: 'Vocês cobrem tatuagem antiga ou cicatriz?', a: 'Sim. O processo de cobertura (cover-up) e tatuagem sobre cicatriz exige uma avaliação cuidadosa da pele e do desenho anterior. Trabalharemos juntos para criar uma arte que se adapte perfeitamente à sua necessidade.' },
  { q: 'Vocês atendem em qual bairro / cidade?', a: 'Meu estúdio privado está localizado em Atibaia-SP, oferecendo um ambiente seguro e exclusivo para os clientes que viajam para tatuar comigo.' },
  { q: 'Quanto custa uma tatuagem?', a: 'O investimento depende do tamanho, complexidade e local da tatuagem. O valor mínimo é de R$ 2.500. Solicite um orçamento detalhado no formulário abaixo para receber uma proposta exata para a sua ideia.' },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current, 
          { filter: 'blur(8px)', opacity: 0.2, y: 20 },
          { filter: 'blur(0px)', opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: titleRef.current, start: 'top 80%' } }
        );
      }
      
      const items = gsap.utils.toArray('.faq-item');
      items.forEach((item: any, i) => {
        gsap.fromTo(item,
          { filter: 'blur(8px)', opacity: 0, y: 20 },
          { filter: 'blur(0px)', opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, scrollTrigger: { trigger: listRef.current, start: 'top 80%' } }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 md:py-32 bg-black px-6 md:px-12 max-w-4xl mx-auto">
      <h2 ref={titleRef} className="text-3xl md:text-5xl font-serif text-cream mb-16 text-center">Perguntas Frequentes</h2>
      
      <div ref={listRef} className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="faq-item border-b border-cream/20">
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full py-8 flex items-center justify-between text-left group"
            >
              <span className="text-xl md:text-2xl font-serif text-cream group-hover:text-gold transition-colors">{faq.q}</span>
              <span className="text-gold font-mono text-sm tracking-widest relative w-4 h-4">
                <span className={cn('absolute inset-0 flex items-center justify-center transition-transform duration-500', openIndex === i ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100')}>+</span>
                <span className={cn('absolute inset-0 flex items-center justify-center transition-transform duration-500', openIndex === i ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0')}>—</span>
              </span>
            </button>
            <div 
              className={cn('overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]', openIndex === i ? 'max-h-64 opacity-100 pb-8' : 'max-h-0 opacity-0')}
            >
              <p className="text-cream/70 text-lg font-light leading-relaxed pr-12">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
