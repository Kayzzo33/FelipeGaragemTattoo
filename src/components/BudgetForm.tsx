import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { pricingCatalog, bodyAreas, investmentBands } from '../lib/pricingCatalog';
import { Loader2 } from 'lucide-react';

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

export function BudgetForm() {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // File states
  const [photoRegiao, setPhotoRegiao] = useState<File | null>(null);
  const [refImages, setRefImages] = useState<File[]>([]);

  // Watch fields for conditional logic
  const selectedLocal = watch('local');
  const selectedCondicaoPele = watch('condicaoPele');
  const selectedComoConheceu = watch('comoConheceu');

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('reference-images')
      .upload(fileName, file);
      
    if (error) throw error;
    
    const { data: publicUrlData } = supabase.storage
      .from('reference-images')
      .getPublicUrl(fileName);
      
    return publicUrlData.publicUrl;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      const imageUrls: string[] = [];
      
      if (photoRegiao) {
        const url = await uploadFile(photoRegiao);
        imageUrls.push(url);
      }
      
      for (const file of refImages) {
        const url = await uploadFile(file);
        imageUrls.push(url);
      }

      const payload = {
        ...data,
        imagens: imageUrls,
      };

      // Save to Supabase DB
      const { error: dbError } = await supabase
        .from('orcamentos')
        .insert([{
          ...payload,
          created_at: new Date().toISOString()
        }]);

      // Note: If 'orcamentos' table doesn't exist, this might fail. We should proceed with email anyway or handle it gracefully.
      if (dbError) {
        console.warn('Supabase insert failed, continuing to email:', dbError);
      }

      // Send Email via Express backend
      const res = await fetch('/api/send-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!resData.success) {
        throw new Error('Falha ao enviar email');
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Houve um erro ao enviar seu orçamento. Por favor, tente novamente ou entre em contato via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="contact" className="py-32 bg-black px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center border border-gold/20 p-12 md:p-24 rounded-sm">
          <h2 className="text-3xl md:text-5xl font-serif text-cream mb-6">Projeto Enviado</h2>
          <p className="text-cream/70 text-lg mb-12">Recebi sua ideia! Em até 5 dias úteis, retornarei com uma proposta. Se preferir, me chame no WhatsApp.</p>
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
            <p className="text-cream/50 text-sm font-light">As imagens ficam anexadas ao seu orçamento. Os formatos permitidos são JPG e PNG.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <label className="cursor-pointer group flex flex-col items-center justify-center text-center gap-4 py-12 px-6 border border-cream/20 hover:border-cream/50 transition-colors w-full rounded-none">
                <span className="text-cream text-sm uppercase tracking-widest group-hover:text-gold transition-colors">Foto da Região (Seu corpo)</span>
                <span className="text-cream/40 text-xs font-light">Toque para selecionar do dispositivo</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setPhotoRegiao(e.target.files?.[0] || null)}
                  className="hidden"
                />
                {photoRegiao && <span className="text-gold text-xs mt-2 truncate max-w-[200px]">{photoRegiao.name}</span>}
              </label>
              
              <label className="cursor-pointer group flex flex-col items-center justify-center text-center gap-4 py-12 px-6 border border-cream/20 hover:border-cream/50 transition-colors w-full rounded-none">
                <span className="text-cream text-sm uppercase tracking-widest group-hover:text-gold transition-colors">Imagens de Referência</span>
                <span className="text-cream/40 text-xs font-light">Toque para selecionar do dispositivo</span>
                <input 
                  type="file" 
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setRefImages(files);
                  }}
                  className="hidden"
                />
                {refImages.length > 0 && <span className="text-gold text-xs mt-2 truncate max-w-[200px]">{refImages.length} arquivo(s) selecionado(s)</span>}
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
              <label className="text-sm tracking-wide text-cream/70 uppercase block flex items-center justify-between">
                <span>Faixa de Investimento Estimada *</span>
              </label>
              <Controller
                control={control}
                name="investimento"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-3">
                    {investmentBands.map(opt => (
                      <SquareButton key={opt} label={opt} selected={field.value === opt} onClick={() => field.onChange(opt)} />
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
            <span className="text-cream/50 text-sm mt-6 block font-light">Retorno em até 5 dias úteis.</span>
          </div>
          
        </form>
      </div>

      <div className="hidden md:block absolute -bottom-10 -right-20 md:-right-40 pointer-events-none opacity-20 mix-blend-screen select-none">
        <img 
          src="https://drive.google.com/thumbnail?sz=w1000&id=15U2mMMojOj9etBjc4lMgbvjr0Mvv21ab" 
          alt="Texture" 
          className="w-[450px] md:w-[900px] object-cover invert scale-110 md:scale-125 origin-bottom-right" 
        />
      </div>
    </section>
  );
}
