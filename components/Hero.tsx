import Image from "next/image";

export default function Hero() {
  return (
    <section id="anasayfa" style={{ position: "relative", height: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 10 }} />
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf7enA31HHcZgs8hONgni9LQ1n207HGAwd_hcmQFyIbTcu_3nDDSnY1778ZUbVANURoZPGzR8CuLUIJMGgvv-2DFqX7u8m8vofLSG7FMoVAvuBw8Hb6Czr6m86t5uvV095k8KFhg4vtWFC9U-lkx10259ByrmvQnKFoYqJCXUscMlaxTmUJ38ZyhWe5mworIQpVCkrRj_6wsUtnv7ZqKgXW6wHt1DXSGmEpsbkTjtNs-hwVqkFsLJfOJzwRzSbef4e2XKlhWq3ZlQ"
          alt="Sardun Hero" fill className="object-cover" priority unoptimized
        />
      </div>
      <div style={{ position: "relative", zIndex: 20, padding: "0 64px", maxWidth: 1440, margin: "0 auto", width: "100%" }}>
        <div style={{ maxWidth: 768, display: "flex", flexDirection: "column", gap: 32 }}>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 72px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#e5e2e1", margin: 0 }}>
            Güçlü Temeller, <br /><span style={{ color: "#f9bc51" }}>Kalıcı Yapılar.</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "#d4c4b0", maxWidth: 480, margin: 0 }}>
            Sardun İnşaat — profesyonel çözümler, güvenilir hizmet. Mimari mükemmellik ve mühendislik disipliniyle geleceği inşa ediyoruz.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#iletisim" style={{ backgroundColor: "#c9922a", color: "#472f00", padding: "16px 32px", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
              TEKLİF AL
            </a>
            <a href="#projeler" style={{ border: "1px solid #e5e2e1", color: "#e5e2e1", padding: "16px 32px", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
              PROJELERİMİZ
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
