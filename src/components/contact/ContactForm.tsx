import { useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useContactModal } from "./ContactModalContext";

const inquiryTypes = [
  "Enterprise Partnership",
  "Platform Demo",
  "Technical Integration",
  "Media & Press",
  "Careers",
  "General Inquiry",
];

type FormState = {
  name: string;
  email: string;
  type: string;
  org: string;
  message: string;
};

const initialForm: FormState = { name: "", email: "", type: "", org: "", message: "" };

/* Shared field styles matching EMR Layer hero aesthetic */
const fieldStyle: React.CSSProperties = {
  background: "rgba(123,97,255,0.08)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "rgba(255,255,255,0.9)",
  borderRadius: 8,
  padding: "10px 14px",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const fieldFocusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = "rgba(123,97,255,0.4)";
  e.target.style.boxShadow = "0 0 20px rgba(123,97,255,0.12)";
};
const fieldBlurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = "rgba(255,255,255,0.1)";
  e.target.style.boxShadow = "none";
};

export default function ContactForm({ autoFocus = false }: { autoFocus?: boolean }) {
  const { toast } = useToast();
  const { closeModal } = useContactModal();

  const [form, setForm] = useState<FormState>(initialForm);
  const [sending, setSending] = useState(false);

  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!autoFocus) return;
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [autoFocus]);

  const canSubmit = useMemo(() => {
    return Boolean(form.name.trim() && form.email.trim() && form.message.trim());
  }, [form.email, form.message, form.name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      toast({ title: "Message received", description: "Our team will respond within 24 hours." });
      setForm(initialForm);
      closeModal();
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          ref={firstFieldRef}
          style={fieldStyle}
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          onFocus={fieldFocusHandler}
          onBlur={fieldBlurHandler}
          required
        />
        <input
          style={fieldStyle}
          placeholder="Email address"
          type="email"
          value={form.email}
          onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          onFocus={fieldFocusHandler}
          onBlur={fieldBlurHandler}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          style={{ ...fieldStyle, height: 42, appearance: "none" as const }}
          value={form.type}
          onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
          onFocus={fieldFocusHandler as any}
          onBlur={fieldBlurHandler as any}
        >
          <option value="" style={{ background: "#1A0630", color: "rgba(255,255,255,0.5)" }}>
            Inquiry type
          </option>
          {inquiryTypes.map((t) => (
            <option key={t} value={t} style={{ background: "#1A0630", color: "rgba(255,255,255,0.9)" }}>
              {t}
            </option>
          ))}
        </select>
        <input
          style={fieldStyle}
          placeholder="Organization (optional)"
          value={form.org}
          onChange={(e) => setForm((s) => ({ ...s, org: e.target.value }))}
          onFocus={fieldFocusHandler}
          onBlur={fieldBlurHandler}
        />
      </div>

      <textarea
        style={{ ...fieldStyle, resize: "none" }}
        placeholder="Your message"
        value={form.message}
        onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
        onFocus={fieldFocusHandler as any}
        onBlur={fieldBlurHandler as any}
        rows={5}
        required
      />

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          disabled={sending || !canSubmit}
          className="px-6 font-semibold tracking-wide border-0"
          style={{
            background: "linear-gradient(135deg, #D4616B 0%, #E8967C 100%)",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(212,97,107,0.3)",
          }}
        >
          {sending ? "Sending…" : "Send message"}
          <Send className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
