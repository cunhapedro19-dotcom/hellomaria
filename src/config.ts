import type { Category, StoreConfig } from "./types";

/* =====================================================================
   CONFIGURAÇÃO DA LOJA
   Troque o número abaixo pelo WhatsApp real da loja antes de publicar.
   Formato: código do país + DDD + número (somente dígitos).
   ===================================================================== */
export const WHATSAPP_NUMBER = "5521999999999"; // ← número fictício de demonstração

export const DEFAULT_STORE: StoreConfig = {
  storeName: "Amora Boutique",
  whatsappNumber: WHATSAPP_NUMBER,
  address: "Rua das Flores, 128 · Centro — São Paulo/SP",
  hours: "Seg a Sex, 10h às 19h · Sáb, 10h às 15h",
  email: "ola@amoraboutique.com.br",
  instagram: "@amoraboutique",
  facebook: "/amoraboutique",
};

export const CATEGORIES: { id: Category; label: string; plural: string }[] = [
  { id: "vestidos", label: "Vestidos", plural: "Vestidos" },
  { id: "blusas", label: "Blusas", plural: "Blusas" },
  { id: "calcas", label: "Calças", plural: "Calças" },
  { id: "conjuntos", label: "Conjuntos", plural: "Conjuntos" },
  { id: "saias", label: "Saias", plural: "Saias" },
  { id: "acessorios", label: "Acessórios", plural: "Acessórios" },
];

export const categoryLabel = (id: Category): string =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id;

export const SIZES = ["P", "M", "G", "GG", "XG", "Único"];

export const COLOR_SUGGESTIONS = [
  "Off-white",
  "Bege",
  "Café",
  "Vinho",
  "Rosa",
  "Preto",
];

/** Cor aproximada para as amostras (bolinhas) de cor da vitrine */
export const COLOR_SWATCH: Record<string, string> = {
  "Off-white": "#f1eadf",
  Bege: "#d8c3a5",
  Café: "#5c4030",
  Vinho: "#6e2b3b",
  Rosa: "#c98a7b",
  Preto: "#262019",
  Terracota: "#b96a4b",
};
export const swatchFor = (color: string): string =>
  COLOR_SWATCH[color] ?? "#c9b29b";

/* =====================================================================
   ACESSO DE DEMONSTRAÇÃO DO PAINEL
   Somente para teste local — NÃO é autenticação segura.
   Em produção, use login real, banco de dados e rotas protegidas.
   ===================================================================== */
export const ADMIN_USER = "admin";
export const ADMIN_PASS = "admin123";
