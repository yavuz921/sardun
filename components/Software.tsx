"use client";
import { motion } from "framer-motion";

const tools = [
  { name: "Tekla Structures", role: "Çelik detaylandırma & BIM modelleme" },
  { name: "ETABS", role: "Betonarme bina analiz & tasarımı" },
  { name: "SAP2000", role: "Genel yapısal sonlu eleman analizi" },
];

export default function Software() {
  return (
    <section className="py-20 md:py-28 px-5 md:px-14" style={{ backgroundColor: "#16293f" }}>
      <div className="mx-auto" style={{ maxWidth: 1440 }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-12"
        >
          <span style={{ width: 48, height: 1.5, backgroundColor: "#d9a441" }} />
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#d9a441" }}>
            Kullandığımız Teknolojiler
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {tools.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="py-8 md:py-6 md:px-10 first:pl-0 flex flex-col gap-2"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span className="text-2xl md:text-3xl font-extrabold" style={{ color: "#ffffff", letterSpacing: "-0.01em" }}>
                {t.name}
              </span>
              <span style={{ fontSize: 13.5, color: "#8fa3b8", lineHeight: 1.6 }}>{t.role}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
