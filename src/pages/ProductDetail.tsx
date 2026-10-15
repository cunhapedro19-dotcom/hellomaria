import { useState } from "react";
import { useStore } from "../store/AppContext";
import { categoryLabel, swatchFor } from "../config";
import { brl, discountPct, effectivePrice } from "../lib/format";
import { Link } from "../lib/router";
import { waLink, buildProductMessage } from "../lib/whatsapp";
import { Reveal } from "../components/Reveal";
import { SmartImg } from "../components/SmartImg";
import { ProductCard } from "../components/ProductCard";
import { cn } from "../utils/cn";
import {
  AlertIcon,
  ArrowRight,
  BagIcon,
  MinusIcon,
  PinIcon,
  PlusIcon,
  WhatsAppIcon,
} from "../components/Icons";

export function ProductDetail({ id }: { id: string }) {
  const { products, addToBag, config, toast } = useStore();
  const product = products.find((p) => p.id === id);

  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState<string | null>(
    product && product.sizes.length === 1 ? product.sizes[0] : null
  );
  const [color, setColor] = useState<string | null>(
    product && product.colors.length === 1 ? product.colors[0] : null
  );
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-28 text-center">
        <p className="font-display text-5xl font-medium text-ink">
          Peça não encontrada
        </p>
        <p className="mt-3 text-sm leading-relaxed text-cocoa">
          O produto que você procura pode ter saído da vitrine ou o link está
          incorreto. Que tal explorar o catálogo completo?
        </p>
        <Link
          to="/catalogo"
          className="btn mt-7 bg-coffee px-7 py-3.5 text-cream hover:bg-wine"
        >
          Voltar ao catálogo
        </Link>
      </main>
    );
  }

  const promo = product.promoPrice != null && product.promoPrice > 0;
  const price = effectivePrice(product);
  const idx = products.indexOf(product);
  const code = `AMR-${String(idx + 1).padStart(3, "0")}`;

  const sizeAvailable = (s: string) =>
    product.variations.some((v) => v.size === s && v.available);
  const colorAvailable = (c: string) =>
    product.variations.some((v) => v.color === c && v.available);
  const combo =
    size && color
      ? product.variations.find((v) => v.size === size && v.color === color)
      : undefined;
  const comboOut = Boolean(combo && !combo.available);

  const handleAdd = () => {
    if (!size) {
      toast("Selecione um tamanho para continuar.", "error");
      return;
    }
    if (!color) {
      toast("Selecione uma cor para continuar.", "error");
      return;
    }
    if (!combo || !combo.available) {
      toast("Essa combinação está esgotada. Escolha outra.", "error");
      return;
    }
    addToBag(product, size, color, qty);
  };

  const handleConsult = () => {
    const url = waLink(
      config.whatsappNumber,
      buildProductMessage(product, size, color, config.storeName)
    );
    window.open(url, "_blank", "noopener");
  };

  const related = products
    .filter((p) => p.id !== product.id)
    .sort(
      (a, b) =>
        Number(b.category === product.category) -
          Number(a.category === product.category) ||
        b.createdAt - a.createdAt
    )
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      {/* breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-cocoa" aria-label="Trilha de navegação">
        <Link to="/" className="transition-colors hover:text-wine">
          Início
        </Link>
        <span aria-hidden>/</span>
        <Link to="/catalogo" className="transition-colors hover:text-wine">
          Catálogo
        </Link>
        <span aria-hidden>/</span>
        <Link
          to={`/catalogo?cat=${product.category}`}
          className="transition-colors hover:text-wine"
        >
          {categoryLabel(product.category)}
        </Link>
        <span aria-hidden>/</span>
        <span className="normal-case tracking-normal text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* galeria */}
        <Reveal>
          <div className="relative overflow-hidden rounded-sm bg-sand">
            <SmartImg
              key={imgIdx}
              src={product.images[imgIdx] ?? product.images[0] ?? ""}
              alt={`${product.name} — foto ${imgIdx + 1}`}
              eager
              className="fade-in aspect-[3/4] w-full object-cover"
            />
            <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
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
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2.5">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImgIdx(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-pressed={imgIdx === i}
                  className={cn(
                    "w-20 overflow-hidden rounded-sm border-2 transition-all",
                    imgIdx === i
                      ? "border-wine"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <SmartImg
                    src={img}
                    alt=""
                    className="aspect-[3/4] w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </Reveal>

        {/* informações */}
        <Reveal delay={100}>
          <div>
            <p className="overline flex items-center gap-3">
              <span className="h-px w-8 bg-rose" aria-hidden />
              {categoryLabel(product.category)} · {code}
            </p>
            <h1 className="mt-3 font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {promo && (
                <span className="text-lg text-cocoa/70 line-through">
                  {brl(product.price)}
                </span>
              )}
              <span
                className={cn(
                  "font-display text-4xl font-semibold",
                  promo ? "text-wine" : "text-ink"
                )}
              >
                {brl(price)}
              </span>
              {promo && (
                <span className="bg-sand px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-cocoa">
                  Economize {brl(product.price - price)}
                </span>
              )}
            </div>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-cocoa">
              {product.description}
            </p>

            {/* tamanho */}
            <div className="mt-7">
              <div className="flex items-baseline justify-between">
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.22em] text-ink">
                  Tamanho{size ? `: ${size}` : ""}
                </h2>
                {size && (
                  <button
                    type="button"
                    onClick={() => setSize(null)}
                    className="text-[11px] uppercase tracking-[0.16em] text-cocoa underline-offset-2 hover:text-wine hover:underline"
                  >
                    limpar
                  </button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const disabled = !sizeAvailable(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={disabled}
                      onClick={() => setSize(s)}
                      aria-pressed={size === s}
                      title={disabled ? `Tamanho ${s} esgotado` : `Tamanho ${s}`}
                      className={cn(
                        "min-w-12 border px-3 py-2.5 text-sm font-medium transition-all",
                        size === s
                          ? "border-wine bg-wine text-cream"
                          : disabled
                            ? "cursor-not-allowed border-latte/60 text-cocoa/40 line-through"
                            : "border-latte bg-white/50 text-coffee hover:border-coffee"
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* cor */}
            <div className="mt-6">
              <div className="flex items-baseline justify-between">
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.22em] text-ink">
                  Cor{color ? `: ${color}` : ""}
                </h2>
                {color && (
                  <button
                    type="button"
                    onClick={() => setColor(null)}
                    className="text-[11px] uppercase tracking-[0.16em] text-cocoa underline-offset-2 hover:text-wine hover:underline"
                  >
                    limpar
                  </button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((c) => {
                  const disabled = !colorAvailable(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      disabled={disabled}
                      onClick={() => setColor(c)}
                      aria-pressed={color === c}
                      title={disabled ? `Cor ${c} esgotada` : `Cor ${c}`}
                      className={cn(
                        "flex items-center gap-2 border px-3.5 py-2.5 text-sm transition-all",
                        color === c
                          ? "border-wine bg-wine text-cream"
                          : disabled
                            ? "cursor-not-allowed border-latte/60 text-cocoa/40 line-through"
                            : "border-latte bg-white/50 text-coffee hover:border-coffee"
                      )}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-ink/15"
                        style={{ backgroundColor: swatchFor(c) }}
                        aria-hidden
                      />
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {comboOut && (
              <p className="fade-in mt-4 flex items-center gap-2 text-sm font-medium text-wine">
                <AlertIcon className="h-4.5 w-4.5" />
                Essa combinação está esgotada — escolha outro tamanho ou cor.
              </p>
            )}

            {/* quantidade + adicionar */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center justify-between border border-latte bg-white/50 sm:justify-start sm:gap-0">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-13 w-12 place-items-center text-coffee transition-colors hover:bg-sand"
                  aria-label="Diminuir quantidade"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-[15px] font-semibold text-ink">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(10, q + 1))}
                  disabled={qty >= 10}
                  className="grid h-13 w-12 place-items-center text-coffee transition-colors hover:bg-sand disabled:opacity-30"
                  aria-label="Aumentar quantidade"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className="btn flex-1 bg-coffee px-6 py-4 text-cream shadow-lg shadow-coffee/20 hover:bg-wine"
              >
                <BagIcon className="h-5 w-5" />
                Adicionar à sacola
              </button>
            </div>

            <button
              type="button"
              onClick={handleConsult}
              className="btn mt-3 w-full border border-wine/50 px-6 py-3.5 text-wine hover:bg-wine hover:text-cream"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Consultar pelo WhatsApp
            </button>

            {/* meta */}
            <ul className="mt-8 space-y-2.5 border-t border-latte pt-5 text-sm text-cocoa">
              <li className="flex items-center gap-2.5">
                <PinIcon className="h-4.5 w-4.5 text-rose" />
                Retirada na loja ou entrega — condições a combinar
              </li>
              <li className="flex items-center gap-2.5">
                <WhatsAppIcon className="h-4.5 w-4.5 text-rose" />
                Dúvidas de tamanho? Fale com a loja, respondemos rapidinho
              </li>
              <li className="flex items-center gap-2.5">
                <BagIcon className="h-4.5 w-4.5 text-rose" />
                Peça nova, conferida e pronta para envio
              </li>
            </ul>
          </div>
        </Reveal>
      </div>

      {/* relacionados */}
      {related.length > 0 && (
        <section className="mt-20">
          <Reveal className="flex items-end justify-between gap-4">
            <div>
              <p className="overline">Complete o look</p>
              <h2 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">
                Você também pode <em className="text-wine">gostar</em>
              </h2>
            </div>
            <Link
              to="/catalogo"
              className="group hidden items-center gap-2 text-[12px] font-medium uppercase tracking-[0.2em] text-coffee transition-colors hover:text-wine sm:inline-flex"
            >
              Catálogo
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <div className="mt-16 text-center">
        <Link
          to="/catalogo"
          className="btn border border-coffee/40 px-6 py-3.5 text-coffee hover:bg-coffee hover:text-cream"
        >
          Voltar para o catálogo
        </Link>
      </div>
    </main>
  );
}
