"use client";

/*
  Saf CSS 3D dönen çelik kule — 3 katlı çerçeve.
  Kolonlar (beyaz), kat kirişleri (çelik mavi), çapraz stabilite (altın),
  düğüm plakaları (altın). WebGL yok; her yerde kesin render eder.
*/

const S = 120; // küp kenarı
const half = S / 2;
const WHITE = "#e8eef5";
const RING = "#5b82ad";
const GOLD = "#d9a441";

type Bar = { w: number; t: number; color: string; transform: string; glow?: boolean };

function buildBars(): Bar[] {
  const bars: Bar[] = [];
  const centers = [-S, 0, S]; // 3 kat

  for (const cy of centers) {
    const top = cy - half;
    const bot = cy + half;

    // Yatay kat kirişleri (her kata üst + alt kare çerçeve)
    for (const y of [top, bot]) {
      // X yönü kirişler (z = ±half)
      bars.push({ w: S, t: 3, color: RING, transform: `translate3d(0px, ${y}px, ${half}px)` });
      bars.push({ w: S, t: 3, color: RING, transform: `translate3d(0px, ${y}px, ${-half}px)` });
      // Z yönü kirişler (x = ±half)
      bars.push({ w: S, t: 3, color: RING, transform: `translate3d(${half}px, ${y}px, 0px) rotateY(90deg)` });
      bars.push({ w: S, t: 3, color: RING, transform: `translate3d(${-half}px, ${y}px, 0px) rotateY(90deg)` });
    }

    // Dikey kolonlar (4 köşe)
    for (const x of [-half, half]) {
      for (const z of [-half, half]) {
        bars.push({ w: S, t: 4, color: WHITE, transform: `translate3d(${x}px, ${cy}px, ${z}px) rotateZ(90deg)` });
      }
    }

    // Çapraz stabilite elemanları (altın) — 4 dış yüzde birer diyagonal
    const diag = Math.sqrt(2) * S;
    // ön (z=half) ve arka (z=-half)
    bars.push({ w: diag, t: 2, color: GOLD, glow: true, transform: `translate3d(0px, ${cy}px, ${half}px) rotateZ(45deg)` });
    bars.push({ w: diag, t: 2, color: GOLD, glow: true, transform: `translate3d(0px, ${cy}px, ${-half}px) rotateZ(-45deg)` });
    // sağ (x=half) ve sol (x=-half) — Z düzlemine döndürülmüş
    bars.push({ w: diag, t: 2, color: GOLD, glow: true, transform: `translate3d(${half}px, ${cy}px, 0px) rotateY(90deg) rotateZ(45deg)` });
    bars.push({ w: diag, t: 2, color: GOLD, glow: true, transform: `translate3d(${-half}px, ${cy}px, 0px) rotateY(90deg) rotateZ(-45deg)` });
  }

  return bars;
}

function Node({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <span
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transformStyle: "preserve-3d",
        width: 9,
        height: 9,
        marginLeft: -4.5,
        marginTop: -4.5,
        borderRadius: "50%",
        backgroundColor: GOLD,
        boxShadow: "0 0 10px rgba(217,164,65,0.8)",
        transform: `translate3d(${x}px, ${y}px, ${z}px)`,
      }}
    />
  );
}

export default function Structure3D() {
  const bars = buildBars();
  // Düğüm plakaları — her kat seviyesinin 4 köşesi
  const levels = [-S - half, -half, half, S + half];
  const nodes: { x: number; y: number; z: number }[] = [];
  for (const y of levels) {
    for (const x of [-half, half]) {
      for (const z of [-half, half]) {
        nodes.push({ x, y, z });
      }
    }
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 1100,
      }}
    >
      <style>{`
        @keyframes sardunTowerSpin { from { transform: rotateX(-16deg) rotateY(0deg); } to { transform: rotateX(-16deg) rotateY(360deg); } }
        @keyframes sardunTowerFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @media (prefers-reduced-motion: reduce) {
          .sardun-spin, .sardun-float { animation: none !important; }
        }
      `}</style>
      <div className="sardun-float" style={{ transformStyle: "preserve-3d", animation: "sardunTowerFloat 6s ease-in-out infinite" }}>
        <div
          className="sardun-spin"
          style={{
            position: "relative",
            width: 0,
            height: 0,
            transformStyle: "preserve-3d",
            animation: "sardunTowerSpin 26s linear infinite",
          }}
        >
          {bars.map((b, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transformStyle: "preserve-3d",
                width: b.w,
                height: b.t,
                marginLeft: -b.w / 2,
                marginTop: -b.t / 2,
                backgroundColor: b.color,
                transform: b.transform,
                boxShadow: b.glow ? "0 0 8px rgba(217,164,65,0.55)" : "0 0 1px rgba(0,0,0,0.4)",
                borderRadius: 1,
              }}
            />
          ))}
          {nodes.map((n, i) => (
            <Node key={`n${i}`} {...n} />
          ))}
        </div>
      </div>
    </div>
  );
}
