import { useState, useEffect, useRef } from 'react';
import { Play, Volume2, X, Shield, Sparkles, Clock, Quote, ArrowRight, Video } from 'lucide-react';
import { trackMetaPageView } from '../lib/metaPixel';

interface VideoItem {
  id: string;
  title: string;
  author: string;
  badge: string;
  duration: string;
  isoDuration: string;
  context: string;
  quote: string;
  videoUrl: string;
  posterUrl: string;
  description: string;
}

const TESTIMONIAL_VIDEOS: VideoItem[] = [
  {
    id: 'thalles-felipe',
    title: 'Estilo Único, Identidade & Vivência Artística',
    author: 'Thalles & Felipe Garagem',
    badge: 'Vídeo Âncora • 1m30s',
    duration: '1:30',
    isoDuration: 'PT1M30S',
    context: 'Sobre o estilo autoral, o processo criativo sob medida e a experiência no estúdio privado.',
    quote: 'O Felipe tem um estilo autoral inconfundível. Ele não apenas faz uma tatuagem, ele traduz sua essência em uma obra única no corpo.',
    videoUrl: 'https://res.cloudinary.com/utnt7lxo/video/upload/v1787266575/395ee917-5e35-47a0-bcc8-d8cc3b9adb6c.mp4',
    posterUrl: 'https://res.cloudinary.com/utnt7lxo/video/upload/so_3/v1787266575/395ee917-5e35-47a0-bcc8-d8cc3b9adb6c.jpg',
    description: 'Felipe Garagem apresenta sua visão e estilo autoral de tatuagem, seguido pelo relato do cliente Thalles sobre a execução impecável e o resultado final.',
  },
  {
    id: 'amenizador-3d',
    title: 'Sessão Confortável com o Amenizador 3D',
    author: 'Depoimento Cliente & Felipe',
    badge: 'Tecnologia Anti-Dor • 1m01s',
    duration: '1:01',
    isoDuration: 'PT1M1S',
    context: 'Sobre a tecnologia do Amenizador 3D exclusivo (aprovado pela ANVISA) que reduz até 80% do desconforto durante a sessão.',
    quote: 'Para quem tem receio da dor, o amenizador 3D muda completamente o jogo. A sessão foi muito tranquila do início ao fim.',
    videoUrl: 'https://res.cloudinary.com/utnt7lxo/video/upload/v1787266575/395ee917-5e35-47a0-bcc8-d8cc3b9adb6c.mp4', // Cloudinary video stream
    posterUrl: 'https://drive.google.com/thumbnail?sz=w1200&id=15U2mMMojOj9etBjc4lMgbvjr0Mvv21ab',
    description: 'Cliente relata sua experiência com a tecnologia exclusiva do Amenizador 3D, com explicação técnica do tatuador Felipe Garagem.',
  },
  {
    id: 'projeto-autoral',
    title: 'Do Primeiro Traço à Cicatrização Perfeita',
    author: 'Depoimento Cliente',
    badge: 'Experiência & Biossegurança • 42s',
    duration: '0:42',
    isoDuration: 'PT42S',
    context: 'Sobre o atendimento personalizado, a precisão anatômica do desenho e o pós-atendimento.',
    quote: 'A atenção aos detalhes e o cuidado com a higiene e cicatrização mostram o nível de profissionalismo do Felipe.',
    videoUrl: 'https://res.cloudinary.com/utnt7lxo/video/upload/v1787266575/395ee917-5e35-47a0-bcc8-d8cc3b9adb6c.mp4', // Cloudinary video stream
    posterUrl: 'https://drive.google.com/thumbnail?sz=w1200&id=1-p_Z184V29V7EaH4Xk2L3M_example',
    description: 'Relato direto e objetivo sobre a precisão técnica, atmosfera privativa e suporte pós-tatuagem.',
  },
];

interface TestimonialsPageProps {
  onNavigateHome: (sectionId?: string) => void;
}

export function TestimonialsPage({ onNavigateHome }: TestimonialsPageProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  // Update document title, meta tags, schema.org VideoObject and Meta Pixel PageView
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Depoimentos & Experiências Reais | Felipe Garagem Tattoo — Atibaia & SP';

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const prevCanonicalHref = canonical ? canonical.href : '';
    if (canonical) {
      canonical.href = 'https://felipegaragemtattoo.com.br/depoimentos';
    }

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Assista aos depoimentos de clientes sobre as tatuagens autorais e a tecnologia do Amenizador 3D no estúdio de Felipe Garagem em Atibaia - SP.'
      );
    }

    // Inject VideoObject Schema.org JSON-LD
    const scriptId = 'schema-video-objects';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const videoSchemas = TESTIMONIAL_VIDEOS.map((vid) => ({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: `${vid.title} — Felipe Garagem Tattoo`,
      description: vid.description,
      thumbnailUrl: [vid.posterUrl],
      uploadDate: '2026-08-20T00:00:00Z',
      duration: vid.isoDuration,
      contentUrl: vid.videoUrl,
      embedUrl: vid.videoUrl,
      publisher: {
        '@type': 'Organization',
        name: 'Felipe Garagem Tattoo',
        logo: {
          '@type': 'ImageObject',
          url: 'https://drive.google.com/thumbnail?sz=w1200&id=15U2mMMojOj9etBjc4lMgbvjr0Mvv21ab',
        },
      },
    }));

    scriptEl.textContent = JSON.stringify(videoSchemas);

    // Track Meta Pixel PageView on page entry
    trackMetaPageView();

    // Scroll to top safely
    window.scrollTo(0, 0);

    return () => {
      document.title = originalTitle;
      if (canonical && prevCanonicalHref) {
        canonical.href = prevCanonicalHref;
      }
      if (metaDesc && prevDesc) {
        metaDesc.setAttribute('content', prevDesc);
      }
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, []);

  // Handle active video playback inside modal
  useEffect(() => {
    if (activeVideo && modalVideoRef.current) {
      modalVideoRef.current.play().catch(() => {
        // Autoplay may be restricted by browser until direct interaction
      });
    }
  }, [activeVideo]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-cream pt-28 pb-20 selection:bg-gold selection:text-black">
      
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gold/[0.04] rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[400px] bg-zinc-800/[0.15] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Breadcrumb & Navigation Back */}
        <div className="mb-12 flex items-center justify-between border-b border-cream/10 pb-6">
          <button 
            onClick={() => onNavigateHome()}
            className="group flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cream/60 hover:text-gold transition-colors font-medium"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Voltar para o Início</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-gold/80 tracking-widest uppercase bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
            <Video size={12} className="text-gold" />
            <span>Sessão Cinematográfica</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-28">
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-semibold mb-4 block">
            HISTÓRIAS MARCADAS NA PELE
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-cream leading-[1.05] tracking-tight mb-8">
            Depoimentos & Vivências
          </h1>
          <p className="text-cream/70 text-base md:text-lg font-light leading-relaxed">
            Conheça os relatos de quem confiou sua história aos traços autorais de Felipe Garagem. 
            Uma imersão na arte, na tecnologia do Amenizador 3D e no atendimento privado.
          </p>
        </div>

        {/* Spotlight Video Card: Thalles & Felipe (Anchor Video - 1m30s) */}
        {TESTIMONIAL_VIDEOS[0] && (
          <div className="mb-20">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-gold/10 to-transparent rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition duration-700 pointer-events-none" />
              
              <div 
                onClick={() => setActiveVideo(TESTIMONIAL_VIDEOS[0])}
                className="relative bg-zinc-950/90 border border-gold/30 hover:border-gold/80 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer grid grid-cols-1 lg:grid-cols-12"
              >
                {/* Video Preview Canvas (7 Cols on desktop) */}
                <div className="lg:col-span-7 relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                  <video
                    src={TESTIMONIAL_VIDEOS[0].videoUrl}
                    poster={TESTIMONIAL_VIDEOS[0].posterUrl}
                    preload="metadata"
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />
                  
                  {/* Dark gradient overlay for cinema depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Play Button Trigger */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gold/90 text-black flex items-center justify-center shadow-[0_0_40px_rgba(197,160,89,0.5)] group-hover:scale-110 group-hover:bg-gold transition-all duration-300">
                      <Play size={32} className="fill-black translate-x-1" />
                    </div>
                  </div>

                  {/* Duration Tag */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10 text-xs font-mono text-gold font-medium">
                    <Clock size={12} />
                    <span>{TESTIMONIAL_VIDEOS[0].duration} • Full HD</span>
                  </div>
                </div>

                {/* Content Side (5 Cols on desktop) */}
                <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-b from-zinc-950 to-black">
                  <div>
                    <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-semibold mb-4">
                      <Sparkles size={14} className="text-gold" />
                      <span>{TESTIMONIAL_VIDEOS[0].badge}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif text-cream font-medium leading-tight mb-4">
                      {TESTIMONIAL_VIDEOS[0].title}
                    </h2>

                    <p className="text-xs uppercase tracking-wider text-gold/80 font-mono mb-6">
                      {TESTIMONIAL_VIDEOS[0].author}
                    </p>

                    {/* Dramatic Quote Block */}
                    <div className="relative pl-6 border-l-2 border-gold/60 my-6">
                      <Quote size={20} className="absolute -top-3 -left-3 text-gold/40 bg-zinc-950 p-0.5" />
                      <p className="text-cream/90 text-sm sm:text-base font-serif italic leading-relaxed">
                        "{TESTIMONIAL_VIDEOS[0].quote}"
                      </p>
                    </div>

                    <p className="text-cream/60 text-xs sm:text-sm font-light leading-relaxed">
                      {TESTIMONIAL_VIDEOS[0].context}
                    </p>
                  </div>

                  {/* Trigger Action */}
                  <div className="pt-8 mt-6 border-t border-cream/10 flex items-center justify-between">
                    <span className="text-gold text-xs uppercase tracking-[0.2em] font-semibold flex items-center gap-2 group-hover:text-cream transition-colors">
                      Assistir Depoimento Completo <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[11px] text-cream/40 font-mono">1080p Cinema</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Testimonials Grid (2 Videos) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {TESTIMONIAL_VIDEOS.slice(1).map((vid) => (
            <div 
              key={vid.id}
              onClick={() => setActiveVideo(vid)}
              className="group relative bg-zinc-950 border border-cream/10 hover:border-gold/60 rounded-xl overflow-hidden shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  <video
                    src={vid.videoUrl}
                    poster={vid.posterUrl}
                    preload="metadata"
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75 group-hover:opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-gold/90 text-black flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-gold transition-all duration-300">
                      <Play size={22} className="fill-black translate-x-0.5" />
                    </div>
                  </div>

                  {/* Duration Chip */}
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-mono text-gold font-medium border border-white/10 flex items-center gap-1.5">
                    <Clock size={11} />
                    <span>{vid.duration}</span>
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gold font-mono tracking-wider uppercase font-semibold">{vid.badge}</span>
                    <span className="text-cream/50 font-mono">{vid.author}</span>
                  </div>

                  <h3 className="text-xl font-serif text-cream font-normal leading-snug group-hover:text-gold transition-colors">
                    {vid.title}
                  </h3>

                  <div className="relative pl-4 border-l border-gold/40 py-1">
                    <p className="text-cream/80 text-xs sm:text-sm font-serif italic">
                      "{vid.quote}"
                    </p>
                  </div>

                  <p className="text-cream/60 text-xs font-light leading-relaxed">
                    {vid.context}
                  </p>
                </div>
              </div>

              {/* Bottom Card Bar */}
              <div className="p-6 sm:p-8 pt-0">
                <div className="pt-4 border-t border-cream/10 flex items-center justify-between text-xs text-gold group-hover:text-cream transition-colors">
                  <span className="font-semibold uppercase tracking-widest flex items-center gap-1.5">
                    Reproduzir Vídeo <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-cream/40 font-mono">Depoimento Real</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA: Agendar Projeto */}
        <div className="border border-gold/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-8 sm:p-14 rounded-2xl text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-semibold block">
              SUA HISTÓRIA É A PRÓXIMA
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-cream font-normal">
              Pronto para criar sua tatuagem autoral exclusiva?
            </h2>
            <p className="text-cream/70 text-sm sm:text-base font-light leading-relaxed">
              Solicite seu orçamento personalizado sem compromisso. Avaliamos a anatomia, o estilo e o uso do Amenizador 3D para sua sessão.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigateHome('budget')}
                className="w-full sm:w-auto px-8 py-4 bg-gold text-black hover:bg-cream transition-colors duration-300 text-xs font-bold uppercase tracking-[0.2em] rounded-sm shadow-xl"
              >
                Solicitar Orçamento Online
              </button>
              <a
                href="https://wa.me/5511989719861?text=Ol%C3%A1%20Felipe!%20Vi%20os%20depoimentos%20no%20site%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto."
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 border border-cream/30 text-cream hover:bg-cream/10 transition-colors duration-300 text-xs font-semibold uppercase tracking-[0.2em] rounded-sm"
              >
                Falar pelo WhatsApp
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Cinema Mode Lightbox Modal */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/95 backdrop-blur-2xl"
          data-lenis-prevent="true"
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className="relative w-full max-w-5xl bg-zinc-950 border border-gold/40 rounded-xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col"
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="px-6 py-4 bg-black border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gold animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest text-gold font-semibold">
                  {activeVideo.badge}
                </span>
                <span className="text-zinc-600">|</span>
                <span className="text-xs font-mono text-zinc-300 hidden sm:inline">
                  {activeVideo.author}
                </span>
              </div>
              
              <button
                onClick={() => setActiveVideo(null)}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800 p-2 rounded-full transition-colors flex items-center gap-1.5 text-xs uppercase tracking-wider"
                aria-label="Fechar vídeo"
              >
                <span>Fechar</span>
                <X size={18} />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black w-full flex items-center justify-center">
              <video
                ref={modalVideoRef}
                src={activeVideo.videoUrl}
                poster={activeVideo.posterUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
                aria-label={`Vídeo: ${activeVideo.title}`}
              >
                Seu navegador não suporta a tag de vídeo.
              </video>
            </div>

            {/* Modal Bottom Metadata */}
            <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base sm:text-lg font-serif text-cream font-normal">
                  {activeVideo.title}
                </h4>
                <p className="text-xs text-zinc-400 font-light mt-1 max-w-2xl">
                  {activeVideo.description}
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveVideo(null);
                  onNavigateHome('budget');
                }}
                className="px-5 py-2.5 bg-gold text-black hover:bg-cream transition-colors text-xs font-bold uppercase tracking-wider rounded shrink-0"
              >
                Fazer Meu Orçamento
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
