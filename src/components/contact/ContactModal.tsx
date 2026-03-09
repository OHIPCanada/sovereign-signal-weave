import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useContactModal } from "./ContactModalContext";
import ContactForm from "./ContactForm";

export default function ContactModal() {
  const { open, setOpen } = useContactModal();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="dark max-w-2xl w-[calc(100vw-32px)] w-[calc(100vw-32px)] p-0 overflow-hidden border-0"
        style={{
          background: `
            radial-gradient(600px 400px at 30% 30%, rgba(212,97,107,0.15), transparent 60%),
            radial-gradient(500px 350px at 70% 70%, rgba(123,97,255,0.12), transparent 55%),
            linear-gradient(180deg, #0B0613 0%, #1A0630 50%, #0B0613 100%)
          `,
          boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 0 120px rgba(123,97,255,0.08)",
        }}
      >
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-lg opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />

        <div className="relative z-10 p-4 sm:p-6 md:p-8">
          <DialogHeader className="text-left">
            <p
              className="font-mono uppercase mb-2"
              style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, letterSpacing: "0.22em" }}
            >
              [ CONTACT ]
            </p>
            <DialogTitle
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: "rgba(255,255,255,0.95)", letterSpacing: "-0.02em" }}
            >
              Get in Touch
            </DialogTitle>
            <DialogDescription style={{ color: "rgba(255,255,255,0.5)", marginTop: 6 }}>
              Share what you need — partnership, demo, integration — and we'll respond within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <ContactForm autoFocus />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
