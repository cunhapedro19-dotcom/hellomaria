import type { Product } from "../types";

export const brl = (n: number): string =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Preço vigente da peça (promocional quando existir) */
export const effectivePrice = (p: Pick<Product, "price" | "promoPrice">): number =>
  p.promoPrice != null && p.promoPrice > 0 ? p.promoPrice : p.price;

export const discountPct = (p: Pick<Product, "price" | "promoPrice">): number =>
  p.promoPrice != null && p.promoPrice > 0
    ? Math.round((1 - p.promoPrice / p.price) * 100)
    : 0;

/** Converte "129,90" (entrada brasileira) em número */
export const parsePrice = (value: string): number => {
  const clean = value.replace(/[R$\s]/g, "");
  const normalized = clean.includes(",")
    ? clean.replace(/\./g, "").replace(",", ".")
    : clean;
  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) ? n : NaN;
};
