import { BlurRevealText } from './BlurRevealText';

export function Differentials() {
  const blocks = [
    {
      title: 'Técnica e Arte Única',
      desc: 'Mais que traços, crio artes que contam histórias. Minha visão artística busca transformar a sua narrativa em uma obra de arte única. Esse cuidado com o design autoral atrai clientes que viajam o Brasil para tatuar comigo.'
    },
    {
      title: 'Atendimento Exclusivo',
      desc: 'O dia do seu agendamento é reservado exclusivamente para você. A arte final só é revelada no dia da sessão, garantindo uma experiência de imersão e colaboração total, onde cada detalhe é explicado.'
    },
    {
      title: 'Ambiente Descontraído',
      desc: 'O estúdio foi pensado para ser um espaço onde você possa relaxar e aproveitar o momento. Uma atmosfera acolhedora, sem a frieza de um estúdio convencional, feita para tornar a sua experiência inesquecível.'
    },
    {
      title: 'Biossegurança Rigorosa',
      desc: 'A beleza da arte só se sustenta com segurança. Todos os procedimentos seguem normas de higiene e biossegurança extremamente rigorosas, garantindo a sua saúde e a cicatrização perfeita do trabalho.'
    }
  ];

  return (
    <section className="py-24 md:py-40 bg-black px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-32 md:gap-48 overflow-hidden">
      {blocks.map((block, i) => {
        const isEven = i % 2 === 0;
        return (
          <div 
            key={i} 
            className={`w-full md:w-[55%] flex flex-col ${isEven ? 'self-start' : 'self-end'}`}
          >
            <div className="flex gap-4 items-baseline mb-8">
              <span className="text-gold font-mono text-sm tracking-widest">0{i + 1}</span>
              <h3 className="text-3xl md:text-4xl font-sans font-light text-cream">{block.title}</h3>
            </div>
            <BlurRevealText 
              text={block.desc}
              elementType="p"
              className="text-cream/80 text-xl md:text-2xl leading-relaxed font-sans font-light pl-8"
            />
          </div>
        );
      })}
    </section>
  );
}
