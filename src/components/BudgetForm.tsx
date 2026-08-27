import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { pricingCatalog, bodyAreas, investmentBands } from '../lib/pricingCatalog';
import { trackMetaLead } from '../lib/metaPixel';
import { Loader2, UploadCloud, CheckCircle2, Image as ImageIcon, FileText } from 'lucide-react';
import { PricingTableModal } from './PricingTableModal';

type FormValues = {
  nome: string;
  instagram: string;
  whatsapp: string;
  ideia: string;
  local: string;
  localOutro?: string;
  lado: string;
  tamanho: string;
  condicaoPele: string;
  condicaoPeleOutro?: string;
  quando: string;
  investimento: string;
  amenizador: string;
  infosExtras?: string;
  comoConheceu: string;
  comoConheceuOutro?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

// Convert file to base64 for email attachment fallback
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });
}

export function BudgetForm() {
  const { register, handleSubmit, control, watch } = useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  
  // File states
  const [photoRegiao, setPhotoRegiao] = useState<File | null>(null);
  const [refImages, setRefImages] = useState<File[]>([]);

  // Watch fields for conditional logic
  const selectedLocal = watch('local');
  const selectedCondicaoPele = watch('condicaoPele');
  const selectedComoConheceu = watch('comoConheceu');

  const validateAndFilterFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type.toLowerCase()) && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
        alert(`O arquivo "${file.name}" não é uma imagem permitida. Use JPG, PNG ou WEBP.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`O arquivo "${file.name}" excede o tamanho máximo de 5MB.`);
        continue;
      }
      validFiles.push(file);
    }
    return validFiles;
  };

  const uploadFileToSupabase = async (file: File, index = 0): Promise<string> => {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${index}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('reference-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
      
    if (error) throw error;
    
    const { data: publicUrlData } = supabase.storage
      .from('reference-images')
      .getPublicUrl(fileName);
      
    return publicUrlData.publicUrl;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      // Track Meta Pixel Lead event upon click/submit
      trackMetaLead({
        nome: data.nome,
        local: data.local,
        investimento: data.investimento,
      });
      
      const imageUrls: string[] = [];
      const fallbackAttachments: Array<{ filename: string; content: string; contentType: string }> = [];
      
      const allSelectedFiles: File[] = [];
      if (photoRegiao) allSelectedFiles.push(photoRegiao);
      allSelectedFiles.push(...refImages);

      // Try uploading to Supabase Storage, with automatic Base64 fallback if storage fails
      for (let i = 0; i < allSelectedFiles.length; i++) {
        const file = allSelectedFiles[i];
        try {
          const url = await uploadFileToSupabase(file, i);
          imageUrls.push(url);
        } catch (storageErr) {
          console.warn(`Supabase storage upload failed for ${file.name}, using base64 email attachment fallback:`, storageErr);
          try {
            const base64Data = await fileToBase64(file);
            fallbackAttachments.push({
              filename: file.name,
              content: base64Data,
              contentType: file.type || 'image/jpeg',
            });
          } catch (base64Err) {
            console.error('Failed to convert file to base64 fallback:', base64Err);
          }
        }
      }

      const payload = {
        ...data,
        imagens: imageUrls,
        attachments: fallbackAttachments,
      };

      // Optional: attempt save to Supabase DB if table exists (graceful ignore if not)
      try {
        await supabase
          .from('orcamentos')
          .insert([{
            ...data,
            imagens: imageUrls,
            created_at: new Date().toISOString()
          }]);
      } catch (dbErr) {
        console.warn('Supabase DB insert skipped/failed (non-blocking):', dbErr);
      }

      // Send Email via Express backend (Resend API)
      try {
        await fetch('/api/send-budget', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (emailErr) {
        console.error('Email API call caught error (non-blocking for user):', emailErr);
      }

      // Build WhatsApp message
      const formattedWhatsappMsg = `Olá Felipe! Acabei de enviar minha solicitação de orçamento pelo site:
- *Nome:* ${data.nome}
- *Instagram:* ${data.instagram ? `@${data.instagram.replace(/^@/, '')}` : 'Não informado'}
- *WhatsApp:* ${data.whatsapp}
- *Ideia:* ${data.ideia}
- *Local:* ${data.local}${data.localOutro ? ` (${data.localOutro})` : ''} - ${data.lado}
- *Tamanho:* ${data.tamanho}
- *Condição da pele:* ${data.condicaoPele}${data.condicaoPeleOutro ? ` (${data.condicaoPeleOutro})` : ''}
- *Previsão:* ${data.quando}
- *Investimento:* ${data.investimento}
- *Amenizador 3D:* ${data.amenizador}
${data.infosExtras ? `- *Extras:* ${data.infosExtras}` : ''}`;

      const whatsappUrl = `https://wa.me/5511989719861?text=${encodeURIComponent(formattedWhatsappMsg)}`;

      // Non-blocking redirect to WhatsApp
      try {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      } catch (e) {
        console.warn('Popup blocked, will provide direct button on success screen.');
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      // Even on error, do not trap user: redirect to WhatsApp
      const fallbackMsg = `Olá Felipe! Tentei enviar meu orçamento pelo site:
- *Nome:* ${data.nome}
- *Ideia:* ${data.ideia}`;
      window.open(`https://wa.me/5511989719861?text=${encodeURIComponent(fallbackMsg)}`, '_blank', 'noopener,noreferrer');
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="contact" className="py-32 bg-black px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center border border-gold/20 p-12 md:p-24 rounded-sm">
          <h2 className="text-3xl md:text-5xl font-serif text-cream mb-6">Projeto Enviado</h2>
          <p className="text-cream/70 text-lg mb-12">Recebi sua ideia! Em até dois dias úteis, retornarei com uma proposta. Se preferir, me chame no WhatsApp.</p>
          <a href="https://wa.me/5511989719861" target="_blank" rel="noreferrer" className="inline-block text-black bg-gold px-8 py-4 rounded-full uppercase tracking-widest text-sm font-medium hover:bg-cream transition-colors">
            Falar no WhatsApp
          </a>
        </div>
      </section>
    );
  }

  const renderPriceBadge = (local: string) => {
    if (!local || local === 'Outro') return null;
    const price = pricingCatalog.porRegiao[local];
    if (price === undefined) return null;
    
    return (
      <span className="inline-block ml-4 text-gold/80 text-xs tracking-wider border border-gold/30 px-3 py-1 rounded-full whitespace-nowrap">
        {price === null ? 'Sob consulta após avaliação' : `A partir de R$ ${price.toLocaleString('pt-BR')}`}
      </span>
    );
  };

  const SquareButton: React.FC<{ label: string, selected: boolean, onClick: () => void }> = ({ label, selected, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-6 py-3 text-sm font-light tracking-wide transition-all rounded-none',
        selected 
          ? 'bg-cream text-black border border-cream' 
          : 'bg-transparent text-cream border border-cream/20 hover:border-cream/50'
      )}
    >
      {label}
    </button>
  );

  return (
    <section id="budget" className="py-24 md:py-32 bg-black px-6 md:px-12 relative overflow-hidden">
      <div id="contact" className="absolute -top-20" />
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-gold text-xs tracking-[0.2em] uppercase font-medium mb-4 block">NOVO PROJETO</span>
          <h2 className="text-4xl md:text-6xl font-serif text-cream mb-6">Solicite Seu Orçamento</h2>
          <p className="text-cream/70 text-lg font-light max-w-xl mx-auto">Conte sobre o que você imagina. Quanto mais detalhes, melhor! Assim consigo preparar uma proposta certeira para sua ideia.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
          
          {/* BLOCO 1 - Contato */}
          <div className="space-y-8">
            <h3 className="text-xl font-serif text-gold border-b border-gold/20 pb-4">01. Dados de Contato</h3>
            
            <div className="space-y-2">
              <label className="text-sm tracking-wide text-cream/70 uppercase">Nome Completo *</label>
              <input 
                {...register('nome', { required: true })}
                className="w-full bg-transparent border-b border-cream/30 py-3 text-cream focus:outline-none focus:border-gold transition-colors text-lg"
                placeholder="Seu nome"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm tracking-wide text-cream/70 uppercase">Instagram</label>
                <input 
                  {...register('instagram')}
                  className="w-full bg-transparent border-b border-cream/30 py-3 text-cream focus:outline-none focus:border-gold transition-colors text-lg"
                  placeholder="@seuusuario"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm tracking-wide text-cream/70 uppercase">WhatsApp *</label>
                <input 
                  {...register('whatsapp', { required: true })}
                  className="w-full bg-transparent border-b border-cream/30 py-3 text-cream focus:outline-none focus:border-gold transition-colors text-lg"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </div>

          {/* BLOCO 2 - Sobre a Tatuagem */}
          <div className="space-y-8">
            <h3 className="text-xl font-serif text-gold border-b border-gold/20 pb-4">02. Sobre a Tatuagem</h3>
            
            <div className="space-y-2">
              <label className="text-sm tracking-wide text-cream/70 uppercase block mb-4">O que você quer tatuar? *</label>
              <textarea 
                {...register('ideia', { required: true })}
                className="w-full bg-transparent border-b border-cream/30 py-3 text-cream focus:outline-none focus:border-gold transition-colors min-h-[60px] rounded-none resize-y text-lg"
                placeholder="Descreva detalhadamente sua ideia..."
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm tracking-wide text-cream/70 uppercase block flex items-center">
                Local da Tatuagem *
                {renderPriceBadge(selectedLocal)}
              </label>
              <Controller
                control={control}
                name="local"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-3">
                    {bodyAreas.map(area => (
                      <SquareButton 
                        key={area}
                        label={area}
                        selected={field.value === area}
                        onClick={() => field.onChange(area)}
                      />
                    ))}
                  </div>
                )}
              />
              {selectedLocal === 'Outro' && (
                <input 
                  {...register('localOutro', { required: selectedLocal === 'Outro' })}
                  className="w-full bg-transparent border-b border-cream/30 py-3 text-cream focus:outline-none focus:border-gold mt-4"
                  placeholder="Especifique o local"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-4">
                <label className="text-sm tracking-wide text-cream/70 uppercase block">Lado do Corpo *</label>
                <Controller
                  control={control}
                  name="lado"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-3">
                      {['Direito', 'Esquerdo', 'Ambos'].map(opt => (
                        <SquareButton key={opt} label={opt} selected={field.value === opt} onClick={() => field.onChange(opt)} />
                      ))}
                    </div>
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm tracking-wide text-cream/70 uppercase">Tamanho aproximado (cm) *</label>
                <input 
                  {...register('tamanho', { required: true })}
                  className="w-full bg-transparent border-b border-cream/30 py-3 text-cream focus:outline-none focus:border-gold text-lg"
                  placeholder="Ex: 15cm"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-sm tracking-wide text-cream/70 uppercase block">Condição da Pele *</label>
              <Controller
                control={control}
                name="condicaoPele"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-3">
                    {['Pele sem tatuagem', 'Pele sem tatuagem, mas com cicatriz', 'Cobertura de tatuagem', 'Reforma de tatuagem', 'Outro'].map(opt => (
                      <SquareButton key={opt} label={opt} selected={field.value === opt} onClick={() => field.onChange(opt)} />
                    ))}
                  </div>
                )}
              />
              {selectedCondicaoPele === 'Outro' && (
                <input 
                  {...register('condicaoPeleOutro', { required: selectedCondicaoPele === 'Outro' })}
                  className="w-full bg-transparent border-b border-cream/30 py-3 text-cream focus:outline-none focus:border-gold mt-4"
                  placeholder="Especifique a condição"
                />
              )}
            </div>
          </div>

          {/* BLOCO 3 - Referências */}
          <div className="space-y-8">
            <h3 className="text-xl font-serif text-gold border-b border-gold/20 pb-4">03. Referências Visuais</h3>
            <p className="text-cream/50 text-sm font-light">As imagens ficam anexadas ao seu orçamento. Os formatos permitidos são JPG, PNG e WEBP (máx. 5MB).</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Foto da Região */}
              <label className="cursor-pointer group relative flex flex-col items-center justify-center text-center gap-4 p-8 sm:p-10 bg-zinc-900/90 hover:bg-zinc-800/90 border border-gold/40 hover:border-gold transition-all duration-300 rounded-lg shadow-xl overflow-hidden">
                <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold group-hover:scale-110 group-hover:bg-gold group-hover:text-black transition-all duration-300 shadow-inner">
                  {photoRegiao ? <CheckCircle2 size={26} className="text-emerald-400 group-hover:text-black" /> : <UploadCloud size={26} />}
                </div>
                
                <div className="space-y-1 z-10">
                  <span className="text-cream text-sm font-semibold uppercase tracking-widest group-hover:text-gold transition-colors block">
                    Foto da Região (Seu corpo)
                  </span>
                  <span className="text-zinc-400 text-xs font-light block">
                    {photoRegiao ? 'Arquivo pronto para envio' : 'Clique ou toque para carregar foto do local'}
                  </span>
                </div>

                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const fileList = e.target.files;
                    const files: File[] = fileList ? Array.from(fileList) : [];
                    const validated = validateAndFilterFiles(files);
                    setPhotoRegiao(validated[0] || null);
                  }}
                  className="hidden"
                />

                {photoRegiao && (
                  <div className="flex items-center gap-2 bg-black/60 border border-gold/30 px-3 py-1.5 rounded text-xs text-gold font-medium mt-2 max-w-full">
                    <ImageIcon size={14} className="shrink-0" />
                    <span className="truncate max-w-[220px]">{photoRegiao.name}</span>
                  </div>
                )}
              </label>
              
              {/* Imagens de Referência */}
              <label className="cursor-pointer group relative flex flex-col items-center justify-center text-center gap-4 p-8 sm:p-10 bg-zinc-900/90 hover:bg-zinc-800/90 border border-gold/40 hover:border-gold transition-all duration-300 rounded-lg shadow-xl overflow-hidden">
                <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold group-hover:scale-110 group-hover:bg-gold group-hover:text-black transition-all duration-300 shadow-inner">
                  {refImages.length > 0 ? <CheckCircle2 size={26} className="text-emerald-400 group-hover:text-black" /> : <UploadCloud size={26} />}
                </div>

                <div className="space-y-1 z-10">
                  <span className="text-cream text-sm font-semibold uppercase tracking-widest group-hover:text-gold transition-colors block">
                    Imagens de Referência
                  </span>
                  <span className="text-zinc-400 text-xs font-light block">
                    {refImages.length > 0 ? `${refImages.length} referência(s) selecionada(s)` : 'Clique ou toque para carregar imagens de inspiração'}
                  </span>
                </div>

                <input 
                  type="file" 
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const fileList = e.target.files;
                    const files: File[] = fileList ? Array.from(fileList) : [];
                    const validated = validateAndFilterFiles(files);
                    setRefImages(validated);
                  }}
                  className="hidden"
                />

                {refImages.length > 0 && (
                  <div className="flex items-center gap-2 bg-black/60 border border-gold/30 px-3 py-1.5 rounded text-xs text-gold font-medium mt-2 max-w-full">
                    <ImageIcon size={14} className="shrink-0" />
                    <span>{refImages.length} arquivo(s) selecionado(s)</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* BLOCO 4 - Planejamento */}
          <div className="space-y-8">
            <h3 className="text-xl font-serif text-gold border-b border-gold/20 pb-4">04. Planejamento</h3>
            
            <div className="space-y-4">
              <label className="text-sm tracking-wide text-cream/70 uppercase block">Quando pretende fazer? *</label>
              <Controller
                control={control}
                name="quando"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-3">
                    {['O quanto antes', 'Em até 30 dias', 'Em até 3 meses', 'Em até 6 meses', 'Ainda estou planejando'].map(opt => (
                      <SquareButton key={opt} label={opt} selected={field.value === opt} onClick={() => field.onChange(opt)} />
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <label className="text-sm tracking-wide text-cream/70 uppercase block">
                  Qual faixa de investimento imagina para esse projeto? *
                </label>
                <button
                  type="button"
                  onClick={() => setIsPricingModalOpen(true)}
                  className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 border border-gold/40 hover:border-gold bg-gold/10 hover:bg-gold text-gold hover:text-black rounded text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-sm"
                >
                  <FileText size={14} />
                  <span>Tabela de Valores</span>
                </button>
              </div>

              <Controller
                control={control}
                name="investimento"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {investmentBands.map(opt => (
                      <SquareButton 
                        key={opt} 
                        label={opt} 
                        selected={field.value === opt} 
                        onClick={() => field.onChange(opt)} 
                      />
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-sm tracking-wide text-cream/70 uppercase block">Deseja utilizar o Amenizador 3D? (Reduz até 80% da dor) *</label>
              <Controller
                control={control}
                name="amenizador"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-3">
                    {['Sim', 'Não', 'Quero mais informações'].map(opt => (
                      <SquareButton key={opt} label={opt} selected={field.value === opt} onClick={() => field.onChange(opt)} />
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-sm tracking-wide text-cream/70 uppercase block">Como conheceu meu trabalho? *</label>
              <Controller
                control={control}
                name="comoConheceu"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-3">
                    {['Instagram', 'TikTok', 'Indicação', 'Outro'].map(opt => (
                      <SquareButton key={opt} label={opt} selected={field.value === opt} onClick={() => field.onChange(opt)} />
                    ))}
                  </div>
                )}
              />
              {selectedComoConheceu === 'Outro' && (
                <input 
                  {...register('comoConheceuOutro', { required: selectedComoConheceu === 'Outro' })}
                  className="w-full bg-transparent border-b border-cream/30 py-3 text-cream focus:outline-none focus:border-gold mt-4"
                  placeholder="Por onde?"
                />
              )}
            </div>

            <div className="space-y-2 pt-4">
              <label className="text-sm tracking-wide text-cream/70 uppercase block mb-4">Informações Extras (Opcional)</label>
              <textarea 
                {...register('infosExtras')}
                className="w-full bg-transparent border-b border-cream/30 py-3 text-cream focus:outline-none focus:border-gold transition-colors min-h-[60px] rounded-none resize-y text-lg"
                placeholder="Conte a história por trás dessa ideia..."
              />
            </div>
          </div>

          <div className="pt-12 border-t border-cream/10 text-center flex flex-col items-center">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="text-xl md:text-2xl font-serif text-cream hover:text-gold transition-colors border-b border-cream hover:border-gold pb-1 flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>Enviando... <Loader2 className="animate-spin" size={24} /></>
              ) : (
                <>ENVIAR PROJETO →</>
              )}
            </button>
            <span className="text-cream/50 text-sm mt-6 block font-light">Retorno em até dois dias úteis.</span>
          </div>
          
        </form>
      </div>

      {/* Pricing Table Details Modal */}
      <PricingTableModal 
        isOpen={isPricingModalOpen} 
        onClose={() => setIsPricingModalOpen(false)} 
      />
    </section>
  );
}
