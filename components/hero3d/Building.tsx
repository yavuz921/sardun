"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroProgress } from "@/lib/heroProgress";

/*
  A real construction sequence, in real engineering order. Every element is
  authored ONCE at its true, final position — nothing ever travels sideways
  or arrives from elsewhere. Vertical elements (slabs, columns, walls, roof)
  rise upward from the exact point where they meet the structure beneath
  them; beams grow outward from their own center to meet the columns they
  connect. The building never assembles from scattered fragments — it
  simply grows, in order, exactly where it belongs.

  Final result: a modern luxury villa — a solid, grounded concrete-and-stone
  ground floor wrapping an open, column-supported covered terrace, carrying
  a cantilevered all-glass upper volume above it.

   0. Blueprint — the full structural drawing appears first: every
      foundation, slab, column, beam and wall outline the engineer has
      already planned, drawn as a glowing technical wireframe (the exact
      same coordinates the solid model below uses — this IS the plan,
      not a decoration).
   1. Foundation / ground platform
   2. Ground floor slab
   3. Structural columns (exposed, at the terrace)
   4. Structural beams (perimeter ring, connecting the columns)
   5. Second floor slab (the cantilevered glass volume's floor)
   6. Exterior walls (concrete)
   7. Roof structure (steel edge frame)
   8. Roof slab
   9. Window frames
  10. Large glass panels
  11. Natural stone cladding
  12. Architectural details (canopy, fascia, steps)
  13. Final lighting — soffit glow ignites, golden-hour settles in

  Every wireframe line dissolves into its real, solid counterpart at the
  exact moment that piece is built — the blueprint isn't a separate phase
  that disappears, it's the same data being progressively realized.
*/

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type Stage = [number, number];
// The blueprint holds, fully drawn and legible, from p=0 to ~0.09 —
// nothing solid begins until the plan has actually been shown.
const STAGE = {
  foundation: [0.09, 0.15] as Stage,
  floorSlab: [0.13, 0.2] as Stage,
  columns: [0.18, 0.25] as Stage,
  beams: [0.23, 0.31] as Stage,
  secondSlab: [0.29, 0.37] as Stage,
  walls: [0.35, 0.44] as Stage,
  roofStructure: [0.42, 0.49] as Stage,
  roof: [0.47, 0.55] as Stage,
  windowFrames: [0.53, 0.6] as Stage,
  glass: [0.58, 0.68] as Stage,
  cladding: [0.66, 0.77] as Stage,
  details: [0.75, 0.87] as Stage,
  lighting: [0.85, 1.0] as Stage,
};

// A vertical element rises from `baseY` (where it connects to the structure below it)
type VertEl = { pos: [number, number]; baseY: number; height: number; args: [number, number, number]; color: string; metalness: number; roughness: number; stage: Stage };
// A spanning element (beam) grows from its own fixed center along one axis, connecting what's on either side
type SpanEl = { pos: [number, number, number]; args: [number, number, number]; axis: "x" | "z"; color: string; metalness: number; roughness: number; stage: Stage };
// A simple reveal element (frame, detail) — fixed position, fades/settles into place
type SimpleEl = { pos: [number, number, number]; rot?: [number, number, number]; args: [number, number, number]; color: string; metalness: number; roughness: number; stage: Stage };
type GlassPanel = { pos: [number, number, number]; rot: [number, number, number]; w: number; h: number; stage: Stage };

const STEEL_STRUCTURE = { color: "#aab0b6", metalness: 0.7, roughness: 0.35 }; // raw structural frame
const CONCRETE = { color: "#c9c6bf", metalness: 0, roughness: 0.9 };
const CONCRETE_DARK = { color: "#b7b4ac", metalness: 0, roughness: 0.95 };
const STONE = { color: "#b6ac93", metalness: 0, roughness: 0.85 };
const METAL_TRIM = { color: "#4a4d50", metalness: 0.8, roughness: 0.25 };

export default function Building({ mobile }: { mobile: boolean }) {
  const blueprintRef = useRef<THREE.Group>(null);
  const foundationRef = useRef<THREE.Group>(null);
  const floorSlabRef = useRef<THREE.Group>(null);
  const columnsRef = useRef<THREE.Group>(null);
  const beamsRef = useRef<THREE.Group>(null);
  const secondSlabRef = useRef<THREE.Group>(null);
  const wallsRef = useRef<THREE.Group>(null);
  const roofStructureRef = useRef<THREE.Group>(null);
  const roofRef = useRef<THREE.Group>(null);
  const framesRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Group>(null);
  const claddingRef = useRef<THREE.Group>(null);
  const detailsRef = useRef<THREE.Group>(null);
  const soffitRef = useRef<THREE.Mesh>(null);

  // ── Villa massing ──
  const M = useMemo(() => {
    const gw = 5.6, gd = 3.8, gh = 1.15; // ground volume: width, depth, height
    const enclosedBackZ = -gd / 2; // -1.9
    const enclosedFrontZ = 0.3; // glazing line between living room and terrace
    const uw = 3.4, ud = 2.6, uh = 1.05; // cantilevered upper (glass) volume
    const upperCenterZ = 0.35;
    const upperBackZ = upperCenterZ - ud / 2; // -0.95
    const upperFrontZ = upperCenterZ + ud / 2; // 1.65
    const roofW = uw + 0.5, roofD = ud + 0.5, roofT = 0.12;
    const totalH = 0.22 + gh + uh + roofT; // podium + ground + upper + roof
    return { gw, gd, gh, enclosedBackZ, enclosedFrontZ, uw, ud, uh, upperCenterZ, upperBackZ, upperFrontZ, roofW, roofD, roofT, totalH };
  }, []);
  const { gw, gd, gh, enclosedBackZ, enclosedFrontZ, uw, ud, uh, upperCenterZ, upperBackZ, upperFrontZ, roofW, roofD, roofT, totalH } = M;

  // ── 1. Foundation / ground platform ──
  const foundation: VertEl[] = useMemo(
    () => [{ pos: [0, 0], baseY: -0.3, height: 0.22, args: [gw + 0.7, 0.22, gd + 0.7], ...CONCRETE_DARK, stage: STAGE.foundation }],
    [gw, gd]
  );

  // ── 2. Ground floor slab ──
  const floorSlab: VertEl[] = useMemo(
    () => [{ pos: [0, 0], baseY: 0, height: 0.1, args: [gw, 0.1, gd], ...CONCRETE, stage: STAGE.floorSlab }],
    [gw, gd]
  );

  // ── 3. Structural columns — exposed, holding up the covered terrace ──
  const columns: VertEl[] = useMemo(() => {
    const xs = [-2.3, -0.75, 0.75, 2.3];
    return xs.map((x) => ({ pos: [x, gd / 2 - 0.08], baseY: 0.1, height: gh - 0.1, args: [0.14, gh - 0.1, 0.14], ...STEEL_STRUCTURE, stage: STAGE.columns }));
  }, [gd, gh]);

  // ── 4. Structural beams — perimeter ring connecting the columns ──
  const beams: SpanEl[] = useMemo(
    () => [
      { pos: [0, gh, gd / 2], args: [gw, 0.14, 0.14], axis: "x", ...STEEL_STRUCTURE, stage: STAGE.beams },
      { pos: [0, gh, -gd / 2], args: [gw, 0.14, 0.14], axis: "x", ...STEEL_STRUCTURE, stage: STAGE.beams },
      { pos: [-gw / 2, gh, 0], args: [0.14, 0.14, gd], axis: "z", ...STEEL_STRUCTURE, stage: STAGE.beams },
      { pos: [gw / 2, gh, 0], args: [0.14, 0.14, gd], axis: "z", ...STEEL_STRUCTURE, stage: STAGE.beams },
    ],
    [gw, gd, gh]
  );

  // ── 5. Second floor slab — the cantilevered upper volume's floor ──
  const secondSlab: VertEl[] = useMemo(
    () => [{ pos: [0, upperCenterZ], baseY: gh, height: 0.12, args: [uw, 0.12, ud], ...CONCRETE, stage: STAGE.secondSlab }],
    [gh, uw, ud, upperCenterZ]
  );

  // ── 6. Exterior walls ──
  const walls: VertEl[] = useMemo(
    () => [
      { pos: [0, enclosedBackZ], baseY: 0.1, height: gh - 0.1, args: [gw, gh - 0.1, 0.14], ...CONCRETE, stage: STAGE.walls },
      { pos: [-gw / 2, (enclosedBackZ + enclosedFrontZ) / 2], baseY: 0.1, height: gh - 0.1, args: [0.14, gh - 0.1, enclosedFrontZ - enclosedBackZ], ...CONCRETE, stage: STAGE.walls },
      { pos: [gw / 2, (enclosedBackZ + enclosedFrontZ) / 2], baseY: 0.1, height: gh - 0.1, args: [0.14, gh - 0.1, enclosedFrontZ - enclosedBackZ], ...CONCRETE, stage: STAGE.walls },
      { pos: [0, upperBackZ], baseY: gh + 0.12, height: uh - 0.12, args: [uw, uh - 0.12, 0.12], ...CONCRETE_DARK, stage: STAGE.walls },
    ],
    [gw, gh, enclosedBackZ, enclosedFrontZ, uw, uh, upperBackZ]
  );

  // ── 7. Roof structure — steel edge frame atop the glass volume ──
  const roofStructure: SpanEl[] = useMemo(() => {
    const y = gh + uh;
    return [
      { pos: [0, y, upperFrontZ], args: [uw, 0.1, 0.1], axis: "x", ...STEEL_STRUCTURE, stage: STAGE.roofStructure },
      { pos: [0, y, upperBackZ], args: [uw, 0.1, 0.1], axis: "x", ...STEEL_STRUCTURE, stage: STAGE.roofStructure },
      { pos: [-uw / 2, y, upperCenterZ], args: [0.1, 0.1, ud], axis: "z", ...STEEL_STRUCTURE, stage: STAGE.roofStructure },
      { pos: [uw / 2, y, upperCenterZ], args: [0.1, 0.1, ud], axis: "z", ...STEEL_STRUCTURE, stage: STAGE.roofStructure },
    ];
  }, [gh, uh, uw, ud, upperFrontZ, upperBackZ, upperCenterZ]);

  // ── 8. Roof slab ──
  const roof: VertEl[] = useMemo(
    () => [{ pos: [0, upperCenterZ], baseY: gh + uh, height: roofT, args: [roofW, roofT, roofD], color: "#aeb4b8", metalness: 0.3, roughness: 0.55, stage: STAGE.roof }],
    [gh, uh, upperCenterZ, roofT, roofW, roofD]
  );

  // ── 0. Blueprint — a technical wireframe built from the EXACT same coordinates
  //     as the solid structure above; each line dissolves into its real
  //     counterpart the instant that piece is actually built. ──
  const blueprint = useMemo(() => {
    const items: { geo: THREE.BufferGeometry; stageStart: number }[] = [];
    const addVert = (el: VertEl) => {
      const box = new THREE.BoxGeometry(el.args[0], el.args[1], el.args[2]);
      box.translate(el.pos[0], el.baseY + el.height / 2, el.pos[1]);
      items.push({ geo: new THREE.EdgesGeometry(box), stageStart: el.stage[0] });
      box.dispose();
    };
    const addSpan = (el: SpanEl) => {
      const box = new THREE.BoxGeometry(el.args[0], el.args[1], el.args[2]);
      box.translate(el.pos[0], el.pos[1], el.pos[2]);
      items.push({ geo: new THREE.EdgesGeometry(box), stageStart: el.stage[0] });
      box.dispose();
    };
    foundation.forEach(addVert);
    floorSlab.forEach(addVert);
    columns.forEach(addVert);
    beams.forEach(addSpan);
    secondSlab.forEach(addVert);
    walls.forEach(addVert);
    roofStructure.forEach(addSpan);
    roof.forEach(addVert);
    return items;
  }, [foundation, floorSlab, columns, beams, secondSlab, walls, roofStructure, roof]);

  // ── 9. Window frames — slim mullions outlining the glazing ──
  const frames: SimpleEl[] = useMemo(() => {
    const arr: SimpleEl[] = [];
    const groundY0 = 0.15, groundY1 = gh - 0.03;
    for (const x of [-gw / 2 + 0.3, -gw / 6, gw / 6, gw / 2 - 0.3]) {
      arr.push({ pos: [x, (groundY0 + groundY1) / 2, enclosedFrontZ + 0.015], args: [0.04, groundY1 - groundY0, 0.04], ...METAL_TRIM, stage: STAGE.windowFrames });
    }
    arr.push({ pos: [0, groundY1, enclosedFrontZ + 0.015], args: [gw - 0.3, 0.04, 0.04], ...METAL_TRIM, stage: STAGE.windowFrames });
    const upperY0 = gh + 0.15, upperY1 = gh + uh - 0.06;
    for (const x of [-uw / 2 + 0.25, 0, uw / 2 - 0.25]) {
      arr.push({ pos: [x, (upperY0 + upperY1) / 2, upperFrontZ + 0.015], args: [0.035, upperY1 - upperY0, 0.035], ...METAL_TRIM, stage: STAGE.windowFrames });
    }
    return arr;
  }, [gw, gh, uh, uw, enclosedFrontZ, upperFrontZ]);

  // ── 10. Large glass panels ──
  const glassPanels: GlassPanel[] = useMemo(
    () => [
      { pos: [0, (0.1 + gh) / 2, enclosedFrontZ + 0.02], rot: [0, 0, 0], w: gw - 0.2, h: gh - 0.2, stage: STAGE.glass },
      { pos: [0, (gh + 0.12 + gh + uh) / 2, upperFrontZ + 0.02], rot: [0, 0, 0], w: uw - 0.2, h: uh - 0.14, stage: STAGE.glass },
      { pos: [-uw / 2 - 0.02, (gh + 0.12 + gh + uh) / 2, upperCenterZ], rot: [0, Math.PI / 2, 0], w: ud - 0.2, h: uh - 0.14, stage: STAGE.glass },
      { pos: [uw / 2 + 0.02, (gh + 0.12 + gh + uh) / 2, upperCenterZ], rot: [0, -Math.PI / 2, 0], w: ud - 0.2, h: uh - 0.14, stage: STAGE.glass },
    ],
    [gw, gh, uw, ud, uh, enclosedFrontZ, upperFrontZ, upperCenterZ]
  );

  // ── 11. Natural stone cladding — installed left to right across the back wall ──
  const cladding: (SimpleEl & { order: number })[] = useMemo(() => {
    const n = 3;
    const panelW = gw / n;
    return Array.from({ length: n }, (_, i) => ({
      pos: [-gw / 2 + panelW * (i + 0.5), (0.1 + gh) / 2, enclosedBackZ - 0.02] as [number, number, number],
      args: [panelW - 0.04, gh - 0.14, 0.035] as [number, number, number],
      ...STONE,
      stage: STAGE.cladding,
      order: i,
    }));
  }, [gw, gh, enclosedBackZ]);

  // ── 12. Architectural details ──
  const details: SimpleEl[] = useMemo(
    () => [
      { pos: [-gw / 2 - 0.5, 1.0, enclosedBackZ + 0.6], args: [0.05, 0.7, 1.1], ...METAL_TRIM, stage: STAGE.details }, // entrance canopy support
      { pos: [-gw / 2 - 0.25, 1.35, enclosedBackZ + 0.6], args: [0.06, 1.0, 0.9], color: "#c9c6bf", metalness: 0.1, roughness: 0.7, stage: STAGE.details, rot: [0, 0, Math.PI / 2] },
      { pos: [0, roofT + gh + uh + 0.02, upperFrontZ], args: [roofW, 0.03, 0.06], ...METAL_TRIM, stage: STAGE.details }, // roof fascia (front)
      { pos: [0, 0.04, gd / 2 + 0.4], args: [gw * 0.5, 0.08, 0.7], color: "#b7b4ac", metalness: 0, roughness: 0.9, stage: STAGE.details }, // terrace step
    ],
    [gw, gh, uh, gd, enclosedBackZ, upperFrontZ, roofW, roofT]
  );

  const soffitBaseY = gh + 0.005;

  useFrame(() => {
    const p = heroProgress.value;

    // Blueprint: the whole plan reads clearly almost immediately, then each
    // line dissolves the instant its real, solid piece begins to be built.
    if (blueprintRef.current) {
      const globalIn = smoothstep(0, 0.02, p);
      blueprintRef.current.children.forEach((child, i) => {
        const item = blueprint[i];
        if (!item) return;
        const mat = (child as THREE.LineSegments).material as THREE.LineBasicMaterial;
        const localOut = smoothstep(item.stageStart, item.stageStart + 0.05, p);
        mat.opacity = globalIn * (1 - localOut) * 0.85;
      });
    }

    applyVertical(foundationRef.current, foundation, p);
    applyVertical(floorSlabRef.current, floorSlab, p);
    applyVertical(columnsRef.current, columns, p);
    applySpan(beamsRef.current, beams, p);
    applyVertical(secondSlabRef.current, secondSlab, p);
    applyVertical(wallsRef.current, walls, p);
    applySpan(roofStructureRef.current, roofStructure, p);
    applyVertical(roofRef.current, roof, p);
    applySimple(framesRef.current, frames, p);
    applyGlass(glassRef.current, glassPanels, p);
    applySimple(claddingRef.current, cladding, p);
    applySimple(detailsRef.current, details, p);

    // ── 13. Final lighting — a soffit glow ignites beneath the cantilever ──
    if (soffitRef.current) {
      const mat = soffitRef.current.material as THREE.MeshStandardMaterial;
      const t = smoothstep(STAGE.lighting[0], STAGE.lighting[1], p);
      mat.opacity = t * 0.9;
      mat.emissiveIntensity = t * 1.6;
    }
  });

  return (
    <group position={[0, -totalH / 2 + 0.3, 0]}>
      {/* Blueprint — the structural engineer's drawing, in the exact coordinates of the real building */}
      <group ref={blueprintRef}>
        {blueprint.map((item, i) => (
          <lineSegments key={i}>
            <primitive object={item.geo} attach="geometry" />
            <lineBasicMaterial color="#6fd0ff" transparent opacity={0} toneMapped={false} />
          </lineSegments>
        ))}
      </group>

      <group ref={foundationRef}>{foundation.map((e, i) => <VerticalMesh key={i} el={e} />)}</group>
      <group ref={floorSlabRef}>{floorSlab.map((e, i) => <VerticalMesh key={i} el={e} />)}</group>
      <group ref={columnsRef}>{columns.map((e, i) => <VerticalMesh key={i} el={e} castShadow />)}</group>
      <group ref={beamsRef}>{beams.map((e, i) => <SpanMesh key={i} el={e} castShadow />)}</group>
      <group ref={secondSlabRef}>{secondSlab.map((e, i) => <VerticalMesh key={i} el={e} castShadow />)}</group>
      <group ref={wallsRef}>{walls.map((e, i) => <VerticalMesh key={i} el={e} castShadow />)}</group>
      <group ref={roofStructureRef}>{roofStructure.map((e, i) => <SpanMesh key={i} el={e} />)}</group>
      <group ref={roofRef}>{roof.map((e, i) => <VerticalMesh key={i} el={e} castShadow />)}</group>
      <group ref={framesRef}>{frames.map((e, i) => <SimpleMesh key={i} el={e} />)}</group>

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

      <group ref={claddingRef}>{cladding.map((e, i) => <SimpleMesh key={i} el={e} />)}</group>
      <group ref={detailsRef}>{details.map((e, i) => <SimpleMesh key={i} el={e} />)}</group>

      {/* Soffit light strip — the closing beat, underside of the cantilever */}
      <mesh ref={soffitRef} position={[0, soffitBaseY, upperCenterZ]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[uw - 0.3, ud - 0.3]} />
        <meshStandardMaterial color="#ffdca8" emissive="#ffcf94" emissiveIntensity={0} metalness={0} roughness={0.6} transparent opacity={0.001} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ── Reusable mesh components ──

function VerticalMesh({ el, castShadow }: { el: VertEl; castShadow?: boolean }) {
  return (
    <mesh position={[el.pos[0], el.baseY, el.pos[1]]} castShadow={castShadow} receiveShadow>
      <boxGeometry args={el.args} />
      <meshStandardMaterial color={el.color} metalness={el.metalness} roughness={el.roughness} transparent opacity={0.001} />
    </mesh>
  );
}
function SpanMesh({ el, castShadow }: { el: SpanEl; castShadow?: boolean }) {
  return (
    <mesh position={el.pos} castShadow={castShadow} receiveShadow>
      <boxGeometry args={el.args} />
      <meshStandardMaterial color={el.color} metalness={el.metalness} roughness={el.roughness} transparent opacity={0.001} />
    </mesh>
  );
}
function SimpleMesh({ el }: { el: SimpleEl }) {
  return (
    <mesh position={el.pos} rotation={el.rot}>
      <boxGeometry args={el.args} />
      <meshStandardMaterial color={el.color} metalness={el.metalness} roughness={el.roughness} transparent opacity={0.001} />
    </mesh>
  );
}

// ── Per-frame growth application ──

function applyVertical(g: THREE.Group | null, els: VertEl[], p: number) {
  if (!g) return;
  g.children.forEach((child, i) => {
    const el = els[i];
    if (!el) return;
    const mesh = child as THREE.Mesh;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    const t = smoothstep(el.stage[0], el.stage[1], p);
    const s = Math.max(t, 0.015);
    mesh.scale.y = s;
    mesh.position.y = el.baseY + (el.height * s) / 2;
    mat.opacity = t;
  });
}
function applySpan(g: THREE.Group | null, els: SpanEl[], p: number) {
  if (!g) return;
  g.children.forEach((child, i) => {
    const el = els[i];
    if (!el) return;
    const mesh = child as THREE.Mesh;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    const t = smoothstep(el.stage[0], el.stage[1], p);
    const s = Math.max(t, 0.015);
    if (el.axis === "x") mesh.scale.x = s;
    else mesh.scale.z = s;
    mat.opacity = t;
  });
}
function applySimple(g: THREE.Group | null, els: (SimpleEl & { order?: number })[], p: number) {
  if (!g) return;
  g.children.forEach((child, i) => {
    const el = els[i];
    if (!el) return;
    const mesh = child as THREE.Mesh;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    const stagger = (el.order ?? 0) * 0.03;
    const t = smoothstep(el.stage[0] + stagger, el.stage[1] + stagger, p);
    const s = lerp(0.82, 1, t);
    mesh.scale.set(s, s, s);
    mat.opacity = t;
  });
}
function applyGlass(g: THREE.Group | null, panels: GlassPanel[], p: number) {
  if (!g) return;
  g.children.forEach((child, i) => {
    const panel = panels[i];
    if (!panel) return;
    const mesh = child as THREE.Mesh;
    const mat = mesh.material as THREE.Material & { opacity: number };
    const t = smoothstep(panel.stage[0], panel.stage[1], p);
    mesh.scale.y = lerp(0.9, 1, t);
    mat.opacity = t * 0.74;
  });
}
