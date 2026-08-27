import React, { useEffect, useRef } from 'react';
import { X, Clock } from 'lucide-react';

interface PricingTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingTableModal({ isOpen, onClose }: PricingTableModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // Store previous scroll position & lock html/body
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      data-lenis-prevent="true"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div 
        data-lenis-prevent="true"
        className="relative w-full max-w-lg bg-white text-zinc-900 rounded-lg shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col border border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Title & Close Button */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 shrink-0 bg-white">
          <h3 className="text-2xl sm:text-3xl font-serif text-zinc-900 font-normal tracking-tight">
            Tabela de Valores
          </h3>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content with internal scrolling isolation */}
        <div 
          ref={contentRef}
          data-lenis-prevent="true"
          className="overflow-y-auto overscroll-contain px-6 py-6 space-y-6 text-sm flex-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          
          {/* Main Price Rows */}
          <div className="divide-y divide-zinc-100 border-b border-zinc-100">
            <div className="flex items-center justify-between py-3.5">
              <span className="text-zinc-600 font-normal">Valor mínimo</span>
              <span className="font-semibold text-zinc-900">R$ 2.800</span>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <span className="text-zinc-600 font-normal">Ticket médio recente</span>
              <span className="font-semibold text-zinc-900">~ R$ 5.500</span>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <span className="text-zinc-600 font-normal">Antebraço interno (1 projeto)</span>
              <span className="font-semibold text-zinc-900 text-right">a partir de R$ 2.800</span>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <span className="text-zinc-600 font-normal">Ombro ao punho externo (2 projetos)</span>
              <span className="font-semibold text-zinc-900 text-right">a partir de R$ 5.500</span>
            </div>
          </div>

          {/* Section: Tempo de Atendimento */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-zinc-400" />
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
                Tempo de Atendimento
              </span>
            </div>

            <div className="space-y-3 text-zinc-700 leading-relaxed font-light">
              <p className="font-medium text-zinc-900">
                Todos os atendimentos iniciam às 10h da manhã.
              </p>
              <p>
                O artista tira o dia todo para o seu projeto, então venha com tempo totalmente disponível.
              </p>
              <p>
                O tempo médio de atendimento para <strong>1 projeto</strong> (antebraço interno, antebraço externo, braço externo ou braço interno) é de <strong>6 a 8 hs totais</strong> contando apresentação, pausas durante a tatuagem e pausa para o almoço.
              </p>
              <p>
                O tempo médio de atendimento para <strong>2 projetos</strong> (fechamento de braço externo ou fechamento interno) é de <strong>10hs totais</strong> contando apresentação, pausas durante a tatuagem e pausa para o almoço.
              </p>
              <p>
                O tempo médio de atendimento para <strong>4 projetos</strong> (fechamento completo de braço) serão <strong>dois dias de atendimento</strong>.
              </p>
            </div>
          </div>

            {/* Attention Callout Box */}
          <div className="p-4 bg-zinc-100/80 rounded border-l-4 border-zinc-900 space-y-1">
            <p className="text-xs text-zinc-900 font-medium leading-relaxed">
              <strong>Atenção:</strong> todos os trabalhos podem ser parcelados em até <strong>10x</strong>.
            </p>
          </div>

        </div>

        {/* Footer with close button */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs uppercase tracking-widest font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-colors rounded shadow-sm"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
}
