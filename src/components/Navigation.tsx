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
    <header className="fixed top-0 left-0 right-0 z-40 px-6 py-5 md:px-12 lg:px-20 md:py-6">
      <nav className="flex items-center justify-between max-w-[1600px] mx-auto">
        {/* Logo */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="flex items-center gap-1.5"
        >
          <span className="text-lg md:text-xl font-bold tracking-widest uppercase"
            style={{ color: "#2E2A4F" }}>
            DOCG<span style={{ color: "#00FFFF" }}>AI</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#00FFFF" }} />
        </motion.a>

        {/* Desktop Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="hidden md:flex items-center gap-12"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium tracking-wider transition-colors hover:opacity-70"
              style={{ color: "#2E2A4F" }}
            >
              {link.label}
            </a>
          ))}
        </motion.div>

        {/* Search & Menu */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.7 }}
          className="flex items-center gap-5"
        >
          {/* Search Bar */}
          <div className="hidden lg:flex items-center gap-3 px-5 py-3 rounded-lg border"
            style={{ backgroundColor: "rgba(255,255,255,0.8)", borderColor: "rgba(46, 42, 79, 0.1)" }}>
            <input
              type="text"
              placeholder="SEARCH ANY INFORMATION"
              className="bg-transparent text-xs font-medium tracking-wider outline-none w-44"
              style={{ color: "#5F6368" }}
            />
            <Search className="w-4 h-4" style={{ color: "#5F6368" }} />
          </div>

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg transition-colors hover:bg-white/50"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" style={{ color: "#2E2A4F" }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: "#2E2A4F" }} />
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
            className="absolute top-full left-0 right-0 backdrop-blur-lg border-b md:hidden"
            style={{ backgroundColor: "rgba(242, 243, 244, 0.98)", borderColor: "rgba(46, 42, 79, 0.1)" }}
          >
            <div className="flex flex-col p-6 gap-4 max-w-[1600px] mx-auto">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-base font-medium py-2 tracking-wider"
                  style={{ color: "#2E2A4F" }}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg mt-2"
                style={{ backgroundColor: "rgba(46, 42, 79, 0.05)" }}>
                <Search className="w-4 h-4" style={{ color: "#5F6368" }} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-sm outline-none flex-1"
                  style={{ color: "#2E2A4F" }}
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
