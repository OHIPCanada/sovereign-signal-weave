import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useContactModal } from "./ContactModalContext";
import ContactForm from "./ContactForm";

export default function ContactModal() {
  const { open, setOpen } = useContactModal();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="p-6 sm:p-8">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl font-extrabold tracking-tight">Contact</DialogTitle>
            <DialogDescription>
              Share what you need — partnership, demo, integration — and well respond within 24 hours.
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
