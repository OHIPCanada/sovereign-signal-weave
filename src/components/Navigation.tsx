import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "PLATFORM", href: "#platform" },
    { label: "TECHNOLOGY", href: "#technology" },
    { label: "COMPANY", href: "#company" },
    { label: "CONTACT", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isScrolled
          ? "flex justify-center px-4 pt-4"
          : "flex justify-between px-6 pt-5 md:px-12 lg:px-20"
      }`}
    >
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`flex items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled
            ? "gap-2 bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.06)] rounded-full px-3 py-2 md:px-5 md:py-2.5"
            : "justify-between w-full max-w-[1400px] mx-auto py-1"
        }`}
      >
        {/* Logo */}
        <a href="/" className="flex items-center px-3">
          <span className={`text-[13px] md:text-[14px] font-bold tracking-[0.12em] uppercase transition-colors duration-500 ${
            isScrolled ? "text-foreground" : "text-white"
          }`}>
            DOCG AI
          </span>
        </a>

        {/* Divider - only in island mode */}
        {isScrolled && (
          <div className="hidden md:block w-px h-5 bg-border" />
        )}

        {/* Desktop Navigation */}
        <div className={`hidden md:flex items-center ${isScrolled ? "gap-1" : "gap-10 lg:gap-14"}`}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`nav-item transition-colors ${
                isScrolled
                  ? "px-4 py-2 rounded-full hover:bg-foreground/5"
                  : "hover:text-white/70 !text-white/90"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 transition-opacity hover:opacity-60 md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className={`w-5 h-5 ${isScrolled ? "text-foreground" : "text-white"}`} />
          ) : (
            <Menu className={`w-5 h-5 ${isScrolled ? "text-foreground" : "text-white"}`} />
          )}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`absolute left-4 right-4 bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_40px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden md:hidden ${
              isScrolled ? "top-[64px]" : "top-[60px]"
            }`}
          >
            <div className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="nav-item py-3 px-4 rounded-xl transition-colors hover:bg-foreground/5"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
