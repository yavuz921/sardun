"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroProgress } from "@/lib/heroProgress";

/*
  The birth of architecture — ONE coherent object continuously unfolding.

  Every structural member begins collapsed into a single point of light (the
  idea). As scroll progresses, every member travels outward along the same
  kind of path — from that shared point toward its real, final structural
  position — while a single global twist field (identical for every member
  at a given height, at every instant) sweeps through the whole form. This
  is what keeps the transformation legible as ONE evolving object rather
  than scattered independent pieces: nothing moves along an arbitrary path,
  everything answers to the same underlying field.

    Idea            → collapsed to a single glowing point.
    Emergence        → the point expands outward, coherently, into a
                        precise structural lattice, briefly swept by a
                        unified twisting field (parametric imagination).
    Skeleton         → the twist relaxes; members settle into their exact
                        final columns & beams.
    Materialization  → members refine from glow into brushed steel;
                        concrete and glass grow continuously into being,
                        bottom-up; a slender spire ignites at the crown.
    Masterpiece      → golden-hour light settles over the finished tower.
*/

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

const EMERGE_START = 0.04;
const EMERGE_END = 0.62;
const TWIST_RISE: [number, number] = [0.16, 0.34];
const TWIST_FALL: [number, number] = [0.46, 0.64];
const METAL_START = 0.56;
const METAL_END = 0.86;

const GLOW_COLOR = new THREE.Color("#dcefff");
const STEEL_COLOR = new THREE.Color("#b9c2cc");

type Member = { pos: [number, number, number]; args: [number, number, number]; seed: number };
type Volume = { pos: [number, number, number]; size: [number, number, number]; color: string; metalness: number; roughness: number; threshold: number };
type GlassPanel = { pos: [number, number, number]; rot: [number, number, number]; w: number; h: number; threshold: number };

export default function Building({ mobile }: { mobile: boolean }) {
  const mysteryRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const membersRef = useRef<THREE.Group>(null);
  const concreteRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Group>(null);
  const spireBodyRef = useRef<THREE.Mesh>(null);
  const spireTipRef = useRef<THREE.Mesh>(null);

  // ── Massing — a refined stepped tower: plinth, shaft, two setbacks, spire ──
  const massing = useMemo(() => {
    const shaftFloors = mobile ? 5 : 7;
    const midFloors = mobile ? 1 : 2;
    const topFloors = 1;
    const px = 1.3, pz = 1.1, pH = 1.05;
    const sx = 1.0, sz = 0.85, sF = 0.55;
    const mx = 0.82, mz = 0.7, mF = 0.55;
    const tx = 0.62, tz = 0.53, tF = 0.55;
    const spireH = mobile ? 0.6 : 1.05;
    const shaftH = shaftFloors * sF;
    const midH = midFloors * mF;
    const topH = topFloors * tF;
    const bodyH = pH + shaftH + midH + topH;
    const totalH = bodyH + spireH;
    const core = new THREE.Vector3(0, totalH * 0.42, 0);
    return { shaftFloors, midFloors, topFloors, px, pz, pH, sx, sz, sF, mx, mz, mF, tx, tz, tF, spireH, shaftH, midH, topH, bodyH, totalH, core };
  }, [mobile]);
  const { shaftFloors, midFloors, px, pz, pH, sx, sz, sF, mx, mz, mF, tx, tz, tF, spireH, shaftH, midH, topH, bodyH, totalH, core } = massing;

  // ── Ambient guide lines & particles — Phase 1 atmosphere, independent of the structure ──
  const mysteryGeo = useMemo(() => {
    const n = mobile ? 4 : 7;
    const geos: THREE.BufferGeometry[] = [];
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2;
      const r = 1.0 + (i % 3) * 0.45;
      const y0 = totalH * 0.3 + (i % 4) * totalH * 0.1;
      const a = new THREE.Vector3(Math.cos(ang) * r, y0, Math.sin(ang) * r);
      const b = new THREE.Vector3(Math.cos(ang + 0.6) * (r * 0.35), y0 + totalH * 0.22, Math.sin(ang + 0.6) * (r * 0.35));
      const g = new THREE.BufferGeometry();
      g.setFromPoints([a, b]);
      geos.push(g);
    }
    return geos;
  }, [totalH, mobile]);

  const particleGeo = useMemo(() => {
    const count = mobile ? 80 : 200;
    const positions = new Float32Array(count * 3);
    let seed = 7;
    const rng = () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      const r = 0.5 + rng() * 1.8;
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      positions[i * 3 + 1] = core.y + Math.cos(phi) * r * 0.7;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [core, mobile]);

  // ── Structural members — final positions only; the journey is computed per-frame ──
  const members: Member[] = useMemo(() => {
    const arr: Member[] = [];
    let seed = 0;
    const push = (pos: [number, number, number], args: [number, number, number]) => arr.push({ pos, args, seed: seed++ });
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
    const midBaseY = pH + shaftH;
    for (const x of [-mx, mx]) for (const z of [-mz, mz]) push([x, midBaseY + midH / 2, z], [0.12, midH, 0.12]);
    ring(midBaseY + midH, mx, mz, 0.08);
    const topBaseY = midBaseY + midH;
    for (const x of [-tx, tx]) for (const z of [-tz, tz]) push([x, topBaseY + topH / 2, z], [0.1, topH, 0.1]);
    ring(topBaseY + topH, tx, tz, 0.06);
    return arr;
  }, [px, pz, pH, sx, sz, sF, mx, mz, tx, tz, shaftFloors, shaftH, midH, topH]);

  // ── Concrete & glass volumes — grow continuously into being, bottom-up ──
  const volumes: Volume[] = useMemo(() => {
    const arr: Volume[] = [];
    const thr = (y: number) => 0.6 + (y / bodyH) * 0.2;
    arr.push({ pos: [0, pH / 2, 0], size: [px * 2, pH, pz * 2], color: "#b7b4ac", metalness: 0, roughness: 0.95, threshold: thr(pH / 2) });
    for (let f = 2; f <= shaftFloors; f += 2) {
      const y = pH + f * sF;
      arr.push({ pos: [0, y, 0], size: [sx * 2 + 0.06, 0.08, sz * 2 + 0.06], color: "#c9c6bf", metalness: 0.1, roughness: 0.85, threshold: thr(y) });
    }
    const midBaseY = pH + shaftH;
    // Metallic trim band at the shaft → setback transition
    arr.push({ pos: [0, midBaseY, 0], size: [sx * 2 + 0.16, 0.07, sz * 2 + 0.16], color: "#d7dade", metalness: 0.6, roughness: 0.28, threshold: thr(midBaseY) });
    for (let f = 1; f <= midFloors; f++) {
      const y = midBaseY + f * mF;
      arr.push({ pos: [0, y, 0], size: [mx * 2 + 0.06, 0.08, mz * 2 + 0.06], color: "#c9c6bf", metalness: 0.1, roughness: 0.85, threshold: thr(y) });
    }
    const topBaseY = midBaseY + midH;
    // Metallic trim band at the setback → crown transition
    arr.push({ pos: [0, topBaseY, 0], size: [mx * 2 + 0.14, 0.07, mz * 2 + 0.14], color: "#d7dade", metalness: 0.6, roughness: 0.28, threshold: thr(topBaseY) });
    arr.push({ pos: [0, topBaseY + tF, 0], size: [tx * 2 + 0.06, 0.08, tz * 2 + 0.06], color: "#c9c6bf", metalness: 0.1, roughness: 0.85, threshold: thr(topBaseY + tF) });
    arr.push({ pos: [0, bodyH + 0.04, 0], size: [tx * 2 + 0.18, 0.08, tz * 2 + 0.18], color: "#aeb4b8", metalness: 0.35, roughness: 0.5, threshold: thr(bodyH) });
    arr.push({ pos: [0, -0.06, 0], size: [px * 2 + 0.8, 0.12, pz * 2 + 0.8], color: "#b7b4ac", metalness: 0, roughness: 0.95, threshold: thr(0) });
    return arr;
  }, [px, pz, pH, sx, sz, sF, mx, mz, mF, tx, tz, tF, shaftFloors, midFloors, shaftH, midH, bodyH]);

  const glassPanels: GlassPanel[] = useMemo(() => {
    const thr = (y: number) => 0.66 + (y / bodyH) * 0.2;
    const shaftY = pH + shaftH / 2;
    const midY = pH + shaftH + midH / 2;
    const topY = pH + shaftH + midH + topH / 2;
    const faces = (cx: number, cz: number, y: number, h: number, t: number): GlassPanel[] => [
      { pos: [0, y, cz + 0.02], rot: [0, 0, 0], w: cx * 2, h, threshold: t },
      { pos: [0, y, -cz - 0.02], rot: [0, Math.PI, 0], w: cx * 2, h, threshold: t },
      { pos: [cx + 0.02, y, 0], rot: [0, Math.PI / 2, 0], w: cz * 2, h, threshold: t },
      { pos: [-cx - 0.02, y, 0], rot: [0, -Math.PI / 2, 0], w: cz * 2, h, threshold: t },
    ];
    return [
      ...faces(sx, sz, shaftY, shaftH, thr(shaftY)),
      ...faces(mx, mz, midY, midH, thr(midY)),
      ...faces(tx, tz, topY, topH, thr(topY)),
      { pos: [0, pH * 0.55, pz + 0.02], rot: [0, 0, 0], w: px * 1.3, h: pH * 0.75, threshold: thr(pH * 0.55) },
    ];
  }, [pH, shaftH, midH, topH, sx, sz, mx, mz, tx, tz, px, pz, bodyH]);

  const tmpV = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const p = heroProgress.value;
    void delta;

    // ── Ambient guide lines & particles — Phase 1 only ──
    const ambientOpacity = smoothstep(0, 0.04, p) * (1 - smoothstep(0.12, 0.2, p));
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
      mat.opacity = ambientOpacity * 0.7;
      particlesRef.current.rotation.y += 0.0006;
    }

    // ── Members — one coherent field: shared origin, shared twist, shared timing ──
    const twistAmount =
      smoothstep(TWIST_RISE[0], TWIST_RISE[1], p) * (1 - smoothstep(TWIST_FALL[0], TWIST_FALL[1], p));
    const metalT = smoothstep(METAL_START, METAL_END, p);

    if (membersRef.current) {
      membersRef.current.children.forEach((child, i) => {
        const m = members[i];
        if (!m) return;
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;

        // Every member emerges along the same core → final path, only staggered slightly in TIME
        const stagger = (m.seed % 5) * 0.012;
        const r = smoothstep(EMERGE_START + stagger, EMERGE_END + stagger, p);
        tmpV.set(m.pos[0], m.pos[1], m.pos[2]).sub(core).multiplyScalar(r).add(core);

        // A single global twist field — identical angle for every member at this height, this instant
        const theta = (tmpV.y / totalH) * 1.1 * twistAmount;
        const cosT = Math.cos(theta), sinT = Math.sin(theta);
        const x = tmpV.x * cosT - tmpV.z * sinT;
        const z = tmpV.x * sinT + tmpV.z * cosT;
        mesh.position.set(x, tmpV.y, z);

        const s = 0.28 + 0.72 * r;
        mesh.scale.set(s, s, s);

        const revealGlow = smoothstep(0.03, 0.2, p);
        mat.emissiveIntensity = revealGlow * (1 - metalT) * 1.3 + 0.02;
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
        mat.opacity = t * 0.74;
      });
    }

    // ── Spire — the final beat: a slender beacon igniting at the crown ──
    const spireT = smoothstep(0.8, 0.94, p);
    if (spireBodyRef.current) {
      const mat = spireBodyRef.current.material as THREE.MeshStandardMaterial;
      spireBodyRef.current.scale.y = 0.05 + 0.95 * spireT;
      mat.opacity = spireT;
    }
    if (spireTipRef.current) {
      const mat = spireTipRef.current.material as THREE.MeshStandardMaterial;
      const glow = smoothstep(0.88, 1.0, p);
      mat.opacity = spireT;
      mat.emissiveIntensity = 0.4 + glow * 2.2;
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
        <pointsMaterial color="#dcefff" size={0.026} transparent opacity={0} depthWrite={false} sizeAttenuation />
      </points>

      {/* One coherent field — idea → emergence → skeleton → refined steel */}
      <group ref={membersRef}>
        {members.map((m, i) => (
          <mesh key={i} castShadow receiveShadow>
            <boxGeometry args={m.args} />
            <meshStandardMaterial transparent opacity={1} color="#dcefff" emissive="#bfe0ff" emissiveIntensity={0} metalness={0} roughness={0.55} />
          </mesh>
        ))}
      </group>

      {/* Concrete volumes — plinth, floor datums, metallic trim bands, roof cap, podium */}
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
              <meshPhysicalMaterial color="#9fc4de" metalness={0.1} roughness={0.06} transmission={0.85} thickness={0.4} ior={1.45} transparent opacity={0.001} side={THREE.DoubleSide} />
            )}
          </mesh>
        ))}
      </group>

      {/* Spire — a slender beacon, the closing beat */}
      <mesh ref={spireBodyRef} position={[0, bodyH + spireH / 2, 0]}>
        <coneGeometry args={[0.07, spireH, 8]} />
        <meshStandardMaterial color="#c7ccd1" metalness={0.7} roughness={0.25} transparent opacity={0.001} />
      </mesh>
      <mesh ref={spireTipRef} position={[0, bodyH + spireH + 0.03, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#ffe6bf" emissive="#ffcf94" emissiveIntensity={0} metalness={0.2} roughness={0.3} transparent opacity={0.001} />
      </mesh>
    </group>
  );
}
