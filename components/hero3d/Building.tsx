"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroProgress } from "@/lib/heroProgress";

/*
  The birth of architecture — a single continuous transformation, driven
  entirely by scroll. No objects are ever added, removed or swapped: the
  same set of structural members perpetually reshapes itself.

    Idea            → a soft scattered cloud of light, formless.
    Grid             → the cloud resolves into a precise mathematical lattice.
    Parametric Form  → the lattice flows into a sculptural, twisted geometry.
    Structural Skeleton → the flow resolves into real columns & beams.
    Materialization  → members refine from glow into brushed steel; concrete
                        volumes and glass curtain walls grow continuously
                        into being, bottom-up.
    Masterpiece      → golden-hour light settles over the finished tower.

  Every property (position, scale, color, metalness, emissive intensity,
  opacity) is a pure continuous function of a single scroll progress value —
  nothing pops, nothing cuts.
*/

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Scroll breakpoints for the continuous morph (each segment blends smoothly into the next)
const B1 = 0.24; // idea → grid
const B2 = 0.44; // grid → parametric
const B3 = 0.62; // parametric → structural skeleton (fully resolved)
const METAL_END = 0.84; // glow fully refined into steel by here

const GLOW_COLOR = new THREE.Color("#dcefff");
const STEEL_COLOR = new THREE.Color("#b9c2cc");

type Member = {
  seed: number;
  k0: THREE.Vector3; // idea — scattered cloud
  k1: THREE.Vector3; // precise grid
  k2: THREE.Vector3; // flowing parametric warp
  k3: THREE.Vector3; // final structural position
  args: [number, number, number];
};
type Volume = { pos: [number, number, number]; size: [number, number, number]; color: string; metalness: number; roughness: number; threshold: number };
type GlassPanel = { pos: [number, number, number]; rot: [number, number, number]; w: number; h: number; threshold: number };

export default function Building({ mobile }: { mobile: boolean }) {
  const mysteryRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const membersRef = useRef<THREE.Group>(null);
  const concreteRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Group>(null);

  // ── Massing — a slender, symmetric tower silhouette (unchanged from prior approval) ──
  const massing = useMemo(() => {
    const shaftFloors = mobile ? 5 : 8;
    const crownFloors = mobile ? 1 : 2;
    const px = 1.3, pz = 1.1, pH = 1.05;
    const sx = 1.0, sz = 0.85, sF = 0.55;
    const cx = 0.78, cz = 0.65, cF = 0.55;
    const shaftH = shaftFloors * sF;
    const crownH = crownFloors * cF;
    const totalH = pH + shaftH + crownH;
    return { shaftFloors, crownFloors, px, pz, pH, sx, sz, sF, cx, cz, cF, shaftH, crownH, totalH };
  }, [mobile]);
  const { shaftFloors, crownFloors, px, pz, pH, sx, sz, sF, cx, cz, cF, shaftH, crownH, totalH } = massing;

  // ── Ambient guide lines — atmosphere for Phase 1, independent of the structure ──
  const mysteryGeo = useMemo(() => {
    const n = mobile ? 4 : 7;
    const geos: THREE.BufferGeometry[] = [];
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2;
      const r = 1.1 + (i % 3) * 0.5;
      const y0 = totalH * 0.25 + (i % 4) * totalH * 0.12;
      const a = new THREE.Vector3(Math.cos(ang) * r, y0, Math.sin(ang) * r);
      const b = new THREE.Vector3(Math.cos(ang + 0.6) * (r * 0.35), y0 + totalH * 0.28, Math.sin(ang + 0.6) * (r * 0.35));
      const g = new THREE.BufferGeometry();
      g.setFromPoints([a, b]);
      geos.push(g);
    }
    return geos;
  }, [totalH, mobile]);

  // ── Floating particles — a single draw call, drifting atmosphere for Phase 1 ──
  const particleGeo = useMemo(() => {
    const count = mobile ? 90 : 220;
    const positions = new Float32Array(count * 3);
    const rng = mulberry32(7);
    for (let i = 0; i < count; i++) {
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      const r = 0.6 + rng() * 2.2;
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      positions[i * 3 + 1] = totalH * 0.4 + Math.cos(phi) * r * 0.7;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [totalH, mobile]);

  // ── Structural members — the same list carries idea / grid / parametric / skeleton ──
  const members: Member[] = useMemo(() => {
    const finals: { pos: [number, number, number]; args: [number, number, number] }[] = [];
    const push = (pos: [number, number, number], args: [number, number, number]) => finals.push({ pos, args });
    const ring = (y: number, hx: number, hz: number, t = 0.08) => {
      push([0, y, -hz], [hx * 2, t, t]);
      push([0, y, hz], [hx * 2, t, t]);
      push([-hx, y, 0], [t, t, hz * 2]);
      push([hx, y, 0], [t, t, hz * 2]);
    };
    for (const x of [-px, px]) for (const z of [-pz, pz]) push([x, pH / 2, z], [0.18, pH, 0.18]);
    ring(pH, px, pz, 0.12);
    for (const x of [-sx, sx]) for (const z of [-sz, sz]) push([x, pH + shaftH / 2, z], [0.14, shaftH, 0.14]);
    for (let f = 2; f <= shaftFloors; f += 2) ring(pH + f * sF, sx, sz);
    const crownBaseY = pH + shaftH;
    for (const x of [-cx, cx]) for (const z of [-cz, cz]) push([x, crownBaseY + crownH / 2, z], [0.12, crownH, 0.12]);
    ring(crownBaseY + crownH, cx, cz, 0.07);

    const rng = mulberry32(42);
    const GX = 4, GY = 5, GZ = 4;
    return finals.map((f, i) => {
      // k0 — idea: a soft scattered cloud near the building's emotional center
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      const r = 0.35 + rng() * 1.0;
      const k0 = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * r,
        totalH * 0.32 + Math.cos(phi) * r * 0.55,
        Math.sin(phi) * Math.sin(theta) * r
      );
      // k1 — precise grid: even lattice across the building's bounding volume
      const ix = i % GX, iy = Math.floor(i / GX) % GY, iz = Math.floor(i / (GX * GY)) % GZ;
      const gx = lerp(-px, px, GX > 1 ? ix / (GX - 1) : 0.5);
      const gy = lerp(0.2, totalH - 0.2, GY > 1 ? iy / (GY - 1) : 0.5);
      const gz = lerp(-pz, pz, GZ > 1 ? iz / (GZ - 1) : 0.5);
      const k1 = new THREE.Vector3(gx, gy, gz);
      // k2 — parametric: the grid warped into a flowing, twisted sculptural form
      const twist = (gy / totalH) * Math.PI * 0.85;
      const pulse = 1 + 0.4 * Math.sin(gy * 2.1 + i * 0.35);
      const ang = Math.atan2(gz, gx) + twist;
      const rad = Math.sqrt(gx * gx + gz * gz) * pulse;
      const k2 = new THREE.Vector3(Math.cos(ang) * rad, gy + Math.sin(i * 1.3 + gy * 1.4) * 0.28, Math.sin(ang) * rad);
      const k3 = new THREE.Vector3(f.pos[0], f.pos[1], f.pos[2]);
      return { seed: i, k0, k1, k2, k3, args: f.args };
    });
  }, [px, pz, pH, sx, sz, sF, cx, cz, shaftFloors, shaftH, crownH, totalH]);

  // ── Concrete & glass — grow continuously into being, bottom-up ──
  const volumes: Volume[] = useMemo(() => {
    const arr: Volume[] = [];
    const thr = (y: number) => 0.6 + (y / totalH) * 0.22;
    arr.push({ pos: [0, pH / 2, 0], size: [px * 2, pH, pz * 2], color: "#b7b4ac", metalness: 0, roughness: 0.95, threshold: thr(pH / 2) });
    for (let f = 2; f <= shaftFloors; f += 2) {
      const y = pH + f * sF;
      arr.push({ pos: [0, y, 0], size: [sx * 2 + 0.06, 0.08, sz * 2 + 0.06], color: "#c9c6bf", metalness: 0.1, roughness: 0.85, threshold: thr(y) });
    }
    const crownBase = pH + shaftH;
    for (let f = 1; f <= crownFloors; f++) {
      const y = crownBase + f * cF;
      arr.push({ pos: [0, y, 0], size: [cx * 2 + 0.06, 0.08, cz * 2 + 0.06], color: "#c9c6bf", metalness: 0.1, roughness: 0.85, threshold: thr(y) });
    }
    arr.push({ pos: [0, totalH + 0.05, 0], size: [cx * 2 + 0.2, 0.1, cz * 2 + 0.2], color: "#aeb4b8", metalness: 0.3, roughness: 0.6, threshold: thr(totalH) });
    arr.push({ pos: [0, -0.06, 0], size: [px * 2 + 0.8, 0.12, pz * 2 + 0.8], color: "#b7b4ac", metalness: 0, roughness: 0.95, threshold: thr(0) });
    return arr;
  }, [px, pz, pH, sx, sz, sF, cx, cz, cF, shaftFloors, crownFloors, shaftH, totalH]);

  const glassPanels: GlassPanel[] = useMemo(() => {
    const thr = (y: number) => 0.66 + (y / totalH) * 0.22;
    const shaftY = pH + shaftH / 2;
    const crownY = pH + shaftH + crownH / 2;
    return [
      { pos: [0, shaftY, sz + 0.02] as [number, number, number], rot: [0, 0, 0] as [number, number, number], w: sx * 2, h: shaftH, threshold: thr(shaftY) },
      { pos: [0, shaftY, -sz - 0.02] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number], w: sx * 2, h: shaftH, threshold: thr(shaftY) },
      { pos: [sx + 0.02, shaftY, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number], w: sz * 2, h: shaftH, threshold: thr(shaftY) },
      { pos: [-sx - 0.02, shaftY, 0] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number], w: sz * 2, h: shaftH, threshold: thr(shaftY) },
      { pos: [0, crownY, cz + 0.02] as [number, number, number], rot: [0, 0, 0] as [number, number, number], w: cx * 2, h: crownH, threshold: thr(crownY) },
      { pos: [0, crownY, -cz - 0.02] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number], w: cx * 2, h: crownH, threshold: thr(crownY) },
      { pos: [cx + 0.02, crownY, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number], w: cz * 2, h: crownH, threshold: thr(crownY) },
      { pos: [-cx - 0.02, crownY, 0] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number], w: cz * 2, h: crownH, threshold: thr(crownY) },
      { pos: [0, pH * 0.55, pz + 0.02] as [number, number, number], rot: [0, 0, 0] as [number, number, number], w: px * 1.3, h: pH * 0.75, threshold: thr(pH * 0.55) },
    ];
  }, [pH, shaftH, crownH, sx, sz, cx, cz, px, pz, totalH]);

  const tmpV = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const p = heroProgress.value;
    void delta;

    // ── Ambient guide lines & particles — Phase 1 only ──
    const ambientOpacity = smoothstep(0, 0.05, p) * (1 - smoothstep(0.16, 0.26, p));
    if (mysteryRef.current) {
      mysteryRef.current.children.forEach((child) => {
        const mat = (child as THREE.Line).material as THREE.LineBasicMaterial;
        mat.opacity = ambientOpacity;
      });
      const breathe = Math.sin(performance.now() * 0.00022) * 0.02;
      mysteryRef.current.rotation.y += (breathe - mysteryRef.current.rotation.y) * 0.02;
    }
    if (particlesRef.current) {
      const mat = particlesRef.current.material as THREE.PointsMaterial;
      mat.opacity = ambientOpacity * 0.75;
      particlesRef.current.rotation.y += 0.0006;
      particlesRef.current.position.y = Math.sin(performance.now() * 0.00016) * 0.15;
    }

    // ── Members — one continuous morph: idea → grid → parametric → skeleton → steel ──
    if (membersRef.current) {
      membersRef.current.children.forEach((child, i) => {
        const m = members[i];
        if (!m) return;
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const jitter = ((m.seed % 7) / 7) * 0.05 - 0.025;

        let pos: THREE.Vector3;
        if (p < B1) pos = tmpV.copy(m.k0).lerp(m.k1, smoothstep(0, B1, p));
        else if (p < B2) pos = tmpV.copy(m.k1).lerp(m.k2, smoothstep(B1, B2, p));
        else if (p < B3) pos = tmpV.copy(m.k2).lerp(m.k3, smoothstep(B2, B3, p));
        else pos = tmpV.copy(m.k3);
        mesh.position.copy(pos);

        const scaleT = smoothstep(B2 + jitter, B3 + jitter, p);
        const s = 0.3 + 0.7 * scaleT;
        mesh.scale.set(s, s, s);

        const revealGlow = smoothstep(0.02, 0.2, p);
        const metalT = smoothstep(B3 - 0.02, METAL_END + jitter, p);
        mat.emissiveIntensity = revealGlow * (1 - metalT) * 1.35 + 0.02;
        mat.metalness = metalT * 0.92;
        mat.roughness = 0.55 - metalT * 0.23;
        mat.color.copy(GLOW_COLOR).lerp(STEEL_COLOR, metalT);
      });
    }

    // ── Concrete & glass — grow continuously into being ──
    if (concreteRef.current) {
      concreteRef.current.children.forEach((child, i) => {
        const v = volumes[i];
        if (!v) return;
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const t = smoothstep(v.threshold - 0.06, v.threshold + 0.06, p);
        mesh.scale.y = 0.05 + 0.95 * t;
        mat.opacity = t;
      });
    }
    if (glassRef.current) {
      glassRef.current.children.forEach((child, i) => {
        const g = glassPanels[i];
        if (!g) return;
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.Material & { opacity: number };
        const t = smoothstep(g.threshold - 0.06, g.threshold + 0.06, p);
        mesh.scale.y = 0.06 + 0.94 * t;
        mat.opacity = t * 0.72;
      });
    }
  });

  return (
    <group position={[0, -totalH / 2, 0]}>
      {/* Phase 1 — ambient guide lines */}
      <group ref={mysteryRef}>
        {mysteryGeo.map((g, i) => (
          <line key={i}>
            <primitive object={g} attach="geometry" />
            <lineBasicMaterial color="#cfe8ff" transparent opacity={0} />
          </line>
        ))}
      </group>

      {/* Phase 1 — floating particles */}
      <points ref={particlesRef}>
        <primitive object={particleGeo} attach="geometry" />
        <pointsMaterial color="#dcefff" size={0.028} transparent opacity={0} depthWrite={false} sizeAttenuation />
      </points>

      {/* Idea → Grid → Parametric Form → Skeleton → Steel — one continuously morphing set */}
      <group ref={membersRef}>
        {members.map((m, i) => (
          <mesh key={i} castShadow receiveShadow>
            <boxGeometry args={m.args} />
            <meshStandardMaterial
              transparent
              opacity={1}
              color="#dcefff"
              emissive="#bfe0ff"
              emissiveIntensity={0}
              metalness={0}
              roughness={0.55}
            />
          </mesh>
        ))}
      </group>

      {/* Concrete volumes — plinth, floor datums, roof cap, ground podium */}
      <group ref={concreteRef}>
        {volumes.map((v, i) => (
          <mesh key={i} position={v.pos} castShadow receiveShadow>
            <boxGeometry args={v.size} />
            <meshStandardMaterial color={v.color} metalness={v.metalness} roughness={v.roughness} transparent opacity={0.001} />
          </mesh>
        ))}
      </group>

      {/* Glass curtain walls */}
      <group ref={glassRef}>
        {glassPanels.map((g, i) => (
          <mesh key={i} position={g.pos} rotation={g.rot}>
            <planeGeometry args={[g.w, g.h]} />
            {mobile ? (
              <meshStandardMaterial color="#8fb8d8" metalness={0.6} roughness={0.1} transparent opacity={0.001} side={THREE.DoubleSide} />
            ) : (
              <meshPhysicalMaterial
                color="#9fc4de"
                metalness={0.1}
                roughness={0.06}
                transmission={0.85}
                thickness={0.4}
                ior={1.45}
                transparent
                opacity={0.001}
                side={THREE.DoubleSide}
              />
            )}
          </mesh>
        ))}
      </group>
    </group>
  );
}
