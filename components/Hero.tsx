"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Structure3D from "./Structure3D";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.3 } },
};
const item = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="anasayfa"
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: "100svh", backgroundColor: "#0f1d2e" }}
    >
      {/* Arka plan derinlik gradyanları */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 72% 42%, rgba(47,84,128,0.35), transparent 55%), radial-gradient(circle at 20% 80%, rgba(217,164,65,0.10), transparent 50%)",
        }}
      />

      {/* 3D dönen çelik yapı — sağ tarafta, mobilde arka planda ortalı */}
      <motion.div
        className="absolute inset-0 md:left-auto md:right-0 md:w-[58%] z-0"
        style={{ opacity: sceneOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.4 }}
      >
        <Structure3D />
      </motion.div>

      {/* Mobilde 3D üstüne okunabilirlik için lacivert perde */}
      <div className="absolute inset-0 z-[1] md:hidden" style={{ background: "linear-gradient(to right, rgba(15,29,46,0.82), rgba(15,29,46,0.5))" }} />

      {/* Alt geçiş */}
      <div className="absolute bottom-0 left-0 right-0 z-[2]" style={{ height: 150, background: "linear-gradient(to bottom, transparent, #0f1d2e)" }} />

      {/* İçerik */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full px-5 md:px-14 mx-auto"
        style={{ maxWidth: 1440, y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-2xl">
          <motion.div variants={item} className="flex items-center gap-4 mb-8">
            <motion.span
              style={{ height: 1.5, backgroundColor: "#d9a441", display: "inline-block" }}
              initial={{ width: 0 }}
              animate={{ width: 56 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
            <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#d9a441" }}>
              Mühendislik &amp; Mimarlık
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold"
            style={{ lineHeight: 1.03, letterSpacing: "-0.035em", color: "#ffffff", margin: 0 }}
          >
            Hesaplanmış
            <br />
            <span style={{ color: "#d9a441" }}>güven inşa ederiz.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-base md:text-xl mt-8 max-w-lg"
            style={{ lineHeight: 1.7, color: "rgba(255,255,255,0.78)" }}
          >
            Betonarme ve çelik yapılarda statik proje, ileri yapısal analiz ve mühendislik
            danışmanlığı. Her yapının arkasında milimetrik hesap vardır.
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
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.97 }}
              className="text-center"
              style={{
                border: "1px solid rgba(255,255,255,0.35)", color: "#fff", padding: "18px 40px",
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
        className="absolute left-1/2 hidden md:flex flex-col items-center gap-2 z-10"
        style={{ bottom: 30, x: "-50%" }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
          Keşfet
        </span>
        <span style={{ width: 1, height: 44, background: "linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)" }} />
      </motion.div>
    </section>
  );
}
