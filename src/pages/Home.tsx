import { useStore } from "../store/AppContext";
import { CATEGORIES } from "../config";
import { BANNER_IMG, CATEGORY_IMAGES, HERO_IMG } from "../data/seed";
import { ProductCard } from "../components/ProductCard";
import { Reveal } from "../components/Reveal";
import { SmartImg } from "../components/SmartImg";
import { Link } from "../lib/router";
import { waLink, buildGeneralMessage } from "../lib/whatsapp";
import {
  ArrowRight,
  HeartChatIcon,
  PinIcon,
  SparkIcon,
  WhatsAppIcon,
} from "../components/Icons";

const BENEFITS = [
  {
    n: "01",
    icon: HeartChatIcon,
    title: "Atendimento personalizado",
    text: "Você fala com gente de verdade: dúvidas de tamanho, tecido e combinação respondidas com calma, sem robô e sem fila.",
  },
  {
    n: "02",
    icon: WhatsAppIcon,
    title: "Compra pelo WhatsApp",
    text: "Monte a sacola no site e envie o pedido já preenchido. A loja confirma, combina o pagamento e acompanha até a entrega.",
  },
  {
    n: "03",
    icon: PinIcon,
    title: "Entrega ou retirada",
    text: "As opções de entrega e a retirada na loja são combinadas diretamente com a Amora — no seu prazo e no seu bairro.",
  },
];

const QUOTES = [
  {
    text: "Atendimento impecável: me ajudaram a escolher o tamanho do vestido pelo WhatsApp e chegou no dia combinado.",
    name: "Camila R.",
    tag: "Cliente · São Paulo",
  },
  {
    text: "O Conjunto Elegance virou meu uniforme de trabalho. Tecido bom, caimento impecável, preço justo.",
    name: "Fernanda L.",
    tag: "Cliente · Instagram",
  },
  {
    text: "Pedi pelo site, combinei a retirada na loja e ainda saí com o lenço que me sugeriram. Experiência de boutique de verdade.",
    name: "Juliana M.",
    tag: "Cliente · São Paulo",
  },
];

export function Home() {
  const { products, config } = useStore();

  const newOnes = products
    .filter((p) => p.isNew)
    .sort((a, b) => b.createdAt - a.createdAt);
  const featured = products.filter((p) => p.isFeatured);

  const countByCategory = (id: string) =>
    products.filter((p) => p.category === id).length;

  return (
    <main id="inicio">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-rose/15 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-8 lg:pb-24 lg:pt-16">
          <div className="relative z-10 lg:col-span-5">
            <Reveal>
              <p className="overline flex items-center gap-3">
                <span className="h-px w-10 bg-rose" aria-hidden />
                Coleção Inverno · {config.storeName}
              </p>
              <h1 className="mt-5 font-display text-[54px] font-medium leading-[0.95] tracking-tight text-ink sm:text-7xl xl:text-[84px]">
                Seu estilo,
                <br />
                <em className="text-wine">do seu jeito.</em>
              </h1>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cocoa">
                Moda feminina acessível, elegante e versátil. Peças escolhidas a
                dedo para a rotina — e para os dias que pedem um pouco mais de
                charme.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link
                  to="/catalogo"
                  className="btn bg-coffee px-7 py-4 text-cream shadow-lg shadow-coffee/20 hover:bg-wine"
                >
                  Explorar coleção
                </Link>
                <Link
                  to="/catalogo?nov=1"
                  className="group inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.2em] text-coffee transition-colors hover:text-wine"
                >
                  Ver novidades
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
              <dl className="mt-11 flex divide-x divide-latte border-t border-latte pt-6">
                <div className="pr-6">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-cocoa">
                    Vitrine
                  </dt>
                  <dd className="mt-1 font-display text-3xl font-semibold text-ink">
                    {products.length}
                    <span className="text-rose">+</span>
                  </dd>
                </div>
                <div className="px-6">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-cocoa">
                    Categorias
                  </dt>
                  <dd className="mt-1 font-display text-3xl font-semibold text-ink">
                    {CATEGORIES.length}
                  </dd>
                </div>
                <div className="pl-6">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-cocoa">
                    Novidades
                  </dt>
                  <dd className="mt-1 font-display text-3xl font-semibold text-ink">
                    semanais
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <div className="relative lg:col-span-7">
            <Reveal delay={140}>
              <div className="relative mx-auto max-w-[560px] lg:ml-auto">
                <div
                  className="absolute -inset-0 translate-x-4 translate-y-4 rounded-sm border border-rose/50"
                  aria-hidden
                />
                <div className="relative overflow-hidden rounded-sm">
                  <SmartImg
                    src={HERO_IMG}
                    alt="Modelo vestindo peça da coleção Amora Boutique"
                    eager
                    className="animate-kenburns h-[440px] w-full object-cover sm:h-[540px] lg:h-[640px]"
                  />
                </div>
                <Link
                  to="/catalogo?promo=1"
                  className="animate-floaty absolute -left-3 bottom-8 block bg-cream p-4 shadow-xl sm:-left-8"
                >
                  <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-rose">
                    Campanha
                  </p>
                  <p className="mt-1 font-display text-[22px] font-semibold leading-tight text-ink">
                    Alfaiataria
                    <br />
                    <em className="text-wine">até 25% off</em>
                  </p>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIAS ============ */}
      <section className="border-y border-latte/60 bg-sand/45">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <Reveal className="flex items-end justify-between gap-4">
            <div>
              <p className="overline">Explore a loja</p>
              <h2 className="mt-2 font-display text-4xl font-medium text-ink sm:text-5xl">
                Navegue por <em className="text-wine">categoria</em>
              </h2>
            </div>
            <Link
              to="/catalogo"
              className="btn hidden border border-coffee/40 px-5 py-3 text-coffee hover:bg-coffee hover:text-cream sm:inline-flex"
            >
              Ver tudo
            </Link>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.id} delay={i * 60}>
                <Link
                  to={`/catalogo?cat=${c.id}`}
                  className="group relative block overflow-hidden rounded-sm"
                >
                  <SmartImg
                    src={CATEGORY_IMAGES[c.id]}
                    alt={`Categoria ${c.plural}`}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3.5">
                    <p className="font-display text-[21px] font-medium leading-tight text-cream">
                      {c.plural}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-cream/70">
                      {countByCategory(c.id)} peças
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ NOVIDADES ============ */}
      {newOnes.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="overline">01 — Acabou de chegar</p>
              <h2 className="mt-2 font-display text-4xl font-medium text-ink sm:text-5xl">
                Novidades
              </h2>
            </div>
            <Link
              to="/catalogo?nov=1"
              className="btn border border-coffee/40 px-5 py-3 text-coffee hover:bg-coffee hover:text-cream"
            >
              Ver todas
            </Link>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {newOnes.slice(0, 4).map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ============ BANNER PROMOCIONAL ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <SmartImg
            src={BANNER_IMG}
            alt="Interior da loja com clientes escolhendo peças"
            className="animate-kenburns h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-winedeep/75" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <Reveal className="max-w-xl">
            <p className="overline overline-rose">Campanha da estação</p>
            <h2 className="mt-3 font-display text-4xl font-medium leading-tight text-cream sm:text-5xl">
              Coleção Alfaiataria, <em className="text-rose">até 25% off</em>
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-cream/80">
              Conjuntos e calças selecionados com desconto por tempo limitado.
              Peça pelo WhatsApp e garanta o seu tamanho antes que esgote.
            </p>
            <Link
              to="/catalogo?promo=1"
              className="btn mt-7 bg-cream px-7 py-4 text-ink hover:bg-rose hover:text-cream"
            >
              Aproveitar promoções
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ MAIS DESEJADOS ============ */}
      {featured.length > 0 && (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="overline">02 — Seleção da casa</p>
            <h2 className="mt-2 font-display text-4xl font-medium text-ink sm:text-5xl">
              Mais <em className="text-wine">desejados</em>
            </h2>
          </div>
          <Link
            to="/catalogo"
            className="group inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.2em] text-coffee transition-colors hover:text-wine"
          >
            Ver catálogo completo
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {featured.slice(0, 4).map((p, i) => (
            <Reveal key={p.id} delay={i * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
      )}

      {/* ============ BENEFÍCIOS ============ */}
      <section className="border-y border-latte/60 bg-sand/45">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <Reveal>
            <p className="overline">Por que a Amora</p>
            <h2 className="mt-2 font-display text-4xl font-medium text-ink sm:text-5xl">
              Boutique de verdade, <em className="text-wine">do clique à entrega</em>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.n} delay={i * 100}>
                <div className="border-t border-coffee/25 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-coffee/30 text-coffee">
                      <b.icon className="h-5.5 w-5.5" />
                    </span>
                    <span className="font-display text-4xl font-medium italic text-rose/60">
                      {b.n}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
                    {b.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-cocoa">
                    {b.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DEPOIMENTOS ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <Reveal>
          <p className="overline text-center">Quem veste, recomenda</p>
          <h2 className="mt-2 text-center font-display text-4xl font-medium text-ink sm:text-5xl">
            Palavra de <em className="text-wine">cliente</em>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={i * 90}>
              <figure className="flex h-full flex-col border border-latte bg-cream p-6 sm:p-7">
                <SparkIcon className="h-5 w-5 text-rose" />
                <blockquote className="mt-4 flex-1 font-display text-[19px] italic leading-snug text-coffee">
                  “{q.text}”
                </blockquote>
                <figcaption className="mt-5 border-t border-latte pt-4">
                  <p className="text-sm font-medium text-ink">{q.name}</p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-cocoa">
                    {q.tag}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="relative overflow-hidden bg-coffee">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-rose/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <Reveal>
            <SparkIcon className="mx-auto h-6 w-6 text-rose" />
            <h2 className="mt-5 font-display text-4xl font-medium leading-tight text-cream sm:text-5xl">
              A peça que você procura está a{" "}
              <em className="text-rose">uma mensagem</em> de distância.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-cream/70">
              Tire dúvidas de tamanho, cor e disponibilidade — a equipe responde
              rapidinho pelo WhatsApp.
            </p>
            <a
              href={waLink(config.whatsappNumber, buildGeneralMessage(config.storeName))}
              target="_blank"
              rel="noreferrer"
              className="btn mt-8 bg-rose px-8 py-4 text-cream hover:bg-cream hover:text-ink"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Falar com a loja
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
