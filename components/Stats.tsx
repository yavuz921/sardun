"use client";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, count, to]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const stats = [
  { value: 12, suffix: "+", label: "Tamamlanan Analiz" },
  { value: 3, suffix: "", label: "Uzmanlık Yazılımı" },
  { value: 100, suffix: "%", label: "Yönetmelik Uyumu" },
  { value: 24, suffix: "s", label: "Dönüş Süresi" },
];

export default function Stats() {
  return (
    <section style={{ backgroundColor: "#0F1B2E" }}>
      <div className="mx-auto px-5 md:px-14 py-14 md:py-20" style={{ maxWidth: 1440 }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-3"
              style={{ borderLeft: i % 2 === 1 ? "1px solid rgba(255,255,255,0.08)" : undefined }}
            >
              <span className="text-4xl md:text-6xl font-extrabold" style={{ color: "#ffffff", letterSpacing: "-0.02em" }}>
                <Counter to={s.value} suffix={s.suffix} />
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8fa3b8" }}>
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
