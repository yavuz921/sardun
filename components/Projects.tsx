"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const featured = {
  img: "/projects/celik-hal.jpeg",
  tag: "ÇELİK KONSTRÜKSİYON",
  title: "Endüstriyel Hal Yapısı",
  desc: "Geniş açıklıklı çelik hal yapısının tam yapısal modeli — çapraz stabilite elemanları, aşık sistemi ve temel bağlantı detaylarıyla birlikte tasarlandı.",
};

const others = [
  {
    img: "/projects/sap2000-analiz.jpeg",
    tag: "SAP2000",
    title: "Çelik Yapı Sonlu Eleman Analizi",
    desc: "Deprem ve rüzgâr yükleri altında eleman bazlı kapasite kontrolü.",
  },
  {
    img: "/projects/etabs-betonarme.jpeg",
    tag: "ETABS",
    title: "Betonarme Bina Modellemesi",
    desc: "Çok katlı betonarme taşıyıcı sistemin kat bazlı analiz ve donatı tasarımı.",
  },
  {
    img: "/projects/tekla-celik.jpeg",
    tag: "TEKLA STRUCTURES",
    title: "Çelik Platform Detaylandırma",
    desc: "Bağlantı ve montaj detaylarına kadar üretime hazır BIM modeli.",
  },
  {
    img: "/projects/temel-tasarim.jpeg",
    tag: "GEOTEKNİK",
    title: "Kazıklı Temel Tasarımı",
    desc: "Zemin koşullarına göre kazıklı radye temel sistemi modellemesi.",
  },
];

export default function Projects() {
  return (
    <section id="projeler" className="py-24 md:py-36 px-5 md:px-14" style={{ backgroundColor: "#ffffff" }}>
      <div className="mx-auto" style={{ maxWidth: 1440 }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 md:mb-20">
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
                02 — Projeler
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold"
              style={{ lineHeight: 1.1, letterSpacing: "-0.02em", color: "#16273B", margin: 0 }}
            >
              Analizden sahaya.
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
            Her proje; modelleme, analiz ve raporlama aşamalarından geçerek üretime hazır hale gelir.
          </motion.p>
        </div>

        {/* Öne çıkan proje */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="group grid grid-cols-1 lg:grid-cols-5 mb-5 overflow-hidden"
          style={{ backgroundColor: "#16273B" }}
        >
          <div className="relative lg:col-span-3 overflow-hidden" style={{ minHeight: 320 }}>
            <Image
              src={featured.img}
              alt={featured.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
          </div>
          <div className="lg:col-span-2 flex flex-col justify-center p-8 md:p-14 gap-5">
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.24em", color: "#B9C2CD" }}>
              {featured.tag}
            </span>
            <h3 className="text-2xl md:text-4xl font-extrabold" style={{ color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15, margin: 0 }}>
              {featured.title}
            </h3>
            <p className="text-sm md:text-base" style={{ lineHeight: 1.75, color: "rgba(255,255,255,0.65)", margin: 0 }}>
              {featured.desc}
            </p>
          </div>
        </motion.div>

        {/* Diğer projeler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {others.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group cursor-default"
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/3", border: "1px solid #e3e3de", backgroundColor: "#F6F6F6" }}>
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                  unoptimized
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(to top, rgba(22,41,63,0.75), transparent 55%)" }}
                />
              </div>
              <div className="pt-5">
                <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.22em", color: "#1e3a5f" }}>
                  {p.tag}
                </span>
                <h3 className="text-lg font-bold mt-2 mb-2" style={{ color: "#16273B", letterSpacing: "-0.01em" }}>
                  {p.title}
                </h3>
                <p className="text-sm" style={{ lineHeight: 1.65, color: "#5a6b7d", margin: 0 }}>
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
