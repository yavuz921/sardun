"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.35 } },
};
const item = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      id="anasayfa"
      className="relative flex items-end overflow-hidden"
      style={{ minHeight: "100svh", backgroundColor: "#0f1d2e" }}
    >
      {/* Tam-ekran gerçek proje render — hafif zoom parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: imgScale, y: imgY }}>
        <Image src="/projects/celik-hal.jpeg" alt="Çelik yapı modeli" fill priority unoptimized className="object-cover" />
        {/* Lacivert sinematik overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(15,29,46,0.94) 0%, rgba(15,29,46,0.78) 42%, rgba(15,29,46,0.35) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0f1d2e 2%, transparent 32%)" }} />
      </motion.div>

      {/* İnce üst çizgi vurgusu — tarayan animasyon */}
      <motion.div
        className="absolute top-0 left-0 h-[3px] z-10"
        style={{ backgroundColor: "#d9a441" }}
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full px-5 md:px-14 mx-auto"
        style={{ maxWidth: 1440, y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-3xl pb-24 md:pb-32">
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
            style={{ lineHeight: 1.02, letterSpacing: "-0.035em", color: "#ffffff", margin: 0 }}
          >
            Hesaplanmış
            <br />
            <span style={{ color: "#d9a441" }}>güven inşa ederiz.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-base md:text-xl mt-8 max-w-xl"
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
