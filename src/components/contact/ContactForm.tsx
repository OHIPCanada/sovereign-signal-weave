import { useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useContactModal } from "./ContactModalContext";

const HCAPTCHA_SITE_KEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

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

type TouchedState = Record<keyof FormState, boolean>;

const initialForm: FormState = { name: "", email: "", type: "", org: "", message: "" };
const initialTouched: TouchedState = { name: false, email: false, type: false, org: false, message: false };

/* ── label style: instrument-grade kicker ── */
const labelStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.22em",
  color: "rgba(255,255,255,0.45)",
  textTransform: "uppercase",
  fontFamily: "inherit",
  marginBottom: 6,
  display: "block",
};

/* ── helper text ── */
const helperStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.04em",
  color: "rgba(255,255,255,0.32)",
  marginTop: 4,
  display: "block",
};

/* ── validation error ── */
const errorStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.04em",
  color: "rgba(212,97,107,0.9)",
  marginTop: 4,
  display: "block",
};

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

const fieldErrorStyle: React.CSSProperties = {
  ...fieldStyle,
  borderColor: "rgba(212,97,107,0.5)",
};

const fieldFocusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = "rgba(123,97,255,0.4)";
  e.target.style.boxShadow = "0 0 20px rgba(123,97,255,0.12)";
};
const fieldBlurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = "rgba(255,255,255,0.1)";
  e.target.style.boxShadow = "none";
};

/* ── Validation helpers ── */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getErrors(form: FormState, touched: TouchedState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (touched.name && !form.name.trim()) errors.name = "Required";
  if (touched.email && !form.email.trim()) errors.email = "Required";
  else if (touched.email && !emailRegex.test(form.email.trim())) errors.email = "Invalid email format";
  if (touched.message && !form.message.trim()) errors.message = "Required";
  if (touched.name && form.name.length > 100) errors.name = "Max 100 characters";
  if (touched.email && form.email.length > 255) errors.email = "Max 255 characters";
  if (touched.message && form.message.length > 2000) errors.message = "Max 2000 characters";
  return errors;
}

export default function ContactForm({ autoFocus = false }: { autoFocus?: boolean }) {
  const { toast } = useToast();
  const { closeModal } = useContactModal();

  const [form, setForm] = useState<FormState>(initialForm);
  const [touched, setTouched] = useState<TouchedState>(initialTouched);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [hcaptchaToken, setHcaptchaToken] = useState<string | null>(null);

  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const hcaptchaRef = useRef<HCaptcha>(null);

  useEffect(() => {
    if (!autoFocus) return;
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [autoFocus]);

  const allTouched: TouchedState = { name: true, email: true, type: true, org: true, message: true };
  const errors = getErrors(form, submitted ? allTouched : touched);

  const canSubmit = useMemo(() => {
    return Boolean(form.name.trim() && form.email.trim() && emailRegex.test(form.email.trim()) && form.message.trim() && hcaptchaToken);
  }, [form.email, form.message, form.name, hcaptchaToken]);

  const touch = (field: keyof FormState) => () =>
    setTouched((t) => ({ ...t, [field]: true }));

  const handleBlur = (field: keyof FormState) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched((t) => ({ ...t, [field]: true }));
    fieldBlurHandler(e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!canSubmit) return;

    setSending(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "058926c4-3c10-4985-b14c-4374b48b9734",
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.type || "General Inquiry",
          organization: form.org.trim() || "Not provided",
          message: form.message.trim(),
          "h-captcha-response": hcaptchaToken,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: "Message received", description: "Our team will respond within 24 hours." });
        setForm(initialForm);
        setTouched(initialTouched);
        setSubmitted(false);
        setHcaptchaToken(null);
        hcaptchaRef.current?.resetCaptcha();
        closeModal();
      } else {
        toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label style={labelStyle}>[ Name ]</label>
          <input
            ref={firstFieldRef}
            style={errors.name ? fieldErrorStyle : fieldStyle}
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            onFocus={fieldFocusHandler}
            onBlur={handleBlur("name")}
            maxLength={100}
          />
          {errors.name
            ? <span style={errorStyle}>{errors.name}</span>
            : <span style={helperStyle}>As it appears on record</span>
          }
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>[ Email ]</label>
          <input
            style={errors.email ? fieldErrorStyle : fieldStyle}
            placeholder="you@organization.com"
            type="email"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            onFocus={fieldFocusHandler}
            onBlur={handleBlur("email")}
            maxLength={255}
          />
          {errors.email
            ? <span style={errorStyle}>{errors.email}</span>
            : <span style={helperStyle}>Primary point of contact</span>
          }
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Inquiry Type */}
        <div>
          <label style={labelStyle}>[ Inquiry Type ]</label>
          <select
            style={{ ...(errors.type ? fieldErrorStyle : fieldStyle), height: 42, appearance: "none" as const }}
            value={form.type}
            onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
            onFocus={fieldFocusHandler as any}
            onBlur={handleBlur("type") as any}
          >
            <option value="" style={{ background: "#1A0630", color: "rgba(255,255,255,0.5)" }}>
              Select category
            </option>
            {inquiryTypes.map((t) => (
              <option key={t} value={t} style={{ background: "#1A0630", color: "rgba(255,255,255,0.9)" }}>
                {t}
              </option>
            ))}
          </select>
          <span style={helperStyle}>Helps route to the right team</span>
        </div>

        {/* Organization */}
        <div>
          <label style={labelStyle}>[ Organization ]</label>
          <input
            style={fieldStyle}
            placeholder="Company or institution"
            value={form.org}
            onChange={(e) => setForm((s) => ({ ...s, org: e.target.value }))}
            onFocus={fieldFocusHandler}
            onBlur={handleBlur("org")}
          />
          <span style={helperStyle}>Optional — include if applicable</span>
        </div>
      </div>

      {/* Message */}
      <div>
        <label style={labelStyle}>[ Message ]</label>
        <textarea
          style={{ ...(errors.message ? fieldErrorStyle : fieldStyle), resize: "none" }}
          placeholder="Describe your inquiry or requirements"
          value={form.message}
          onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
          onFocus={fieldFocusHandler as any}
          onBlur={handleBlur("message") as any}
          rows={5}
          maxLength={2000}
        />
        <div className="flex justify-between">
          {errors.message
            ? <span style={errorStyle}>{errors.message}</span>
            : <span style={helperStyle}>Include relevant context for faster routing</span>
          }
          <span style={{ ...helperStyle, textAlign: "right", minWidth: 60 }}>
            {form.message.length}/2000
          </span>
        </div>
      </div>

      {/* hCaptcha */}
      <div className="pt-2">
        <HCaptcha
          ref={hcaptchaRef}
          sitekey={HCAPTCHA_SITE_KEY}
          theme="dark"
          onVerify={(token) => setHcaptchaToken(token)}
          onExpire={() => setHcaptchaToken(null)}
        />
        {submitted && !hcaptchaToken && (
          <span style={{ fontSize: 11, color: "rgba(212,97,107,0.9)", marginTop: 4, display: "block" }}>
            Please complete the captcha
          </span>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          disabled={sending || !hcaptchaToken}
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
