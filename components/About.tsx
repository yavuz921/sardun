import Image from "next/image";

const badges = [
  { icon: "verified", label: "LİSANSLI" },
  { icon: "security", label: "SİGORTALI" },
  { icon: "schedule", label: "ZAMANINDA TESLİM" },
];

export default function About() {
  return (
    <section id="hakkimizda" className="py-20 md:py-32 px-5 md:px-16" style={{ backgroundColor: "#131313" }}>
      <div className="mx-auto" style={{ maxWidth: 1440 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="relative">
            <div className="absolute -top-6 -left-6 md:-top-8 md:-left-8 w-24 h-24 md:w-32 md:h-32 hidden md:block" style={{ borderTop: "2px solid #f9bc51", borderLeft: "2px solid #f9bc51" }} />
            <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuB56ynajpHWvIHprhvCK0KZMVPXD9p_VgWfso6OfKWH1-xK8lht2ehMYUToKQXLcMroTKfOubdccRvuPQd27rOqLbHhV-WtuhVQL83cCrJZm4hcFCgjkSYOv9JjWUpe0ONHmi92iTfg8c7-7eORrQ2Q6zV66g4mJk5gc00Q9kIhmF7aD6CH2J30Xh_5McYbZssdSiXU6WQib99eKGJrlG2gsdmPDkTecEm-Dl9VJMh5zJdRtIKrK6MO3tzxWs564MAZxXiW_kzz8mY"
              alt="Sardun Ekibi" width={700} height={500} className="w-full h-auto relative z-10" style={{ border: "1px solid #262626" }} unoptimized />
          </div>

          <div className="flex flex-col gap-6 md:gap-8">
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f9bc51" }}>03 / HAKKIMIZDA</span>
            <h2 className="text-3xl md:text-5xl font-semibold" style={{ lineHeight: 1.2, letterSpacing: "-0.01em", color: "#e5e2e1", margin: 0 }}>
              Çelik Disiplin, <br />Mimari Vizyon.
            </h2>
            <p className="text-base md:text-lg" style={{ lineHeight: 1.6, color: "#d4c4b0", margin: 0 }}>
              Sardun İnşaat olarak, sektördeki yılların deneyimini modern mühendislik teknikleriyle birleştiriyoruz. Her projemizde yapısal bütünlüğü ve estetiği en üst seviyede tutarak, gelecek nesillere kalıcı eserler bırakıyoruz.
            </p>
            <div className="grid grid-cols-3 gap-3 md:gap-4 pt-4">
              {badges.map((b) => (
                <div key={b.label} className="flex flex-col items-center p-3 md:p-4 text-center gap-2" style={{ backgroundColor: "#201f1f", border: "1px solid #262626" }}>
                  <span className="material-symbols-outlined" style={{ color: "#f9bc51", fontSize: 28 }}>{b.icon}</span>
                  <span className="text-xs font-semibold" style={{ letterSpacing: "0.06em", textTransform: "uppercase", color: "#e5e2e1" }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
