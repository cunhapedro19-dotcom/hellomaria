import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { BagItem, Product, StoreConfig, Toast, ToastKind } from "../types";
import { DEFAULT_STORE } from "../config";
import { seedProducts } from "../data/seed";
import { effectivePrice } from "../lib/format";

/*
  Persistência local (localStorage) — suficiente para a demonstração.
  Não há sincronização entre dispositivos nem segurança real:
  para produção, use um banco de dados + autenticação + imagens em servidor.
*/
const K_PRODUCTS = "amora:products:v1";
const K_CONFIG = "amora:config:v1";
const K_BAG = "amora:bag:v1";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* armazenamento indisponível — segue sem persistir */
  }
}

interface StoreCtx {
  products: Product[];
  config: StoreConfig;
  bag: BagItem[];
  bagOpen: boolean;
  bagCount: number;
  bagTotal: number;
  toasts: Toast[];
  setBagOpen: (v: boolean) => void;
  addToBag: (product: Product, size: string, color: string, qty?: number) => boolean;
  setBagQty: (key: string, qty: number) => void;
  removeFromBag: (key: string) => void;
  clearBag: () => void;
  saveProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  resetCatalog: () => void;
  saveConfig: (c: StoreConfig) => void;
  toast: (message: string, kind?: ToastKind) => void;
  dismissToast: (id: number) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = load<Product[] | null>(K_PRODUCTS, null);
    if (stored !== null && Array.isArray(stored)) return stored;
    const s = seedProducts();
    save(K_PRODUCTS, s);
    return s;
  });

  const [config, setConfig] = useState<StoreConfig>(() =>
    load<StoreConfig>(K_CONFIG, DEFAULT_STORE)
  );

  const [bag, setBag] = useState<BagItem[]>(() => {
    const stored = load<BagItem[]>(K_BAG, []);
    // mantém a sacola sempre sincronizada com o catálogo
    return stored.filter((item) => {
      const p = products.find((pp) => pp.id === item.productId);
      if (!p) return false;
      return p.variations.some(
        (v) => v.size === item.size && v.color === item.color && v.available
      );
    });
  });

  const [bagOpen, setBagOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  useEffect(() => save(K_PRODUCTS, products), [products]);
  useEffect(() => save(K_CONFIG, config), [config]);
  useEffect(() => save(K_BAG, bag), [bag]);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, kind: ToastKind = "success") => {
      const id = ++toastId.current;
      setToasts((t) => [...t.slice(-2), { id, kind, message }]);
      window.setTimeout(
        () => setToasts((t) => t.filter((x) => x.id !== id)),
        4200
      );
    },
    []
  );

  const addToBag = useCallback(
    (product: Product, size: string, color: string, qty = 1): boolean => {
      const variation = product.variations.find(
        (v) => v.size === size && v.color === color
      );
      if (!variation || !variation.available) {
        toast("Essa combinação está esgotada. Escolha outra variação.", "error");
        return false;
      }
      const key = `${product.id}__${size}__${color}`;
      setBag((prev) => {
        const existing = prev.find((i) => i.key === key);
        if (existing) {
          return prev.map((i) =>
            i.key === key ? { ...i, quantity: Math.min(10, i.quantity + qty) } : i
          );
        }
        return [
          ...prev,
          {
            key,
            productId: product.id,
            name: product.name,
            image: product.images[0] ?? "",
            unitPrice: effectivePrice(product),
            size,
            color,
            quantity: Math.min(10, qty),
          },
        ];
      });
      toast(`“${product.name}” adicionado à sacola.`);
      return true;
    },
    [toast]
  );

  const setBagQty = useCallback((key: string, qty: number) => {
    setBag((prev) =>
      prev
        .map((i) =>
          i.key === key ? { ...i, quantity: Math.max(0, Math.min(10, qty)) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeFromBag = useCallback((key: string) => {
    setBag((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearBag = useCallback(() => setBag([]), []);

  const saveProduct = useCallback((p: Product) => {
    setProducts((prev) =>
      prev.some((x) => x.id === p.id)
        ? prev.map((x) => (x.id === p.id ? p : x))
        : [p, ...prev]
    );
    // sincroniza a sacola: atualiza dados ou remove variações fora do ar
    setBag((prev) =>
      prev
        .filter(
          (i) =>
            i.productId !== p.id ||
            p.variations.some(
              (v) => v.size === i.size && v.color === i.color && v.available
            )
        )
        .map((i) =>
          i.productId === p.id
            ? {
                ...i,
                name: p.name,
                image: p.images[0] ?? i.image,
                unitPrice: effectivePrice(p),
              }
            : i
        )
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setBag((prev) => prev.filter((i) => i.productId !== id));
  }, []);

  const resetCatalog = useCallback(() => {
    setProducts(seedProducts());
  }, []);

  const saveConfig = useCallback((c: StoreConfig) => setConfig(c), []);

  const bagCount = useMemo(
    () => bag.reduce((s, i) => s + i.quantity, 0),
    [bag]
  );
  const bagTotal = useMemo(
    () => bag.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    [bag]
  );

  const value = useMemo<StoreCtx>(
    () => ({
      products,
      config,
      bag,
      bagOpen,
      bagCount,
      bagTotal,
      toasts,
      setBagOpen,
      addToBag,
      setBagQty,
      removeFromBag,
      clearBag,
      saveProduct,
      deleteProduct,
      resetCatalog,
      saveConfig,
      toast,
      dismissToast,
    }),
    [
      products,
      config,
      bag,
      bagOpen,
      bagCount,
      bagTotal,
      toasts,
      addToBag,
      setBagQty,
      removeFromBag,
      clearBag,
      saveProduct,
      deleteProduct,
      resetCatalog,
      saveConfig,
      toast,
      dismissToast,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore deve ser usado dentro de <AppProvider>");
  return ctx;
}
