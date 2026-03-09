import { useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
        <Input
          ref={firstFieldRef}
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          required
        />
        <Input
          placeholder="Email address"
          type="email"
          value={form.email}
          onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={form.type}
          onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
        >
          <option value="">Inquiry type</option>
          {inquiryTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <Input
          placeholder="Organization (optional)"
          value={form.org}
          onChange={(e) => setForm((s) => ({ ...s, org: e.target.value }))}
        />
      </div>

      <Textarea
        placeholder="Your message"
        value={form.message}
        onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
        rows={5}
        required
      />

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="submit" variant="coral" disabled={sending || !canSubmit}>
          {sending ? "Sending…" : "Send message"}
          <Send />
        </Button>
      </div>
    </form>
  );
}
