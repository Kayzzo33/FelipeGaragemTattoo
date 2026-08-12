export const pricingCatalog = {
  valorMinimo: 2500,
  ticketMedioRecente: 5500,
  condicoesPagamento: {
    aVista: '10% de desconto',
    parcelado: 'Em até 10x no cartão',
  },
  porRegiao: {
    'Antebraço Externo': 3000,
    'Braço Externo': 3800,
    'Fechamento de Braço Externo (ombro ao punho)': 5800,
    'Fechamento Interno de Braço': 5800,
    'Fechamento Total de Braço': 10800,
    'Canela': 3000,
    'Panturrilha': 3000,
    'Coxa Frontal': 4500,
    'Coxa Posterior': 4000,
    'Fechamento de Perna Frontal': 6800,
    'Fechamento de Perna Posterior': 6500,
    'Fechamento de Costas Parcial Superior': 8800,
    'Fechamento de 1/2 Costas - Central': 6000,
    'Fechamento de 1/2 Costas': 6800,
    'Fechamento de Costas Completo': 11800,
    // ATENÇÃO: os itens abaixo não tinham valor confirmado no catálogo enviado.
    // Marcar como "sob consulta" até o cliente confirmar:
    'Antebraço Interno': null, // sob consulta
    'Braço Interno': null, // sob consulta
    'Fechamento Total de Perna': null, // sob consulta
    'Costas Total': null, // sob consulta
    'Costas Parcial': null, // sob consulta
    'Peitoral Total': null, // sob consulta
    'Meio Peitoral': null, // sob consulta
    'Abdômen': null, // sob consulta
  } as Record<string, number | null>,
  observacoes: 'Valores para execução em Atibaia-SP. Todos os trabalhos podem ser parcelados. Projetos autorais desenvolvidos com base na história/temática do cliente.',
};

export const investmentBands = [
  'R$ 2.500 a R$ 4.000',
  'R$ 4.000 a R$ 6.000',
  'R$ 6.000 a R$ 8.000',
  'Acima de R$ 8.000',
];

export const bodyAreas = [
  'Antebraço Externo',
  'Antebraço Interno',
  'Braço Externo',
  'Braço Interno',
  'Fechamento Total de Braço',
  'Fechamento de Braço Externo',
  'Fechamento de Braço Interno',
  'Fechamento de Perna Frontal',
  'Fechamento de Perna Posterior',
  'Fechamento Total de Perna',
  'Costas Total',
  'Costas Parcial',
  'Coxa Frontal',
  'Posterior de Coxa',
  'Panturrilha',
  'Canela',
  'Peitoral Total',
  'Meio Peitoral',
  'Abdômen',
  'Outro',
];
