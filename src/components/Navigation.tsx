import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import docgLogo from "@/assets/docg-logo.png";

interface SubLink {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  children?: SubLink[];
}

const navLinks: NavItem[] = [
  {
    label: "COMPANY",
    children: [
      { label: "Overview", href: "/company/overview" },
      { label: "Leadership", href: "/company/leadership" },
      { label: "Careers", href: "/company/careers" },
    ],
  },
  {
    label: "PLATFORM",
    children: [
      { label: "AI Cortex", href: "/platform/ai-cortex" },
      { label: "EMR Layer", href: "/platform/emr-layer" },
      { label: "Virtual Care", href: "/platform/virtual-care" },
      { label: "Patient Access", href: "/platform/patient-access" },
    ],
  },
  {
    label: "INFRASTRUCTURE",
    children: [
      { label: "Deployment", href: "/infrastructure/deployment" },
      { label: "Governance", href: "/infrastructure/governance" },
      { label: "Audit Trails", href: "/infrastructure/audit-trails" },
      { label: "Interoperability", href: "/infrastructure/interoperability" },
    ],
  },
  { label: "CONTACT", href: "/company/contact" },
];

function useDropdownClamp(anchorRef: React.RefObject<HTMLDivElement>, open: boolean) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [leftOffset, setLeftOffset] = useState(0);

  const recompute = useCallback(() => {
    const anchorEl = anchorRef.current;
    const dropdownEl = dropdownRef.current;
    if (!anchorEl || !dropdownEl) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const dropW = dropdownEl.offsetWidth || dropdownEl.getBoundingClientRect().width;
    const vw = window.innerWidth;

    const MARGIN = 8;
    const preferredViewportLeft = anchorRect.left;
    const maxViewportLeft = Math.max(MARGIN, vw - dropW - MARGIN);
    const clampedViewportLeft = Math.min(Math.max(preferredViewportLeft, MARGIN), maxViewportLeft);

    setLeftOffset(clampedViewportLeft - anchorRect.left);
  }, [anchorRef]);

  useEffect(() => {
    if (!open) return;

    let raf1 = 0;
    let raf2 = 0;

    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(recompute);
    });

    window.addEventListener("resize", recompute);
    window.addEventListener("scroll", recompute, { passive: true });

    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      window.removeEventListener("resize", recompute);
      window.removeEventListener("scroll", recompute);
    };
  }, [open, recompute]);

  return { dropdownRef, leftOffset };
}

function DesktopNavItem({
  link,
  isScrolled,
  darkMode,
  open,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: {
  link: NavItem;
  isScrolled: boolean;
  darkMode: boolean;
  open: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const { dropdownRef, leftOffset } = useDropdownClamp(anchorRef, open);

  return (
    <div
      ref={anchorRef}
      className="relative"
      onMouseEnter={() => link.children && onMouseEnter()}
      onMouseLeave={() => link.children && onMouseLeave()}
    >
      {link.children ? (
        <button
          className={`nav-item transition-colors flex items-center gap-1 ${
            isScrolled
              ? "px-4 py-2 rounded-full hover:bg-foreground/5"
              : "hover:text-accent"
          } ${!isScrolled && darkMode ? "!text-white/90 hover:!text-white" : ""}`}
        >
          {link.label}
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      ) : (
        (() => {
          const isHash = link.href?.startsWith("#") || link.href?.includes("/#");
          const El = isHash ? "a" : Link;
          const elProps = isHash ? { href: link.href } : { to: link.href! };
          return (
            <El
              {...(elProps as any)}
              className={`nav-item transition-colors ${
                isScrolled ? "px-4 py-2 rounded-full hover:bg-foreground/5" : "hover:text-accent"
              } ${!isScrolled && darkMode ? "!text-white/90 hover:!text-white" : ""}`}
            >
              {link.label}
            </El>
          );
        })()
      )}

      <AnimatePresence>
        {link.children && open && (
          <motion.div
            ref={dropdownRef}
            style={{ left: leftOffset, right: "auto" }}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full mt-2 w-max min-w-[180px] bg-white/85 backdrop-blur-xl border border-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.08)] rounded-xl overflow-hidden"
          >
            <div className="py-2">
              {link.children.map((child) => {
                const isHash = child.href.includes("#");
                const El = isHash ? "a" : Link;
                const props = isHash ? { href: child.href } : { to: child.href };
                return (
                  <El
                    key={child.label}
                    {...(props as any)}
                    className="block px-5 py-2.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground/70 hover:text-foreground hover:bg-foreground/4 transition-colors"
                    onClick={onClose}
                  >
                    {child.label}
                  </El>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Navigation = ({ darkMode = false }: { darkMode?: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isScrolled
          ? "flex justify-center px-3 sm:px-4 pt-3 sm:pt-4"
          : "flex justify-between px-4 pt-4 sm:px-6 sm:pt-5 md:px-12 lg:px-20"
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
        <Link to="/" className="flex items-center px-3">
          <img
            src={docgLogo}
            alt="DocG AI"
            className={`h-[22px] md:h-[26px] w-auto transition-all duration-300 ${
              !isScrolled && darkMode ? "brightness-0 invert drop-shadow-[0_0_1px_rgba(255,255,255,0.8)]" : ""
            }`}
          />
        </Link>

        {/* Divider - only in island mode */}
        {isScrolled && <div className="hidden md:block w-px h-5 bg-border" />}

        {/* Desktop Navigation */}
        <div className={`hidden md:flex items-center ${isScrolled ? "gap-0" : "gap-8 lg:gap-12"}`}>
          {navLinks.map((link) => (
            <DesktopNavItem
              key={link.label}
              link={link}
              isScrolled={isScrolled}
              darkMode={darkMode}
              open={openDropdown === link.label}
              onMouseEnter={() => link.children && handleMouseEnter(link.label)}
              onMouseLeave={handleMouseLeave}
              onClose={() => setOpenDropdown(null)}
            />
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 transition-opacity hover:opacity-60 md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className={`w-5 h-5 ${!isScrolled && darkMode ? "text-white" : "text-foreground"}`} />
          ) : (
            <Menu className={`w-5 h-5 ${!isScrolled && darkMode ? "text-white" : "text-foreground"}`} />
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
                <div key={link.label}>
                  {link.children ? (
                    <>
                      <button
                        onClick={() =>
                          setOpenMobileDropdown(openMobileDropdown === link.label ? null : link.label)
                        }
                        className="nav-item w-full flex items-center justify-between py-3 px-4 rounded-xl transition-colors hover:bg-foreground/5"
                      >
                        {link.label}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            openMobileDropdown === link.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {openMobileDropdown === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-6 pb-2">
                              {link.children.map((child) => {
                                const isHash = child.href.includes("#");
                                const El = isHash ? "a" : Link;
                                const props = isHash ? { href: child.href } : { to: child.href };
                                return (
                                  <El
                                    key={child.label}
                                    {...(props as any)}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block py-2.5 px-4 text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground/60 hover:text-foreground transition-colors"
                                  >
                                    {child.label}
                                  </El>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    (() => {
                      const isHash = link.href?.startsWith("#") || link.href?.includes("/#");
                      const El = isHash ? "a" : Link;
                      const elProps = isHash ? { href: link.href } : { to: link.href! };
                      return (
                        <El
                          {...(elProps as any)}
                          onClick={() => setIsMenuOpen(false)}
                          className="nav-item py-3 px-4 rounded-xl transition-colors hover:bg-foreground/5 block"
                        >
                          {link.label}
                        </El>
                      );
                    })()
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
