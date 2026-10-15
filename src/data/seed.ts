import type { Category, Product, Variation } from "../types";

/**
 * Fotos de demonstração (Pexels — uso livre).
 * Em produção, hospede as fotos das peças na sua própria hospedagem.
 */
const px = (id: number, w = 800, h = 1067) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

const ago = (dias: number) => Date.now() - dias * 86_400_000;

const variants = (
  sizes: string[],
  colors: string[],
  esgotadas: [string, string][] = []
): Variation[] =>
  sizes.flatMap((size) =>
    colors.map((color) => ({
      size,
      color,
      available: !esgotadas.some(([s, c]) => s === size && c === color),
    }))
  );

/** Catálogo ilustrativo da Amora Boutique. Preços e estoques fictícios. */
export function seedProducts(): Product[] {
  return [
    {
      id: "vestido-midi-aurora",
      name: "Vestido Midi Aurora",
      description:
        "Fluido, com caimento leve do ombro à barra, o Aurora é aquele vestido que vai do escritório ao jantar sem esforço. Tecido de toque macio com forro na saia.",
      category: "vestidos",
      price: 129.9,
      promoPrice: null,
      images: [px(40169075), px(36701539)],
      sizes: ["P", "M", "G", "GG"],
      colors: ["Off-white", "Preto", "Vinho"],
      variations: variants(["P", "M", "G", "GG"], ["Off-white", "Preto", "Vinho"], [
        ["G", "Vinho"],
      ]),
      isNew: true,
      isFeatured: true,
      createdAt: ago(2),
    },
    {
      id: "vestido-longo-estrela",
      name: "Vestido Longo Estrela",
      description:
        "Para ocasiões especiais: modelagem fluida, alças finas e barra que desliza com o movimento. Combina com sandália de tiras e brincos minimalistas.",
      category: "vestidos",
      price: 149.9,
      promoPrice: 119.9,
      images: [px(36701530), px(36747242)],
      sizes: ["P", "M", "G"],
      colors: ["Off-white", "Café"],
      variations: variants(["P", "M", "G"], ["Off-white", "Café"], [
        ["G", "Café"],
      ]),
      isNew: false,
      isFeatured: true,
      createdAt: ago(9),
    },
    {
      id: "vestido-slip-marina",
      name: "Vestido Slip Marina",
      description:
        "O clássico slip vestido em versão contemporânea: decote leve, corte reto e comprimento midi. Use com salto ou com tênis para um ar casual.",
      category: "vestidos",
      price: 119.9,
      promoPrice: null,
      images: [px(13859647), px(17377058)],
      sizes: ["P", "M", "G", "GG"],
      colors: ["Preto", "Off-white"],
      variations: variants(["P", "M", "G", "GG"], ["Preto", "Off-white"]),
      isNew: false,
      isFeatured: false,
      createdAt: ago(14),
    },
    {
      id: "blusa-canelada-luna",
      name: "Blusa Canelada Luna",
      description:
        "Caneleira fina com elastano, gola careca e manga longa. O básico que resolve qualquer look — combine com saia, calça ou vestido.",
      category: "blusas",
      price: 59.9,
      promoPrice: null,
      images: [px(33402066), px(28302557)],
      sizes: ["P", "M", "G"],
      colors: ["Off-white", "Bege", "Café"],
      variations: variants(["P", "M", "G"], ["Off-white", "Bege", "Café"]),
      isNew: false,
      isFeatured: true,
      createdAt: ago(18),
    },
    {
      id: "camisa-linho-bella",
      name: "Camisa Linho Bella",
      description:
        "Em linho misto, respirável e de caimento amplo. Botões de madrepérola e punho ajustável: a camisa que funciona o ano inteiro.",
      category: "blusas",
      price: 99.9,
      promoPrice: null,
      images: [px(15577043), px(4945072)],
      sizes: ["P", "M", "G"],
      colors: ["Off-white", "Bege"],
      variations: variants(["P", "M", "G"], ["Off-white", "Bege"]),
      isNew: true,
      isFeatured: false,
      createdAt: ago(3),
    },
    {
      id: "blusa-cropped-vicky",
      name: "Blusa Cropped Vicky",
      description:
        "Corte cropped com decote em V e mangas levemente evasês. Peça versátil para montar composições de baixo para cima.",
      category: "blusas",
      price: 69.9,
      promoPrice: 54.9,
      images: [px(37167347), px(35251915)],
      sizes: ["P", "M", "G"],
      colors: ["Bege", "Vinho"],
      variations: variants(["P", "M", "G"], ["Bege", "Vinho"], [
        ["P", "Vinho"],
      ]),
      isNew: true,
      isFeatured: false,
      createdAt: ago(1),
    },
    {
      id: "calca-pantalona-serena",
      name: "Calça Pantalona Serena",
      description:
        "Alfaiataria de cintura alta e caimento reto que alonga a silhueta. Tecido com leve brilho, perfeito para o dia e para a noite.",
      category: "calcas",
      price: 109.9,
      promoPrice: null,
      images: [px(8485898), px(33821631)],
      sizes: ["P", "M", "G", "GG"],
      colors: ["Bege", "Café", "Off-white"],
      variations: variants(["P", "M", "G", "GG"], ["Bege", "Café", "Off-white"], [
        ["GG", "Off-white"],
      ]),
      isNew: false,
      isFeatured: true,
      createdAt: ago(21),
    },
    {
      id: "calca-widleg-duna",
      name: "Calça Wide Leg Duna",
      description:
        "A calça wide leg da estação: perna ampla, cós confortável e tecido que não amassa. Vai do look de trabalho ao passeio de fim de semana.",
      category: "calcas",
      price: 119.9,
      promoPrice: null,
      images: [px(33821631), px(12911886)],
      sizes: ["P", "M", "G"],
      colors: ["Off-white", "Bege"],
      variations: variants(["P", "M", "G"], ["Off-white", "Bege"]),
      isNew: true,
      isFeatured: false,
      createdAt: ago(4),
    },
    {
      id: "calca-reto-alva",
      name: "Calça Reto Alva",
      description:
        "Corte reto de cintura média, com bolsos reais e barra limpa. Conforto de moletom, acabamento de alfaiataria.",
      category: "calcas",
      price: 99.9,
      promoPrice: 84.9,
      images: [px(12911886), px(33359321)],
      sizes: ["M", "G", "GG"],
      colors: ["Café", "Preto"],
      variations: variants(["M", "G", "GG"], ["Café", "Preto"]),
      isNew: false,
      isFeatured: false,
      createdAt: ago(26),
    },
    {
      id: "conjunto-elegance",
      name: "Conjunto Elegance",
      description:
        "Blusa estruturada + saia midi na mesma trama: um conjunto que funciona junto ou separado. Estruturado na medida, para composições elegantes.",
      category: "conjuntos",
      price: 159.9,
      promoPrice: null,
      images: [px(37130828), px(19647046)],
      sizes: ["P", "M", "G"],
      colors: ["Off-white", "Bege"],
      variations: variants(["P", "M", "G"], ["Off-white", "Bege"], [
        ["G", "Bege"],
      ]),
      isNew: true,
      isFeatured: true,
      createdAt: ago(5),
    },
    {
      id: "conjunto-alfaiataria-prime",
      name: "Conjunto Alfaiataria Prime",
      description:
        "Camisa estruturada e calça de cintura alta com pregas frontais. Alfaiataria acessível para dias em que tudo precisa estar certo.",
      category: "conjuntos",
      price: 189.9,
      promoPrice: 149.9,
      images: [px(38023307), px(38023308)],
      sizes: ["P", "M", "G", "GG"],
      colors: ["Bege", "Café"],
      variations: variants(["P", "M", "G", "GG"], ["Bege", "Café"], [
        ["GG", "Café"],
      ]),
      isNew: false,
      isFeatured: true,
      createdAt: ago(11),
    },
    {
      id: "saia-midi-florenca",
      name: "Saia Midi Florença",
      description:
        "Gode com movimento e fenda sutil na barra. A saia que transforma qualquer blusa básica em produção de fim de semana.",
      category: "saias",
      price: 89.9,
      promoPrice: null,
      images: [px(15019951), px(16051526)],
      sizes: ["P", "M", "G", "GG"],
      colors: ["Bege", "Vinho", "Café"],
      variations: variants(["P", "M", "G", "GG"], ["Bege", "Vinho", "Café"], [
        ["P", "Vinho"],
      ]),
      isNew: false,
      isFeatured: true,
      createdAt: ago(8),
    },
    {
      id: "saia-plissada-milano",
      name: "Saia Plissada Milano",
      description:
        "Plissado permanente que mantém o formato mesmo na lavagem. Comprimento midi e cós de ajuste suave para conforto real.",
      category: "saias",
      price: 94.9,
      promoPrice: null,
      images: [px(27982326), px(17805851)],
      sizes: ["P", "M", "G"],
      colors: ["Off-white", "Rosa"],
      variations: variants(["P", "M", "G"], ["Off-white", "Rosa"]),
      isNew: true,
      isFeatured: false,
      createdAt: ago(6),
    },
    {
      id: "bolsa-tote-amora",
      name: "Bolsa Tote Amora",
      description:
        "Tote espaçosa em couro legítimo, com bolso interno e alça dupla. Cabe o dia inteiro: caderno, nécessaire e lanche.",
      category: "acessorios",
      price: 139.9,
      promoPrice: null,
      images: [px(6650014), px(35270330)],
      sizes: ["Único"],
      colors: ["Café", "Preto"],
      variations: variants(["Único"], ["Café", "Preto"]),
      isNew: false,
      isFeatured: true,
      createdAt: ago(16),
    },
    {
      id: "bolsa-minerva",
      name: "Bolsa Minerva",
      description:
        "Pequena e estruturada, com corrente dourada para usar na transversal. O detalhe que dá acabamento a looks simples.",
      category: "acessorios",
      price: 149.9,
      promoPrice: 124.9,
      images: [px(17792786), px(12643950)],
      sizes: ["Único"],
      colors: ["Bege", "Off-white"],
      variations: variants(["Único"], ["Bege", "Off-white"]),
      isNew: true,
      isFeatured: false,
      createdAt: ago(7),
    },
    {
      id: "lenco-seda-toscana",
      name: "Lenço Seda Toscana",
      description:
        "Lenço estampado em toque de seda. Use no pescoço, no cabelo ou na alça da bolsa — cada jeito muda o look.",
      category: "acessorios",
      price: 79.9,
      promoPrice: null,
      images: [px(26189506), px(26189507)],
      sizes: ["Único"],
      colors: ["Rosa", "Vinho", "Bege"],
      variations: variants(["Único"], ["Rosa", "Vinho", "Bege"], [
        ["Único", "Rosa"],
      ]),
      isNew: false,
      isFeatured: false,
      createdAt: ago(19),
    },
  ];
}

/* ---- imagens usadas na vitrine e no painel ---- */
export const HERO_IMG = px(36701539, 1000, 1400);

export const BANNER_IMG = px(6068964, 1600, 900);

export const CATEGORY_IMAGES: Record<Category, string> = {
  vestidos: px(36701530, 700, 875),
  blusas: px(33402066, 700, 875),
  calcas: px(8485898, 700, 875),
  conjuntos: px(37130828, 700, 875),
  saias: px(15019951, 700, 875),
  acessorios: px(10919291, 700, 875),
};

/** Fotos de exemplo disponíveis no seletor do painel */
export const LIBRARY_IMAGES: string[] = [
  36701539, 40169075, 36701530, 36747242, 33402066, 15577043, 37167347,
  8485898, 33821631, 37130828, 38023307, 15019951, 27982326, 6650014,
  17792786, 26189506, 13859647, 19647046,
].map((id) => px(id, 500, 667));
