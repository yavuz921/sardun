"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Monogram } from "./Logo";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
};
const item = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const monoOpacity = useTransform(scrollYProgress, [0, 0.6], [0.07, 0]);

  return (
    <section
      ref={ref}
      id="anasayfa"
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: "100svh", backgroundColor: "#16293f" }}
    >
      {/* Parallax blueprint grid */}
      <motion.div className="absolute inset-0 blueprint-grid" style={{ y: gridY }} />

      {/* Dev arka plan monogramı */}
      <motion.div
        className="absolute hidden lg:block"
        style={{ right: "4%", top: "12%", opacity: monoOpacity }}
      >
        <Monogram size={520} color="#ffffff" />
      </motion.div>

      {/* Alt geçiş gradyanı */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 140, background: "linear-gradient(to bottom, transparent, #0f1d2e)" }} />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full px-5 md:px-14 mx-auto"
        style={{ maxWidth: 1440, y: contentY }}
      >
        <div className="max-w-4xl pt-32 pb-24 md:pt-40 md:pb-32">
          <motion.div variants={item} className="flex items-center gap-4 mb-8">
            <span style={{ width: 56, height: 1.5, backgroundColor: "#d9a441", display: "inline-block" }} />
            <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#d9a441" }}>
              Mühendislik &amp; Mimarlık
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold"
            style={{ lineHeight: 1.04, letterSpacing: "-0.03em", color: "#ffffff", margin: 0 }}
          >
            Hesaplanmış
            <br />
            <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.55)" }}>
              güven.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-base md:text-xl mt-8 max-w-2xl"
            style={{ lineHeight: 1.7, color: "rgba(255,255,255,0.72)" }}
          >
            Sardun Mühendislik — betonarme ve çelik yapılarda statik proje, ileri yapısal analiz
            ve mühendislik danışmanlığı. Her yapının arkasında milimetrik hesap vardır.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 mt-12">
            <motion.a
              href="#projeler"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="text-center"
              style={{
                backgroundColor: "#d9a441", color: "#16293f", padding: "18px 40px",
                fontSize: 13, fontWeight: 700, letterSpacing: "0.14em",
                textTransform: "uppercase", textDecoration: "none",
              }}
            >
              Projelerimiz
            </motion.a>
            <motion.a
              href="#iletisim"
              whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.8)" }}
              whileTap={{ scale: 0.97 }}
              className="text-center"
              style={{
                border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "18px 40px",
                fontSize: 13, fontWeight: 600, letterSpacing: "0.14em",
                textTransform: "uppercase", textDecoration: "none",
              }}
            >
              İletişime Geç
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll göstergesi */}
      <motion.div
        className="absolute left-1/2 hidden md:flex flex-col items-center gap-2"
        style={{ bottom: 36, x: "-50%" }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
          Keşfet
        </span>
        <span style={{ width: 1, height: 44, background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)" }} />
      </motion.div>
    </section>
  );
}
