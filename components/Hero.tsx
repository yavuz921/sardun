"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { heroProgress } from "@/lib/heroProgress";

const BuildingScene = dynamic(() => import("./hero3d/BuildingScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#0F1B2E]" />,
});

const PHASES = [
  {
    label: "Statik Kurgu",
    meta: "01 / Teknik model",
    description: "Akslar, taşıyıcı elemanlar ve yük yolu tek bir mühendislik sisteminde tanımlanır.",
  },
  {
    label: "Temel & Döşeme",
    meta: "02 / Zemin sistemi",
    description: "Yapının zemine güvenle aktarıldığı temel ve ilk döşeme katmanı oluşur.",
  },
  {
    label: "Taşıyıcı İskelet",
    meta: "03 / Çelik sistem",
    description: "Kolonlar, çevre kirişleri ve çaprazlar gerçek yapım sırasıyla yükselir.",
  },
  {
    label: "Mimari Kabuk",
    meta: "04 / Betonarme kütle",
    description: "Döşemeler ve duvarlar taşıyıcı sistemin çevresinde dengeli bir kütleye dönüşür.",
  },
  {
    label: "Cephe & Cam",
    meta: "05 / İnce işler",
    description: "Doğramalar, geçirgen cam yüzeyler ve doğal taş kaplama yapıya karakter kazandırır.",
  },
  {
    label: "Nihai Yapı",
    meta: "06 / Teslim",
    description: "Malzeme, ışık ve mühendislik tek bir rafine mimari ifadede tamamlanır.",
  },
];

const PHASE_BOUNDARIES = [0.1, 0.28, 0.48, 0.68, 0.88, 1.01];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState(0);
  const [active, setActive] = useState(true);
  const reducedMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 28,
    mass: 0.45,
  });

  const introOpacity = useTransform(progress, [0, 0.09, 0.19], [1, 1, 0]);
  const introY = useTransform(progress, [0, 0.19], [0, -32]);
  const stageOpacity = useTransform(progress, [0.08, 0.17], [0, 1]);
  const gridOpacity = useTransform(progress, [0, 0.24, 0.48], [0.42, 0.18, 0]);
  const progressScale = useTransform(progress, [0, 1], [0.02, 1]);

  useMotionValueEvent(progress, "change", (value) => {
    heroProgress.value = value;
    const index = PHASE_BOUNDARIES.findIndex((boundary) => value < boundary);
    const safeIndex = index === -1 ? PHASES.length - 1 : index;
    setPhase((previous) => (previous === safeIndex ? previous : safeIndex));
  });

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "0px", threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const currentPhase = PHASES[phase];

  return (
    <section
      ref={sectionRef}
      id="anasayfa"
      aria-label="Sardun mühendislik yapı animasyonu"
      className="relative"
      style={{
        height: "360vh",
        backgroundColor: "#0F1B2E",
      }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0 top-[9%] md:top-0 lg:left-[32%]">
          <BuildingScene active={active} reducedMotion={reducedMotion} />
        </div>

        <motion.div
          aria-hidden
          className="premium-blueprint-grid absolute inset-0 pointer-events-none"
          style={{ opacity: gridOpacity }}
        />
        <div aria-hidden className="premium-noise absolute inset-0 pointer-events-none" />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, #0F1B2E 0%, rgba(15,27,46,0.96) 18%, rgba(15,27,46,0.52) 40%, transparent 65%), radial-gradient(circle at 74% 46%, transparent 20%, rgba(7,15,25,0.2) 72%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #0F1B2E)" }}
        />

        <div className="absolute inset-x-0 top-24 md:top-28 pointer-events-none">
          <div className="mx-auto flex items-center justify-between px-5 md:px-14" style={{ maxWidth: 1440 }}>
            <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
              Ankara · Türkiye
            </span>
            <span className="hidden sm:flex items-center gap-3 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.25em] text-white/45">
              <span className="h-px w-8 bg-[#B9C2CD]/60" />
              Yapısal tasarım / 2026
            </span>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center pointer-events-none">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full px-5 md:px-14 mx-auto"
            style={{
              maxWidth: 1440,
              opacity: reducedMotion ? 1 : introOpacity,
              y: reducedMotion ? 0 : introY,
            }}
          >
            <div className="max-w-2xl pointer-events-auto">
              <motion.div variants={item} className="flex items-center gap-4 mb-7">
                <span className="inline-block h-px w-12 bg-[#B9C2CD]" />
                <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[#B9C2CD]">
                  Mühendislik &amp; Mimarlık
                </span>
              </motion.div>

              <motion.h1
                variants={item}
                className="text-5xl md:text-7xl lg:text-[6.6rem] font-extrabold"
                style={{
                  lineHeight: 0.96,
                  letterSpacing: "-0.048em",
                  color: "#ffffff",
                  margin: 0,
                }}
              >
                Çizgiden
                <br />
                <span className="text-[#B9C2CD]">yapıya.</span>
              </motion.h1>

              <motion.p
                variants={item}
                className="mt-8 max-w-lg text-base md:text-lg"
                style={{ lineHeight: 1.75, color: "rgba(255,255,255,0.7)" }}
              >
                Her yapı önce doğru bir sistem olarak çözülür. Statik kurgudan son cephe detayına
                kadar güveni, hassasiyetle inşa ediyoruz.
              </motion.p>

              <motion.div variants={item} className="mt-10 flex flex-col sm:flex-row gap-3">
                <motion.a
                  href="#projeler"
                  whileHover={reducedMotion ? undefined : { y: -2 }}
                  whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                  className="premium-button text-center"
                >
                  Projeleri İncele
                </motion.a>
                <motion.a
                  href="#iletisim"
                  whileHover={reducedMotion ? undefined : { y: -2 }}
                  whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                  className="premium-button premium-button-ghost text-center"
                >
                  Projenizi Konuşalım
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {!reducedMotion && (
          <motion.div
            className="absolute left-5 md:left-14 bottom-9 md:bottom-12 max-w-[320px] pointer-events-none"
            style={{ opacity: stageOpacity }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhase.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8FA3B8]">
                  {currentPhase.meta}
                </div>
                <div className="text-xl md:text-2xl font-bold tracking-[-0.02em] text-white">
                  {currentPhase.label}
                </div>
                <p className="mt-2 text-xs md:text-sm leading-6 text-white/55">
                  {currentPhase.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {!reducedMotion && (
          <div className="absolute right-5 md:right-14 bottom-10 md:bottom-12 top-32 flex gap-5 pointer-events-none">
            <div className="relative hidden sm:block w-px h-full bg-white/10">
              <motion.span
                className="absolute inset-x-0 top-0 h-full origin-top bg-[#B9C2CD]"
                style={{ scaleY: progressScale }}
              />
            </div>
            <div className="self-end flex flex-col items-end gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/40">
                Süreç
              </span>
              <span className="text-2xl font-light tabular-nums text-white">
                {String(phase + 1).padStart(2, "0")}
                <span className="text-sm text-white/35"> / 06</span>
              </span>
            </div>
          </div>
        )}

        {!reducedMotion && (
          <motion.div
            className="absolute left-1/2 bottom-7 hidden md:flex -translate-x-1/2 flex-col items-center gap-2 pointer-events-none"
            style={{ opacity: introOpacity }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/40">
              Süreci keşfet
            </span>
            <span className="h-9 w-px bg-gradient-to-b from-white/55 to-transparent" />
          </motion.div>
        )}
      </div>
    </section>
  );
}