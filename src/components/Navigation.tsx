import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "PLATFORM", href: "#platform" },
    { label: "TECHNOLOGY", href: "#technology" },
    { label: "COMPANY", href: "#company" },
    { label: "CONTACT", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-5">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between w-full max-w-[520px] px-5 py-3 rounded-full bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
      >
        {/* Brand */}
        <a href="/" className="flex items-center">
          <span className="text-[13px] font-bold tracking-[0.14em] uppercase text-foreground">
            DOCG AI
          </span>
        </a>

        {/* Utility */}
        <div className="flex items-center gap-1">
          <button
            className="p-2 rounded-full transition-colors hover:bg-black/5"
            aria-label="Search"
          >
            <Search className="w-[16px] h-[16px] text-foreground/70" />
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full transition-colors hover:bg-black/5"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-[16px] h-[16px] text-foreground/70" />
            ) : (
              <Menu className="w-[16px] h-[16px] text-foreground/70" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[72px] w-full max-w-[520px] rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="nav-item py-2.5 px-3 rounded-lg hover:bg-black/[0.03] transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
