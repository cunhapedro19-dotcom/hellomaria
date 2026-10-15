import { useState } from "react";
import { useStore } from "../store/AppContext";
import { Link, useRoute } from "../lib/router";
import { buildGeneralMessage, waLink } from "../lib/whatsapp";
import { cn } from "../utils/cn";
import { BagIcon, MenuIcon, SparkIcon, WhatsAppIcon, XIcon } from "./Icons";

const MARQUEE = [
  "Seu estilo, do seu jeito",
  "Novidades toda semana",
  "Compra pelo WhatsApp",
  "Atendimento personalizado",
  "Retirada na loja e entrega a combinar",
];

const NAV = [
  { to: "/", label: "Início", match: (p: string) => p === "/" },
  {
    to: "/catalogo",
    label: "Catálogo",
    match: (p: string) => p === "/catalogo" || p.startsWith("/produto/"),
  },
  { to: "/catalogo?nov=1", label: "Novidades" },
  { to: "/catalogo?promo=1", label: "Promoções" },
];

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="Amora Boutique — início">
      <svg viewBox="0 0 32 32" className="h-8 w-8 transition-transform duration-500 group-hover:rotate-12" aria-hidden>
        <circle cx="12" cy="15" r="8" fill="#6e2b3b" />
        <circle cx="21" cy="15" r="8" fill="#c27b5c" opacity="0.9" />
        <circle cx="16.5" cy="22" r="7" fill="#4d392b" />
        <path d="M16 7 Q18 2.5 22 2" stroke="#7d6551" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-[26px] font-semibold tracking-tight text-ink">
          Amora
        </span>
        <span className="block text-[9px] font-medium uppercase tracking-[0.42em] text-cocoa">
          boutique
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const { bagCount, setBagOpen, config } = useStore();
  const { path, query } = useRoute();
  const [menuOpen, setMenuOpen] = useState(false);

  const waHref = waLink(config.whatsappNumber, buildGeneralMessage(config.storeName));
  const currentQuery = query.toString();

  return (
    <header className="relative z-40">
      {/* letreiro */}
      <div className="overflow-hidden bg-wine py-2 text-cream">
        <div className="animate-marquee flex w-max items-center">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {MARQUEE.map((item) => (
                <span
                  key={`${dup}-${item}`}
                  className="flex items-center gap-6 pr-6 text-[10px] font-medium uppercase tracking-[0.3em]"
                >
                  {item}
                  <SparkIcon className="h-3 w-3 text-rose" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* barra principal */}
      <div className="sticky top-0 border-b border-latte/70 bg-cream/92 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[74px]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="grid h-11 w-11 place-items-center text-ink transition-colors hover:text-wine lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
            <Logo />
          </div>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
            {NAV.map((item) => {
              const active =
                item.to === "/"
                  ? path === "/"
                  : item.to === "/catalogo"
                    ? (path === "/catalogo" && currentQuery === "") ||
                      path.startsWith("/produto/")
                    : path === "/catalogo" &&
                      currentQuery === item.to.split("?")[1];
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={cn(
                    "relative text-[12px] font-medium uppercase tracking-[0.22em] transition-colors",
                    active ? "text-ink" : "text-cocoa hover:text-ink"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-0 h-px w-full origin-left bg-wine transition-transform duration-300",
                      active ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="btn hidden border border-coffee/50 px-4 py-2.5 text-coffee hover:bg-coffee hover:text-cream md:inline-flex"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setBagOpen(true)}
              className="relative grid h-11 w-11 place-items-center text-ink transition-colors hover:text-wine"
              aria-label={`Abrir sacola (${bagCount} ${bagCount === 1 ? "item" : "itens"})`}
            >
              <BagIcon className="h-6 w-6" />
              {bagCount > 0 && (
                <span
                  key={bagCount}
                  className="pop-badge absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-wine px-1 text-[10px] font-semibold text-cream"
                >
                  {bagCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* menu mobile */}
        <div
          className={cn(
            "grid overflow-hidden border-latte/70 transition-all duration-400 lg:hidden",
            menuOpen ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]"
          )}
        >
          <div className="min-h-0">
            <nav className="flex flex-col px-4 py-3 sm:px-6" aria-label="Navegação mobile">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-latte/50 py-3.5 text-[13px] font-medium uppercase tracking-[0.22em] text-coffee last:border-0 hover:text-wine"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="py-3.5 text-[11px] uppercase tracking-[0.22em] text-cocoa/70 hover:text-wine"
              >
                Painel da loja (admin)
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
