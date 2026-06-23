import Logo from "./Logo";

const links = [
  { href: "#anasayfa", label: "Anasayfa" },
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#projeler", label: "Projeler" },
  { href: "#hakkimizda", label: "Hakkımızda" },
  { href: "#iletisim", label: "İletişim" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0e0e0e", borderTop: "1px solid #504536" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "64px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Logo size={0.28} />
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#d4c4b0", maxWidth: 280, margin: 0 }}>
            Mimari mükemmellik ve mühendislik disipliniyle geleceği inşa ediyoruz.
          </p>
        </div>
        <nav style={{ display: "flex", flexWrap: "wrap", gap: "16px 48px" }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} style={{ fontSize: 16, lineHeight: 1.6, color: "#d4c4b0", textDecoration: "none" }}>{l.label}</a>
          ))}
        </nav>
        <div style={{ fontSize: 14, color: "#d4c4b0" }}>© 2025 Sardun İnşaat</div>
      </div>
    </footer>
  );
}
