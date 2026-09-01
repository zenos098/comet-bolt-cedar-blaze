import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CopyBlock } from "@/components/CopyBlock";
import { Field, fieldClass, ToolForm } from "@/components/ToolForm";
import { useStudio } from "@/components/StudioShell";
import { api } from "@/lib/client";
import type { Channel, Generation, InboxMessage } from "@/lib/types";

export const Route = createFileRoute("/studio/inbox")({
  component: InboxPage,
  head: () => ({ meta: [{ title: "Inbox — Looply" }] }),
});

function InboxPage() {
  const { setCredits } = useStudio();
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [from, setFrom] = useState("");
  const [channel, setChannel] = useState<Channel>("instagram");
  const [latest, setLatest] = useState<string | null>(null);

  useEffect(() => {
    api<{ items: InboxMessage[] }>("/api/messages")
      .then((d) => setMessages(d.items))
      .catch(() => setMessages([]));
  }, []);

  return (
    <div className="space-y-10">
      <ToolForm
        title="Inbox"
        hint="Drafts replies you can paste. Looply does not connect live Instagram, WhatsApp or Google."
        busy={busy}
        error={error}
        submitLabel="Draft reply · 1 credit"
        onSubmit={async () => {
          setBusy(true);
          setError(null);
          try {
            const res = await api<{
              item: Generation;
              message: InboxMessage;
              credits: number;
            }>("/api/generate/reply", {
              method: "POST",
              body: JSON.stringify({ text, from, channel, kind: "reply" }),
            });
            setLatest(res.message.reply ?? res.item.caption ?? "");
            setCredits(res.credits);
            setMessages((prev) => [res.message, ...prev]);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          } finally {
            setBusy(false);
          }
        }}
      >
        <Field label="From">
          <input
            className={fieldClass}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="ananya.k"
          />
        </Field>
        <Field label="Channel">
          <select
            className={fieldClass}
            value={channel}
            onChange={(e) => setChannel(e.target.value as Channel)}
          >
            <option value="instagram">Instagram</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="google">Google</option>
            <option value="facebook">Facebook</option>
          </select>
        </Field>
        <Field label="Incoming message">
          <textarea
            className={fieldClass}
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Do you ship to Noida?"
          />
        </Field>
      </ToolForm>

      {latest ? (
        <div className="mx-auto w-full max-w-3xl">
          <CopyBlock text={latest} />
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-3xl space-y-3">
        <h2 className="font-serif text-2xl">On file</h2>
        {messages.map((m) => (
          <article key={m.id} className="card-surface p-5">
            <p className="text-xs uppercase tracking-widest text-mint">
              {m.channel} · {m.from}
            </p>
            <p className="mt-2 text-sm">{m.text}</p>
            {m.reply ? (
              <p className="mt-3 border-t border-white/10 pt-3 text-sm text-muted">
                Draft: {m.reply}
              </p>
            ) : (
              <button
                type="button"
                className="mt-3 min-h-11 text-sm text-mint"
                onClick={() => {
                  setFrom(m.from);
                  setText(m.text);
                  setChannel(m.channel);
                }}
              >
                Draft a reply
              </button>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
