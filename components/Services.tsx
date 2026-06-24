"use client";

const services = [
  { icon: "home_work", title: "Konut İnşaatı", desc: "Modern yaşam standartlarına uygun, güvenli ve estetik konut projeleri." },
  { icon: "architecture", title: "Tadilat & Restorasyon", desc: "Mevcut yapıların modernizasyonu ve tarihi dokunun korunması." },
  { icon: "construction", title: "Proje Yönetimi", desc: "Zamanında ve bütçe dahilinde teslim için profesyonel yönetim." },
  { icon: "engineering", title: "Teknik Danışmanlık", desc: "Statik ve mimari süreçlerde uzman mühendislik görüşleri." },
];

export default function Services() {
  return (
    <section id="hizmetler" className="py-20 md:py-32 px-5 md:px-16" style={{ backgroundColor: "#131313" }}>
      <div className="mx-auto" style={{ maxWidth: 1440 }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12 md:mb-16">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-semibold mb-4" style={{ lineHeight: 1.2, letterSpacing: "-0.01em", color: "#e5e2e1" }}>Hizmetlerimiz</h2>
            <p className="text-base" style={{ lineHeight: 1.6, color: "#d4c4b0" }}>İnşaat sürecinin her aşamasında teknik uzmanlık ve titizlikle yanınızdayız.</p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f9bc51" }}>01 / SERVİS</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div key={s.title}
              className="p-8 transition-all duration-300 cursor-default"
              style={{ backgroundColor: "#1c1b1b", border: "1px solid #262626" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#f9bc51"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#262626"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
              <span className="material-symbols-outlined block mb-6" style={{ color: "#f9bc51", fontSize: 40 }}>{s.icon}</span>
              <h3 className="text-xl font-semibold mb-4" style={{ color: "#e5e2e1" }}>{s.title}</h3>
              <p className="text-sm" style={{ lineHeight: 1.6, color: "#d4c4b0" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
