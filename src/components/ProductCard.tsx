import type { MouseEvent } from "react";
import type { Product } from "../types";
import { useStore } from "../store/AppContext";
import { brl, discountPct, effectivePrice } from "../lib/format";
import { categoryLabel } from "../config";
import { Link, navigate } from "../lib/router";
import { cn } from "../utils/cn";
import { SmartImg } from "./SmartImg";
import { ArrowRight, BagIcon, PlusIcon } from "./Icons";

export function ProductCard({ product }: { product: Product }) {
  const { addToBag } = useStore();
  const promo = product.promoPrice != null && product.promoPrice > 0;
  const directAdd = product.sizes.length === 1 && product.colors.length === 1;

  const onQuickAdd = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (directAdd) {
      addToBag(product, product.sizes[0], product.colors[0]);
    } else {
      navigate(`/produto/${product.id}`);
    }
  };

  return (
    <div className="group relative">
      <Link to={`/produto/${product.id}`} className="block focus:outline-none">
        <div className="relative overflow-hidden rounded-sm bg-sand">
          <SmartImg
            src={product.images[0]}
            alt={product.name}
            className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {product.isNew && (
              <span className="bg-rose px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream">
                Novo
              </span>
            )}
            {promo && (
              <span className="bg-wine px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream">
                −{discountPct(product)}%
              </span>
            )}
          </div>
          <span className="absolute inset-x-3 bottom-3 hidden translate-y-2 bg-cream/95 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-ink opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100 md:block">
            Ver detalhes
          </span>
        </div>

        <div className="pt-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-cocoa">
                {categoryLabel(product.category)}
              </p>
              <h3 className="mt-1 truncate font-display text-[19px] font-medium leading-tight text-ink">
                {product.name}
              </h3>
            </div>
            <div className="shrink-0 pt-0.5 text-right">
              {promo && (
                <p className="text-xs text-cocoa/70 line-through">
                  {brl(product.price)}
                </p>
              )}
              <p
                className={cn(
                  "text-[15px]",
                  promo ? "font-semibold text-wine" : "font-medium text-ink"
                )}
              >
                {brl(effectivePrice(product))}
              </p>
            </div>
          </div>
          <span className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-cocoa transition-colors group-hover:text-wine">
            Ver detalhes
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>

      <button
        type="button"
        onClick={onQuickAdd}
        aria-label={
          directAdd
            ? `Adicionar ${product.name} à sacola`
            : `Escolher variações de ${product.name}`
        }
        title={directAdd ? "Adicionar à sacola" : "Escolher tamanho e cor"}
        className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-cream/95 text-coffee shadow-md transition-all duration-300 hover:scale-110 hover:bg-wine hover:text-cream"
      >
        {directAdd ? <PlusIcon className="h-5 w-5" /> : <BagIcon className="h-5 w-5" />}
      </button>
    </div>
  );
}
