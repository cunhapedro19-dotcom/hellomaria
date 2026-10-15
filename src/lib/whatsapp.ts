import type { BagItem, Product } from "../types";
import { brl } from "./format";

export const onlyDigits = (s: string): string => s.replace(/\D/g, "");

/** Monta link wa.me com a mensagem codificada para URL */
export function waLink(number: string, text: string): string {
  return `https://wa.me/${onlyDigits(number)}?text=${encodeURIComponent(text)}`;
}

/** Mensagem de pedido completo, pronta para o cliente revisar e enviar */
export function buildOrderMessage(items: BagItem[], storeName: string): string {
  const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const lines = items.map((i, n) => {
    const line = i.unitPrice * i.quantity;
    const valor =
      i.quantity > 1
        ? `${brl(line)} (${i.quantity} × ${brl(i.unitPrice)})`
        : brl(line);
    return [
      `${n + 1}. ${i.name}`,
      `- Tamanho: ${i.size}`,
      `- Cor: ${i.color}`,
      `- Quantidade: ${i.quantity}`,
      `- Valor: ${valor}`,
    ].join("\n");
  });
  return [
    `Olá! Gostaria de fazer um pedido na ${storeName}.`,
    "",
    "*Meu pedido:*",
    lines.join("\n\n"),
    "",
    `*Total dos produtos: ${brl(total)}*`,
    "",
    "Gostaria de confirmar a disponibilidade e combinar a entrega ou retirada.",
  ].join("\n");
}

/** Mensagem de consulta sobre uma peça específica */
export function buildProductMessage(
  product: Product,
  size: string | null,
  color: string | null,
  storeName: string
): string {
  return [
    `Olá! Gostaria de saber mais sobre uma peça da ${storeName}.`,
    "",
    `*Peça:* ${product.name}`,
    `- Tamanho: ${size ?? "a definir"}`,
    `- Cor: ${color ?? "a definir"}`,
    `- Preço: ${brl(product.promoPrice ?? product.price)}`,
    "",
    "Pode me ajudar a confirmar a disponibilidade?",
  ].join("\n");
}

export function buildGeneralMessage(storeName: string): string {
  return `Olá! Vim pelo site da ${storeName} e gostaria de mais informações sobre as peças disponíveis.`;
}
