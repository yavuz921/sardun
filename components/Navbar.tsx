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
    <header style={{ backgroundColor: "rgba(19,19,19,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #504536", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 64px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="#anasayfa"><Logo size={0.42} /></a>

        <nav style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} style={{
              fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              color: active === link.href.slice(1) ? "#f9bc51" : "#e5e2e1",
              borderBottom: active === link.href.slice(1) ? "2px solid #f9bc51" : "none",
              paddingBottom: active === link.href.slice(1) ? 4 : 0,
              textDecoration: "none", transition: "color 0.3s",
            }}>
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#iletisim" className="hidden md:inline-block" style={{
          backgroundColor: "#c9922a", color: "#472f00", padding: "12px 24px",
          fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
          textDecoration: "none", transition: "background-color 0.2s",
        }}>
          TEKLİF AL
        </a>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "#e5e2e1", cursor: "pointer" }}>
          <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {menuOpen && (
        <div style={{ borderTop: "1px solid #504536", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 24 }}>
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
              fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#e5e2e1", textDecoration: "none",
            }}>{link.label}</a>
          ))}
          <a href="#iletisim" onClick={() => setMenuOpen(false)} style={{
            backgroundColor: "#c9922a", color: "#472f00", padding: "12px 24px",
            fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
            textDecoration: "none", textAlign: "center",
          }}>TEKLİF AL</a>
        </div>
      )}
    </header>
  );
}
