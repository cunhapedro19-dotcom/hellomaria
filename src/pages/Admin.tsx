import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useStore } from "../store/AppContext";
import type { Category, Product, StoreConfig } from "../types";
import {
  ADMIN_PASS,
  ADMIN_USER,
  CATEGORIES,
  COLOR_SUGGESTIONS,
  SIZES,
  categoryLabel,
} from "../config";
import { brl, effectivePrice, parsePrice } from "../lib/format";
import { onlyDigits } from "../lib/whatsapp";
import { LIBRARY_IMAGES } from "../data/seed";
import { Link } from "../lib/router";
import { cn } from "../utils/cn";
import { SmartImg } from "../components/SmartImg";
import {
  AlertIcon,
  CheckIcon,
  ChevronDown,
  ImageIcon,
  InfoIcon,
  LockIcon,
  LogoutIcon,
  PencilIcon,
  PlusIcon,
  ResetIcon,
  SearchIcon,
  StoreIcon,
  TrashIcon,
  XIcon,
} from "../components/Icons";

const K_SESSION = "amora:admin:session";

/* ============================= LOGIN ============================= */

function Login({ onLogin }: { onLogin: (u: string, p: string) => boolean }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!onLogin(user.trim(), pass)) {
      setError("Usuário ou senha inválidos. Verifique e tente novamente.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand/60 px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="text-[11px] font-medium uppercase tracking-[0.22em] text-cocoa transition-colors hover:text-wine"
        >
          ← Voltar para a loja
        </Link>
        <div className="mt-4 border border-latte bg-cream p-7 shadow-sm sm:p-9">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-wine/10 text-wine">
            <LockIcon className="h-6 w-6" />
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
            Painel da loja
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-cocoa">
            Área reservada para gerenciar o catálogo, as promoções e as
            informações da boutique.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="overline">Usuário</span>
              <input
                className="field mt-1.5"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="admin"
                autoComplete="username"
              />
            </label>
            <label className="block">
              <span className="overline">Senha</span>
              <input
                className="field mt-1.5"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>
            {error && (
              <p className="fade-in flex items-center gap-2 text-sm font-medium text-wine">
                <AlertIcon className="h-4 w-4 shrink-0" />
                {error}
              </p>
            )}
            <button
              type="submit"
              className="btn w-full bg-coffee py-3.5 text-cream hover:bg-wine"
            >
              Entrar no painel
            </button>
          </form>

          <div className="mt-6 border border-dashed border-rose/70 bg-rose/10 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-rosedeep">
              Acesso de demonstração
            </p>
            <p className="mt-1.5 text-sm text-coffee">
              Usuário: <strong>admin</strong> · Senha: <strong>admin123</strong>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-cocoa">
              Este acesso é ilustrativo e não é seguro. Antes de publicar,
              substitua por autenticação real com banco de dados e rotas
              protegidas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================= MODAL ============================= */

function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto">
      <div className="fade-in fixed inset-0 bg-ink/55" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative mx-auto my-6 w-[calc(100%-1.5rem)] bg-cream shadow-2xl",
          wide ? "max-w-2xl" : "max-w-md"
        )}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-latte bg-cream px-5 py-4">
          <h3 className="font-display text-2xl font-semibold text-ink">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center text-cocoa transition-colors hover:text-wine"
            aria-label="Fechar"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </header>
        <div className="px-5 py-6 sm:px-7">{children}</div>
      </div>
    </div>
  );
}

/* ========================== FORMULÁRIO DE PRODUTO ========================== */

interface FormState {
  name: string;
  description: string;
  category: Category;
  price: string;
  promoPrice: string;
  images: string[];
  sizes: string[];
  colors: string[];
  avail: Record<string, boolean>;
  isNew: boolean;
  isFeatured: boolean;
}

function ProductForm({
  initial,
  onClose,
}: {
  initial: Product | null;
  onClose: () => void;
}) {
  const { saveProduct, toast } = useStore();
  const [f, setF] = useState<FormState>(() =>
    initial
      ? {
          name: initial.name,
          description: initial.description,
          category: initial.category,
          price: String(initial.price).replace(".", ","),
          promoPrice:
            initial.promoPrice != null
              ? String(initial.promoPrice).replace(".", ",")
              : "",
          images: initial.images.length ? [...initial.images] : [""],
          sizes: [...initial.sizes],
          colors: [...initial.colors],
          avail: Object.fromEntries(
            initial.variations.map((v) => [`${v.size}__${v.color}`, v.available])
          ),
          isNew: initial.isNew,
          isFeatured: initial.isFeatured,
        }
      : {
          name: "",
          description: "",
          category: "vestidos",
          price: "",
          promoPrice: "",
          images: [""],
          sizes: ["P", "M", "G"],
          colors: ["Bege"],
          avail: {},
          isNew: true,
          isFeatured: false,
        }
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [colorDraft, setColorDraft] = useState("");
  const [showLibrary, setShowLibrary] = useState(false);

  const up = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setF((prev) => ({ ...prev, [k]: v }));

  const toggleSize = (s: string) =>
    setF((prev) =>
      prev.sizes.includes(s)
        ? {
            ...prev,
            sizes: prev.sizes.filter((x) => x !== s),
            avail: Object.fromEntries(
              Object.entries(prev.avail).filter(([k]) => !k.startsWith(`${s}__`))
            ),
          }
        : { ...prev, sizes: [...prev.sizes, s] }
    );

  const removeColor = (c: string) =>
    setF((prev) => ({
      ...prev,
      colors: prev.colors.filter((x) => x !== c),
      avail: Object.fromEntries(
        Object.entries(prev.avail).filter(
          ([k]) => !k.endsWith(`__${c}`)
        )
      ),
    }));

  const addColor = () => {
    const c = colorDraft.trim();
    if (!c) return;
    if (f.colors.some((x) => x.toLowerCase() === c.toLowerCase())) {
      toast("Essa cor já foi adicionada.", "error");
      return;
    }
    up("colors", [...f.colors, c]);
    setColorDraft("");
  };

  const save = () => {
    const errs: string[] = [];
    const price = parsePrice(f.price);
    const promo = f.promoPrice.trim() ? parsePrice(f.promoPrice) : null;
    const imgs = f.images.map((i) => i.trim()).filter(Boolean);

    if (!f.name.trim()) errs.push("Informe o nome da peça.");
    if (!Number.isFinite(price) || price <= 0)
      errs.push("Informe um preço cheio válido (ex.: 129,90).");
    if (promo != null && (!Number.isFinite(promo) || promo <= 0))
      errs.push("O preço promocional deve ser um valor válido.");
    else if (promo != null && Number.isFinite(price) && promo >= price)
      errs.push("O preço promocional deve ser menor que o preço cheio.");
    if (imgs.length === 0) errs.push("Adicione ao menos uma imagem (URL).");
    if (f.sizes.length === 0) errs.push("Selecione ao menos um tamanho.");
    if (f.colors.length === 0) errs.push("Adicione ao menos uma cor.");

    if (errs.length > 0) {
      setErrors(errs);
      toast("Revise os campos destacados e tente de novo.", "error");
      return;
    }

    const availableMap: Record<string, boolean> = {};
    for (const s of f.sizes)
      for (const c of f.colors)
        availableMap[`${s}__${c}`] = f.avail[`${s}__${c}`] ?? true;

    const id =
      initial?.id ??
      `peca-${globalThis.crypto?.randomUUID
        ? globalThis.crypto.randomUUID().slice(0, 8)
        : Date.now().toString(36)}`;

    saveProduct({
      id,
      name: f.name.trim(),
      description:
        f.description.trim() || "Peça da coleção, com detalhes a combinar com a loja.",
      category: f.category,
      price,
      promoPrice: promo,
      images: imgs,
      sizes: f.sizes,
      colors: f.colors,
      variations: f.sizes.flatMap((s) =>
        f.colors.map((c) => ({
          size: s,
          color: c,
          available: availableMap[`${s}__${c}`],
        }))
      ),
      isNew: f.isNew,
      isFeatured: f.isFeatured,
      createdAt: initial?.createdAt ?? Date.now(),
    });
    toast(
      initial
        ? "Produto atualizado com sucesso!"
        : "Produto cadastrado com sucesso!"
    );
    onClose();
  };

  const suggestedColors = COLOR_SUGGESTIONS.filter(
    (c) => !f.colors.some((x) => x.toLowerCase() === c.toLowerCase())
  );

  return (
    <div className="space-y-7">
      {errors.length > 0 && (
        <div className="fade-in border border-wine/40 bg-wine/5 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-wine">
            <AlertIcon className="h-4 w-4" />
            Corrija os itens abaixo:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-9 text-sm text-wine/90">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* identificação */}
      <section className="space-y-4">
        <h4 className="overline">Peça</h4>
        <label className="block">
          <span className="text-sm font-medium text-coffee">Nome *</span>
          <input
            className="field mt-1.5"
            value={f.name}
            onChange={(e) => up("name", e.target.value)}
            placeholder="Ex.: Vestido Midi Aurora"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-coffee">Descrição</span>
          <textarea
            className="field mt-1.5 min-h-24 resize-y"
            value={f.description}
            onChange={(e) => up("description", e.target.value)}
            placeholder="Tecido, caimento, ocasiões de uso…"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-coffee">Categoria *</span>
            <div className="relative mt-1.5">
              <select
                className="field field-select appearance-none"
                value={f.category}
                onChange={(e) => up("category", e.target.value as Category)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.plural}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa" />
            </div>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-coffee">Preço (R$) *</span>
              <input
                className="field mt-1.5"
                inputMode="decimal"
                value={f.price}
                onChange={(e) => up("price", e.target.value)}
                placeholder="129,90"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-coffee">Promo (R$)</span>
              <input
                className="field mt-1.5"
                inputMode="decimal"
                value={f.promoPrice}
                onChange={(e) => up("promoPrice", e.target.value)}
                placeholder="opcional"
              />
            </label>
          </div>
        </div>
      </section>

      {/* imagens */}
      <section>
        <h4 className="overline">Fotos</h4>
        <p className="mt-1 text-xs text-cocoa">
          Cole o endereço (URL) de cada foto. A primeira foto é a capa do
          produto.
        </p>
        <ul className="mt-3 space-y-2.5">
          {f.images.map((url, i) => (
            <li key={i} className="flex items-center gap-3">
              <SmartImg
                src={url}
                alt={`Foto ${i + 1}`}
                className="h-16 w-12 shrink-0 rounded-sm object-cover"
              />
              <input
                className="field flex-1"
                value={url}
                onChange={(e) =>
                  up(
                    "images",
                    f.images.map((x, xi) => (xi === i ? e.target.value : x))
                  )
                }
                placeholder={`https://… (foto ${i + 1})`}
                aria-label={`URL da foto ${i + 1}`}
              />
              <button
                type="button"
                onClick={() =>
                  up(
                    "images",
                    f.images.filter((_, xi) => xi !== i)
                  )
                }
                disabled={f.images.length === 1}
                className="grid h-10 w-10 shrink-0 place-items-center border border-latte text-cocoa transition-colors hover:border-wine hover:text-wine disabled:opacity-30"
                aria-label={`Remover foto ${i + 1}`}
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => up("images", [...f.images, ""])}
            className="btn border border-coffee/40 px-4 py-2.5 text-coffee hover:bg-coffee hover:text-cream"
          >
            <PlusIcon className="h-4 w-4" />
            Adicionar foto
          </button>
          <button
            type="button"
            onClick={() => setShowLibrary((v) => !v)}
            className="btn border border-latte px-4 py-2.5 text-cocoa hover:border-coffee"
            aria-expanded={showLibrary}
          >
            <ImageIcon className="h-4 w-4" />
            Usar fotos de exemplo
          </button>
        </div>
        {showLibrary && (
          <div className="fade-in mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {LIBRARY_IMAGES.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => {
                  if (!f.images.includes(url)) up("images", [...f.images, url]);
                }}
                className="overflow-hidden rounded-sm border-2 border-transparent transition-all hover:border-wine"
                aria-label="Usar esta foto de exemplo"
              >
                <SmartImg src={url} alt="" className="aspect-[3/4] w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* tamanhos */}
      <section>
        <h4 className="overline">Tamanhos *</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSize(s)}
              aria-pressed={f.sizes.includes(s)}
              className={cn(
                "min-w-11 border px-3 py-2.5 text-sm font-medium transition-all",
                f.sizes.includes(s)
                  ? "border-coffee bg-coffee text-cream"
                  : "border-latte bg-white/50 text-coffee hover:border-coffee"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* cores */}
      <section>
        <h4 className="overline">Cores *</h4>
        {f.colors.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {f.colors.map((c) => (
              <span
                key={c}
                className="flex items-center gap-1.5 border border-coffee bg-coffee py-2 pl-3.5 pr-2 text-sm font-medium text-cream"
              >
                {c}
                <button
                  type="button"
                  onClick={() => removeColor(c)}
                  aria-label={`Remover cor ${c}`}
                  className="grid h-6 w-6 place-items-center rounded-full transition-colors hover:bg-wine"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="mt-3 flex gap-2">
          <input
            className="field flex-1"
            value={colorDraft}
            onChange={(e) => setColorDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addColor();
              }
            }}
            placeholder="Nova cor, ex.: Terracota"
            aria-label="Nome da nova cor"
          />
          <button
            type="button"
            onClick={addColor}
            className="btn bg-coffee px-4 py-2.5 text-cream hover:bg-wine"
          >
            Adicionar
          </button>
        </div>
        {suggestedColors.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-cocoa">
            Sugestões:
            {suggestedColors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => up("colors", [...f.colors, c])}
                className="border border-dashed border-latte px-2.5 py-1 text-coffee transition-colors hover:border-coffee"
              >
                + {c}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* disponibilidade por variação */}
      <section>
        <h4 className="overline">Disponibilidade por variação</h4>
        {f.sizes.length === 0 || f.colors.length === 0 ? (
          <p className="mt-2 text-sm text-cocoa">
            Selecione tamanhos e cores para montar a grade de estoque.
          </p>
        ) : (
          <>
            <p className="mt-1 text-xs text-cocoa">
              Toque em uma célula para alternar entre disponível e esgotado.
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[300px] border-collapse text-center text-sm">
                <thead>
                  <tr>
                    <th className="p-1.5 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa">
                      Tam.
                    </th>
                    {f.colors.map((c) => (
                      <th key={c} className="p-1.5 text-[11px] font-semibold text-ink">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {f.sizes.map((s) => (
                    <tr key={s}>
                      <td className="p-1.5 text-left text-sm font-semibold text-ink">
                        {s}
                      </td>
                      {f.colors.map((c) => {
                        const key = `${s}__${c}`;
                        const on = f.avail[key] ?? true;
                        return (
                          <td key={key} className="p-1">
                            <button
                              type="button"
                              onClick={() =>
                                up("avail", { ...f.avail, [key]: !on })
                              }
                              aria-pressed={on}
                              aria-label={`Tamanho ${s}, cor ${c}: ${on ? "disponível" : "esgotado"}`}
                              className={cn(
                                "mx-auto grid h-9 w-11 place-items-center border transition-all",
                                on
                                  ? "border-wine bg-wine text-cream"
                                  : "border-latte bg-white/40 text-cocoa/40"
                              )}
                            >
                              {on ? <CheckIcon className="h-4 w-4" /> : <XIcon className="h-3.5 w-3.5" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* destaque */}
      <section className="space-y-2.5">
        <h4 className="overline">Destaque</h4>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-coffee">
          <input
            type="checkbox"
            checked={f.isNew}
            onChange={(e) => up("isNew", e.target.checked)}
            className="h-4 w-4 accent-wine"
          />
          Marcar como <strong>novidade</strong> (aparece na seção Novidades)
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-coffee">
          <input
            type="checkbox"
            checked={f.isFeatured}
            onChange={(e) => up("isFeatured", e.target.checked)}
            className="h-4 w-4 accent-wine"
          />
          Marcar como <strong>destaque</strong> (aparece em Mais desejados)
        </label>
      </section>

      <footer className="sticky bottom-0 -mx-5 flex gap-3 border-t border-latte bg-cream px-5 py-4 sm:-mx-7 sm:px-7">
        <button
          type="button"
          onClick={onClose}
          className="btn border border-coffee/40 px-5 py-3.5 text-coffee hover:bg-coffee hover:text-cream"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={save}
          className="btn flex-1 bg-coffee py-3.5 text-cream hover:bg-wine"
        >
          <CheckIcon className="h-4 w-4" />
          Salvar produto
        </button>
      </footer>
    </div>
  );
}

/* ========================== CONFIGURAÇÕES ========================== */

function ConfigTab() {
  const { config, saveConfig, resetCatalog, toast } = useStore();
  const [form, setForm] = useState<StoreConfig>(config);
  const [confirmReset, setConfirmReset] = useState(false);

  const set = (k: keyof StoreConfig) => (
    e: ChangeEvent<HTMLInputElement>
  ) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.storeName.trim()) {
      toast("Informe o nome da loja.", "error");
      return;
    }
    const digits = onlyDigits(form.whatsappNumber);
    if (digits.length < 10) {
      toast("Informe um WhatsApp válido: 55 + DDD + número.", "error");
      return;
    }
    saveConfig({ ...form, storeName: form.storeName.trim(), whatsappNumber: digits });
    toast("Configurações salvas com sucesso!");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <form onSubmit={submit} className="space-y-4">
        <h3 className="font-display text-2xl font-semibold text-ink">
          Identidade e contato
        </h3>
        <label className="block">
          <span className="text-sm font-medium text-coffee">Nome da loja *</span>
          <input className="field mt-1.5" value={form.storeName} onChange={set("storeName")} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-coffee">
            WhatsApp para pedidos *
          </span>
          <input
            className="field mt-1.5"
            inputMode="tel"
            value={form.whatsappNumber}
            onChange={set("whatsappNumber")}
            placeholder="5521999999999"
          />
          <span className="mt-1.5 block text-xs text-cocoa">
            Formato: 55 + DDD + número, somente dígitos. É o número que recebe
            os pedidos da sacola.
          </span>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-coffee">Endereço</span>
          <input className="field mt-1.5" value={form.address} onChange={set("address")} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-coffee">Horário</span>
            <input className="field mt-1.5" value={form.hours} onChange={set("hours")} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-coffee">E-mail</span>
            <input className="field mt-1.5" value={form.email} onChange={set("email")} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-coffee">Instagram</span>
            <input className="field mt-1.5" value={form.instagram} onChange={set("instagram")} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-coffee">Facebook</span>
            <input className="field mt-1.5" value={form.facebook} onChange={set("facebook")} />
          </label>
        </div>
        <button type="submit" className="btn bg-coffee px-6 py-3.5 text-cream hover:bg-wine">
          Salvar configurações
        </button>
      </form>

      <aside className="space-y-4">
        <div className="border border-latte bg-white/40 p-5">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <InfoIcon className="h-4 w-4 text-cocoa" />
            Sobre os dados
          </h4>
          <p className="mt-2.5 text-[13px] leading-relaxed text-cocoa">
            Nesta demonstração, catálogo e configurações ficam salvos apenas no
            navegador (localStorage). Não há sincronização entre dispositivos.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-cocoa">
            Para produção: banco de dados, autenticação real e imagens
            hospedadas em servidor.
          </p>
        </div>
        <div className="border border-wine/30 bg-wine/5 p-5">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-wine">
            <ResetIcon className="h-4 w-4" />
            Zona de restauração
          </h4>
          <p className="mt-2.5 text-[13px] leading-relaxed text-cocoa">
            Volte o catálogo para os produtos de demonstração. Suas
            alterações serão substituídas.
          </p>
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="btn mt-3.5 border border-wine/50 px-4 py-2.5 text-wine hover:bg-wine hover:text-cream"
          >
            Restaurar catálogo demo
          </button>
        </div>
      </aside>

      {confirmReset && (
        <Modal title="Restaurar catálogo" onClose={() => setConfirmReset(false)}>
          <p className="text-sm leading-relaxed text-cocoa">
            Isso substitui <strong>todos os produtos atuais</strong> pelos 16
            itens de demonstração. Essa ação não pode ser desfeita.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="btn flex-1 border border-coffee/40 py-3 text-coffee hover:bg-coffee hover:text-cream"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                resetCatalog();
                setConfirmReset(false);
                toast("Catálogo de demonstração restaurado.");
              }}
              className="btn flex-1 bg-wine py-3 text-cream hover:bg-winedeep"
            >
              Restaurar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================ DASHBOARD ============================ */

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { products, deleteProduct, toast } = useStore();
  const [tab, setTab] = useState<"produtos" | "config">("produtos");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...products].sort((a, b) => b.createdAt - a.createdAt);
    return q ? sorted.filter((p) => p.name.toLowerCase().includes(q)) : sorted;
  }, [products, search]);

  return (
    <div className="min-h-screen bg-cream">
      <div className="sticky top-0 z-30 border-b border-latte bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 sm:px-6">
          <Link
            to="/"
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-cocoa transition-colors hover:text-wine"
          >
            ← Ver loja
          </Link>
          <h1 className="flex items-center gap-2.5 font-display text-2xl font-semibold text-ink">
            <StoreIcon className="h-5.5 w-5.5 text-wine" />
            Painel da loja
          </h1>
          <span className="hidden rounded-full bg-sand px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cocoa sm:inline">
            Demo · localStorage
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="btn ml-auto border border-coffee/40 px-4 py-2.5 text-coffee hover:bg-coffee hover:text-cream"
          >
            <LogoutIcon className="h-4 w-4" />
            Sair
          </button>
        </div>
        <div className="mx-auto flex max-w-6xl gap-7 px-4 sm:px-6">
          {(
            [
              { id: "produtos", label: `Produtos (${products.length})` },
              { id: "config", label: "Configurações" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "border-b-2 pb-2.5 pt-1 text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors",
                tab === t.id
                  ? "border-wine text-ink"
                  : "border-transparent text-cocoa hover:text-ink"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-latte bg-sand/70">
        <p className="mx-auto flex max-w-6xl items-start gap-2.5 px-4 py-2.5 text-xs leading-relaxed text-cocoa sm:px-6">
          <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Modo demonstração: os dados ficam salvos apenas neste navegador e o
          acesso não é protegido por autenticação real. Substitua por backend
          antes de publicar.
        </p>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {tab === "produtos" ? (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:max-w-sm">
                <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa" />
                <input
                  className="field field-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar produto pelo nome…"
                  aria-label="Pesquisar produto"
                />
              </div>
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="btn bg-wine px-5 py-3 text-cream hover:bg-winedeep"
              >
                <PlusIcon className="h-4 w-4" />
                Novo produto
              </button>
            </div>

            {products.length === 0 ? (
              <div className="mt-10 flex flex-col items-center border border-dashed border-latte px-6 py-20 text-center">
                <StoreIcon className="h-10 w-10 text-cocoa/50" />
                <h3 className="mt-4 font-display text-3xl font-medium text-ink">
                  Nenhum produto cadastrado
                </h3>
                <p className="mt-2 max-w-sm text-sm text-cocoa">
                  Cadastre a primeira peça da loja ou restaure o catálogo de
                  demonstração em Configurações.
                </p>
                <button
                  type="button"
                  onClick={() => setCreating(true)}
                  className="btn mt-6 bg-coffee px-6 py-3.5 text-cream hover:bg-wine"
                >
                  <PlusIcon className="h-4 w-4" />
                  Cadastrar produto
                </button>
              </div>
            ) : list.length === 0 ? (
              <p className="mt-10 border border-dashed border-latte px-6 py-12 text-center text-sm text-cocoa">
                Nenhum produto encontrado para “{search}”.
              </p>
            ) : (
              <ul className="mt-4">
                {list.map((p) => {
                  const promo = p.promoPrice != null && p.promoPrice > 0;
                  return (
                    <li
                      key={p.id}
                      className="flex flex-col gap-3 border-b border-latte/60 py-4 first:pt-0 sm:flex-row sm:items-center"
                    >
                      <div className="flex flex-1 items-center gap-3.5">
                        <SmartImg
                          src={p.images[0] ?? ""}
                          alt={p.name}
                          className="h-[74px] w-14 shrink-0 rounded-sm object-cover"
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h4 className="font-display text-lg font-semibold leading-tight text-ink">
                              {p.name}
                            </h4>
                            {p.isNew && (
                              <span className="bg-rose px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-cream">
                                Novo
                              </span>
                            )}
                            {p.isFeatured && (
                              <span className="bg-coffee px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-cream">
                                Destaque
                              </span>
                            )}
                            {promo && (
                              <span className="bg-wine px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-cream">
                                −{Math.round((1 - p.promoPrice! / p.price) * 100)}%
                              </span>
                            )}
                          </div>
                          <p className="mt-1 truncate text-xs text-cocoa">
                            {categoryLabel(p.category)} · {p.sizes.join(" / ")} ·{" "}
                            {p.colors.length} {p.colors.length === 1 ? "cor" : "cores"}
                          </p>
                          <p className="mt-1 text-sm">
                            {promo && (
                              <s className="mr-1.5 text-xs text-cocoa/70">
                                {brl(p.price)}
                              </s>
                            )}
                            <span
                              className={
                                promo
                                  ? "font-semibold text-wine"
                                  : "font-medium text-ink"
                              }
                            >
                              {brl(effectivePrice(p))}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 pl-[70px] sm:ml-auto sm:pl-0">
                        <button
                          type="button"
                          onClick={() => setEditing(p)}
                          className="grid h-10 w-11 place-items-center border border-latte text-coffee transition-colors hover:border-coffee hover:bg-coffee hover:text-cream"
                          aria-label={`Editar ${p.name}`}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(p)}
                          className="grid h-10 w-11 place-items-center border border-latte text-wine transition-colors hover:border-wine hover:bg-wine hover:text-cream"
                          aria-label={`Excluir ${p.name}`}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        ) : (
          <ConfigTab />
        )}
      </main>

      {(creating || editing) && (
        <Modal
          title={editing ? "Editar produto" : "Novo produto"}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          wide
        >
          <ProductForm
            initial={editing}
            onClose={() => {
              setCreating(false);
              setEditing(null);
            }}
          />
        </Modal>
      )}

      {deleting && (
        <Modal title="Excluir produto" onClose={() => setDeleting(null)}>
          <p className="text-sm leading-relaxed text-cocoa">
            Tem certeza que deseja excluir{" "}
            <strong className="text-ink">{deleting.name}</strong>? A peça sairá
            da vitrine e das sacolas das clientes. Essa ação não pode ser
            desfeita.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setDeleting(null)}
              className="btn flex-1 border border-coffee/40 py-3 text-coffee hover:bg-coffee hover:text-cream"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                deleteProduct(deleting.id);
                toast(`“${deleting.name}” foi excluído.`, "info");
                setDeleting(null);
              }}
              className="btn flex-1 bg-wine py-3 text-cream hover:bg-winedeep"
            >
              <TrashIcon className="h-4 w-4" />
              Excluir
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================== PÁGINA ============================== */

export function Admin() {
  const { toast } = useStore();
  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(K_SESSION) === "1";
    } catch {
      return false;
    }
  });

  const handleLogin = (u: string, p: string) => {
    if (u === ADMIN_USER && p === ADMIN_PASS) {
      try {
        sessionStorage.setItem(K_SESSION, "1");
      } catch {
        /* segue sem persistir */
      }
      setAuthed(true);
      toast("Bem-vinda ao painel da Amora Boutique!");
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(K_SESSION);
    } catch {
      /* ok */
    }
    setAuthed(false);
    toast("Você saiu do painel.", "info");
  };

  return authed ? <Dashboard onLogout={handleLogout} /> : <Login onLogin={handleLogin} />;
}
