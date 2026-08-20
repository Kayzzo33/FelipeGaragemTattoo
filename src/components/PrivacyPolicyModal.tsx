import { useEffect } from 'react';
import { X, ShieldCheck, FileText, Lock, Eye, UserCheck } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  // Lock background body scroll and prevent scroll leak
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-sm"
      data-lenis-prevent="true"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 border border-zinc-700 text-zinc-100 max-w-3xl w-full rounded-lg shadow-2xl flex flex-col max-h-[88vh] overflow-hidden font-sans [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans"
        data-lenis-prevent="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Institutional & Clean */}
        <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-800 rounded text-zinc-200">
              <ShieldCheck size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-zinc-100 font-sans tracking-tight !font-sans">
                Aviso de Privacidade e Proteção de Dados
              </h2>
              <p className="text-xs text-zinc-400 font-sans">
                Conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded p-1.5 transition-colors"
            aria-label="Fechar modal de privacidade"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div 
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-7 text-zinc-300 font-sans text-sm leading-relaxed overscroll-contain"
          data-lenis-prevent="true"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#52525b #18181b' }}
        >
          {/* Summary Box */}
          <div className="bg-zinc-950/60 border border-zinc-800 p-4 rounded text-xs text-zinc-300 space-y-2">
            <div className="flex items-center gap-2 font-medium text-zinc-200">
              <FileText size={14} className="text-amber-400" />
              <span>Resumo do Compromisso</span>
            </div>
            <p>
              Este documento explica de forma clara, transparente e objetiva como tratamos os dados pessoais fornecidos 
              através dos nossos canais e formulários de orçamento para atendimento artístico exclusivo.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-zinc-100 font-semibold text-sm sm:text-base border-b border-zinc-800/80 pb-1.5 font-sans">
              <UserCheck size={16} className="text-amber-400 shrink-0" />
              <h3 className="!font-sans font-semibold text-zinc-100 text-sm sm:text-base">1. Dados Pessoais Coletados</h3>
            </div>
            <p className="text-zinc-300 text-xs sm:text-sm">
              Coletamos estritamente as informações necessárias para viabilizar a criação de propostas artísticas, 
              avaliação anatômica e comunicação direta:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-xs sm:text-sm">
              <li><strong className="text-zinc-200">Identificação e Contato:</strong> Nome completo, número de WhatsApp e perfil do Instagram.</li>
              <li><strong className="text-zinc-200">Especificações do Projeto:</strong> Descrição da ideia, local do corpo, dimensão aproximada em centímetros e lado corporal.</li>
              <li><strong className="text-zinc-200">Histórico Cutâneo:</strong> Condição da pele na região escolhida (pele lisa, cicatriz prévia, cobertura de tatuagem antiga ou reforma).</li>
              <li><strong className="text-zinc-200">Arquivos Digitais:</strong> Imagens de referência estética e fotografia da região corporal para estudo de proporção e anatomia.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-zinc-100 font-semibold text-sm sm:text-base border-b border-zinc-800/80 pb-1.5 font-sans">
              <Eye size={16} className="text-amber-400 shrink-0" />
              <h3 className="!font-sans font-semibold text-zinc-100 text-sm sm:text-base">2. Finalidade e Base Legal do Tratamento</h3>
            </div>
            <p className="text-zinc-300 text-xs sm:text-sm">
              Todos os dados fornecidos são tratados com fundamento no consentimento do titular e nos procedimentos preliminares 
              relacionados ao contrato de prestação de serviços artísticos (Art. 7º, V da LGPD):
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-xs sm:text-sm">
              <li>Elaboração de orçamento personalizado e cálculo de tempo estimado de sessão.</li>
              <li>Contato direto via WhatsApp ou e-mail para apresentação da proposta e esclarecimento de dúvidas técnicas.</li>
              <li>Garantia de biossegurança e adequação do desenho às particularidades da pele informada.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-zinc-100 font-semibold text-sm sm:text-base border-b border-zinc-800/80 pb-1.5 font-sans">
              <Lock size={16} className="text-amber-400 shrink-0" />
              <h3 className="!font-sans font-semibold text-zinc-100 text-sm sm:text-base">3. Segurança, Armazenamento e Não Compartilhamento</h3>
            </div>
            <p className="text-zinc-300 text-xs sm:text-sm">
              Adotamos medidas técnicas de segurança e criptografia no tráfego das informações. 
              <strong className="text-zinc-100"> Não comercializamos, não compartilhamos e não transferimos</strong> seus 
              dados pessoais ou fotos com terceiros para fins de marketing ou publicidade externa.
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm">
              O acesso aos arquivos e dados é restrito exclusivamente ao artista Felipe Garagem e à equipe responsável 
              pelo agendamento das sessões.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-zinc-100 font-semibold text-sm sm:text-base border-b border-zinc-800/80 pb-1.5 font-sans">
              <ShieldCheck size={16} className="text-amber-400 shrink-0" />
              <h3 className="!font-sans font-semibold text-zinc-100 text-sm sm:text-base">4. Cookies e Tecnologias de Medição</h3>
            </div>
            <p className="text-zinc-300 text-xs sm:text-sm">
              Nosso site utiliza cookies estritamente necessários para a operação do formulário e ferramentas analíticas 
              (como o Meta Pixel) com a única finalidade de medir a eficiência de campanhas de divulgação. O carregamento 
              desses rastreadores é condicionado à sua aceitação no banner de cookies.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-zinc-100 font-semibold text-sm sm:text-base border-b border-zinc-800/80 pb-1.5 font-sans">
              <FileText size={16} className="text-amber-400 shrink-0" />
              <h3 className="!font-sans font-semibold text-zinc-100 text-sm sm:text-base">5. Direitos do Titular (Art. 18 da LGPD)</h3>
            </div>
            <p className="text-zinc-300 text-xs sm:text-sm">
              A qualquer momento, você pode exercer seus direitos como titular de dados:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-xs sm:text-sm">
              <li>Confirmar a existência de tratamento e solicitar cópia dos dados cadastrados.</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
              <li>Solicitar a eliminação definitiva de seus dados e imagens de nossas bases.</li>
              <li>Revogar o consentimento previamente fornecido.</li>
            </ul>
            <p className="text-zinc-400 text-xs sm:text-sm pt-1">
              Para qualquer solicitação, entre em contato pelo canal oficial: <span className="text-zinc-100 font-mono">(11) 98971-9861</span>.
            </p>
          </section>

          <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-500 flex justify-between items-center">
            <span>Última atualização: Agosto de 2026</span>
            <span>Versão 1.2 — LGPD Compliant</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950 flex justify-end items-center gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-zinc-100 text-zinc-900 hover:bg-white transition-colors text-xs font-semibold uppercase tracking-wider font-sans"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
