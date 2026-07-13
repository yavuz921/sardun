"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroProgress } from "@/lib/heroProgress";

/*
  Mimari dönüşüm — bir fikrin gerçeğe dönüşme hikayesi (scroll ile, 6 evre,
  hepsi birbirine yumuşakça karışır, sert kesim yok):

  1. Gizem      (0.00–0.16)  Karanlıkta birkaç zarif parlayan kılavuz çizgi.
  2. Hassas Izgara (0.10–0.32) Çizgiler matematiksel bir ızgarada toplanır.
  3. Akışkan Form  (0.26–0.48) Izgara soyut, parametrik bir forma bükülür.
  4. Yapısal İskelet (0.42–0.64) Form düzelir; parlayan çizgiler PBR çeliğe döner.
  5. Beton & Cam   (0.58–0.84) Hacimler ve cam belirir, ışık ısınmaya başlar.
  6. Nihai Eser    (0.78–1.00) Golden-hour ışığında tamamlanmış bina.

  Aynı iskelet noktaları tüm yolculuğu taşır — sadece konumları (dağınık →
  ızgara → akışkan bükülme → düz iskelet) ve materyali (parlayan çizgi → PBR
  çelik) evrilir. Böylece 2. ve 4. evre aynı geometriyi paylaşır, geçiş organik olur.
*/

const FLOORS = 8;
const FH = 0.9;
const WX = 4;
const WZ = 3;
const H = FLOORS * FH;
const halfX = WX / 2;
const halfZ = WZ / 2;

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

const colXs = [-halfX, 0, halfX];
const colZs = [-halfZ, 0, halfZ];

type Bar = { pos: [number, number, number]; args: [number, number, number]; seed: number };

export default function Building({ mobile }: { mobile: boolean }) {
  const mysteryRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Group>(null);
  const steelRef = useRef<THREE.Group>(null);
  const concreteRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Group>(null);

  // İskelet: kolonlar + kirişler — grid/akış/iskelet evrelerinin ortak geometrisi
  const bars: Bar[] = useMemo(() => {
    const arr: Bar[] = [];
    let seed = 0;
    for (const x of colXs) {
      for (const z of colZs) {
        arr.push({ pos: [x, H / 2, z], args: [0.14, H, 0.14], seed: seed++ });
      }
    }
    for (let f = 1; f <= FLOORS; f++) {
      const y = f * FH;
      arr.push({ pos: [0, y, -halfZ], args: [WX, 0.1, 0.1], seed: seed++ });
      arr.push({ pos: [0, y, halfZ], args: [WX, 0.1, 0.1], seed: seed++ });
      arr.push({ pos: [-halfX, y, 0], args: [0.1, 0.1, WZ], seed: seed++ });
      arr.push({ pos: [halfX, y, 0], args: [0.1, 0.1, WZ], seed: seed++ });
    }
    return arr;
  }, []);

  // Birkaç zarif kılavuz çizgi — evre 1'in tüm gizemi, iskeletle ilgisiz
  const mysteryLines = useMemo(() => {
    const n = 9;
    const arr: { a: THREE.Vector3; b: THREE.Vector3 }[] = [];
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2;
      const r = 1.6 + (i % 3) * 0.7;
      const y0 = H * 0.2 + (i % 4) * H * 0.15;
      const a = new THREE.Vector3(Math.cos(ang) * r, y0, Math.sin(ang) * r);
      const b = new THREE.Vector3(Math.cos(ang + 0.6) * (r * 0.4), y0 + H * 0.35, Math.sin(ang + 0.6) * (r * 0.4));
      arr.push({ a, b });
    }
    return arr;
  }, []);
  const mysteryGeo = useMemo(
    () =>
      mysteryLines.map((l) => {
        const g = new THREE.BufferGeometry();
        g.setFromPoints([l.a, l.b]);
        return g;
      }),
    [mysteryLines]
  );

  const slabs = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let f = 1; f <= FLOORS; f++) arr.push([0, f * FH, 0]);
    return arr;
  }, []);

  // Yeniden kullanılabilir vektörler (GC baskısını azaltmak için)
  const tmpV = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const p = heroProgress.value;
    const damp = 1 - Math.pow(0.0025, delta);

    // ── Evre pencereleri (üst üste biner, sert geçiş yok) ──
    const mysteryOpacity = smoothstep(0.0, 0.05, p) * (1 - smoothstep(0.11, 0.19, p));
    const gridOpacity = smoothstep(0.08, 0.16, p) * (1 - smoothstep(0.5, 0.62, p));
    // Akışkan bükülme genliği: 0.26–0.48 arası yükselip alçalır
    const flowRise = smoothstep(0.2, 0.34, p);
    const flowFall = 1 - smoothstep(0.44, 0.58, p);
    const flowAmount = flowRise * flowFall * (mobile ? 0.35 : 1);
    const steelOpacity = smoothstep(0.5, 0.64, p);
    const concreteOpacity = smoothstep(0.58, 0.78, p);
    const glassOpacity = smoothstep(0.68, 0.9, p) * 0.68;

    // ── Gizem çizgileri ──
    if (mysteryRef.current) {
      setOpacity(mysteryRef.current, mysteryOpacity, damp);
      // neredeyse hareketsiz — çok hafif nefes alma
      const breathe = Math.sin(performance.now() * 0.00025) * 0.02;
      mysteryRef.current.rotation.y += (breathe - mysteryRef.current.rotation.y) * 0.02;
    }

    // ── Işıklı ızgara / akışkan form (aynı barlar, konumları bükülüyor) ──
    if (glowRef.current) {
      setOpacity(glowRef.current, gridOpacity, damp);
      glowRef.current.children.forEach((child, i) => {
        const bar = bars[i];
        if (!bar) return;
        const offset = flowOffset(bar, flowAmount, tmpV);
        child.position.set(bar.pos[0] + offset.x, bar.pos[1] + offset.y, bar.pos[2] + offset.z);
      });
    }

    // ── PBR çelik iskelet (glow'un yerini alır) ──
    if (steelRef.current) {
      setOpacity(steelRef.current, steelOpacity, damp);
      steelRef.current.children.forEach((child, i) => {
        const bar = bars[i];
        if (!bar) return;
        // Çelik yalnızca son evrede belirir; hafif kalıntı bükülme ile organik bağlanır
        const residualFlow = flowAmount * (1 - smoothstep(0.5, 0.6, p));
        const offset = flowOffset(bar, residualFlow, tmpV);
        child.position.set(bar.pos[0] + offset.x, bar.pos[1] + offset.y, bar.pos[2] + offset.z);
      });
    }

    setOpacity(concreteRef.current, concreteOpacity, damp);
    setOpacity(glassRef.current, glassOpacity, damp);

    liftIn(concreteRef.current, concreteOpacity);
    liftIn(glassRef.current, glassOpacity / 0.68);
  });

  return (
    <group position={[0, -H / 2, 0]}>
      {/* Evre 1 — Gizem: birkaç zarif parlayan kılavuz çizgi */}
      <group ref={mysteryRef}>
        {mysteryGeo.map((g, i) => (
          <line key={i}>
            <primitive object={g} attach="geometry" />
            <lineBasicMaterial color="#cfe8ff" transparent opacity={0} toneMapped={false} />
          </line>
        ))}
      </group>

      {/* Evre 2–3 — Hassas ızgara → akışkan parametrik form (parlayan) */}
      <group ref={glowRef}>
        {bars.map((b, i) => (
          <mesh key={i}>
            <boxGeometry args={[Math.max(b.args[0] * 0.4, 0.02), Math.max(b.args[1] * 0.4, 0.02), Math.max(b.args[2] * 0.4, 0.02)]} />
            <meshBasicMaterial color="#e4f2ff" transparent opacity={0} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Evre 4 — Yapısal iskelet: PBR çelik */}
      <group ref={steelRef}>
        {bars.map((b, i) => (
          <mesh key={i} castShadow receiveShadow>
            <boxGeometry args={b.args} />
            <meshStandardMaterial color="#b9c2cc" metalness={0.92} roughness={0.35} transparent opacity={0} />
          </mesh>
        ))}
      </group>

      {/* Evre 5 — Betonarme: döşemeler + çekirdek */}
      <group ref={concreteRef}>
        {slabs.map((s, i) => (
          <mesh key={`s${i}`} position={s} castShadow receiveShadow>
            <boxGeometry args={[WX + 0.1, 0.14, WZ + 0.1]} />
            <meshStandardMaterial color="#c9c6bf" metalness={0.0} roughness={0.92} transparent opacity={0} />
          </mesh>
        ))}
        <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[WX * 0.3, H, WZ * 0.32]} />
          <meshStandardMaterial color="#b7b4ac" metalness={0} roughness={0.95} transparent opacity={0} />
        </mesh>
      </group>

      {/* Evre 5–6 — Cam cephe */}
      <group ref={glassRef}>
        {[
          { pos: [0, H / 2, halfZ + 0.02] as [number, number, number], rot: [0, 0, 0] as [number, number, number], w: WX },
          { pos: [0, H / 2, -halfZ - 0.02] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number], w: WX },
          { pos: [halfX + 0.02, H / 2, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number], w: WZ },
          { pos: [-halfX - 0.02, H / 2, 0] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number], w: WZ },
        ].map((f, i) => (
          <mesh key={`g${i}`} position={f.pos} rotation={f.rot}>
            <planeGeometry args={[f.w, H]} />
            {mobile ? (
              <meshStandardMaterial color="#8fb8d8" metalness={0.6} roughness={0.1} transparent opacity={0} side={THREE.DoubleSide} />
            ) : (
              <meshPhysicalMaterial
                color="#9fc4de"
                metalness={0.1}
                roughness={0.06}
                transmission={0.85}
                thickness={0.4}
                ior={1.45}
                transparent
                opacity={0}
                side={THREE.DoubleSide}
              />
            )}
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Her bar'a özgü akışkan bükülme — parametrik bir "dalga" alanı.
// amount 0 iken tam düz ızgara/iskelet; amount arttıkça yumuşak, organik bükülme.
function flowOffset(bar: Bar, amount: number, out: THREE.Vector3): THREE.Vector3 {
  if (amount <= 0.0005) return out.set(0, 0, 0);
  const y = bar.pos[1];
  const s = bar.seed * 0.9;
  const twist = (y / H) * 1.4; // yükseklikle artan hafif burulma
  out.set(
    Math.sin(s + twist) * 0.5 * amount,
    Math.cos(s * 0.7 + twist * 0.6) * 0.22 * amount,
    Math.cos(s + twist) * 0.5 * amount
  );
  return out;
}

function setOpacity(g: THREE.Group | null, target: number, damp: number) {
  if (!g) return;
  let anyVisible = false;
  g.traverse((o) => {
    const mesh = o as THREE.Mesh & { material?: THREE.Material & { opacity?: number } };
    const m = mesh.material as (THREE.Material & { opacity: number }) | undefined;
    if (m && typeof m.opacity === "number") {
      m.opacity += (target - m.opacity) * damp;
      const vis = m.opacity > 0.004;
      o.visible = vis;
      if (vis) anyVisible = true;
    }
  });
  g.visible = anyVisible;
}

function liftIn(g: THREE.Group | null, t: number) {
  if (!g) return;
  const y = (1 - Math.min(1, Math.max(0, t))) * -0.6;
  g.position.y += (y - g.position.y) * 0.12;
}
