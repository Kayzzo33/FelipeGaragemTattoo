import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

// Fontes de vídeo com streaming nativo em MP4 (Autoplay 100% funcional no scroll, sem botão do Drive):
const VIDEOS = {
  video1: {
    id: '1hKdTUQ4Wm6n5zywo10czirNsVhS6GyyC',
    streamUrl: '/videos/video1.mp4',
    fallbackUrl: '/api/video-stream/1hKdTUQ4Wm6n5zywo10czirNsVhS6GyyC',
    title: 'Estilo Autoral & Identidade — Thalles & Felipe',
    duration: '1:30',
  },
  video2: {
    id: '1NQ0OwCxJZb6fJFM1tSIDPdgCSHMLXwtj',
    streamUrl: '/videos/video2.mp4',
    fallbackUrl: '/api/video-stream/1NQ0OwCxJZb6fJFM1tSIDPdgCSHMLXwtj',
    title: 'Amenizador 3D & Conforto Térmico',
    duration: '1:01',
  },
  video3: {
    id: '1dgr8-gsp2VB7SjrP3a6j13h0P7vnkb0s',
    streamUrl: '/videos/video3.mp4',
    fallbackUrl: 'https://res.cloudinary.com/utnt7lxo/video/upload/v1787266575/395ee917-5e35-47a0-bcc8-d8cc3b9adb6c.mp4',
    title: 'Precisão, Cicatrização & Depoimento',
    duration: '0:42',
  },
};

// Player Nativo HTML5 com Autoplay Fluido no Scroll e Controles de Áudio
function NativeVideoPlayer({
  streamUrl,
  fallbackUrl,
  isActive,
  isMuted,
  onToggleMute,
  onTogglePlay,
  duration,
}: {
  streamUrl: string;
  fallbackUrl?: string;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: (e: React.MouseEvent) => void;
  onTogglePlay: (e: React.MouseEvent) => void;
  duration?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlayingState, setIsPlayingState] = useState(false);

  // Executa play/pause quando a seção se torna ativa no scroll
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.muted = isMuted;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlayingState(true);
          })
          .catch(() => {
            // Se o navegador bloquear áudio no autoplay, muta e toca imediatamente
            video.muted = true;
            video.play().then(() => setIsPlayingState(true)).catch(() => {});
          });
      }
    } else {
      video.pause();
      setIsPlayingState(false);
    }
  }, [isActive, isMuted]);

  // Atualiza áudio em tempo real
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div className="relative w-full h-full bg-zinc-950 flex items-center justify-center overflow-hidden select-none group/player">
      <video
        ref={videoRef}
        playsInline
        muted={isMuted}
        loop
        preload="auto"
        className="w-full h-full object-cover cursor-pointer"
        onClick={onTogglePlay}
      >
        <source src={streamUrl} type="video/mp4" />
        {fallbackUrl && <source src={fallbackUrl} type="video/mp4" />}
      </video>

      {/* Botões Flutuantes no Canto Inferior Direito (Apenas os nossos controles elegantes) */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center gap-2 pointer-events-auto">
        
        {/* Botão de Play/Pausa */}
        <button
          onClick={onTogglePlay}
          className="flex items-center gap-2 bg-black/85 hover:bg-black backdrop-blur-md border border-gold/40 hover:border-gold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 shadow-2xl cursor-pointer"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold">
            {isActive && isPlayingState ? (
              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-2.5 h-2.5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] text-cream">
            {isActive && isPlayingState ? 'Pausar' : 'Reproduzir'}
          </span>
          {duration && (
            <span className="hidden sm:inline text-[9px] font-mono text-cream/40">
              • {duration}
            </span>
          )}
        </button>

        {/* Botão de Som */}
        <button
          onClick={onToggleMute}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/85 hover:bg-black backdrop-blur-md border border-white/20 hover:border-gold flex items-center justify-center text-cream hover:text-gold transition-colors cursor-pointer"
          title={isMuted ? 'Ativar Som' : 'Silenciar'}
        >
          {isMuted ? (
            <svg className="w-3.5 h-3.5 fill-current text-cream/60" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 fill-current text-gold" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>

      </div>
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
// SEÇÃO 1: THALLES & FELIPE (Link 1 - 1m 30s)
// Miniatura no início -> Expande para Fullscreen no scroll -> Autoplay automático ao chegar em tela cheia!
// Clicar em Play de início rola e reproduz com áudio
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
  const [isMuted, setIsMuted] = useState(true);
  const isActive = activeVideoKey === 'video1';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer,
    offset: ['start start', 'end end'],
  });

  // Autoplay inteligente no scroll ao se aproximar de tela cheia
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest >= 0.45 && latest <= 0.95) {
        if (activeVideoKey !== 'video1') {
          onSetActiveVideo('video1');
        }
      } else if (latest < 0.15 || latest > 0.98) {
        if (activeVideoKey === 'video1') {
          onSetActiveVideo(null);
        }
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, activeVideoKey, onSetActiveVideo]);

  // Se clicar em play de início, rola suavemente para o enquadramento de tela cheia e reproduz
  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isActive) {
      onSetActiveVideo('video1');
      if (scrollContainer.current && containerRef.current) {
        const top = containerRef.current.offsetTop + window.innerHeight * 0.6;
        scrollContainer.current.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      onSetActiveVideo(null);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const titleY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  // Transição fluida de miniatura para tela cheia
  const videoInsetTop = useTransform(scrollYProgress, [0, 0.6], ['36%', '0%']);
  const videoInsetLeft = useTransform(scrollYProgress, [0, 0.6], ['46%', '0%']);
  const videoInsetRight = useTransform(scrollYProgress, [0, 0.6], ['4%', '0%']);
  const videoInsetBottom = useTransform(scrollYProgress, [0, 0.6], ['6%', '0%']);
  const videoRadius = useTransform(scrollYProgress, [0, 0.6], ['16px', '0px']);

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

        {/* Container do Vídeo que expande de forma fluida até tela cheia */}
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
          <NativeVideoPlayer
            streamUrl={VIDEOS.video1.streamUrl}
            fallbackUrl={VIDEOS.video1.fallbackUrl}
            isActive={isActive}
            isMuted={isMuted}
            duration={VIDEOS.video1.duration}
            onTogglePlay={handleTogglePlay}
            onToggleMute={handleToggleMute}
          />
        </motion.div>

      </div>
    </div>
  );
}

// =========================================================================
// SEÇÃO 2: AMENIZADOR 3D (Link 2 - 1m 01s)
// IDÊNTICO ÀS SUAS REFERÊNCIAS:
// - Centro exato sem desvio: Ancorado em (50%, 50%)
// - Textos responsivos nunca cortam em telas menores ("SESSÃO" na esquerda, "CONFORTÁVEL" na direita)
// - Conforme o scroll desce: As palavras se afastam e somem (fade out)
// - O vídeo cresce a partir do centro absoluto e REPRODUZ AUTOMATICAMENTE no zoom!
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
  const [isMuted, setIsMuted] = useState(true);
  const isActive = activeVideoKey === 'video2';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer,
    offset: ['start start', 'end end'],
  });

  // Autoplay quando o vídeo cresce na seção
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest >= 0.35 && latest <= 0.95) {
        if (activeVideoKey !== 'video2') {
          onSetActiveVideo('video2');
        }
      } else if (latest < 0.15 || latest > 0.98) {
        if (activeVideoKey === 'video2') {
          onSetActiveVideo(null);
        }
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, activeVideoKey, onSetActiveVideo]);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSetActiveVideo(isActive ? null : 'video2');
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  // Animação das palavras laterais:
  // "SESSÃO" à esquerda: afasta para a esquerda e some (opacity: 0)
  const leftTextX = useTransform(scrollYProgress, [0, 0.40], [0, -100]);
  const leftTextOpacity = useTransform(scrollYProgress, [0, 0.30], [1, 0]);

  // "CONFORTÁVEL" à direita: afasta para a direita e some (opacity: 0)
  const rightTextX = useTransform(scrollYProgress, [0, 0.40], [0, 100]);
  const rightTextOpacity = useTransform(scrollYProgress, [0, 0.30], [1, 0]);

  // Vídeo no centro: Inicia compacto e cresce suavemente a partir do centro (origin-center)
  const videoWidth = useTransform(scrollYProgress, [0, 0.55], ['min(290px, 38vw)', 'min(820px, 86vw)']);
  const videoHeight = useTransform(scrollYProgress, [0, 0.55], ['min(190px, 26vh)', 'min(480px, 56vh)']);
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

        {/* Camada de Textos Laterais Perfeitamente Alinhados à Miniatura */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 flex items-center justify-between pointer-events-none select-none">
          
          {/* Palavra à Esquerda: "SESSÃO" */}
          <motion.div
            style={{ x: leftTextX, opacity: leftTextOpacity }}
            className="flex-1 text-right pr-3 sm:pr-5 md:pr-8"
          >
            <span className="text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-cream uppercase font-light tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] whitespace-nowrap">
              Sessão
            </span>
          </motion.div>

          {/* Espaço reservado central proporcional à miniatura */}
          <div className="shrink-0 w-[min(290px,38vw)]" />

          {/* Palavra à Direita: "CONFORTÁVEL" */}
          <motion.div
            style={{ x: rightTextX, opacity: rightTextOpacity }}
            className="flex-1 text-left pl-3 sm:pl-5 md:pl-8"
          >
            <span className="text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-gold italic uppercase font-light tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] whitespace-nowrap">
              Confortável
            </span>
          </motion.div>

        </div>

        {/* Card do Vídeo Central: ANCORADO NO CENTRO EXATO (origin-center, sem deslocamento) */}
        <motion.div
          style={{
            width: videoWidth,
            height: videoHeight,
            borderRadius: videoRadius,
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.95)] bg-zinc-950 border border-gold/30 flex items-center justify-center origin-center"
        >
          <NativeVideoPlayer
            streamUrl={VIDEOS.video2.streamUrl}
            fallbackUrl={VIDEOS.video2.fallbackUrl}
            isActive={isActive}
            isMuted={isMuted}
            duration={VIDEOS.video2.duration}
            onTogglePlay={handleTogglePlay}
            onToggleMute={handleToggleMute}
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
// SEÇÃO 3: CICATRIZAÇÃO & RESULTADO (Link 3 - 42s)
// - Expande suavemente da direita até cobrir a tela sem zoom exagerado
// - REPRODUZ AUTOMATICAMENTE no scroll ao expandir!
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
  const [isMuted, setIsMuted] = useState(true);
  const isActive = activeVideoKey === 'video3';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer,
    offset: ['start start', 'end end'],
  });

  // Autoplay ao expandir o vídeo na Seção 3
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest >= 0.40 && latest <= 0.95) {
        if (activeVideoKey !== 'video3') {
          onSetActiveVideo('video3');
        }
      } else if (latest < 0.15 || latest > 0.98) {
        if (activeVideoKey === 'video3') {
          onSetActiveVideo(null);
        }
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, activeVideoKey, onSetActiveVideo]);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSetActiveVideo(isActive ? null : 'video3');
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  // Texto editorial no lado esquerdo
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  // Transição do vídeo da lateral direita para tela cheia
  const videoInsetTop = useTransform(scrollYProgress, [0, 0.6], ['15%', '0%']);
  const videoInsetLeft = useTransform(scrollYProgress, [0, 0.6], ['50%', '0%']);
  const videoInsetRight = useTransform(scrollYProgress, [0, 0.6], ['5%', '0%']);
  const videoInsetBottom = useTransform(scrollYProgress, [0, 0.6], ['15%', '0%']);
  const videoRadius = useTransform(scrollYProgress, [0, 0.6], ['16px', '0px']);

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

        {/* Lado Direito: Vídeo que expande até cobrir a tela e reproduz sozinho */}
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
          <NativeVideoPlayer
            streamUrl={VIDEOS.video3.streamUrl}
            fallbackUrl={VIDEOS.video3.fallbackUrl}
            isActive={isActive}
            isMuted={isMuted}
            duration={VIDEOS.video3.duration}
            onTogglePlay={handleTogglePlay}
            onToggleMute={handleToggleMute}
          />
        </motion.div>

      </div>
    </div>
  );
}

// =========================================================================
// COMPONENTE PRINCIPAL (OVERLAY FULLSCREEN)
// =========================================================================
interface TestimonialsFullscreenProps {
  onClose: () => void;
  onOpenBudget: () => void;
}

export function TestimonialsFullscreen({ onClose, onOpenBudget }: TestimonialsFullscreenProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeVideoKey, setActiveVideoKey] = useState<string | null>(null);

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
      {/* 1 ÚNICO BOTÃO NO TOPO (FECHAR ✕) */}
      <button
        onClick={handleCloseModal}
        className="fixed top-6 right-6 md:top-8 md:right-10 z-[120] text-xs font-mono uppercase tracking-[0.25em] text-cream/80 hover:text-gold transition-colors flex items-center gap-2.5 bg-black/85 px-5 py-2.5 rounded-full border border-white/15 backdrop-blur-md cursor-pointer hover:border-gold/50 shadow-2xl"
      >
        <span>Fechar</span>
        <span className="text-sm">✕</span>
      </button>

      {/* SEÇÃO 1: THALLES + FELIPE (Link 1 - 1m 30s) */}
      <HeroScrollSection 
        scrollContainer={scrollRef} 
        activeVideoKey={activeVideoKey}
        onSetActiveVideo={setActiveVideoKey}
      />

      {/* Textos Intermediários Soltos na Tela */}
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

      {/* SEÇÃO 2: AMENIZADOR 3D (Link 2 - 1m 01s) */}
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

      {/* SEÇÃO 3: CICATRIZAÇÃO & RESULTADO (Link 3 - 42s) */}
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
          className="text-xs uppercase font-mono tracking-[0.25em] text-cream/40 hover:text-cream transition-colors pt-6 cursor-pointer"
        >
          Voltar à Página Principal
        </button>

      </section>

    </div>
  );
}


