"use client";
import { useEffect, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      sections.forEach((s) => {
        const el = s as HTMLElement;
        if (window.scrollY >= el.offsetTop - 100) current = el.id;
      });
      if (current) setActive(current);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: "rgba(19,19,19,0.97)", backdropFilter: "blur(12px)", borderColor: "#504536" }}>
      <div className="flex justify-between items-center px-5 md:px-16 py-4 md:py-6 mx-auto" style={{ maxWidth: 1440 }}>
        <a href="#anasayfa"><Logo size={0.38} /></a>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors duration-300" style={{
              fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              textDecoration: "none",
              color: active === link.href.slice(1) ? "#f9bc51" : "#e5e2e1",
              borderBottom: active === link.href.slice(1) ? "2px solid #f9bc51" : "none",
              paddingBottom: active === link.href.slice(1) ? 4 : 0,
            }}>
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#iletisim" className="hidden md:inline-block" style={{
          backgroundColor: "#c9922a", color: "#472f00", padding: "12px 24px",
          fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
        }}>
          TEKLİF AL
        </a>

        {/* Hamburger */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "#e5e2e1", cursor: "pointer", padding: 4 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 28 }}>{menuOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-6 px-5 py-6" style={{ borderTop: "1px solid #262626", backgroundColor: "#131313" }}>
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
              fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#e5e2e1", textDecoration: "none",
            }}>
              {link.label}
            </a>
          ))}
          <a href="#iletisim" onClick={() => setMenuOpen(false)} className="text-center" style={{
            backgroundColor: "#c9922a", color: "#472f00", padding: "14px 24px",
            fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
          }}>
            TEKLİF AL
          </a>
        </div>
      )}
    </header>
  );
}
