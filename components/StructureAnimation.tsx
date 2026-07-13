"use client";
import { motion } from "framer-motion";

/*
  Kendini inşa eden izometrik çelik iskelet — Tekla/ETABS/SAP2000 çıktılarındaki
  gerçek çalışma tarzına gönderme: temeller belirir, kolonlar yükselir, kirişler
  kayarak yerleşir, çaprazlar çizilir, düğüm noktaları analiz işareti gibi yanıp söner.
*/

const columnXs = [40, 140, 240, 340];
const beamY = { top: 40, mid: 130, base: 220 };

export default function StructureAnimation() {
  return (
    <motion.svg
      viewBox="0 0 420 300"
      className="w-full h-full"
      style={{ overflow: "visible" }}
      initial="hidden"
      animate="show"
    >
      <defs>
        <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Temel blokları */}
      {columnXs.map((x, i) => (
        <motion.rect
          key={`f-${i}`}
          x={x - 16}
          y={beamY.base + 6}
          width="32"
          height="14"
          fill="#0b1622"
          stroke="rgba(217,164,65,0.4)"
          strokeWidth="1"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          style={{ transformOrigin: `${x}px ${beamY.base + 13}px` }}
        />
      ))}

      {/* Kolonlar — temelden yukarı uzar */}
      {columnXs.map((x, i) => (
        <motion.line
          key={`c-${i}`}
          x1={x} y1={beamY.base}
          x2={x} y2={beamY.top}
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="2.5"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.7, delay: 0.35 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${x}px ${beamY.base}px` }}
        />
      ))}

      {/* Orta kat kirişi */}
      <motion.line
        x1={columnXs[0]} y1={beamY.mid} x2={columnXs[3]} y2={beamY.mid}
        stroke="#d9a441" strokeWidth="2.5"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${columnXs[0]}px ${beamY.mid}px` }}
      />

      {/* Üst kat kirişi (çatı) */}
      <motion.line
        x1={columnXs[0]} y1={beamY.top} x2={columnXs[3]} y2={beamY.top}
        stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.75"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${columnXs[0]}px ${beamY.top}px` }}
      />

      {/* Çapraz stabilite elemanları */}
      {[0, 1, 2].map((i) => (
        <motion.line
          key={`b-${i}`}
          x1={columnXs[i]} y1={beamY.mid}
          x2={columnXs[i + 1]} y2={beamY.top}
          stroke="rgba(143,163,184,0.55)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 + i * 0.15 }}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <motion.line
          key={`b2-${i}`}
          x1={columnXs[i]} y1={beamY.base}
          x2={columnXs[i + 1]} y2={beamY.mid}
          stroke="rgba(143,163,184,0.4)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.75 + i * 0.15 }}
        />
      ))}

      {/* Düğüm noktaları — analiz işareti gibi yanıp sönüyor */}
      {columnXs.map((x, i) => (
        <g key={`n-${i}`}>
          <motion.circle
            cx={x} cy={beamY.mid} r="3.5"
            fill="#d9a441"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.9 + i * 0.08, duration: 0.3 }}
          />
          <motion.circle
            cx={x} cy={beamY.mid} r="3.5"
            fill="none"
            stroke="#d9a441"
            strokeWidth="1.5"
            filter="url(#glow)"
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{ opacity: 0, scale: 2.8 }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              delay: 2.4 + i * 0.35,
              ease: "easeOut",
            }}
          />
        </g>
      ))}

      {/* Sonuç etiketi */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.6 }}
      >
        <rect x={columnXs[0] - 6} y={10} width="188" height="28" fill="rgba(255,255,255,0.06)" stroke="rgba(217,164,65,0.5)" strokeWidth="1" />
        <circle cx={columnXs[0] + 10} cy={24} r="4" fill="#d9a441" />
        <text x={columnXs[0] + 22} y={28} fill="#ffffff" fontSize="11" fontWeight="700" letterSpacing="0.06em" fontFamily="var(--font-inter), sans-serif">
          TBDY 2018 — ANALİZ OK
        </text>
      </motion.g>
    </motion.svg>
  );
}
