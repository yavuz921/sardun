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
    <footer style={{ backgroundColor: "#0f1d2e", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div
        className="mx-auto px-5 md:px-14 py-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-10"
        style={{ maxWidth: 1440 }}
      >
        <div className="flex flex-col gap-5">
          <Logo variant="light" />
          <p className="text-sm max-w-xs" style={{ lineHeight: 1.7, color: "#8fa3b8", margin: 0 }}>
            Betonarme ve çelik yapılarda statik proje, analiz ve mühendislik danışmanlığı.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-9 gap-y-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors duration-300 hover:text-white"
              style={{ fontSize: 13.5, color: "#8fa3b8", textDecoration: "none" }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-1 text-sm" style={{ color: "#8fa3b8" }}>
          <span>Çankaya / Ankara</span>
          <span>© 2026 Sardun Mühendislik &amp; Mimarlık</span>
        </div>
      </div>
    </footer>
  );
}
