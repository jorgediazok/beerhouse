"use client";

import { useEffect, useState } from "react";
import { Check, Link as LinkIcon, Share2 } from "lucide-react";

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.999.586 3.86 1.594 5.428L2 22l4.708-1.554A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12.001 2zm0 18.222a8.19 8.19 0 0 1-4.174-1.14l-.299-.178-3.11.999.999-3.031-.198-.312A8.194 8.194 0 0 1 3.778 12c0-4.535 3.688-8.222 8.223-8.222 4.535 0 8.222 3.687 8.222 8.222 0 4.535-3.687 8.222-8.222 8.222z" />
    </svg>
  );
}

export function ShareProduct({ url, text }: { url: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setCanNativeShare(typeof navigator.share === "function");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: text, url });
    } catch {
      // user cancelled the share sheet — nothing to do
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard permission denied — nothing to recover, link stays visible via WhatsApp/share
    }
  };

  const buttonClass =
    "flex h-9 w-9 items-center justify-center rounded-full border border-dark/10 text-dark/60 transition hover:border-orange hover:text-orange";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-dark/50">Compartir:</span>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir por WhatsApp"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:opacity-90"
      >
        <WhatsAppIcon size={17} />
      </a>
      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          aria-label="Más opciones para compartir"
          className={buttonClass}
        >
          <Share2 size={16} />
        </button>
      )}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copiar link del producto"
        className={buttonClass}
      >
        {copied ? <Check size={16} /> : <LinkIcon size={16} />}
      </button>
      {copied && <span className="text-xs text-dark/50">¡Copiado!</span>}
    </div>
  );
}
