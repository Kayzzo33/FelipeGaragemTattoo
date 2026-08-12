import { BlurRevealText } from './BlurRevealText';

export function About() {
  return (
    <section id="about" className="py-24 md:py-40 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center">
      
      {/* Header Image & Title */}
      <div className="relative w-full min-h-[80vh] flex justify-center items-center flex-col overflow-hidden mb-24 md:mb-32">
        <div className="relative w-full max-w-[450px] aspect-[3/4] z-[1]">
          <img 
            src="https://drive.google.com/thumbnail?sz=w1000&id=1JzMcw8v4_ca_zAGb389GXLaewK6bhVVE" 
            alt="Felipe Garagem" 
            className="w-full h-full object-cover grayscale" 
          />
        </div>
        
        {/* Overlapping Text */}
        <div className="absolute top-[65%] md:top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2] w-full text-center pointer-events-none">
          <h2 className="font-serif m-0 text-[#d1d5db]" style={{ fontSize: 'clamp(8rem, 25vw, 25rem)', lineHeight: 0.8, letterSpacing: '-0.05em' }}>
            Sobre
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
        <div className="flex flex-col gap-12">
          <div className="text-gold text-sm tracking-[0.2em] uppercase font-medium">
            A arte começa<br/> na escuta
          </div>
          <div className="w-[200px] bg-[#1a1a1a] overflow-hidden relative opacity-80">
            <img src="https://drive.google.com/thumbnail?sz=w1000&id=1HVsM9TLWmemw1BKMYrZno6viQ-zVLp4K" alt="Conteúdo abaixo" className="w-full h-auto object-cover" />
          </div>
        </div>
        
        <div className="space-y-12 text-xl md:text-2xl leading-relaxed text-cream/90 font-sans font-light">
          <BlurRevealText text="Tatuador há quase 8 anos, passei por diversos estilos até decidir criar algo verdadeiramente próprio e autoral." />
          <BlurRevealText text="Acredito que a tatuagem não é apenas um desenho, mas a tradução de uma narrativa. Meu processo se apoia em três pilares fundamentais: a anatomia da região tatuada, a história profunda por trás de cada projeto, e a estética refinada." />
          <BlurRevealText text="O resultado deve ser uma obra de arte que agrade tanto quem carrega a marca na pele quanto quem a observa. Cada traço é pensado para harmonizar com o corpo de forma única." />
        </div>
      </div>

    </section>
  );
}
