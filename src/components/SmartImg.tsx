import { useState } from "react";
import { cn } from "../utils/cn";

interface SmartImgProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

/** Imagem com fallback elegante — nunca deixa placeholder quebrado */
export function SmartImg({ src, alt, className, eager }: SmartImgProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-sand text-cocoa/60",
          className
        )}
        role="img"
        aria-label={alt}
      >
        <span className="font-display px-4 text-center text-lg italic">
          Amora Boutique
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      className={className}
      onError={() => setFailed(true)}
      draggable={false}
    />
  );
}
