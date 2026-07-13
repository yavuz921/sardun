"use client";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { heroProgress } from "@/lib/heroProgress";

// WebGL sahnesi yalnızca istemcide (SSR kapalı) — hero'ya izole
const BuildingScene = dynamic(() => import("./hero3d/BuildingScene"), { ssr: false });

const PHASES = ["Gizem", "Hassas Izgara", "Akışkan Form", "Yapısal İskelet", "Beton & Cam", "Nihai Eser"];
// Her aşamanın ekranda baskın olduğu scroll aralığı (Building.tsx'teki evre pencereleriyle eşleşir)
const PHASE_BOUNDARIES = [0.1, 0.28, 0.46, 0.62, 0.82, 1.01];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } } };
const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState(0);
  const [active, setActive] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    heroProgress.value = v;
    const idx = PHASE_BOUNDARIES.findIndex((b) => v < b);
    const safeIdx = idx === -1 ? PHASES.length - 1 : idx;
    setPhase((prev) => (prev === safeIdx ? prev : safeIdx));
  });

  // Hero görünür değilken 3D render'ı durdur (batarya + performans, izolasyon)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setActive(entries[0].isIntersecting), {
      rootMargin: "0px",
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="anasayfa" style={{ position: "relative", height: "340vh", backgroundColor: "#0F1B2E" }}>
      {/* Sabitlenmiş sahne + arayüz */}
      <div className="sticky top-0 overflow-hidden" style={{ height: "100svh" }}>
        {/* 3D Canvas — büyük ekranlarda sağ tarafa sabitlenir, metnin üstüne binmez */}
        <div className="absolute inset-0 lg:left-[34%]">
          <BuildingScene active={active} />
        </div>

        {/* Derinlik vinyeti + alt geçiş */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #0F1B2E 0%, rgba(15,27,46,0.85) 20%, transparent 46%, transparent 100%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 160, background: "linear-gradient(to bottom, transparent, #0F1B2E)" }} />

        {/* Arayüz — tümü Framer Motion, canvas dışında */}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full px-5 md:px-14 mx-auto"
            style={{ maxWidth: 1440 }}
          >
            <div className="max-w-2xl pointer-events-auto">
              <motion.div variants={item} className="flex items-center gap-4 mb-8">
                <motion.span
                  style={{ height: 1.5, backgroundColor: "#B9C2CD", display: "inline-block" }}
                  initial={{ width: 0 }}
                  animate={{ width: 56 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
                <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#B9C2CD" }}>
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
                <span style={{ color: "#B9C2CD" }}>güven inşa ederiz.</span>
              </motion.h1>

              <motion.p
                variants={item}
                className="text-base md:text-xl mt-8 max-w-lg"
                style={{ lineHeight: 1.7, color: "rgba(255,255,255,0.78)" }}
              >
                Blueprint&apos;ten teslim anahtarına — her yapıyı statik hesap, çelik ve betonun
                mühendislik disipliniyle kuruyoruz. Aşağı kaydırın, birlikte inşa edelim.
              </motion.p>

              <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 mt-12">
                <motion.a
                  href="#projeler"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-center"
                  style={{
                    backgroundColor: "#B9C2CD", color: "#16273B", padding: "18px 40px",
                    fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none",
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
                    fontSize: 13, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none",
                  }}
                >
                  İletişime Geç
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Aşama göstergesi — sağ alt */}
        <div className="absolute right-5 md:right-14 bottom-24 md:bottom-16 pointer-events-none">
          <div className="flex flex-col gap-3 items-end">
            {PHASES.map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <AnimatePresence>
                  {phase === i && (
                    <motion.span
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                <motion.span
                  animate={{
                    width: phase === i ? 30 : 14,
                    backgroundColor: phase >= i ? "#B9C2CD" : "rgba(255,255,255,0.25)",
                  }}
                  transition={{ duration: 0.4 }}
                  style={{ height: 2, display: "inline-block" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll ipucu */}
        <motion.div
          className="absolute left-1/2 hidden md:flex flex-col items-center gap-2 pointer-events-none"
          style={{ bottom: 30, x: "-50%" }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
            İnşa Et
          </span>
          <span style={{ width: 1, height: 44, background: "linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)" }} />
        </motion.div>
      </div>
    </section>
  );
}
