"use client";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";

const services = [
  {
    icon: "foundation",
    title: "Statik Proje Tasarımı",
    desc: "Betonarme ve çelik yapıların TBDY 2018'e tam uyumlu statik proje ve hesap raporları.",
  },
  {
    icon: "view_in_ar",
    title: "Çelik Yapı Tasarımı",
    desc: "Endüstriyel tesis, hal ve depo yapılarında ekonomik ve güvenli çelik konstrüksiyon çözümleri.",
  },
  {
    icon: "grid_4x4",
    title: "Sonlu Elemanlar Analizi",
    desc: "SAP2000, ETABS ve Tekla ile ileri düzey modelleme, deprem performans ve stabilite analizleri.",
  },
  {
    icon: "engineering",
    title: "Mühendislik Danışmanlığı",
    desc: "Mevcut yapı değerlendirme, güçlendirme projeleri ve uygulama sürecinde teknik destek.",
  },
];

export default function Services() {
  return (
    <section id="hizmetler" className="relative py-24 md:py-36 px-5 md:px-14" style={{ backgroundColor: "#f5f5f2" }}>
      <div className="mx-auto" style={{ maxWidth: 1440 }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 md:mb-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-6"
            >
              <span style={{ width: 48, height: 1.5, backgroundColor: "#1e3a5f" }} />
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#1e3a5f" }}>
                01 — Hizmetler
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold"
              style={{ lineHeight: 1.1, letterSpacing: "-0.02em", color: "#16293f", margin: 0 }}
            >
              Hesap bizim işimiz.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="max-w-sm text-base"
            style={{ lineHeight: 1.7, color: "#5a6b7d" }}
          >
            Projenin ilk çizgisinden son bulonuna kadar, yapısal güvenliği mühendislik disipliniyle garanti altına alıyoruz.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard strength={7} className="group relative overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #e3e3de" }}>
                <div className="p-8 md:p-9">
                  {/* Hover'da dolan lacivert şerit */}
                  <span
                    className="absolute top-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                    style={{ backgroundColor: "#1e3a5f" }}
                  />
                  <span
                    className="material-symbols-outlined block mb-7"
                    style={{ color: "#1e3a5f", fontSize: 42 }}
                  >
                    {s.icon}
                  </span>
                  <h3 className="text-lg font-bold mb-4" style={{ color: "#16293f", letterSpacing: "-0.01em" }}>
                    {s.title}
                  </h3>
                  <p className="text-sm" style={{ lineHeight: 1.7, color: "#5a6b7d" }}>
                    {s.desc}
                  </p>
                  <span
                    className="block mt-7 text-xs font-bold"
                    style={{ color: "#c4c9cd", letterSpacing: "0.1em" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
