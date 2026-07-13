"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const links = [
  { href: "#anasayfa", label: "Anasayfa" },
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#projeler", label: "Projeler" },
  { href: "#hakkimizda", label: "Hakkımızda" },
  { href: "#iletisim", label: "İletişim" },
];

export default function Navbar() {
  const [active, setActive] = useState("anasayfa");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      sections.forEach((s) => {
        const el = s as HTMLElement;
        if (window.scrollY >= el.offsetTop - 120) current = el.id;
      });
      if (current) setActive(current);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? "rgba(15, 29, 46, 0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
      }}
    >
      <div className="flex justify-between items-center px-5 md:px-14 py-4 mx-auto" style={{ maxWidth: 1440 }}>
        <a href="#anasayfa" aria-label="Sardun anasayfa">
          <Logo variant="light" compact={scrolled} />
        </a>

        {/* Desktop */}
        <nav className="hidden md:flex gap-9 items-center">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative transition-colors duration-300"
              style={{
                fontSize: 12.5, fontWeight: 600, letterSpacing: "0.12em",
                textTransform: "uppercase", textDecoration: "none",
                color: active === link.href.slice(1) ? "#ffffff" : "rgba(255,255,255,0.6)",
              }}
            >
              {link.label}
              {active === link.href.slice(1) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-0 right-0"
                  style={{ bottom: -6, height: 2, backgroundColor: "#B9C2CD" }}
                />
              )}
            </a>
          ))}
        </nav>

        <a
          href="#iletisim"
          className="hidden md:inline-block transition-all duration-300 hover:opacity-85"
          style={{
            border: "1px solid rgba(255,255,255,0.35)", color: "#fff",
            padding: "11px 26px", fontSize: 12, fontWeight: 600,
            letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none",
          }}
        >
          Teklif Al
        </a>

        {/* Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü"
          style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 30 }}>
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
            style={{ backgroundColor: "rgba(15,29,46,0.98)", backdropFilter: "blur(14px)" }}
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ x: -24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    fontSize: 14, fontWeight: 600, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: "#fff", textDecoration: "none",
                    padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#iletisim"
                onClick={() => setMenuOpen(false)}
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: links.length * 0.06 }}
                className="text-center mt-4 mb-2"
                style={{
                  backgroundColor: "#B9C2CD", color: "#16273B", padding: "14px",
                  fontSize: 12.5, fontWeight: 700, letterSpacing: "0.14em",
                  textTransform: "uppercase", textDecoration: "none",
                }}
              >
                Teklif Al
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
