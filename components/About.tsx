"use client";
import { motion } from "framer-motion";
import { Monogram } from "./Logo";

const principles = [
  { icon: "verified", title: "Yönetmelik Uyumu", desc: "TBDY 2018 ve Eurocode standartlarına tam uyum." },
  { icon: "precision_manufacturing", title: "Üretime Hazır Detay", desc: "Sahada soru bırakmayan bağlantı ve imalat çizimleri." },
  { icon: "schedule", title: "Zamanında Teslim", desc: "Taahhüt edilen sürede, eksiksiz rapor ve proje seti." },
];

export default function About() {
  return (
    <section id="hakkimizda" className="relative py-24 md:py-36 px-5 md:px-14 overflow-hidden" style={{ backgroundColor: "#f5f5f2" }}>
      {/* Arka plan monogram */}
      <div className="absolute hidden xl:block" style={{ left: "-80px", bottom: "-60px", opacity: 0.05 }}>
        <Monogram size={480} color="navy" />
      </div>

      <div className="relative mx-auto" style={{ maxWidth: 1440 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-6"
            >
              <span style={{ width: 48, height: 1.5, backgroundColor: "#1e3a5f" }} />
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#1e3a5f" }}>
                03 — Hakkımızda
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold"
              style={{ lineHeight: 1.12, letterSpacing: "-0.02em", color: "#16293f", margin: 0 }}
            >
              Sağlam yapı,
              <br />
              sağlam hesapla başlar.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-base md:text-lg mt-8 max-w-xl"
              style={{ lineHeight: 1.8, color: "#5a6b7d" }}
            >
              Sardun Mühendislik &amp; Mimarlık, Ankara merkezli bir yapısal tasarım ofisidir.
              İnşaat mühendisliği disiplinini modern analiz araçlarıyla birleştirerek betonarme
              ve çelik yapılarda güvenli, ekonomik ve uygulanabilir çözümler üretiyoruz.
              Bizim için her proje; taşıyıcı sistemin ilk kurgusundan son bulon detayına kadar
              hesaplanmış bir bütündür.
            </motion.p>
          </div>

          <div className="flex flex-col gap-4 lg:pt-24">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: 44 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: -6 }}
                className="flex gap-6 items-start p-7"
                style={{ backgroundColor: "#ffffff", border: "1px solid #e3e3de" }}
              >
                <span className="material-symbols-outlined" style={{ color: "#1e3a5f", fontSize: 34 }}>
                  {p.icon}
                </span>
                <div>
                  <h3 className="text-base font-bold mb-1.5" style={{ color: "#16293f" }}>{p.title}</h3>
                  <p className="text-sm" style={{ lineHeight: 1.65, color: "#5a6b7d", margin: 0 }}>{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
