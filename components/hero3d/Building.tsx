"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroProgress } from "@/lib/heroProgress";

/*
  Mimari dönüşüm — bir fikrin gerçeğe dönüşme hikayesi (scroll ile, 6 evre,
  hepsi birbirine yumuşakça karışır, sert kesim yok):

  1. Gizem          (0.00–0.16)  Karanlıkta birkaç zarif parlayan kılavuz çizgi.
  2. Hassas Izgara   (0.10–0.32) Çizgiler matematiksel bir ızgarada toplanır.
  3. Akışkan Form    (0.26–0.48) Izgara soyut, parametrik bir forma bükülür.
  4. Yapısal İskelet (0.42–0.64) Form düzelir; çizgiler PBR çeliğe döner.
  5. Beton & Cam     (0.58–0.84) Hacimler ve cam belirir, ışık ısınmaya başlar.
  6. Nihai Eser      (0.78–1.00) Golden-hour ışığında tamamlanmış mimari eser.

  Nihai kompozisyon: tek bakışta "bina" olarak okunan, sade ve zarif bir
  kule — taş/beton bir plinth (giriş katı), üzerinde cam cepheli uzun bir
  gövde, tepede geri çekilmiş (setback) bir taç katı. Simetrik, dikeyliği
  vurgulayan, inşaat/mühendislik markasına uygun klasik bir mimari siluet —
  soyut/karmaşık bir kütle değil.
*/

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

type Bar = { pos: [number, number, number]; args: [number, number, number]; seed: number };

export default function Building({ mobile }: { mobile: boolean }) {
  const mysteryRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Group>(null);
  const steelRef = useRef<THREE.Group>(null);
  const concreteRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Group>(null);

  // ── Kütle geometrisi — simetrik, dikey kule siluet ──
  const massing = useMemo(() => {
    const shaftFloors = mobile ? 5 : 8;
    const crownFloors = mobile ? 1 : 2;
    const px = 1.3, pz = 1.1, pH = 1.05; // plinth (giriş katı)
    const sx = 1.0, sz = 0.85, sF = 0.55; // gövde (kat yüksekliği)
    const cx = 0.78, cz = 0.65, cF = 0.55; // taç (setback)
    const shaftH = shaftFloors * sF;
    const crownH = crownFloors * cF;
    const totalH = pH + shaftH + crownH;
    return { shaftFloors, crownFloors, px, pz, pH, sx, sz, sF, cx, cz, cF, shaftH, crownH, totalH };
  }, [mobile]);

  const { shaftFloors, crownFloors, px, pz, pH, sx, sz, sF, cx, cz, cF, shaftH, crownH, totalH } = massing;

  // Birkaç zarif kılavuz çizgi — evre 1'in tüm gizemi, iskeletle ilgisiz
  const mysteryLines = useMemo(() => {
    const n = 9;
    const arr: { a: THREE.Vector3; b: THREE.Vector3 }[] = [];
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2;
      const r = 1.3 + (i % 3) * 0.55;
      const y0 = totalH * 0.2 + (i % 4) * totalH * 0.15;
      const a = new THREE.Vector3(Math.cos(ang) * r, y0, Math.sin(ang) * r);
      const b = new THREE.Vector3(Math.cos(ang + 0.6) * (r * 0.4), y0 + totalH * 0.3, Math.sin(ang + 0.6) * (r * 0.4));
      arr.push({ a, b });
    }
    return arr;
  }, [totalH]);
  const mysteryGeo = useMemo(
    () =>
      mysteryLines.map((l) => {
        const g = new THREE.BufferGeometry();
        g.setFromPoints([l.a, l.b]);
        return g;
      }),
    [mysteryLines]
  );

  // ── İskelet: plinth + gövde + taç kolonları, birkaç kat halkası ──
  const bars: Bar[] = useMemo(() => {
    const arr: Bar[] = [];
    let seed = 0;
    const push = (pos: [number, number, number], args: [number, number, number]) => arr.push({ pos, args, seed: seed++ });
    const ring = (y: number, hx: number, hz: number, t = 0.08) => {
      push([0, y, -hz], [hx * 2, t, t]);
      push([0, y, hz], [hx * 2, t, t]);
      push([-hx, y, 0], [t, t, hz * 2]);
      push([hx, y, 0], [t, t, hz * 2]);
    };

    // Plinth köşe kolonları + üst halkası
    for (const x of [-px, px]) for (const z of [-pz, pz]) push([x, pH / 2, z], [0.18, pH, 0.18]);
    ring(pH, px, pz, 0.12);

    // Gövde köşe kolonları (tam yükseklik, plinth üstünden başlar)
    for (const x of [-sx, sx]) for (const z of [-sz, sz]) push([x, pH + shaftH / 2, z], [0.14, shaftH, 0.14]);
    // Gövde kat halkaları — her katta değil, ~2 katta bir (uzaktan sade okunur)
    for (let f = 2; f <= shaftFloors; f += 2) {
      ring(pH + f * sF, sx, sz);
    }

    // Taç köşe kolonları + üst halkası
    const crownBaseY = pH + shaftH;
    for (const x of [-cx, cx]) for (const z of [-cz, cz]) push([x, crownBaseY + crownH / 2, z], [0.12, crownH, 0.12]);
    ring(crownBaseY + crownH, cx, cz, 0.07);

    return arr;
  }, [px, pz, pH, sx, sz, sF, cx, cz, shaftFloors, shaftH, crownH]);

  // ── Beton/cam hacimleri ──
  const shaftSlabs = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let f = 2; f <= shaftFloors; f += 2) arr.push([0, pH + f * sF, 0]);
    return arr;
  }, [pH, sF, shaftFloors]);

  const crownSlabs = useMemo(() => {
    const arr: [number, number, number][] = [];
    const base = pH + shaftH;
    for (let f = 1; f <= crownFloors; f++) arr.push([0, base + f * cF, 0]);
    return arr;
  }, [pH, shaftH, cF, crownFloors]);

  const tmpV = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const p = heroProgress.value;
    const damp = 1 - Math.pow(0.0025, delta);

    const mysteryOpacity = smoothstep(0.0, 0.05, p) * (1 - smoothstep(0.11, 0.19, p));
    const gridOpacity = smoothstep(0.08, 0.16, p) * (1 - smoothstep(0.5, 0.62, p));
    const flowRise = smoothstep(0.2, 0.34, p);
    const flowFall = 1 - smoothstep(0.44, 0.58, p);
    const flowAmount = flowRise * flowFall * (mobile ? 0.3 : 1);
    const steelOpacity = smoothstep(0.5, 0.64, p);
    const concreteOpacity = smoothstep(0.58, 0.78, p);
    const glassOpacity = smoothstep(0.68, 0.9, p) * 0.72;

    if (mysteryRef.current) {
      setOpacity(mysteryRef.current, mysteryOpacity, damp);
      const breathe = Math.sin(performance.now() * 0.00025) * 0.02;
      mysteryRef.current.rotation.y += (breathe - mysteryRef.current.rotation.y) * 0.02;
    }

    if (glowRef.current) {
      setOpacity(glowRef.current, gridOpacity, damp);
      glowRef.current.children.forEach((child, i) => {
        const bar = bars[i];
        if (!bar) return;
        const offset = flowOffset(bar, flowAmount, totalH, tmpV);
        child.position.set(bar.pos[0] + offset.x, bar.pos[1] + offset.y, bar.pos[2] + offset.z);
      });
    }

    if (steelRef.current) {
      setOpacity(steelRef.current, steelOpacity, damp);
      steelRef.current.children.forEach((child, i) => {
        const bar = bars[i];
        if (!bar) return;
        const residualFlow = flowAmount * (1 - smoothstep(0.5, 0.6, p));
        const offset = flowOffset(bar, residualFlow, totalH, tmpV);
        child.position.set(bar.pos[0] + offset.x, bar.pos[1] + offset.y, bar.pos[2] + offset.z);
      });
    }

    setOpacity(concreteRef.current, concreteOpacity, damp);
    setOpacity(glassRef.current, glassOpacity, damp);

    liftIn(concreteRef.current, concreteOpacity);
    liftIn(glassRef.current, glassOpacity / 0.72);
  });

  return (
    <group position={[0, -totalH / 2, 0]}>
      {/* Evre 1 — Gizem */}
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

      {/* Evre 5 — Betonarme: plinth kütlesi, ara kat halkaları, taç döşemeleri, çatı kapağı */}
      <group ref={concreteRef}>
        {/* Plinth — katı giriş kütlesi */}
        <mesh position={[0, pH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[px * 2, pH, pz * 2]} />
          <meshStandardMaterial color="#b7b4ac" metalness={0} roughness={0.95} transparent opacity={0} />
        </mesh>
        {/* Gövde ara kat datumları */}
        {shaftSlabs.map((s, i) => (
          <mesh key={`sh${i}`} position={s} receiveShadow>
            <boxGeometry args={[sx * 2 + 0.06, 0.08, sz * 2 + 0.06]} />
            <meshStandardMaterial color="#c9c6bf" metalness={0.1} roughness={0.85} transparent opacity={0} />
          </mesh>
        ))}
        {/* Taç kat döşemeleri */}
        {crownSlabs.map((s, i) => (
          <mesh key={`cr${i}`} position={s} receiveShadow>
            <boxGeometry args={[cx * 2 + 0.06, 0.08, cz * 2 + 0.06]} />
            <meshStandardMaterial color="#c9c6bf" metalness={0.1} roughness={0.85} transparent opacity={0} />
          </mesh>
        ))}
        {/* Taç çatı kapağı */}
        <mesh position={[0, totalH + 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[cx * 2 + 0.2, 0.1, cz * 2 + 0.2]} />
          <meshStandardMaterial color="#aeb4b8" metalness={0.3} roughness={0.6} transparent opacity={0} />
        </mesh>
        {/* Zemin podyumu */}
        <mesh position={[0, -0.06, 0]} receiveShadow>
          <boxGeometry args={[px * 2 + 0.8, 0.12, pz * 2 + 0.8]} />
          <meshStandardMaterial color="#b7b4ac" metalness={0} roughness={0.95} transparent opacity={0} />
        </mesh>
      </group>

      {/* Evre 5–6 — Cam: gövde ve taç boyunca sürekli cephe + plinth'te giriş şeridi */}
      <group ref={glassRef}>
        {[
          { pos: [0, pH + shaftH / 2, sz + 0.02] as [number, number, number], rot: [0, 0, 0] as [number, number, number], w: sx * 2, h: shaftH },
          { pos: [0, pH + shaftH / 2, -sz - 0.02] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number], w: sx * 2, h: shaftH },
          { pos: [sx + 0.02, pH + shaftH / 2, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number], w: sz * 2, h: shaftH },
          { pos: [-sx - 0.02, pH + shaftH / 2, 0] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number], w: sz * 2, h: shaftH },
          { pos: [0, pH + shaftH + crownH / 2, cz + 0.02] as [number, number, number], rot: [0, 0, 0] as [number, number, number], w: cx * 2, h: crownH },
          { pos: [0, pH + shaftH + crownH / 2, -cz - 0.02] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number], w: cx * 2, h: crownH },
          { pos: [cx + 0.02, pH + shaftH + crownH / 2, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number], w: cz * 2, h: crownH },
          { pos: [-cx - 0.02, pH + shaftH + crownH / 2, 0] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number], w: cz * 2, h: crownH },
          // Plinth giriş cam şeridi
          { pos: [0, pH * 0.55, pz + 0.02] as [number, number, number], rot: [0, 0, 0] as [number, number, number], w: px * 1.3, h: pH * 0.75 },
        ].map((f, i) => (
          <mesh key={`g${i}`} position={f.pos} rotation={f.rot}>
            <planeGeometry args={[f.w, f.h]} />
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
function flowOffset(bar: Bar, amount: number, totalH: number, out: THREE.Vector3): THREE.Vector3 {
  if (amount <= 0.0005) return out.set(0, 0, 0);
  const y = bar.pos[1];
  const s = bar.seed * 0.9;
  const twist = (y / totalH) * 1.4;
  out.set(
    Math.sin(s + twist) * 0.4 * amount,
    Math.cos(s * 0.7 + twist * 0.6) * 0.18 * amount,
    Math.cos(s + twist) * 0.4 * amount
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
