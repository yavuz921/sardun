"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroProgress } from "@/lib/heroProgress";

/*
  A real construction sequence, in real engineering order. Every element is
  authored ONCE at its true, final position — nothing ever travels sideways.
  Vertical elements rise from where they connect to what's beneath them;
  beams and diagonal bracing grow outward from their own center to meet
  what they connect. The blueprint is the same coordinate data as the solid
  model, drawn as a glowing structural-analysis wireframe (columns, beam
  grid, X-bracing) before each piece is realized in concrete, steel and glass.

  Final result: a 3-level modern villa — two solid concrete floors (ground
  floor wraps a column-and-braced covered terrace; second floor is fully
  enclosed) carrying a cantilevered all-glass third-floor volume on top.
*/

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type Stage = [number, number];
const STAGE = {
  foundation: [0.07, 0.13] as Stage,
  floorSlab: [0.11, 0.18] as Stage,
  columns: [0.17, 0.25] as Stage,
  beams: [0.22, 0.31] as Stage,
  floor2Slab: [0.28, 0.35] as Stage,
  floor2Columns: [0.33, 0.41] as Stage,
  floor2Beams: [0.38, 0.47] as Stage,
  secondSlab: [0.45, 0.53] as Stage,
  floor2Walls: [0.48, 0.58] as Stage,
  walls: [0.48, 0.59] as Stage,
  roofStructure: [0.53, 0.63] as Stage,
  roof: [0.59, 0.68] as Stage,
  windowFrames: [0.65, 0.74] as Stage,
  glass: [0.71, 0.82] as Stage,
  cladding: [0.79, 0.89] as Stage,
  details: [0.85, 0.95] as Stage,
  lighting: [0.91, 1.0] as Stage,
};

type VertEl = { pos: [number, number]; baseY: number; height: number; args: [number, number, number]; color: string; metalness: number; roughness: number; stage: Stage };
type SpanEl = { pos: [number, number, number]; args: [number, number, number]; axis: "x" | "z"; rot?: [number, number, number]; color: string; metalness: number; roughness: number; stage: Stage };
type SimpleEl = { pos: [number, number, number]; rot?: [number, number, number]; args: [number, number, number]; color: string; metalness: number; roughness: number; stage: Stage };
type GlassPanel = { pos: [number, number, number]; rot: [number, number, number]; w: number; h: number; stage: Stage };

const STEEL_STRUCTURE = { color: "#aeb8c2", metalness: 0.82, roughness: 0.24 };
const CONCRETE = { color: "#d5d2ca", metalness: 0.02, roughness: 0.82 };
const CONCRETE_DARK = { color: "#aaa79f", metalness: 0.02, roughness: 0.88 };
const STONE = { color: "#9f927a", metalness: 0, roughness: 0.92 };
const METAL_TRIM = { color: "#303a43", metalness: 0.9, roughness: 0.18 };
const BLUEPRINT = "#79b5d4";
const BLUEPRINT_ACCENT = "#bdd5e2";

function makeDiag(x1: number, y1: number, x2: number, y2: number, z: number, stage: Stage): SpanEl {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const rotZ = Math.atan2(dy, dx);
  return { pos: [(x1 + x2) / 2, (y1 + y2) / 2, z], args: [len, 0.07, 0.07], axis: "x", rot: [0, 0, rotZ], ...STEEL_STRUCTURE, stage };
}

export default function Building({ mobile }: { mobile: boolean }) {
  const blueprintRef = useRef<THREE.Group>(null);
  const foundationRef = useRef<THREE.Group>(null);
  const floorSlabRef = useRef<THREE.Group>(null);
  const columnsRef = useRef<THREE.Group>(null);
  const beamsRef = useRef<THREE.Group>(null);
  const floor2SlabRef = useRef<THREE.Group>(null);
  const floor2ColumnsRef = useRef<THREE.Group>(null);
  const floor2BeamsRef = useRef<THREE.Group>(null);
  const floor2WallsRef = useRef<THREE.Group>(null);
  const secondSlabRef = useRef<THREE.Group>(null);
  const wallsRef = useRef<THREE.Group>(null);
  const roofStructureRef = useRef<THREE.Group>(null);
  const roofRef = useRef<THREE.Group>(null);
  const framesRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Group>(null);
  const claddingRef = useRef<THREE.Group>(null);
  const detailsRef = useRef<THREE.Group>(null);
  const soffitRef = useRef<THREE.Mesh>(null);
  const interiorLightsRef = useRef<THREE.Group>(null);

  // ── Villa massing — bigger, 3 levels ──
  const M = useMemo(() => {
    const gw = 7.2, gd = 4.3, gh = 1.45; // wide, low-rise architectural proportions
    const enclosedBackZ = -gd / 2;
    const enclosedFrontZ = 0.35;
    const uw = 4.8, ud = 3.2, uh = 1.35;
    const upperCenterZ = 0.48;
    const upperBackZ = upperCenterZ - ud / 2;
    const upperFrontZ = upperCenterZ + ud / 2;
    const roofW = uw + 0.55, roofD = ud + 0.55, roofT = 0.12;
    const floor2BaseY = gh + 0.14; // atop ring beam 1
    const crownBaseY = floor2BaseY + gh; // atop ring beam 2
    const roofTopY = crownBaseY + uh + roofT;
    const groupOffsetY = -((roofTopY - 0.3) / 2);
    return { gw, gd, gh, enclosedBackZ, enclosedFrontZ, uw, ud, uh, upperCenterZ, upperBackZ, upperFrontZ, roofW, roofD, roofT, floor2BaseY, crownBaseY, roofTopY, groupOffsetY };
  }, []);
  const { gw, gd, gh, enclosedBackZ, enclosedFrontZ, uw, ud, uh, upperCenterZ, upperBackZ, upperFrontZ, roofW, roofD, roofT, floor2BaseY, crownBaseY, groupOffsetY } = M;

  // ── 1. Foundation ──
  const foundation: VertEl[] = useMemo(
    () => [{ pos: [0, 0], baseY: -0.3, height: 0.22, args: [gw + 0.7, 0.22, gd + 0.7], ...CONCRETE_DARK, stage: STAGE.foundation }],
    [gw, gd]
  );
  // ── 2. Ground floor slab ──
  const floorSlab: VertEl[] = useMemo(() => [{ pos: [0, 0], baseY: 0, height: 0.1, args: [gw, 0.1, gd], ...CONCRETE, stage: STAGE.floorSlab }], [gw, gd]);

  // ── 3. Structural columns — exposed at the covered terrace ──
  const colXs = useMemo(() => [-2.8, -0.95, 0.95, 2.8], []);
  const colZ = gd / 2 - 0.1;
  const columns: VertEl[] = useMemo(
    () => colXs.map((x) => ({ pos: [x, colZ], baseY: 0.1, height: gh - 0.1, args: [0.16, gh - 0.1, 0.16], ...STEEL_STRUCTURE, stage: STAGE.columns })),
    [colXs, colZ, gh]
  );

  // ── 4. Structural beams — perimeter ring + X-bracing between the terrace columns ──
  const beams: SpanEl[] = useMemo(() => {
    const arr: SpanEl[] = [
      { pos: [0, gh, gd / 2], args: [gw, 0.15, 0.15], axis: "x", ...STEEL_STRUCTURE, stage: STAGE.beams },
      { pos: [0, gh, -gd / 2], args: [gw, 0.15, 0.15], axis: "x", ...STEEL_STRUCTURE, stage: STAGE.beams },
      { pos: [-gw / 2, gh, 0], args: [0.15, 0.15, gd], axis: "z", ...STEEL_STRUCTURE, stage: STAGE.beams },
      { pos: [gw / 2, gh, 0], args: [0.15, 0.15, gd], axis: "z", ...STEEL_STRUCTURE, stage: STAGE.beams },
    ];
    for (let i = 0; i < colXs.length - 1; i++) {
      const x1 = colXs[i], x2 = colXs[i + 1];
      arr.push(makeDiag(x1, 0.1, x2, gh, colZ, STAGE.beams));
      arr.push(makeDiag(x1, gh, x2, 0.1, colZ, STAGE.beams));
    }
    return arr;
  }, [gw, gd, gh, colXs, colZ]);

  // ── 5. Floor 2 slab ──
  const floor2Slab: VertEl[] = useMemo(() => [{ pos: [0, 0], baseY: floor2BaseY, height: 0.12, args: [gw, 0.12, gd], ...CONCRETE, stage: STAGE.floor2Slab }], [gw, gd, floor2BaseY]);

  // ── 6. Floor 2 columns — corners, rising to the second ring beam ──
  const floor2ColPos = useMemo(
    () => [
      [-gw / 2 + 0.1, -gd / 2 + 0.1], [gw / 2 - 0.1, -gd / 2 + 0.1], [-gw / 2 + 0.1, gd / 2 - 0.1], [gw / 2 - 0.1, gd / 2 - 0.1],
    ] as [number, number][],
    [gw, gd]
  );
  const floor2Columns: VertEl[] = useMemo(
    () => floor2ColPos.map((p) => ({ pos: p, baseY: floor2BaseY, height: gh, args: [0.15, gh, 0.15], ...STEEL_STRUCTURE, stage: STAGE.floor2Columns })),
    [floor2ColPos, floor2BaseY, gh]
  );

  // ── 7. Floor 2 ring beam ──
  const floor2Beams: SpanEl[] = useMemo(
    () => [
      { pos: [0, crownBaseY, gd / 2], args: [gw, 0.15, 0.15], axis: "x", ...STEEL_STRUCTURE, stage: STAGE.floor2Beams },
      { pos: [0, crownBaseY, -gd / 2], args: [gw, 0.15, 0.15], axis: "x", ...STEEL_STRUCTURE, stage: STAGE.floor2Beams },
      { pos: [-gw / 2, crownBaseY, 0], args: [0.15, 0.15, gd], axis: "z", ...STEEL_STRUCTURE, stage: STAGE.floor2Beams },
      { pos: [gw / 2, crownBaseY, 0], args: [0.15, 0.15, gd], axis: "z", ...STEEL_STRUCTURE, stage: STAGE.floor2Beams },
    ],
    [gw, gd, crownBaseY]
  );

  // ── 8. Floor 2 walls — enclosed on 3 sides, glass front ──
  const floor2Walls: VertEl[] = useMemo(
    () => [
      { pos: [0, -gd / 2], baseY: floor2BaseY, height: gh - 0.1, args: [gw, gh - 0.1, 0.14], ...CONCRETE, stage: STAGE.floor2Walls },
      { pos: [-gw / 2, 0], baseY: floor2BaseY, height: gh - 0.1, args: [0.14, gh - 0.1, gd], ...CONCRETE, stage: STAGE.floor2Walls },
      { pos: [gw / 2, 0], baseY: floor2BaseY, height: gh - 0.1, args: [0.14, gh - 0.1, gd], ...CONCRETE, stage: STAGE.floor2Walls },
    ],
    [gw, gd, floor2BaseY, gh]
  );

  // ── 9. Second (crown) floor slab — the cantilevered glass volume's floor ──
  const secondSlab: VertEl[] = useMemo(
    () => [{ pos: [0, upperCenterZ], baseY: crownBaseY, height: 0.12, args: [uw, 0.12, ud], ...CONCRETE, stage: STAGE.secondSlab }],
    [crownBaseY, uw, ud, upperCenterZ]
  );

  // ── 10. Exterior walls — ground U-shape + crown's solid back wall ──
  const walls: VertEl[] = useMemo(
    () => [
      { pos: [0, enclosedBackZ], baseY: 0.1, height: gh - 0.1, args: [gw, gh - 0.1, 0.14], ...CONCRETE, stage: STAGE.walls },
      { pos: [-gw / 2, (enclosedBackZ + enclosedFrontZ) / 2], baseY: 0.1, height: gh - 0.1, args: [0.14, gh - 0.1, enclosedFrontZ - enclosedBackZ], ...CONCRETE, stage: STAGE.walls },
      { pos: [gw / 2, (enclosedBackZ + enclosedFrontZ) / 2], baseY: 0.1, height: gh - 0.1, args: [0.14, gh - 0.1, enclosedFrontZ - enclosedBackZ], ...CONCRETE, stage: STAGE.walls },
      { pos: [0, upperBackZ], baseY: crownBaseY + 0.12, height: uh - 0.12, args: [uw, uh - 0.12, 0.12], ...CONCRETE_DARK, stage: STAGE.walls },
    ],
    [gw, gh, enclosedBackZ, enclosedFrontZ, uw, uh, upperBackZ, crownBaseY]
  );

  // ── 11. Roof structure — steel edge frame atop the glass crown ──
  const roofStructure: SpanEl[] = useMemo(() => {
    const y = crownBaseY + uh;
    return [
      { pos: [0, y, upperFrontZ], args: [uw, 0.1, 0.1], axis: "x", ...STEEL_STRUCTURE, stage: STAGE.roofStructure },
      { pos: [0, y, upperBackZ], args: [uw, 0.1, 0.1], axis: "x", ...STEEL_STRUCTURE, stage: STAGE.roofStructure },
      { pos: [-uw / 2, y, upperCenterZ], args: [0.1, 0.1, ud], axis: "z", ...STEEL_STRUCTURE, stage: STAGE.roofStructure },
      { pos: [uw / 2, y, upperCenterZ], args: [0.1, 0.1, ud], axis: "z", ...STEEL_STRUCTURE, stage: STAGE.roofStructure },
    ];
  }, [crownBaseY, uh, uw, ud, upperFrontZ, upperBackZ, upperCenterZ]);

  // ── 12. Roof slab ──
  const roof: VertEl[] = useMemo(
    () => [{ pos: [0, upperCenterZ], baseY: crownBaseY + uh, height: roofT, args: [roofW, roofT, roofD], color: "#aeb4b8", metalness: 0.3, roughness: 0.55, stage: STAGE.roof }],
    [crownBaseY, uh, upperCenterZ, roofT, roofW, roofD]
  );

  // ── 0. Blueprint — same coordinates as the solid structure, color-coded like a structural model ──
  const blueprint = useMemo(() => {
    const items: { geo: THREE.BufferGeometry; stageStart: number; color: string }[] = [];
    const addVert = (el: VertEl, color: string) => {
      const box = new THREE.BoxGeometry(el.args[0], el.args[1], el.args[2]);
      box.translate(el.pos[0], el.baseY + el.height / 2, el.pos[1]);
      items.push({ geo: new THREE.EdgesGeometry(box), stageStart: el.stage[0], color });
      box.dispose();
    };
    const addSpan = (el: SpanEl, color: string) => {
      const box = new THREE.BoxGeometry(el.args[0], el.args[1], el.args[2]);
      if (el.rot) box.rotateZ(el.rot[2]);
      box.translate(el.pos[0], el.pos[1], el.pos[2]);
      items.push({ geo: new THREE.EdgesGeometry(box), stageStart: el.stage[0], color });
      box.dispose();
    };
    foundation.forEach((e) => addVert(e, BLUEPRINT_ACCENT));
    floorSlab.forEach((e) => addVert(e, BLUEPRINT));
    columns.forEach((e) => addVert(e, BLUEPRINT_ACCENT));
    beams.forEach((e) => addSpan(e, e.rot ? BLUEPRINT_ACCENT : BLUEPRINT));
    floor2Slab.forEach((e) => addVert(e, BLUEPRINT));
    floor2Columns.forEach((e) => addVert(e, BLUEPRINT_ACCENT));
    floor2Beams.forEach((e) => addSpan(e, BLUEPRINT));
    floor2Walls.forEach((e) => addVert(e, BLUEPRINT));
    secondSlab.forEach((e) => addVert(e, BLUEPRINT));
    walls.forEach((e) => addVert(e, BLUEPRINT));
    roofStructure.forEach((e) => addSpan(e, BLUEPRINT_ACCENT));
    roof.forEach((e) => addVert(e, BLUEPRINT));
    return items;
  }, [foundation, floorSlab, columns, beams, floor2Slab, floor2Columns, floor2Beams, floor2Walls, secondSlab, walls, roofStructure, roof]);

  // ── 13. Window frames ──
  const frames: SimpleEl[] = useMemo(() => {
    const arr: SimpleEl[] = [];
    const groundY0 = 0.15, groundY1 = gh - 0.03;
    for (const x of [-gw / 2 + 0.3, -gw / 6, gw / 6, gw / 2 - 0.3]) {
      arr.push({ pos: [x, (groundY0 + groundY1) / 2, enclosedFrontZ + 0.015], args: [0.04, groundY1 - groundY0, 0.04], ...METAL_TRIM, stage: STAGE.windowFrames });
    }
    arr.push({ pos: [0, groundY1, enclosedFrontZ + 0.015], args: [gw - 0.3, 0.04, 0.04], ...METAL_TRIM, stage: STAGE.windowFrames });
    const f2Y0 = floor2BaseY + 0.15, f2Y1 = crownBaseY - 0.06;
    for (const x of [-gw / 2 + 0.35, -gw / 6, gw / 6, gw / 2 - 0.35]) {
      arr.push({ pos: [x, (f2Y0 + f2Y1) / 2, gd / 2 + 0.015], args: [0.04, f2Y1 - f2Y0, 0.04], ...METAL_TRIM, stage: STAGE.windowFrames });
    }
    const upperY0 = crownBaseY + 0.15, upperY1 = crownBaseY + uh - 0.06;
    for (const x of [-uw / 2 + 0.25, 0, uw / 2 - 0.25]) {
      arr.push({ pos: [x, (upperY0 + upperY1) / 2, upperFrontZ + 0.015], args: [0.035, upperY1 - upperY0, 0.035], ...METAL_TRIM, stage: STAGE.windowFrames });
    }
    return arr;
  }, [gw, gh, uh, uw, enclosedFrontZ, upperFrontZ, floor2BaseY, crownBaseY, gd]);

  // ── 14. Large glass panels — ground terrace face, floor 2 front, crown box ──
  const glassPanels: GlassPanel[] = useMemo(
    () => [
      { pos: [0, (0.1 + gh) / 2, enclosedFrontZ + 0.02], rot: [0, 0, 0], w: gw - 0.2, h: gh - 0.2, stage: STAGE.glass },
      { pos: [0, (floor2BaseY + crownBaseY) / 2, gd / 2 + 0.02], rot: [0, 0, 0], w: gw - 0.3, h: gh - 0.2, stage: STAGE.glass },
      { pos: [0, (crownBaseY + 0.12 + crownBaseY + uh) / 2, upperFrontZ + 0.02], rot: [0, 0, 0], w: uw - 0.2, h: uh - 0.14, stage: STAGE.glass },
      { pos: [-uw / 2 - 0.02, (crownBaseY + 0.12 + crownBaseY + uh) / 2, upperCenterZ], rot: [0, Math.PI / 2, 0], w: ud - 0.2, h: uh - 0.14, stage: STAGE.glass },
      { pos: [uw / 2 + 0.02, (crownBaseY + 0.12 + crownBaseY + uh) / 2, upperCenterZ], rot: [0, -Math.PI / 2, 0], w: ud - 0.2, h: uh - 0.14, stage: STAGE.glass },
    ],
    [gw, gd, gh, uw, ud, uh, enclosedFrontZ, upperFrontZ, upperCenterZ, floor2BaseY, crownBaseY]
  );

  // ── 15. Natural stone cladding ──
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

  // ── 16. Architectural details ──
  const details: SimpleEl[] = useMemo(
    () => [
      { pos: [-gw / 2 - 0.5, 1.0, enclosedBackZ + 0.6], args: [0.05, 0.7, 1.1], ...METAL_TRIM, stage: STAGE.details },
      { pos: [-gw / 2 - 0.25, 1.35, enclosedBackZ + 0.6], args: [0.06, 1.0, 0.9], color: "#c9c6bf", metalness: 0.1, roughness: 0.7, stage: STAGE.details, rot: [0, 0, Math.PI / 2] },
      { pos: [0, roofT + crownBaseY + uh + 0.02, upperFrontZ], args: [roofW, 0.03, 0.06], ...METAL_TRIM, stage: STAGE.details },
      { pos: [0, 0.04, gd / 2 + 0.4], args: [gw * 0.5, 0.08, 0.7], color: "#b7b4ac", metalness: 0, roughness: 0.9, stage: STAGE.details },
      { pos: [1.62, crownBaseY + uh / 2, upperFrontZ + 0.08], args: [0.055, uh - 0.1, 0.2], ...METAL_TRIM, stage: STAGE.details },
      { pos: [1.9, crownBaseY + uh / 2, upperFrontZ + 0.08], args: [0.055, uh - 0.1, 0.2], ...METAL_TRIM, stage: STAGE.details },
      { pos: [2.18, crownBaseY + uh / 2, upperFrontZ + 0.08], args: [0.055, uh - 0.1, 0.2], ...METAL_TRIM, stage: STAGE.details },
    ],
    [gw, uh, gd, enclosedBackZ, upperFrontZ, roofW, roofT, crownBaseY]
  );

  const soffitBaseY = crownBaseY + 0.005;

  useFrame(({ clock }) => {
    const p = heroProgress.value;

    if (blueprintRef.current) {
      const globalIn = smoothstep(0, 0.02, p);
      blueprintRef.current.children.forEach((child, i) => {
        const item = blueprint[i];
        if (!item) return;
        const mat = (child as THREE.LineSegments).material as THREE.LineBasicMaterial;
        const localOut = smoothstep(item.stageStart, item.stageStart + 0.05, p);
        const breathe = 0.76 + Math.sin(clock.elapsedTime * 0.8) * 0.04;
        mat.opacity = globalIn * (1 - localOut) * breathe;
      });
    }

    applyVertical(foundationRef.current, foundation, p);
    applyVertical(floorSlabRef.current, floorSlab, p);
    applyVertical(columnsRef.current, columns, p);
    applySpan(beamsRef.current, beams, p);
    applyVertical(floor2SlabRef.current, floor2Slab, p);
    applyVertical(floor2ColumnsRef.current, floor2Columns, p);
    applySpan(floor2BeamsRef.current, floor2Beams, p);
    applyVertical(floor2WallsRef.current, floor2Walls, p);
    applyVertical(secondSlabRef.current, secondSlab, p);
    applyVertical(wallsRef.current, walls, p);
    applySpan(roofStructureRef.current, roofStructure, p);
    applyVertical(roofRef.current, roof, p);
    applySimple(framesRef.current, frames, p);
    applyGlass(glassRef.current, glassPanels, p);
    applySimple(claddingRef.current, cladding, p);
    applySimple(detailsRef.current, details, p);

    if (soffitRef.current) {
      const mat = soffitRef.current.material as THREE.MeshStandardMaterial;
      const t = smoothstep(STAGE.lighting[0], STAGE.lighting[1], p);
      mat.opacity = t * 0.82;
      mat.emissiveIntensity = t * 1.9;
    }
    if (interiorLightsRef.current) {
      const t = smoothstep(STAGE.lighting[0] - 0.03, STAGE.lighting[1], p);
      interiorLightsRef.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = t * (i === 2 ? 0.3 : 0.2);
      });
    }
  });

  return (
    <group position={[0, groupOffsetY, 0]}>
      <group ref={blueprintRef}>
        {blueprint.map((item, i) => (
          <lineSegments key={i}>
            <primitive object={item.geo} attach="geometry" />
            <lineBasicMaterial color={item.color} transparent opacity={0} toneMapped={false} />
          </lineSegments>
        ))}
      </group>

      <group ref={foundationRef}>{foundation.map((e, i) => <VerticalMesh key={i} el={e} />)}</group>
      <group ref={floorSlabRef}>{floorSlab.map((e, i) => <VerticalMesh key={i} el={e} />)}</group>
      <group ref={columnsRef}>{columns.map((e, i) => <VerticalMesh key={i} el={e} castShadow />)}</group>
      <group ref={beamsRef}>{beams.map((e, i) => <SpanMesh key={i} el={e} castShadow />)}</group>
      <group ref={floor2SlabRef}>{floor2Slab.map((e, i) => <VerticalMesh key={i} el={e} castShadow />)}</group>
      <group ref={floor2ColumnsRef}>{floor2Columns.map((e, i) => <VerticalMesh key={i} el={e} castShadow />)}</group>
      <group ref={floor2BeamsRef}>{floor2Beams.map((e, i) => <SpanMesh key={i} el={e} />)}</group>
      <group ref={floor2WallsRef}>{floor2Walls.map((e, i) => <VerticalMesh key={i} el={e} castShadow />)}</group>
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
              <meshStandardMaterial color="#8fb8d8" metalness={0.6} roughness={0.1} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
            ) : (
              <meshPhysicalMaterial color="#9fc4de" metalness={0.1} roughness={0.06} transmission={0.85} thickness={0.4} ior={1.45} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
            )}
          </mesh>
        ))}
      </group>

      <group ref={interiorLightsRef}>
        <mesh position={[0, gh * 0.53, enclosedFrontZ - 0.045]}>
          <planeGeometry args={[gw - 0.45, gh - 0.28]} />
          <meshBasicMaterial color="#e9b875" transparent opacity={0} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh position={[0, (floor2BaseY + crownBaseY) / 2, gd / 2 - 0.045]}>
          <planeGeometry args={[gw - 0.45, gh - 0.28]} />
          <meshBasicMaterial color="#e9b875" transparent opacity={0} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh position={[0, crownBaseY + uh * 0.55, upperFrontZ - 0.045]}>
          <planeGeometry args={[uw - 0.35, uh - 0.2]} />
          <meshBasicMaterial color="#f2c98e" transparent opacity={0} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>

      <group ref={claddingRef}>{cladding.map((e, i) => <SimpleMesh key={i} el={e} />)}</group>
      <group ref={detailsRef}>{details.map((e, i) => <SimpleMesh key={i} el={e} />)}</group>

      <mesh ref={soffitRef} position={[0, soffitBaseY, upperCenterZ]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[uw - 0.3, ud - 0.3]} />
        <meshStandardMaterial color="#ffdca8" emissive="#ffcf94" emissiveIntensity={0} metalness={0} roughness={0.6} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function VerticalMesh({ el, castShadow }: { el: VertEl; castShadow?: boolean }) {
  return (
    <mesh position={[el.pos[0], el.baseY, el.pos[1]]} castShadow={castShadow} receiveShadow>
      <boxGeometry args={el.args} />
      <meshStandardMaterial color={el.color} metalness={el.metalness} roughness={el.roughness} transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
function SpanMesh({ el, castShadow }: { el: SpanEl; castShadow?: boolean }) {
  return (
    <mesh position={el.pos} rotation={el.rot} castShadow={castShadow} receiveShadow>
      <boxGeometry args={el.args} />
      <meshStandardMaterial color={el.color} metalness={el.metalness} roughness={el.roughness} transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
function SimpleMesh({ el }: { el: SimpleEl }) {
  return (
    <mesh position={el.pos} rotation={el.rot}>
      <boxGeometry args={el.args} />
      <meshStandardMaterial color={el.color} metalness={el.metalness} roughness={el.roughness} transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function setRevealMaterial(mesh: THREE.Mesh, mat: THREE.MeshStandardMaterial, t: number) {
  mesh.visible = t > 0.001;
  mat.opacity = t;
  mat.depthWrite = t > 0.96;
}

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
    setRevealMaterial(mesh, mat, t);
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
    setRevealMaterial(mesh, mat, t);
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
    const s = lerp(0.96, 1, t);
    mesh.scale.set(s, s, s);
    setRevealMaterial(mesh, mat, t);
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
    mesh.visible = t > 0.001;
    mat.opacity = t * 0.68;
  });
}
