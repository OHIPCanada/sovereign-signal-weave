import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "PRODUCT", href: "#product" },
    { label: "FEATURES", href: "#features" },
    { label: "PRICING", href: "#pricing" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5 md:px-12 lg:px-20 md:py-6">
      <nav className="flex items-center justify-between max-w-[1600px] mx-auto">
        {/* Logo */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-1.5"
        >
          <span className="text-lg md:text-xl font-bold tracking-widest text-foreground uppercase">
            SPACECLOUD
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
        </motion.a>

        {/* Desktop Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden md:flex items-center gap-12"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors tracking-wider"
            >
              {link.label}
            </a>
          ))}
        </motion.div>

        {/* Search & Menu */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-5"
        >
          {/* Search Bar */}
          <div className="hidden lg:flex items-center gap-3 px-5 py-3 bg-card border border-border/50 rounded-lg">
            <input
              type="text"
              placeholder="SEARCH ANY INFORMATION"
              className="bg-transparent text-xs font-medium tracking-wider text-muted-foreground placeholder:text-muted-foreground/60 outline-none w-44"
            />
            <Search className="w-4 h-4 text-muted-foreground/60" />
          </div>

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-muted/30 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </motion.div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 bg-background/98 backdrop-blur-lg border-b border-border"
          >
            <div className="flex flex-col p-6 gap-4 max-w-[1600px] mx-auto">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-base font-medium text-foreground py-2 tracking-wider"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-lg mt-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
