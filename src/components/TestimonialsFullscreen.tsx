import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';

// Vídeos locais em alta resolução com capas de pré-visualização:
const VIDEOS = {
  video1: {
    streamUrl: '/videos/video1.mp4',
    posterUrl: '/videos/video1-poster.jpg',
    title: 'Estilo Autoral & Identidade — Thalles & Felipe',
  },
  video2: {
    streamUrl: '/videos/video2.mp4',
    posterUrl: '/videos/video2-poster.jpg',
    title: 'Amenizador 3D & Conforto Térmico',
  },
  video3: {
    streamUrl: '/videos/video3.mp4',
    posterUrl: '/videos/video3-poster.jpg',
    title: 'Precisão, Cicatrização & Depoimento',
  },
};

// Player de Vídeo com Botão Play estilo Google Drive, Controles Nacionais Nativos e Autoplay Inteligente
interface VideoPlayerProps {
  streamUrl: string;
  posterUrl: string;
  title?: string;
  isActive: boolean;
  onZoomAndPlay?: () => void;
}

function DriveVideoPlayer({
  streamUrl,
  posterUrl,
  title,
  isActive,
  onZoomAndPlay,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDrivePlayBtn, setShowDrivePlayBtn] = useState(true);

  // Executa play/pause quando a seção se torna ativa no scroll
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // Inicia mutado para garantir que o navegador não bloqueie o autoplay
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setShowDrivePlayBtn(false);
          })
          .catch((err) => {
            console.warn('Autoplay bloqueado pelo navegador, aguardando clique do usuário:', err);
            setIsPlaying(false);
            setShowDrivePlayBtn(true);
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
      setShowDrivePlayBtn(true);
    }
  }, [isActive]);

  const handlePlayClick = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;

    // Se estiver em miniatura, avança a animação para tela cheia
    if (onZoomAndPlay) {
      onZoomAndPlay();
    }

    // Clique direto do usuário desbloqueia áudio
    video.muted = false;
    const promise = video.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          setIsPlaying(true);
          setShowDrivePlayBtn(false);
        })
        .catch((err) => {
          console.warn('Erro ao reproduzir com som, tentando muted:', err);
          video.muted = true;
          video.play().then(() => {
            setIsPlaying(true);
            setShowDrivePlayBtn(false);
          });
        });
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden select-none group cursor-pointer"
      onClick={() => {
        if (!isPlaying) {
          handlePlayClick();
        }
      }}
    >
      {/* Elemento de Vídeo HTML5 com controles nativos ao reproduzir */}
      <video
        ref={videoRef}
        src={streamUrl}
        poster={posterUrl}
        playsInline
        controls={isPlaying}
        preload="auto"
        loop
        muted={!isPlaying}
        onPlay={() => {
          setIsPlaying(true);
          setShowDrivePlayBtn(false);
        }}
        onPause={() => {
          setIsPlaying(false);
          setShowDrivePlayBtn(true);
        }}
        className="w-full h-full object-contain bg-black relative z-10"
      />

      {/* Botão de Play Estilo Google Drive (Central, translúcido e elegante) */}
      {showDrivePlayBtn && (
        <div 
          onClick={handlePlayClick}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 hover:bg-black/20 backdrop-blur-[1px] transition-colors cursor-pointer"
        >
          <button
            type="button"
            onClick={handlePlayClick}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/75 hover:bg-black/90 border border-white/30 hover:border-gold text-white hover:text-gold flex items-center justify-center shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md transform transition-all duration-300 hover:scale-110 active:scale-95 group/btn cursor-pointer"
            aria-label={`Reproduzir ${title || 'vídeo'}`}
          >
            <Play size={28} className="fill-current translate-x-0.5 text-cream group-hover/btn:text-gold transition-colors" />
          </button>
        </div>
      )}
    </div>
  );
}

// Revelador de texto suave no scroll
function ScrollBlurText({ 
  text, 
  className = '', 
  scrollContainer 
}: { 
  text: string; 
  className?: string; 
  scrollContainer: React.RefObject<HTMLDivElement>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainer,
    offset: ['start 90%', 'end 60%'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [0.2, 1]);
  const filter = useTransform(scrollYProgress, [0, 0.8], ['blur(8px)', 'blur(0px)']);
  const y = useTransform(scrollYProgress, [0, 0.8], [20, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, filter, y }} className={className}>
      {text}
    </motion.div>
  );
}

// =========================================================================
// SEÇÃO 1: THALLES & FELIPE
// Miniatura -> Zoom tela cheia no scroll -> Autoplay automático
// =========================================================================
function HeroScrollSection({ 
  scrollContainer,
  activeVideoKey,
  onSetActiveVideo,
}: { 
  scrollContainer: React.RefObject<HTMLDivElement>;
  activeVideoKey: string | null;
  onSetActiveVideo: (key: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isActive = activeVideoKey === 'video1';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer,
    offset: ['start start', 'end end'],
  });

  // Autoplay ao chegar perto de zoom e em zoom (entre 18% e 88% do scroll)
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest >= 0.18 && latest <= 0.88) {
        if (activeVideoKey !== 'video1') {
          onSetActiveVideo('video1');
        }
      } else if (latest < 0.08 || latest > 0.95) {
        if (activeVideoKey === 'video1') {
          onSetActiveVideo(null);
        }
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, activeVideoKey, onSetActiveVideo]);

  // Se o usuário clicar no play antes de rolar, avança a animação para tela cheia
  const handleZoomAndPlay = () => {
    onSetActiveVideo('video1');
    if (scrollContainer.current && containerRef.current) {
      const targetScroll = containerRef.current.offsetTop + containerRef.current.offsetHeight * 0.45;
      scrollContainer.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  const titleY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  // Transição fluida de miniatura para tela cheia
  const videoInsetTop = useTransform(scrollYProgress, [0, 0.55], ['36%', '0%']);
  const videoInsetLeft = useTransform(scrollYProgress, [0, 0.55], ['46%', '0%']);
  const videoInsetRight = useTransform(scrollYProgress, [0, 0.55], ['4%', '0%']);
  const videoInsetBottom = useTransform(scrollYProgress, [0, 0.55], ['6%', '0%']);
  const videoRadius = useTransform(scrollYProgress, [0, 0.55], ['16px', '0px']);

  return (
    <div ref={containerRef} className="relative h-[220vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex flex-col justify-between p-6 sm:p-10 md:p-14">
        
        {/* Fundo Atmosférico */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black pointer-events-none" />

        {/* Header Editorial */}
        <motion.div 
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-10 max-w-2xl pt-6 sm:pt-10 select-none pointer-events-none"
        >
          <span className="text-xs uppercase font-mono tracking-[0.35em] text-gold block mb-3 sm:mb-4">
            Depoimentos & Experiência
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-cream font-light leading-[0.92] tracking-tight uppercase">
            Histórias <br />
            <span className="text-gold italic font-light lowercase font-serif">na pele</span>
          </h1>

          <p className="text-cream/60 text-xs sm:text-sm md:text-base font-light mt-5 sm:mt-6 max-w-md leading-relaxed">
            Role para vivenciar a transformação artística e o processo sob medida no estúdio privativo em Atibaia.
          </p>
        </motion.div>

        {/* Container do Vídeo que expande até tela cheia */}
        <motion.div 
          style={{
            top: videoInsetTop,
            left: videoInsetLeft,
            right: videoInsetRight,
            bottom: videoInsetBottom,
            borderRadius: videoRadius,
          }}
          className="absolute z-20 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] bg-zinc-950 border border-white/10"
        >
          <DriveVideoPlayer
            streamUrl={VIDEOS.video1.streamUrl}
            posterUrl={VIDEOS.video1.posterUrl}
            title={VIDEOS.video1.title}
            isActive={isActive}
            onZoomAndPlay={handleZoomAndPlay}
          />
        </motion.div>

      </div>
    </div>
  );
}

// =========================================================================
// SEÇÃO 2: AMENIZADOR 3D
// Centro -> Textos se afastam -> Vídeo expande em zoom -> Autoplay
// =========================================================================
function SplitScrollSection({ 
  scrollContainer,
  activeVideoKey,
  onSetActiveVideo,
}: { 
  scrollContainer: React.RefObject<HTMLDivElement>;
  activeVideoKey: string | null;
  onSetActiveVideo: (key: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isActive = activeVideoKey === 'video2';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer,
    offset: ['start start', 'end end'],
  });

  // Autoplay quando o vídeo cresce em zoom
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest >= 0.18 && latest <= 0.88) {
        if (activeVideoKey !== 'video2') {
          onSetActiveVideo('video2');
        }
      } else if (latest < 0.08 || latest > 0.95) {
        if (activeVideoKey === 'video2') {
          onSetActiveVideo(null);
        }
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, activeVideoKey, onSetActiveVideo]);

  // Se o usuário clicar no play antes de rolar, avança a animação para tela cheia
  const handleZoomAndPlay = () => {
    onSetActiveVideo('video2');
    if (scrollContainer.current && containerRef.current) {
      const targetScroll = containerRef.current.offsetTop + containerRef.current.offsetHeight * 0.45;
      scrollContainer.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  // Animação das palavras laterais
  const leftTextX = useTransform(scrollYProgress, [0, 0.40], [0, -140]);
  const leftTextOpacity = useTransform(scrollYProgress, [0, 0.30], [1, 0]);

  const rightTextX = useTransform(scrollYProgress, [0, 0.40], [0, 140]);
  const rightTextOpacity = useTransform(scrollYProgress, [0, 0.30], [1, 0]);

  // Vídeo no centro: Inicia compacto e cresce suavemente até proporção vertical sem cortar o rosto
  const videoWidth = useTransform(scrollYProgress, [0, 0.55], ['min(240px, 34vw)', 'min(450px, 92vw)']);
  const videoHeight = useTransform(scrollYProgress, [0, 0.55], ['min(155px, 22vh)', 'min(780px, 80vh)']);
  const videoRadius = useTransform(scrollYProgress, [0, 0.55], ['14px', '20px']);

  return (
    <div ref={containerRef} className="relative h-[220vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center p-4 sm:p-6 md:p-10">
        
        {/* Tag Superior Discreta */}
        <div className="absolute top-10 sm:top-14 text-center select-none pointer-events-none z-10">
          <span className="text-[10px] sm:text-xs uppercase font-mono tracking-[0.3em] text-gold/80">
            ✦ Tecnologia Anti-Dor em Atibaia
          </span>
        </div>

        {/* Camada de Textos Laterais com Espaçamento Rigorosamente Idêntico */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none px-4 sm:px-8">
          <div className="flex items-center w-full max-w-6xl">
            
            {/* Palavra à Esquerda: "SESSÃO" (Coluna esquerda de tamanho idêntico) */}
            <motion.div
              style={{ x: leftTextX, opacity: leftTextOpacity }}
              className="flex-1 basis-0 min-w-0 text-right pr-4 sm:pr-8 md:pr-10"
            >
              <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-cream uppercase font-light tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] whitespace-nowrap inline-block">
                Sessão
              </span>
            </motion.div>

            {/* Espaço reservado central com a largura exata da miniatura inicial */}
            <div className="shrink-0 w-[min(240px,34vw)]" />

            {/* Palavra à Direita: "CONFORTÁVEL" (Coluna direita de tamanho idêntico) */}
            <motion.div
              style={{ x: rightTextX, opacity: rightTextOpacity }}
              className="flex-1 basis-0 min-w-0 text-left pl-4 sm:pl-8 md:pl-10"
            >
              <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-gold italic uppercase font-light tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] whitespace-nowrap inline-block">
                Confortável
              </span>
            </motion.div>

          </div>
        </div>

        {/* Card do Vídeo Central */}
        <motion.div
          style={{
            width: videoWidth,
            height: videoHeight,
            borderRadius: videoRadius,
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.95)] bg-zinc-950 border border-gold/30 flex items-center justify-center origin-center"
        >
          <DriveVideoPlayer
            streamUrl={VIDEOS.video2.streamUrl}
            posterUrl={VIDEOS.video2.posterUrl}
            title={VIDEOS.video2.title}
            isActive={isActive}
            onZoomAndPlay={handleZoomAndPlay}
          />
        </motion.div>

        {/* Legenda de apoio inferior */}
        <div className="absolute bottom-10 sm:bottom-14 text-center select-none pointer-events-none max-w-md px-4 z-10">
          <p className="text-[10px] sm:text-xs font-mono text-cream/50 uppercase tracking-widest">
            Alívio térmico constante • Redução de até 80% do desconforto
          </p>
        </div>

      </div>
    </div>
  );
}

// =========================================================================
// SEÇÃO 3: CICATRIZAÇÃO & RESULTADO
// Expande da lateral cobrindo a tela -> Autoplay no scroll
// =========================================================================
function WipeScrollSection({ 
  scrollContainer,
  activeVideoKey,
  onSetActiveVideo,
}: { 
  scrollContainer: React.RefObject<HTMLDivElement>;
  activeVideoKey: string | null;
  onSetActiveVideo: (key: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isActive = activeVideoKey === 'video3';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer,
    offset: ['start start', 'end end'],
  });

  // Autoplay ao expandir o vídeo
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest >= 0.18 && latest <= 0.88) {
        if (activeVideoKey !== 'video3') {
          onSetActiveVideo('video3');
        }
      } else if (latest < 0.08 || latest > 0.95) {
        if (activeVideoKey === 'video3') {
          onSetActiveVideo(null);
        }
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, activeVideoKey, onSetActiveVideo]);

  // Se o usuário clicar no play antes de rolar, avança a animação para tela cheia
  const handleZoomAndPlay = () => {
    onSetActiveVideo('video3');
    if (scrollContainer.current && containerRef.current) {
      const targetScroll = containerRef.current.offsetTop + containerRef.current.offsetHeight * 0.45;
      scrollContainer.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  // Texto editorial no lado esquerdo
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  // Transição do vídeo da lateral para tela cheia
  const videoInsetTop = useTransform(scrollYProgress, [0, 0.55], ['15%', '0%']);
  const videoInsetLeft = useTransform(scrollYProgress, [0, 0.55], ['50%', '0%']);
  const videoInsetRight = useTransform(scrollYProgress, [0, 0.55], ['5%', '0%']);
  const videoInsetBottom = useTransform(scrollYProgress, [0, 0.55], ['15%', '0%']);
  const videoRadius = useTransform(scrollYProgress, [0, 0.55], ['16px', '0px']);

  return (
    <div ref={containerRef} className="relative h-[220vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-between p-6 sm:p-12 md:p-20">
        
        {/* Lado Esquerdo: Tipografia Editorial */}
        <motion.div 
          style={{ opacity: textOpacity }}
          className="w-full md:w-5/12 z-10 space-y-4 select-none pr-4 pointer-events-none"
        >
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold block">
            Cuidado & Cicatrização
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-cream font-light leading-tight">
            Do Primeiro Traço <br />
            <span className="text-gold italic font-light">ao Resultado Final</span>
          </h2>
          <p className="text-cream/60 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
            Acompanhamento atencioso pós-sessão e protocolo completo de biossegurança.
          </p>
        </motion.div>

        {/* Lado Direito: Vídeo que expande até cobrir a tela */}
        <motion.div 
          style={{ 
            top: videoInsetTop,
            left: videoInsetLeft,
            right: videoInsetRight,
            bottom: videoInsetBottom,
            borderRadius: videoRadius,
          }}
          className="absolute z-20 overflow-hidden bg-zinc-950 border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex items-center justify-center"
        >
          <DriveVideoPlayer
            streamUrl={VIDEOS.video3.streamUrl}
            posterUrl={VIDEOS.video3.posterUrl}
            title={VIDEOS.video3.title}
            isActive={isActive}
            onZoomAndPlay={handleZoomAndPlay}
          />
        </motion.div>

      </div>
    </div>
  );
}

// =========================================================================
// COMPONENTE PRINCIPAL (OVERLAY FULLSCREEN DE DEPOIMENTOS)
// =========================================================================
interface TestimonialsFullscreenProps {
  onClose: () => void;
  onOpenBudget: () => void;
}

export function TestimonialsFullscreen({ onClose, onOpenBudget }: TestimonialsFullscreenProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeVideoKey, setActiveVideoKey] = useState<string | null>('video1');

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideoKey(null);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleCloseModal = () => {
    setActiveVideoKey(null);
    onClose();
  };

  return (
    <div 
      ref={scrollRef} 
      data-lenis-prevent="true"
      className="fixed inset-0 z-[100] bg-black text-cream font-sans overflow-y-auto overflow-x-hidden selection:bg-gold selection:text-black"
    >
      {/* BOTÃO NO TOPO: "VOLTAR" */}
      <button
        onClick={handleCloseModal}
        className="fixed top-5 right-5 sm:top-6 sm:right-8 md:top-8 md:right-10 z-[120] text-xs font-mono uppercase tracking-[0.2em] text-cream hover:text-gold transition-all flex items-center gap-2 bg-black/90 hover:bg-black px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-full border border-gold/40 backdrop-blur-md cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.8)] active:scale-95"
        title="Voltar para a página principal"
      >
        <ArrowLeft size={14} className="text-gold" />
        <span className="font-semibold">Voltar</span>
      </button>

      {/* SEÇÃO 1: THALLES + FELIPE */}
      <HeroScrollSection 
        scrollContainer={scrollRef} 
        activeVideoKey={activeVideoKey}
        onSetActiveVideo={setActiveVideoKey}
      />

      {/* Textos Intermediários */}
      <div className="py-24 md:py-36 px-6 md:px-14 max-w-4xl mx-auto space-y-10 text-center">
        <ScrollBlurText 
          scrollContainer={scrollRef}
          text="Cada projeto nasce de uma conversa profunda. A tatuagem traduz memórias e sentimentos em traços autorais definitivos."
          className="text-2xl sm:text-3xl md:text-4xl font-serif text-cream font-light leading-snug"
        />
        
        <ScrollBlurText 
          scrollContainer={scrollRef}
          text="Atendimento privativo em Atibaia, com horário reservado e tranquilidade absoluta para a sua sessão."
          className="text-sm sm:text-base font-sans text-cream/65 font-light max-w-xl mx-auto leading-relaxed"
        />
      </div>

      {/* SEÇÃO 2: AMENIZADOR 3D */}
      <SplitScrollSection 
        scrollContainer={scrollRef} 
        activeVideoKey={activeVideoKey}
        onSetActiveVideo={setActiveVideoKey}
      />

      {/* Citação do Amenizador */}
      <div className="py-24 md:py-36 px-6 md:px-12 max-w-3xl mx-auto text-center space-y-4">
        <ScrollBlurText 
          scrollContainer={scrollRef}
          text="«Para quem tem receio da dor, o amenizador 3D muda completamente a experiência. Você consegue relaxar durante sessões longas e desfrutar do processo criativo.»"
          className="text-lg sm:text-xl md:text-2xl font-sans text-cream/90 font-normal leading-relaxed"
        />
        <span className="text-xs uppercase font-mono tracking-[0.25em] text-gold/80 block pt-2">
          Tecnologia Anti-Dor • Redução de até 80% do Desconforto
        </span>
      </div>

      {/* SEÇÃO 3: CICATRIZAÇÃO & RESULTADO */}
      <WipeScrollSection 
        scrollContainer={scrollRef} 
        activeVideoKey={activeVideoKey}
        onSetActiveVideo={setActiveVideoKey}
      />

      {/* CTA FINAL MINIMALISTA */}
      <section className="py-28 md:py-40 px-6 max-w-3xl mx-auto flex flex-col items-center text-center space-y-8">
        
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-cream font-light leading-tight">
          Pronto para criar sua tatuagem autoral?
        </h2>

        <p className="text-cream/60 text-sm sm:text-base font-light max-w-md">
          Envie sua ideia e receba uma proposta personalizada diretamente com Felipe Garagem.
        </p>

        <div className="pt-4">
          <button 
            onClick={onOpenBudget}
            className="text-lg sm:text-2xl md:text-3xl font-serif text-cream hover:text-gold transition-colors border-b border-cream/70 hover:border-gold pb-2 flex items-center gap-3 cursor-pointer group"
          >
            <span>SOLICITAR MEU PROJETO</span>
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </button>
        </div>

        <button 
          onClick={handleCloseModal}
          className="text-xs uppercase font-mono tracking-[0.25em] text-cream/40 hover:text-cream transition-colors pt-6 cursor-pointer flex items-center gap-1.5"
        >
          <span>←</span>
          <span>Voltar à Página Principal</span>
        </button>

      </section>

    </div>
  );
}
