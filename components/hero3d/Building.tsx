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

  Nihai kompozisyon: katı beton bir taban kütlesi üzerinde, bir tarafa doğru
  taşan (cantilever) tamamen camla kaplı üst kütle — aralarında kalın bir
  aktarma kirişi (mühendislik hikayesini görünür kılar) ve kompozisyonu
  dikeyde tutan ince bir beton kanat duvarı. İnşaat/mühendislik markasına
  uygun, gerçek bir çağdaş mimari nesne — düz bir ızgara kafes değil.
*/

const FH = 0.85;

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

  // ── Kütle geometrisi ──
  const massing = useMemo(() => {
    const baseFloors = mobile ? 2 : 3;
    const upperFloors = mobile ? 3 : 5;
    const bx = 1.6, bz = 1.5; // taban yarı-genişlik/derinlik
    const ux = 2.15, uz = 1.05; // üst kütle (cam) yarı-genişlik/derinlik
    const offsetX = 1.0; // üst kütlenin +X yönünde taştığı mesafe
    const baseH = baseFloors * FH;
    const upperH = upperFloors * FH;
    const totalH = baseH + upperH;
    return { baseFloors, upperFloors, bx, bz, ux, uz, offsetX, baseH, upperH, totalH };
  }, [mobile]);

  const { bx, bz, ux, uz, offsetX, baseH, upperH, totalH, baseFloors, upperFloors } = massing;

  // Birkaç zarif kılavuz çizgi — evre 1'in tüm gizemi, iskeletle ilgisiz
  const mysteryLines = useMemo(() => {
    const n = 9;
    const arr: { a: THREE.Vector3; b: THREE.Vector3 }[] = [];
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2;
      const r = 1.6 + (i % 3) * 0.7;
      const y0 = totalH * 0.2 + (i % 4) * totalH * 0.15;
      const a = new THREE.Vector3(Math.cos(ang) * r, y0, Math.sin(ang) * r);
      const b = new THREE.Vector3(Math.cos(ang + 0.6) * (r * 0.4), y0 + totalH * 0.35, Math.sin(ang + 0.6) * (r * 0.4));
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

  // ── İskelet: taban kolonları, üst kolonlar, aktarma kirişi + kat kirişleri ──
  const bars: Bar[] = useMemo(() => {
    const arr: Bar[] = [];
    let seed = 0;
    const push = (pos: [number, number, number], args: [number, number, number]) => arr.push({ pos, args, seed: seed++ });

    // Taban köşe kolonları
    for (const x of [-bx, bx]) for (const z of [-bz, bz]) push([x, baseH / 2, z], [0.16, baseH, 0.16]);
    // Taban kat kirişleri (üst ring, aktarma kirişiyle çakışmayacak şekilde son kat hariç)
    for (let f = 1; f < baseFloors; f++) {
      const y = f * FH;
      push([0, y, -bz], [bx * 2, 0.1, 0.1]);
      push([0, y, bz], [bx * 2, 0.1, 0.1]);
      push([-bx, y, 0], [0.1, 0.1, bz * 2]);
      push([bx, y, 0], [0.1, 0.1, bz * 2]);
    }
    // Aktarma kirişi — cantilever'ı taşıyan derin çelik kiriş halkası (mühendislik anlatısı)
    push([offsetX, baseH, -uz], [ux * 2, 0.3, 0.16]);
    push([offsetX, baseH, uz], [ux * 2, 0.3, 0.16]);
    push([offsetX - ux, baseH, 0], [0.16, 0.3, uz * 2]);
    push([offsetX + ux, baseH, 0], [0.16, 0.3, uz * 2]);
    // Üst kütle köşe kolonları
    for (const x of [offsetX - ux, offsetX + ux]) for (const z of [-uz, uz]) push([x, baseH + upperH / 2, z], [0.13, upperH, 0.13]);
    // Üst kütle kat kirişleri (çatı dahil — ince saçak kirişi)
    for (let f = 1; f <= upperFloors; f++) {
      const y = baseH + f * FH;
      push([offsetX, y, -uz], [ux * 2, 0.09, 0.09]);
      push([offsetX, y, uz], [ux * 2, 0.09, 0.09]);
      push([offsetX - ux, y, 0], [0.09, 0.09, uz * 2]);
      push([offsetX + ux, y, 0], [0.09, 0.09, uz * 2]);
    }
    return arr;
  }, [bx, bz, ux, uz, offsetX, baseH, upperH, baseFloors, upperFloors]);

  const slabs = useMemo(() => {
    const arr: { pos: [number, number, number]; size: [number, number, number] }[] = [];
    for (let f = 1; f <= baseFloors; f++) {
      arr.push({ pos: [0, f * FH, 0], size: [bx * 2 + 0.1, 0.14, bz * 2 + 0.1] });
    }
    for (let f = 1; f <= upperFloors; f++) {
      arr.push({ pos: [offsetX, baseH + f * FH, 0], size: [ux * 2 + 0.1, 0.14, uz * 2 + 0.1] });
    }
    return arr;
  }, [bx, bz, ux, uz, offsetX, baseH, baseFloors, upperFloors]);

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
    const glassOpacity = smoothstep(0.68, 0.9, p) * 0.7;

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
    liftIn(glassRef.current, glassOpacity / 0.7);
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

      {/* Evre 5 — Betonarme: kat döşemeleri, kanat duvar, çatı saçağı, zemin podyumu */}
      <group ref={concreteRef}>
        {slabs.map((s, i) => (
          <mesh key={`s${i}`} position={s.pos} castShadow receiveShadow>
            <boxGeometry args={s.size} />
            <meshStandardMaterial color="#c9c6bf" metalness={0.0} roughness={0.92} transparent opacity={0} />
          </mesh>
        ))}
        {/* Beton kanat duvar — kompozisyonu dikeyde tutan mimari imza */}
        <mesh position={[-bx - 0.06, totalH / 2, -bz + 0.35]} castShadow receiveShadow>
          <boxGeometry args={[0.22, totalH, 1.0]} />
          <meshStandardMaterial color="#b7b4ac" metalness={0} roughness={0.95} transparent opacity={0} />
        </mesh>
        {/* Çatı saçağı — üst kütleden taşan ince beton/metal kesit */}
        <mesh position={[offsetX, totalH + 0.06, 0]} castShadow receiveShadow>
          <boxGeometry args={[ux * 2 + 0.6, 0.12, uz * 2 + 0.6]} />
          <meshStandardMaterial color="#aeb4b8" metalness={0.3} roughness={0.6} transparent opacity={0} />
        </mesh>
        {/* Zemin podyumu — taban kütlesinden geniş, binayı yere oturtan taraça */}
        <mesh position={[0, -0.07, 0]} receiveShadow>
          <boxGeometry args={[bx * 2 + 1.1, 0.14, bz * 2 + 1.1]} />
          <meshStandardMaterial color="#b7b4ac" metalness={0} roughness={0.95} transparent opacity={0} />
        </mesh>
      </group>

      {/* Evre 5–6 — Cam: üst kütlenin dört cephesi + zemin katta giriş şeridi */}
      <group ref={glassRef}>
        {[
          { pos: [offsetX, baseH + upperH / 2, uz + 0.02] as [number, number, number], rot: [0, 0, 0] as [number, number, number], w: ux * 2, h: upperH },
          { pos: [offsetX, baseH + upperH / 2, -uz - 0.02] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number], w: ux * 2, h: upperH },
          { pos: [offsetX + ux + 0.02, baseH + upperH / 2, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number], w: uz * 2, h: upperH },
          { pos: [offsetX - ux - 0.02, baseH + upperH / 2, 0] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number], w: uz * 2, h: upperH },
          // Zemin katta giriş/lobi cam şeridi
          { pos: [0, FH * 0.55, bz + 0.02] as [number, number, number], rot: [0, 0, 0] as [number, number, number], w: bx * 1.2, h: FH * 0.8 },
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
