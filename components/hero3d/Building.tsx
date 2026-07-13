"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroProgress } from "@/lib/heroProgress";

/*
  Prosedürel bina — 5 aşamalı montaj (scroll ile):
  0.00–0.20 Blueprint (mavi tel çerçeve)
  0.15–0.42 Çelik iskelet (kolon + kiriş, PBR metal)
  0.38–0.62 Betonarme (döşemeler + çekirdek)
  0.58–0.84 Cam cephe (physical glass)
  0.80–1.00 Tamamlanmış
  Her aşama kendi grubunun materyal opaklığıyla yumuşakça belirir.
*/

const FLOORS = 8;
const FH = 0.9; // kat yüksekliği
const WX = 4; // genişlik
const WZ = 3; // derinlik
const H = FLOORS * FH;
const halfX = WX / 2;
const halfZ = WZ / 2;

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// Kolon/kiriş konumları
const colXs = [-halfX, 0, halfX];
const colZs = [-halfZ, 0, halfZ];

export default function Building({ mobile }: { mobile: boolean }) {
  const blueprintRef = useRef<THREE.Group>(null);
  const steelRef = useRef<THREE.Group>(null);
  const concreteRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Group>(null);

  // Blueprint tel çerçeve — massing kutusu + kat çizgileri
  const blueprintGeo = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    // Dış kutu kenarları
    const box = new THREE.BoxGeometry(WX, H, WZ);
    box.translate(0, H / 2, 0);
    geos.push(new THREE.EdgesGeometry(box));
    // Kat çizgileri (her seviyede dikdörtgen)
    for (let f = 1; f < FLOORS; f++) {
      const plane = new THREE.BoxGeometry(WX, 0.001, WZ);
      plane.translate(0, f * FH, 0);
      geos.push(new THREE.EdgesGeometry(plane));
    }
    return geos;
  }, []);

  // Çelik elemanlar
  const steel = useMemo(() => {
    const cols: [number, number, number][] = [];
    for (const x of colXs) for (const z of colZs) cols.push([x, H / 2, z]);
    const beams: { pos: [number, number, number]; args: [number, number, number] }[] = [];
    for (let f = 1; f <= FLOORS; f++) {
      const y = f * FH;
      // çevre kirişleri (x yönü)
      beams.push({ pos: [0, y, -halfZ], args: [WX, 0.1, 0.1] });
      beams.push({ pos: [0, y, halfZ], args: [WX, 0.1, 0.1] });
      // z yönü
      beams.push({ pos: [-halfX, y, 0], args: [0.1, 0.1, WZ] });
      beams.push({ pos: [halfX, y, 0], args: [0.1, 0.1, WZ] });
    }
    return { cols, beams };
  }, []);

  // Betonarme döşemeler + çekirdek
  const slabs = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let f = 1; f <= FLOORS; f++) arr.push([0, f * FH, 0]);
    return arr;
  }, []);

  useFrame((state, delta) => {
    const p = heroProgress.value;
    const damp = 1 - Math.pow(0.001, delta); // yumuşak lerp katsayısı

    // Blueprint: 0'dan belirir, çelik gelince söner
    const bpTarget = smoothstep(0.0, 0.08, p) * (1 - smoothstep(0.16, 0.3, p));
    // Çelik: 0.15–0.42
    const steelTarget = smoothstep(0.15, 0.36, p);
    // Beton: 0.38–0.62
    const concreteTarget = smoothstep(0.38, 0.58, p);
    // Cam: 0.58–0.84
    const glassTarget = smoothstep(0.58, 0.82, p) * 0.62; // cam yarı saydam kalır

    applyOpacity(blueprintRef.current, bpTarget, damp, true);
    applyOpacity(steelRef.current, steelTarget, damp, false);
    applyOpacity(concreteRef.current, concreteTarget, damp, false);
    applyOpacity(glassRef.current, glassTarget, damp, false);

    // Montaj hissi: her grup belirirken hafifçe yukarı otururlar
    liftIn(steelRef.current, steelTarget);
    liftIn(concreteRef.current, concreteTarget);
    liftIn(glassRef.current, glassTarget);
    void state;
  });

  return (
    <group position={[0, -H / 2, 0]}>
      {/* Blueprint */}
      <group ref={blueprintRef}>
        {blueprintGeo.map((g, i) => (
          <lineSegments key={i} geometry={g}>
            <lineBasicMaterial color="#6fb4ff" transparent opacity={0} toneMapped={false} />
          </lineSegments>
        ))}
      </group>

      {/* Çelik iskelet — PBR metal */}
      <group ref={steelRef}>
        {steel.cols.map((c, i) => (
          <mesh key={`c${i}`} position={c} castShadow receiveShadow>
            <boxGeometry args={[0.14, H, 0.14]} />
            <meshStandardMaterial color="#b9c2cc" metalness={0.95} roughness={0.32} transparent opacity={0} />
          </mesh>
        ))}
        {steel.beams.map((b, i) => (
          <mesh key={`b${i}`} position={b.pos} castShadow receiveShadow>
            <boxGeometry args={b.args} />
            <meshStandardMaterial color="#8f9aa6" metalness={0.9} roughness={0.4} transparent opacity={0} />
          </mesh>
        ))}
      </group>

      {/* Betonarme — döşemeler + çekirdek */}
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

      {/* Cam cephe — 4 perde duvar */}
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
              <meshStandardMaterial
                color="#8fb8d8"
                metalness={0.6}
                roughness={0.1}
                transparent
                opacity={0}
                side={THREE.DoubleSide}
              />
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

// Yardımcılar
function applyOpacity(g: THREE.Group | null, target: number, damp: number, isLine: boolean) {
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
  void isLine;
}

function liftIn(g: THREE.Group | null, t: number) {
  if (!g) return;
  // t 0→1 arası grubu hafifçe yukarı oturt (montaj hissi)
  const y = (1 - t) * -0.6;
  g.position.y += (y - g.position.y) * 0.12;
}
