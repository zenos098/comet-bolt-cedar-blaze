import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyBlock({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 1400);
  }
  return (
    <div className="relative">
      <pre className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/[0.03] p-4 pr-14 text-sm leading-relaxed text-cream/90">
        {text}
      </pre>
      <button
        type="button"
        onClick={copy}
        className="absolute right-3 top-3 grid size-10 place-items-center rounded-full text-cream/60 hover:text-cream"
        aria-label={label}
      >
        {done ? <Check className="size-4 text-mint" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}

export function ResultImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full rounded-2xl object-cover"
      loading="lazy"
    />
  );
}
