import Image from "next/image";

const badges = [
  { icon: "verified", label: "LİSANSLI" },
  { icon: "security", label: "SİGORTALI" },
  { icon: "schedule", label: "ZAMANINDA TESLİM" },
];

export default function About() {
  return (
    <section id="hakkimizda" style={{ padding: "128px 64px", backgroundColor: "#131313" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 80, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: -32, left: -32, width: 128, height: 128, borderTop: "2px solid #f9bc51", borderLeft: "2px solid #f9bc51" }} />
          <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuB56ynajpHWvIHprhvCK0KZMVPXD9p_VgWfso6OfKWH1-xK8lht2ehMYUToKQXLcMroTKfOubdccRvuPQd27rOqLbHhV-WtuhVQL83cCrJZm4hcFCgjkSYOv9JjWUpe0ONHmi92iTfg8c7-7eORrQ2Q6zV66g4mJk5gc00Q9kIhmF7aD6CH2J30Xh_5McYbZssdSiXU6WQib99eKGJrlG2gsdmPDkTecEm-Dl9VJMh5zJdRtIKrK6MO3tzxWs564MAZxXiW_kzz8mY"
            alt="Sardun Ekibi" width={700} height={500} style={{ width: "100%", height: "auto", border: "1px solid #262626", position: "relative", zIndex: 10 }} unoptimized />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f9bc51" }}>03 / HAKKIMIZDA</span>
          <h2 style={{ fontSize: 48, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.01em", color: "#e5e2e1", margin: 0 }}>Çelik Disiplin, <br />Mimari Vizyon.</h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "#d4c4b0", margin: 0 }}>
            Sardun İnşaat olarak, sektördeki yılların deneyimini modern mühendislik teknikleriyle birleştiriyoruz. Her projemizde yapısal bütünlüğü ve estetiği en üst seviyede tutarak, gelecek nesillere kalıcı eserler bırakıyoruz.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {badges.map((b) => (
              <div key={b.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 16, backgroundColor: "#201f1f", border: "1px solid #262626", textAlign: "center", gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: "#f9bc51", fontSize: 28 }}>{b.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e5e2e1" }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
