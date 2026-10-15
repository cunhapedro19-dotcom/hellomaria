import { useStore } from "../store/AppContext";
import { cn } from "../utils/cn";
import { AlertIcon, CheckIcon, InfoIcon } from "./Icons";

const styles = {
  success: "bg-coffee text-cream",
  error: "bg-wine text-cream",
  info: "bg-ink text-cream",
} as const;

export function Toasts() {
  const { toasts, dismissToast } = useStore();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-[90] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2 sm:left-auto sm:right-6 sm:translate-x-0">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismissToast(t.id)}
          className={cn(
            "toast-in flex items-start gap-3 rounded-sm px-4 py-3.5 text-left text-sm leading-snug shadow-xl",
            styles[t.kind]
          )}
          aria-live="polite"
        >
          <span className="mt-0.5 shrink-0">
            {t.kind === "success" && <CheckIcon className="h-4 w-4" />}
            {t.kind === "error" && <AlertIcon className="h-4 w-4" />}
            {t.kind === "info" && <InfoIcon className="h-4 w-4" />}
          </span>
          {t.message}
        </button>
      ))}
    </div>
  );
}
