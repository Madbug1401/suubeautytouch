// config.ts — fonte única de dados do negócio.
// Tudo o que for preço, duração, contacto ou categoria muda-se AQUI.

export const SITE = {
  nome: "Su Beauty Touch",
  url: "https://su-beauty-touch.web.app", // TODO: domínio final
  descricao:
    "Maquilhagem profissional para momentos únicos: Soft Glam, Glow Glam e Full Glam. Marque o seu atendimento online.",
  // TODO: número com indicativo, sem "+" nem espaços (ex.: "2389xxxxxx").
  whatsapp: "",
  // TODO: utilizador do Instagram sem "@".
  instagram: "",
  pagamento: {
    titular: "Susana Rocha Pereira",
    conta: "2812865110001",
    nib: "000200002812865110173",
  },
} as const;

export const MOEDA = "$"; // escudo cabo-verdiano

export type Servico = {
  id: CategoriaId;
  /** Valor guardado no Firestore (campo `servico`) — não alterar sem migrar dados. */
  nome: string;
  preco: number;
  /** Duração usada para calcular disponibilidade (min). */
  duracao: number;
  /** Texto de duração mostrado ao público. */
  duracaoTexto: string;
  emoji: string;
  resumo: string;
  descricao: string;
};

export const SERVICOS: Servico[] = [
  {
    id: "soft-glam", nome: "Soft Glam", preco: 2000, duracao: 60, duracaoTexto: "1h – 1h30", emoji: "💄",
    resumo: "Elegância natural para o dia a dia",
    descricao: "Ideal para quem prefere um visual mais discreto. Sombra de olhos básica. Cílios à parte.",
  },
  {
    id: "glow-glam", nome: "Glow Glam", preco: 2200, duracao: 90, duracaoTexto: "1h30 – 2h", emoji: "✨",
    resumo: "Brilho na medida certa",
    descricao: "Sombra com mais destaque. Ideal para eventos de dia ou noite. Cílios à parte.",
  },
  {
    id: "full-glam", nome: "Full Glam", preco: 2500, duracao: 120, duracaoTexto: "2h", emoji: "👑",
    resumo: "Impacto total para ocasiões especiais",
    descricao: "Maquiagem completa. Ideal para casamentos e sessões fotográficas. Inclui cílios postiços.",
  },
];

export type Cilios = { id: CategoriaId; nome: string; preco: number };

/** `nome` é o valor guardado no Firestore (campo `cilios`). */
export const CILIOS: Cilios[] = [
  { id: "cilios-natural", nome: "Simples / Natural", preco: 200 },
  { id: "cilios-volumoso", nome: "Cheio / Volumoso", preco: 300 },
];

export const CATEGORIAS = [
  { id: "soft-glam", nome: "Soft Glam" },
  { id: "glow-glam", nome: "Glow Glam" },
  { id: "full-glam", nome: "Full Glam" },
  { id: "cilios-natural", nome: "Cílios Natural" },
  { id: "cilios-volumoso", nome: "Cílios Volumoso" },
] as const;

export type CategoriaId = (typeof CATEGORIAS)[number]["id"];

/** Imagem local usada enquanto não houver imagem ativa no admin. */
export const IMAGEM_PADRAO: Record<CategoriaId, string> = {
  "soft-glam": "/img/soft-glam.jpeg",
  "glow-glam": "/img/glow-glam.jpeg",
  "full-glam": "/img/full-glam.jpeg",
  "cilios-natural": "/img/cilios.jpeg",
  "cilios-volumoso": "/img/cilios2.jpeg",
};

export const HORARIO = {
  inicio: "09:00",
  fim: "18:00", // último horário de início disponível
  intervalo: 30, // minutos
};

export const TAXA_MARCACAO = 500;
export const DURACAO_PADRAO = 60;

export const ESTADOS = {
  pendente: "Pendente",
  confirmado: "Confirmado",
} as const;
export type Estado = keyof typeof ESTADOS;
export const ESTADOS_ATIVOS: Estado[] = ["pendente", "confirmado"];

export const REGRAS = [
  "Apenas uma acompanhante mulher (sem homens ou crianças)",
  "Chegue no horário marcado ou no máximo 10 minutos antes",
  "Atrasos comprometem os próximos atendimentos",
  "Pontualidade é essencial",
];

// ---------- helpers ----------
export const formatPreco = (valor: number) => `${valor}${MOEDA}`;

export const duracaoDe = (nomeServico?: string | null) =>
  SERVICOS.find((s) => s.nome === nomeServico)?.duracao ?? DURACAO_PADRAO;

export const nomeCategoria = (id?: string | null) =>
  CATEGORIAS.find((c) => c.id === id)?.nome ?? id ?? "";

export function whatsappUrl(texto = ""): string | null {
  if (!SITE.whatsapp) return null;
  const q = texto ? `?text=${encodeURIComponent(texto)}` : "";
  return `https://wa.me/${SITE.whatsapp}${q}`;
}

export function instagramUrl(): string | null {
  return SITE.instagram ? `https://instagram.com/${SITE.instagram}` : null;
}
