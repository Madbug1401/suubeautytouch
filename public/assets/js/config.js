// config.js — fonte única de dados do negócio.
// Tudo o que for preço, duração, contacto ou categoria muda-se AQUI.

export const SITE = {
  nome: "Su Beauty Touch",
  // TODO: número com indicativo e sem "+" nem espaços (ex.: "2389xxxxxx").
  whatsapp: "",
  // TODO: utilizador do Instagram sem "@".
  instagram: "",
};

export const MOEDA = "$"; // escudo cabo-verdiano

// `nome` é o valor guardado no Firestore (campo `servico`) — não alterar sem migrar dados.
export const SERVICOS = [
  { id: "soft-glam", nome: "Soft Glam", preco: 2000, duracao: 60 },
  { id: "glow-glam", nome: "Glow Glam", preco: 2200, duracao: 90 },
  { id: "full-glam", nome: "Full Glam", preco: 2500, duracao: 120 },
];

// `nome` é o valor guardado no Firestore (campo `cilios`).
export const CILIOS = [
  { id: "cilios-natural", nome: "Simples / Natural", preco: 200 },
  { id: "cilios-volumoso", nome: "Cheio / Volumoso", preco: 300 },
];

// Categorias de imagens do site e álbuns do portfólio (ids em kebab-case).
export const CATEGORIAS = [
  { id: "soft-glam", nome: "Soft Glam" },
  { id: "glow-glam", nome: "Glow Glam" },
  { id: "full-glam", nome: "Full Glam" },
  { id: "cilios-natural", nome: "Cílios Natural" },
  { id: "cilios-volumoso", nome: "Cílios Volumoso" },
];

export const HORARIO = {
  inicio: "09:00",
  fim: "18:00",      // último horário de início disponível
  intervalo: 30,     // minutos entre horários
};

export const TAXA_MARCACAO = 500;
export const DURACAO_PADRAO = 60;

export const ESTADOS = {
  pendente: "Pendente",
  confirmado: "Confirmado",
};

// ---------- helpers ----------
export const formatPreco = (valor) => `${valor}${MOEDA}`;

export const duracaoDe = (nomeServico) =>
  SERVICOS.find((s) => s.nome === nomeServico)?.duracao ?? DURACAO_PADRAO;

export const nomeCategoria = (id) =>
  CATEGORIAS.find((c) => c.id === id)?.nome ?? id;

export function whatsappUrl(texto = "") {
  if (!SITE.whatsapp) return null;
  const q = texto ? `?text=${encodeURIComponent(texto)}` : "";
  return `https://wa.me/${SITE.whatsapp}${q}`;
}

export function instagramUrl() {
  return SITE.instagram ? `https://instagram.com/${SITE.instagram}` : null;
}
