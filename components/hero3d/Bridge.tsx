"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroProgress } from "@/lib/heroProgress";

type Stage = [number, number];
type Reveal = "vertical" | "x" | "z" | "simple";

type BridgeElement = {
  position: [number, number, number];
  args: [number, number, number];
  color: string;
  metalness: number;
  roughness: number;
  stage: Stage;
  reveal: Reveal;
  baseY?: number;
  height?: number;
};

const STAGE = {
  foundation: [0.07, 0.2] as Stage,
  piers: [0.18, 0.36] as Stage,
  caps: [0.31, 0.45] as Stage,
  girders: [0.4, 0.61] as Stage,
  deck: [0.56, 0.73] as Stage,
  barriers: [0.7, 0.87] as Stage,
  details: [0.84, 1] as Stage,
};

const CONCRETE = { color: "#d3d1ca", metalness: 0.02, roughness: 0.84 };
const CONCRETE_DARK = { color: "#aaa8a1", metalness: 0.02, roughness: 0.9 };
const STEEL = { color: "#aab6c1", metalness: 0.82, roughness: 0.24 };
const ASPHALT = { color: "#252b31", metalness: 0.05, roughness: 0.94 };
const SAFETY = { color: "#c4ccd3", metalness: 0.64, roughness: 0.3 };

function smoothstep(a: number, b: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export default function Bridge({ mobile }: { mobile: boolean }) {
  const blueprintRef = useRef<THREE.Group>(null);
  const elementsRef = useRef<THREE.Group>(null);

  const elements = useMemo<BridgeElement[]>(() => {
    const items: BridgeElement[] = [];
    const bentXs = [-3.8, 3.8];
    const pierZs = [-1.08, 1.08];

    bentXs.forEach((x) => {
      pierZs.forEach((z) => {
        items.push({
          position: [x, -1.98, z],
          args: [1.18, 0.28, 1.18],
          ...CONCRETE_DARK,
          stage: STAGE.foundation,
          reveal: "vertical",
          baseY: -2.12,
          height: 0.28,
        });
        items.push({
          position: [x, -0.69, z],
          args: [0.58, 2.3, 0.58],
          ...CONCRETE,
          stage: STAGE.piers,
          reveal: "vertical",
          baseY: -1.84,
          height: 2.3,
        });
      });
      items.push({
        position: [x, 0.61, 0],
        args: [0.72, 0.3, 4.55],
        ...CONCRETE,
        stage: STAGE.caps,
        reveal: "z",
      });
    });

    [-6.55, 6.55].forEach((x) => {
      items.push({
        position: [x, -0.87, 0],
        args: [0.66, 2.5, 4.5],
        ...CONCRETE_DARK,
        stage: STAGE.foundation,
        reveal: "vertical",
        baseY: -2.12,
        height: 2.5,
      });
    });

    [-1.45, -0.5, 0.5, 1.45].forEach((z) => {
      items.push({
        position: [0, 0.91, z],
        args: [13.3, 0.34, 0.2],
        ...STEEL,
        stage: STAGE.girders,
        reveal: "x",
      });
    });

    [-3.8, 0, 3.8].forEach((x) => {
      items.push({
        position: [x, 0.91, 0],
        args: [0.18, 0.3, 3.25],
        ...STEEL,
        stage: STAGE.girders,
        reveal: "z",
      });
    });

    items.push({
      position: [0, 1.18, 0],
      args: [13.7, 0.28, 4],
      ...CONCRETE,
      stage: STAGE.deck,
      reveal: "x",
    });
    items.push({
      position: [0, 1.35, 0],
      args: [13.45, 0.07, 3.68],
      ...ASPHALT,
      stage: STAGE.deck,
      reveal: "x",
    });

    [-2.02, 2.02].forEach((z) => {
      items.push({
        position: [0, 1.68, z],
        args: [13.72, 0.72, 0.16],
        ...SAFETY,
        stage: STAGE.barriers,
        reveal: "x",
      });
      items.push({
        position: [0, 2.08, z],
        args: [13.72, 0.08, 0.08],
        ...STEEL,
        stage: STAGE.barriers,
        reveal: "x",
      });
    });

    for (let x = -5.4; x <= 5.4; x += 1.8) {
      items.push({
        position: [x, 1.405, 0],
        args: [0.92, 0.025, 0.08],
        color: "#e8e4d9",
        metalness: 0,
        roughness: 0.76,
        stage: STAGE.details,
        reveal: "simple",
      });
    }

    [-5.6, -2.8, 0, 2.8, 5.6].forEach((x) => {
      [-2.05, 2.05].forEach((z) => {
        items.push({
          position: [x, 2.48, z],
          args: [0.07, 0.82, 0.07],
          ...STEEL,
          stage: STAGE.details,
          reveal: "vertical",
          baseY: 2.08,
          height: 0.82,
        });
        items.push({
          position: [x, 2.87, z * 0.94],
          args: [0.12, 0.08, 0.48],
          color: "#f0d2a0",
          metalness: 0.28,
          roughness: 0.35,
          stage: STAGE.details,
          reveal: "simple",
        });
      });
    });

    return items;
  }, []);

  const blueprint = useMemo(
    () =>
      elements.map((element) => ({
        geometry: new THREE.EdgesGeometry(new THREE.BoxGeometry(...element.args)),
        position: element.position,
        stage: element.stage,
      })),
    [elements],
  );

  useFrame(() => {
    const progress = heroProgress.value;
    if (blueprintRef.current) {
      const globalIn = smoothstep(0, 0.025, progress);
      blueprintRef.current.children.forEach((child, index) => {
        const item = blueprint[index];
        const material = (child as THREE.LineSegments).material as THREE.LineBasicMaterial;
        material.opacity = globalIn * (1 - smoothstep(item.stage[0], item.stage[0] + 0.055, progress)) * 0.82;
      });
    }

    if (!elementsRef.current) return;
    elementsRef.current.children.forEach((child, index) => {
      const element = elements[index];
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;
      const t = smoothstep(element.stage[0], element.stage[1], progress);
      const scale = Math.max(t, 0.015);

      mesh.visible = t > 0.001;
      material.opacity = t;
      material.depthWrite = t > 0.96;
      mesh.scale.set(1, 1, 1);

      if (element.reveal === "vertical") {
        mesh.scale.y = scale;
        mesh.position.y = (element.baseY ?? 0) + ((element.height ?? element.args[1]) * scale) / 2;
      } else if (element.reveal === "x") {
        mesh.scale.x = scale;
      } else if (element.reveal === "z") {
        mesh.scale.z = scale;
      } else {
        mesh.scale.setScalar(0.94 + t * 0.06);
      }
    });
  });

  return (
    <group position={[0, -0.05, 0]}>
      <group ref={blueprintRef}>
        {blueprint.map((item, index) => (
          <lineSegments key={index} position={item.position}>
            <primitive object={item.geometry} attach="geometry" />
            <lineBasicMaterial color={index % 5 === 0 ? "#bdd5e2" : "#79b5d4"} transparent opacity={0} toneMapped={false} />
          </lineSegments>
        ))}
      </group>

      <group ref={elementsRef}>
        {elements.map((element, index) => (
          <mesh key={index} position={element.position} castShadow={!mobile} receiveShadow>
            <boxGeometry args={element.args} />
            <meshStandardMaterial
              color={element.color}
              metalness={element.metalness}
              roughness={element.roughness}
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
