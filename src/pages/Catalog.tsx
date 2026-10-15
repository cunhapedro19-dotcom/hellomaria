import { useMemo, useState } from "react";
import { useStore } from "../store/AppContext";
import type { Category, Product } from "../types";
import { CATEGORIES, SIZES, categoryLabel } from "../config";
import { effectivePrice } from "../lib/format";
import { ProductCard } from "../components/ProductCard";
import { Reveal } from "../components/Reveal";
import { cn } from "../utils/cn";
import {
  ChevronDown,
  ResetIcon,
  SearchIcon,
  SlidersIcon,
  XIcon,
} from "../components/Icons";

type SortKey = "recentes" | "menor" | "maior" | "novidades";

const RANGES = [
  { id: "all", label: "Todos os preços", min: 0, max: Infinity },
  { id: "0-80", label: "Até R$ 80", min: 0, max: 80 },
  { id: "80-130", label: "R$ 80 a R$ 130", min: 80, max: 130 },
  { id: "130-180", label: "R$ 130 a R$ 180", min: 130, max: 180 },
  { id: "180+", label: "Acima de R$ 180", min: 180, max: Infinity },
] as const;

type RangeId = (typeof RANGES)[number]["id"];

function applySort(list: Product[], sort: SortKey): Product[] {
  const copy = [...list];
  switch (sort) {
    case "menor":
      return copy.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    case "maior":
      return copy.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    case "novidades":
      return copy.sort(
        (a, b) => Number(b.isNew) - Number(a.isNew) || b.createdAt - a.createdAt
      );
    default:
      return copy.sort((a, b) => b.createdAt - a.createdAt);
  }
}

export function Catalog({ query }: { query: URLSearchParams }) {
  const { products } = useStore();

  const initialCat = (query.get("cat") ?? "all") as Category | "all";
  const validCat =
    initialCat === "all" || CATEGORIES.some((c) => c.id === initialCat)
      ? initialCat
      : "all";

  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<Category | "all">(validCat);
  const [sizes, setSizes] = useState<string[]>([]);
  const [range, setRange] = useState<RangeId>("all");
  const [onlyNew, setOnlyNew] = useState(query.get("nov") === "1");
  const [onlyPromo, setOnlyPromo] = useState(query.get("promo") === "1");
  const [sort, setSort] = useState<SortKey>("recentes");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeCount =
    (search ? 1 : 0) +
    (cat !== "all" ? 1 : 0) +
    (sizes.length > 0 ? 1 : 0) +
    (range !== "all" ? 1 : 0) +
    (onlyNew ? 1 : 0) +
    (onlyPromo ? 1 : 0);

  const clearAll = () => {
    setSearch("");
    setCat("all");
    setSizes([]);
    setRange("all");
    setOnlyNew(false);
    setOnlyPromo(false);
    setSort("recentes");
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const r = RANGES.find((x) => x.id === range) ?? RANGES[0];
    const list = products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (cat !== "all" && p.category !== cat) return false;
      const price = effectivePrice(p);
      if (price < r.min || price >= r.max) return false;
      if (sizes.length > 0 && !sizes.some((s) => p.sizes.includes(s)))
        return false;
      if (onlyNew && !p.isNew) return false;
      if (onlyPromo && !(p.promoPrice != null && p.promoPrice > 0)) return false;
      return true;
    });
    return applySort(list, sort);
  }, [products, search, cat, sizes, range, onlyNew, onlyPromo, sort]);

  const toggleSize = (s: string) =>
    setSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const countFor = (id: Category) =>
    products.filter((p) => p.category === id).length;

  const filters = (
    <div className="space-y-7">
      <div>
        <h3 className="overline">Categoria</h3>
        <div className="mt-3 space-y-1">
          <button
            type="button"
            onClick={() => setCat("all")}
            className={cn(
              "flex w-full items-center justify-between py-1.5 text-left text-sm transition-colors",
              cat === "all" ? "font-semibold text-wine" : "text-coffee hover:text-ink"
            )}
          >
            Todas
            <span className="text-xs text-cocoa/70">{products.length}</span>
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              className={cn(
                "flex w-full items-center justify-between py-1.5 text-left text-sm transition-colors",
                cat === c.id ? "font-semibold text-wine" : "text-coffee hover:text-ink"
              )}
            >
              {c.plural}
              <span className="text-xs text-cocoa/70">{countFor(c.id)}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="overline">Faixa de preço</h3>
        <div className="relative mt-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as RangeId)}
            className="field field-select appearance-none"
            aria-label="Filtrar por faixa de preço"
          >
            {RANGES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa" />
        </div>
      </div>

      <div>
        <h3 className="overline">Tamanho</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSize(s)}
              aria-pressed={sizes.includes(s)}
              className={cn(
                "min-w-11 border px-2.5 py-2 text-[13px] font-medium transition-all",
                sizes.includes(s)
                  ? "border-wine bg-wine text-cream"
                  : "border-latte bg-white/50 text-coffee hover:border-coffee"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-coffee">
          <input
            type="checkbox"
            checked={onlyNew}
            onChange={(e) => setOnlyNew(e.target.checked)}
            className="h-4 w-4 accent-wine"
          />
          Somente novidades
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-coffee">
          <input
            type="checkbox"
            checked={onlyPromo}
            onChange={(e) => setOnlyPromo(e.target.checked)}
            className="h-4 w-4 accent-wine"
          />
          Somente em promoção
        </label>
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.18em] text-wine transition-colors hover:text-winedeep"
        >
          <ResetIcon className="h-4 w-4" />
          Limpar filtros ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <Reveal>
        <p className="overline">Vitrine · {configLabel(cat)}</p>
        <h1 className="mt-2 font-display text-5xl font-medium text-ink sm:text-6xl">
          {cat === "all" ? "Catálogo" : <em className="text-wine">{categoryLabel(cat)}</em>}
        </h1>
        <p className="mt-3 text-sm text-cocoa">
          {filtered.length} de {products.length} peças · preços e disponibilidade
          ilustrativos
        </p>
      </Reveal>

      {/* toolbar */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-md">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-cocoa" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar peça pelo nome…"
            className="field field-search"
            aria-label="Buscar produto pelo nome"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cocoa hover:text-wine"
              aria-label="Limpar busca"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="btn border border-coffee/40 px-4 py-3 text-coffee hover:bg-coffee hover:text-cream lg:hidden"
            aria-expanded={filtersOpen}
          >
            <SlidersIcon className="h-4 w-4" />
            Filtros{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="field field-select appearance-none"
              aria-label="Ordenar produtos"
            >
              <option value="recentes">Ordenar: recentes</option>
              <option value="novidades">Ordenar: novidades</option>
              <option value="menor">Menor preço</option>
              <option value="maior">Maior preço</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa" />
          </div>
        </div>
      </div>

      {/* filtros mobile */}
      {filtersOpen && (
        <div className="fade-in mt-4 border border-latte bg-white/40 p-5 lg:hidden">
          {filters}
        </div>
      )}

      <div className="mt-8 lg:grid lg:grid-cols-[236px_1fr] lg:items-start lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24 border-r border-latte/70 pr-6">
            {filters}
          </div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="fade-in mt-14 flex flex-col items-center border border-dashed border-latte px-6 py-20 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-sand text-cocoa">
                <SearchIcon className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-display text-3xl font-medium text-ink">
                Nenhuma peça encontrada
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-cocoa">
                Não encontramos nada com esses critérios. Ajuste a busca ou
                limpe os filtros para ver a coleção completa.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="btn mt-6 bg-coffee px-6 py-3.5 text-cream hover:bg-wine"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i, 5) * 50}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}

          <p className="mt-14 border-t border-latte/60 pt-5 text-center text-[11px] leading-relaxed text-cocoa/70">
            Loja de demonstração — produtos, fotos, valores e disponibilidade
            são ilustrativos. O pedido é finalizado com a loja pelo WhatsApp.
          </p>
        </div>
      </div>
    </main>
  );
}

function configLabel(cat: Category | "all"): string {
  return cat === "all" ? "Todas as peças" : categoryLabel(cat);
}
