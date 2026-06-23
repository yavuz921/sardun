"use client";
const services = [
  { icon: "home_work", title: "Konut İnşaatı", desc: "Modern yaşam standartlarına uygun, güvenli ve estetik konut projeleri." },
  { icon: "architecture", title: "Tadilat & Restorasyon", desc: "Mevcut yapıların modernizasyonu ve tarihi dokunun korunması." },
  { icon: "construction", title: "Proje Yönetimi", desc: "Zamanında ve bütçe dahilinde teslim için profesyonel yönetim." },
  { icon: "engineering", title: "Teknik Danışmanlık", desc: "Statik ve mimari süreçlerde uzman mühendislik görüşleri." },
];

export default function Services() {
  return (
    <section id="hizmetler" style={{ padding: "128px 64px", backgroundColor: "#131313" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, gap: 24, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 480 }}>
            <h2 style={{ fontSize: 48, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.01em", color: "#e5e2e1", margin: "0 0 16px 0" }}>Hizmetlerimiz</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "#d4c4b0", margin: 0 }}>İnşaat sürecinin her aşamasında teknik uzmanlık ve titizlikle yanınızdayız.</p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f9bc51" }}>01 / SERVİS</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {services.map((s) => (
            <div key={s.title} style={{ backgroundColor: "#1c1b1b", border: "1px solid #262626", padding: 32, transition: "border-color 0.3s, transform 0.3s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#f9bc51"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#262626"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
              <span className="material-symbols-outlined" style={{ color: "#f9bc51", fontSize: 40, display: "block", marginBottom: 24 }}>{s.icon}</span>
              <h3 style={{ fontSize: 24, fontWeight: 600, color: "#e5e2e1", margin: "0 0 16px 0" }}>{s.title}</h3>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: "#d4c4b0", margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
