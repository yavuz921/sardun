"use client";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, MouseEvent } from "react";
import { Monogram } from "./Logo";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
};
const item = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

// Kayan hexagon parçacıkları — inşaat/mühendislik hissi için hafif kayan geometrik şekiller
const floaters = [
  { size: 46, top: "18%", left: "72%", delay: 0, duration: 9 },
  { size: 30, top: "62%", left: "84%", delay: 1.2, duration: 11 },
  { size: 64, top: "72%", left: "63%", delay: 0.6, duration: 13 },
  { size: 24, top: "30%", left: "60%", delay: 2, duration: 8 },
];

function Hexagon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <polygon
        points="50,3 95,26 95,74 50,97 5,74 5,26"
        stroke="rgba(217,164,65,0.35)"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const monoOpacity = useTransform(scrollYProgress, [0, 0.6], [0.09, 0]);

  // Fareye göre hafif paralaks kayan büyük monogram
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const monoX = useSpring(useTransform(mx, [-0.5, 0.5], [-18, 18]), { stiffness: 60, damping: 15 });
  const monoY = useSpring(useTransform(my, [-0.5, 0.5], [-14, 14]), { stiffness: 60, damping: 15 });

  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section
      ref={ref}
      id="anasayfa"
      onMouseMove={handleMouseMove}
      className="relative flex items-center overflow-hidden hex-pattern hex-pattern-animated"
      style={{ minHeight: "100svh" }}
    >
      {/* Fareyle hafif kayan dev arka plan monogramı */}
      <motion.div
        className="absolute hidden lg:block"
        style={{ right: "3%", top: "10%", opacity: monoOpacity, x: monoX, y: monoY }}
      >
        <Monogram size={480} color="white" />
      </motion.div>

      {/* Kayan hexagon çizgi-taslak parçacıkları */}
      {floaters.map((f, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:block pointer-events-none"
          style={{ top: f.top, left: f.left }}
          animate={{ y: [0, -22, 0], rotate: [0, 8, 0] }}
          transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <Hexagon size={f.size} />
        </motion.div>
      ))}

      {/* Sol altta çizilen teknik taslak çizgisi (blueprint çizim animasyonu) */}
      <svg
        className="absolute hidden md:block pointer-events-none"
        style={{ left: "4%", bottom: "8%", opacity: 0.5 }}
        width="220" height="140" viewBox="0 0 220 140" fill="none"
      >
        <motion.path
          d="M10 130 L10 40 L70 40 L70 90 L130 90 L130 20 L210 20"
          stroke="rgba(217,164,65,0.55)"
          strokeWidth="1.5"
          strokeDasharray="4 5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.8 }}
        />
        {[[10, 130], [10, 40], [70, 40], [70, 90], [130, 90], [130, 20], [210, 20]].map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx} cy={cy} r="3"
            fill="#d9a441"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + i * 0.28, duration: 0.3 }}
          />
        ))}
      </svg>

      {/* Alt geçiş gradyanı */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 160, background: "linear-gradient(to bottom, transparent, #0f1d2e)" }} />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full px-5 md:px-14 mx-auto"
        style={{ maxWidth: 1440, y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-4xl pt-32 pb-24 md:pt-40 md:pb-32">
          <motion.div variants={item} className="flex items-center gap-4 mb-8">
            <motion.span
              style={{ height: 1.5, backgroundColor: "#d9a441", display: "inline-block" }}
              initial={{ width: 0 }}
              animate={{ width: 56 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
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
