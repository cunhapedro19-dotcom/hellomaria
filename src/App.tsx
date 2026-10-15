import { useEffect } from "react";
import { AppProvider } from "./store/AppContext";
import { Link, useRoute } from "./lib/router";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { BagDrawer } from "./components/BagDrawer";
import { WhatsAppFloat } from "./components/WhatsAppFloat";
import { Toasts } from "./components/Toasts";
import { Home } from "./pages/Home";
import { Catalog } from "./pages/Catalog";
import { ProductDetail } from "./pages/ProductDetail";
import { Admin } from "./pages/Admin";

function Noise() {
  return (
    <div
      aria-hidden
      className="noise pointer-events-none fixed inset-0 z-[75] opacity-[0.05]"
    />
  );
}

function NotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-28 text-center">
      <p className="font-display text-[90px] font-semibold leading-none text-latte">
        404
      </p>
      <h1 className="mt-2 font-display text-4xl font-medium text-ink">
        Página não encontrada
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-cocoa">
        O endereço que você acessou não existe ou mudou de lugar. Que tal
        voltar para a vitrine e continuar de onde parou?
      </p>
      <Link
        to="/"
        className="btn mt-7 bg-coffee px-7 py-3.5 text-cream hover:bg-wine"
      >
        Voltar para o início
      </Link>
    </main>
  );
}

function Shell() {
  const { path, query } = useRoute();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [path]);

  if (path === "/admin") {
    return (
      <>
        <Noise />
        <Admin />
        <Toasts />
      </>
    );
  }

  let page;
  if (path === "/") {
    page = <Home />;
  } else if (path === "/catalogo") {
    page = <Catalog key={query.toString()} query={query} />;
  } else if (path.startsWith("/produto/")) {
    const id = decodeURIComponent(path.slice("/produto/".length));
    page = <ProductDetail key={id} id={id} />;
  } else {
    page = <NotFound />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Noise />
      <Header />
      <div className="flex-1">{page}</div>
      <Footer />
      <BagDrawer />
      <WhatsAppFloat />
      <Toasts />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
