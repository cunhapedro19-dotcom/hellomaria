import { useStore } from "../store/AppContext";
import { buildGeneralMessage, waLink } from "../lib/whatsapp";
import { WhatsAppIcon } from "./Icons";

export function WhatsAppFloat() {
  const { config } = useStore();

  return (
    <a
      href={waLink(config.whatsappNumber, buildGeneralMessage(config.storeName))}
      target="_blank"
      rel="noreferrer"
      aria-label="Conversar com a loja no WhatsApp"
      className="group fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center rounded-full bg-wa text-white shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-transform duration-300 hover:scale-110"
    >
      <span
        className="absolute inset-0 -z-10 animate-ping rounded-full bg-wa/40 [animation-duration:2.6s]"
        aria-hidden
      />
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
