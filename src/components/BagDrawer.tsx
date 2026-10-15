import { useEffect } from "react";
import { useStore } from "../store/AppContext";
import { brl } from "../lib/format";
import { buildOrderMessage, waLink } from "../lib/whatsapp";
import { navigate } from "../lib/router";
import { cn } from "../utils/cn";
import { SmartImg } from "./SmartImg";
import { BagIcon, MinusIcon, PlusIcon, TrashIcon, WhatsAppIcon, XIcon } from "./Icons";

export function BagDrawer() {
  const {
    bag,
    bagOpen,
    setBagOpen,
    bagTotal,
    bagCount,
    setBagQty,
    removeFromBag,
    config,
  } = useStore();

  useEffect(() => {
    if (!bagOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBagOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [bagOpen, setBagOpen]);

  const close = () => setBagOpen(false);

  const finalize = () => {
    if (bag.length === 0) return;
    const url = waLink(config.whatsappNumber, buildOrderMessage(bag, config.storeName));
    window.open(url, "_blank", "noopener");
  };

  return (
    <div
      className={cn("fixed inset-0 z-[70]", !bagOpen && "pointer-events-none")}
      aria-hidden={!bagOpen}
    >
      {/* fundo */}
      <div
        onClick={close}
        className={cn(
          "absolute inset-0 bg-ink/50 transition-opacity duration-500",
          bagOpen ? "opacity-100" : "opacity-0"
        )}
      />

      {/* painel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Sacola de compras"
        inert={!bagOpen}
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl",
          "transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
          bagOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <header className="flex items-center justify-between border-b border-latte px-5 py-4">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Sua sacola
            <span className="ml-2 font-sans text-xs font-medium tracking-[0.2em] text-cocoa">
              {bagCount} {bagCount === 1 ? "ITEM" : "ITENS"}
            </span>
          </h2>
          <button
            type="button"
            onClick={close}
            className="grid h-10 w-10 place-items-center text-cocoa transition-colors hover:text-wine"
            aria-label="Fechar sacola"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </header>

        {bag.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-sand text-cocoa">
              <BagIcon className="h-9 w-9" />
            </span>
            <div>
              <p className="font-display text-2xl text-ink">Sua sacola está vazia</p>
              <p className="mt-1.5 text-sm text-cocoa">
                Explore a coleção e escolha as peças que combinam com você.
              </p>
            </div>
            <button
              type="button"
              className="btn bg-coffee px-6 py-3.5 text-cream hover:bg-wine"
              onClick={() => {
                close();
                navigate("/catalogo");
              }}
            >
              Explorar coleção
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-latte/60 overflow-y-auto px-5">
              {bag.map((item) => (
                <li key={item.key} className="flex gap-4 py-4">
                  <SmartImg
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-[74px] shrink-0 rounded-sm object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-lg leading-tight text-ink">
                        {item.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromBag(item.key)}
                        className="grid h-8 w-8 shrink-0 place-items-center text-cocoa/60 transition-colors hover:text-wine"
                        aria-label={`Remover ${item.name}`}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-cocoa">
                      Tam. {item.size} · {item.color}
                    </p>
                    <p className="mt-1 text-xs text-cocoa">
                      {brl(item.unitPrice)} cada
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center border border-latte">
                        <button
                          type="button"
                          onClick={() => setBagQty(item.key, item.quantity - 1)}
                          className="grid h-9 w-9 place-items-center text-coffee transition-colors hover:bg-sand"
                          aria-label="Diminuir quantidade"
                        >
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-ink">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setBagQty(item.key, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                          className="grid h-9 w-9 place-items-center text-coffee transition-colors hover:bg-sand disabled:opacity-30"
                          aria-label="Aumentar quantidade"
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-[15px] font-medium text-wine">
                        {brl(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="space-y-4 border-t border-latte bg-cream px-5 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-cocoa">
                  Subtotal
                </span>
                <span className="font-display text-3xl font-semibold text-ink">
                  {brl(bagTotal)}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-cocoa">
                Sem pagamento online nesta demonstração. O pedido é enviado
                preenchido para o WhatsApp e a loja confirma disponibilidade,
                pagamento e entrega/retirada com você.
              </p>
              <button
                type="button"
                onClick={finalize}
                disabled={bag.length === 0}
                className="btn w-full bg-wine px-6 py-4 text-cream hover:bg-winedeep"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Finalizar pelo WhatsApp
              </button>
              <button
                type="button"
                onClick={close}
                className="btn w-full border border-coffee/40 px-6 py-3 text-coffee hover:bg-coffee hover:text-cream"
              >
                Continuar comprando
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
