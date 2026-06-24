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
      <div className="mx-auto px-5 md:px-16 py-12 md:py-16 flex flex-col md:flex-row justify-between items-start gap-10" style={{ maxWidth: 1440 }}>
        <div className="flex flex-col gap-4">
          <Logo size={0.38} />
          <p className="text-sm md:text-base max-w-xs" style={{ lineHeight: 1.6, color: "#d4c4b0", margin: 0 }}>
            Mimari mükemmellik ve mühendislik disipliniyle geleceği inşa ediyoruz.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-10 gap-y-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm md:text-base" style={{ color: "#d4c4b0", textDecoration: "none" }}>{l.label}</a>
          ))}
        </nav>
        <div className="text-sm" style={{ color: "#d4c4b0" }}>© 2025 Sardun İnşaat</div>
      </div>
    </footer>
  );
}
