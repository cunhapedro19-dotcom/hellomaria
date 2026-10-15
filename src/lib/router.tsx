import { useEffect, useMemo, useState } from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface Route {
  path: string;
  query: URLSearchParams;
}

function parse(hash: string): Route {
  const raw = hash.replace(/^#/, "") || "/";
  const [p = "", q = ""] = raw.split("?");
  const path = p.startsWith("/") ? p : `/${p}`;
  return { path: path || "/", query: new URLSearchParams(q) };
}

/** Roteamento por hash — funciona em qualquer hospedagem estática */
export function useRoute(): Route {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return useMemo(() => parse(hash), [hash]);
}

export function navigate(to: string): void {
  const target = to.startsWith("/") ? to : `/${to}`;
  if (window.location.hash === `#${target}`) return;
  window.location.hash = target;
}

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  children: ReactNode;
}

export function Link({ to, children, ...rest }: LinkProps) {
  const target = to.startsWith("/") ? to : `/${to}`;
  return (
    <a href={`#${target}`} {...rest}>
      {children}
    </a>
  );
}
