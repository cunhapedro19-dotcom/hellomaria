import { Link } from "../lib/router";
import { useStore } from "../store/AppContext";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PinIcon,
  WhatsAppIcon,
} from "./Icons";

export function Footer() {
  const { config } = useStore();

  const socials = [
    {
      label: `Instagram ${config.instagram}`,
      href: `https://instagram.com/${config.instagram.replace("@", "")}`,
      icon: <InstagramIcon className="h-4.5 w-4.5" />,
    },
    {
      label: `Facebook ${config.facebook}`,
      href: `https://facebook.com${config.facebook.startsWith("/") ? "" : "/"}${config.facebook}`,
      icon: <FacebookIcon className="h-4.5 w-4.5" />,
    },
  ];

  return (
    <footer className="bg-ink text-cream/75">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-display text-4xl font-semibold tracking-tight text-cream">
            Amora
            <span className="ml-2 align-middle text-[10px] font-sans font-medium uppercase tracking-[0.42em] text-rose">
              boutique
            </span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Moda feminina acessível, elegante e versátil. Peças escolhidas a
            dedo para a rotina — e para os dias que pedem um pouco mais de
            charme.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-cream/25 text-cream/80 transition-all hover:border-rose hover:bg-rose hover:text-ink"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="overline overline-cream">Navegação</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              { to: "/", label: "Início" },
              { to: "/catalogo", label: "Catálogo" },
              { to: "/catalogo?nov=1", label: "Novidades" },
              { to: "/catalogo?promo=1", label: "Promoções" },
              { to: "/admin", label: "Painel da loja" },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="transition-colors hover:text-rose">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="overline overline-cream">Contato</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 transition-colors hover:text-rose"
              >
                <WhatsAppIcon className="h-4 w-4" />
                +{config.whatsappNumber}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MailIcon className="h-4 w-4" />
              {config.email}
            </li>
            <li className="flex items-start gap-2.5">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0" />
              {config.hours}
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="overline overline-cream">Loja</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0" />
              {config.address}
            </li>
            <li className="text-[13px] leading-relaxed text-cream/50">
              A entrega e a forma de pagamento são combinadas diretamente com a
              loja pelo WhatsApp.
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-[11px] tracking-wide text-cream/40 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {config.storeName} — demonstração
            comercial. Produtos, preços e disponibilidade são ilustrativos.
          </p>
          <p>Fotos: Pexels · Dados salvos neste navegador (localStorage)</p>
        </div>
      </div>
    </footer>
  );
}
