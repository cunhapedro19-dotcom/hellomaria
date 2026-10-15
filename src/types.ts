export type Category =
  | "vestidos"
  | "blusas"
  | "calcas"
  | "conjuntos"
  | "saias"
  | "acessorios";

export interface Variation {
  size: string;
  color: string;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  /** Preço promocional (nulo = sem promoção) */
  promoPrice: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  /** Disponibilidade por combinação tamanho × cor */
  variations: Variation[];
  isNew: boolean;
  isFeatured: boolean;
  createdAt: number;
}

export interface BagItem {
  key: string;
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  size: string;
  color: string;
  quantity: number;
}

export interface StoreConfig {
  storeName: string;
  whatsappNumber: string;
  address: string;
  hours: string;
  email: string;
  instagram: string;
  facebook: string;
}

export type ToastKind = "success" | "error" | "info";

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}
