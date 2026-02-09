import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "PLATFORM", href: "#platform" },
    { label: "TECHNOLOGY", href: "#technology" },
    { label: "COMPANY", href: "#company" },
    { label: "CONTACT", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5 md:px-12 lg:px-20">
      <nav className="flex items-center justify-between max-w-[1400px] mx-auto">
        {/* Logo */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center"
        >
          <span className="text-[14px] md:text-[16px] font-bold tracking-[0.12em] uppercase text-[#2B2F3A]">
            DOCG AI
          </span>
        </motion.a>

        {/* Desktop Navigation - Centered */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hidden md:flex items-center gap-10 lg:gap-14"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-item"
            >
              {link.label}
            </a>
          ))}
        </motion.div>

        {/* Menu Button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 transition-opacity hover:opacity-60 md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-[#2B2F3A]" />
          ) : (
            <Menu className="w-6 h-6 text-[#2B2F3A]" />
          )}
        </motion.button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-border md:hidden"
          >
            <div className="flex flex-col p-6 gap-4 max-w-[1400px] mx-auto">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="nav-item py-2"
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
