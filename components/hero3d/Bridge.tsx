"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroProgress } from "@/lib/heroProgress";

type Stage = [number, number];
type Reveal = "vertical" | "x" | "z" | "simple";

type BridgeElement = {
  position: [number, number, number];
  rotation?: [number, number, number];
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
  foundation: [0.06, 0.18] as Stage,
  piers: [0.15, 0.33] as Stage,
  caps: [0.28, 0.42] as Stage,
  girders: [0.37, 0.58] as Stage,
  deck: [0.52, 0.7] as Stage,
  barriers: [0.66, 0.83] as Stage,
  details: [0.78, 1] as Stage,
};

const CONCRETE = { color: "#d3d1ca", metalness: 0.02, roughness: 0.84 };
const CONCRETE_DARK = { color: "#aaa8a1", metalness: 0.02, roughness: 0.9 };
const STEEL = { color: "#aab6c1", metalness: 0.82, roughness: 0.24 };
const ASPHALT = { color: "#252b31", metalness: 0.05, roughness: 0.94 };
const SAFETY = { color: "#c4ccd3", metalness: 0.64, roughness: 0.3 };
const CABLE = { color: "#f2f6f8", metalness: 0.88, roughness: 0.1 };

function smoothstep(a: number, b: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
function memberBetween(
  from: [number, number, number],
  to: [number, number, number],
  thickness: number,
  depth: number,
  stage: Stage,
  material = STEEL,
): BridgeElement {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.sqrt(dx * dx + dy * dy);
  return {
    position: [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2],
    rotation: [0, 0, Math.atan2(dy, dx)],
    args: [length, thickness, depth],
    ...material,
    stage,
    reveal: "x",
  };
}

export default function Bridge({ mobile }: { mobile: boolean }) {
  const blueprintRef = useRef<THREE.Group>(null);
  const elementsRef = useRef<THREE.Group>(null);

  const elements = useMemo<BridgeElement[]>(() => {
    const items: BridgeElement[] = [];
    const bridgeLength = 23.4;
    const bentXs = [-7, 0, 7];
    const frameZs = [-1.55, 1.55];

    bentXs.forEach((x) => {
      frameZs.forEach((z) => {
        [-0.72, 0.72].forEach((offset) => {
          items.push({
            position: [x + offset, -1.98, z],
            args: [1.05, 0.28, 1.05],
            ...CONCRETE_DARK,
            stage: STAGE.foundation,
            reveal: "vertical",
            baseY: -2.12,
            height: 0.28,
          });
        });
        items.push(
          memberBetween(
            [x - 0.72, -1.84, z],
            [x, 0.38, z],
            0.46,
            0.72,
            STAGE.piers,
            CONCRETE,
          ),
          memberBetween(
            [x + 0.72, -1.84, z],
            [x, 0.38, z],
            0.46,
            0.72,
            STAGE.piers,
            CONCRETE,
          ),
        );
      });
      items.push({
        position: [x, 0.51, 0],
        args: [1.72, 0.26, 5.35],
        ...CONCRETE,
        stage: STAGE.caps,
        reveal: "z",
      });
    });

    [-11.25, 11.25].forEach((x) => {
      items.push({
        position: [x, -0.72, 0],
        args: [0.72, 2.8, 5.45],
        ...CONCRETE_DARK,
        stage: STAGE.foundation,
        reveal: "vertical",
        baseY: -2.12,
        height: 2.8,
      });
    });

    [-1.82, -0.61, 0.61, 1.82].forEach((z) => {
      items.push({
        position: [0, 0.72, z],
        args: [23.05, 0.36, 0.24],
        ...STEEL,
        stage: STAGE.girders,
        reveal: "x",
      });
    });

    [-9.4, -7, -4.7, -2.35, 0, 2.35, 4.7, 7, 9.4].forEach((x) => {
      items.push({
        position: [x, 0.72, 0],
        args: [0.16, 0.3, 4.52],
        ...STEEL,
        stage: STAGE.girders,
        reveal: "z",
      });
    });

    items.push(
      {
        position: [0, 1.03, 0],
        args: [bridgeLength, 0.28, 5.18],
        ...CONCRETE,
        stage: STAGE.deck,
        reveal: "x",
      },
      {
        position: [0, 1.205, 0],
        args: [23.12, 0.07, 4.78],
        ...ASPHALT,
        stage: STAGE.deck,
        reveal: "x",
      },
    );

    [-2.62, 2.62].forEach((z) => {
      items.push(
        {
          position: [0, 0.9, z],
          args: [23.48, 0.68, 0.14],
          color: "#596b7a",
          metalness: 0.72,
          roughness: 0.3,
          stage: STAGE.deck,
          reveal: "x",
        },
        {
          position: [0, 1.55, z],
          args: [23.48, 0.62, 0.13],
          ...SAFETY,
          stage: STAGE.barriers,
          reveal: "x",
        },
        {
          position: [0, 1.89, z],
          args: [23.48, 0.07, 0.08],
          ...STEEL,
          stage: STAGE.barriers,
          reveal: "x",
        },
      );
    });

    for (let x = -9.8; x <= 9.8; x += 1.75) {
      items.push({
        position: [x, 1.25, 0],
        args: [0.96, 0.025, 0.085],
        color: "#eee9da",
        metalness: 0,
        roughness: 0.74,
        stage: STAGE.details,
        reveal: "simple",
      });
    }

    [-4.8, 4.8].forEach((pylonX) => {
      const direction = Math.sign(pylonX);
      const topX = pylonX + direction * 0.28;
      const anchors =
        direction < 0
          ? [-10.1, -8.15, -6.35, -3.05, -1.15]
          : [1.15, 3.05, 6.35, 8.15, 10.1];

      [-2.74, 2.74].forEach((z) => {
        items.push(
          memberBetween(
            [pylonX, 1.2, z],
            [topX, 4.9, z],
            0.28,
            0.26,
            STAGE.barriers,
            STEEL,
          ),
        );

        anchors.forEach((anchorX, index) => {
          const anchorY = 1.56 + Math.abs(anchorX - pylonX) * 0.018;
          items.push(
            memberBetween(
              [topX, 4.72 - index * 0.08, z],
              [anchorX, anchorY, z],
              0.055,
              0.055,
              STAGE.details,
              CABLE,
            ),
          );
        });
      });
    });

    [-2.42, 2.42].forEach((z) => {
      items.push({
        position: [0, 0.52, z],
        args: [22.8, 0.035, 0.055],
        color: "#f0c889",
        metalness: 0.32,
        roughness: 0.32,
        stage: STAGE.details,
        reveal: "x",
      });
    });

    return items;
  }, []);

  const blueprint = useMemo(
    () =>
      elements.map((element) => ({
        geometry: new THREE.EdgesGeometry(new THREE.BoxGeometry(...element.args)),
        position: element.position,
        rotation: element.rotation,
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
          <lineSegments key={index} position={item.position} rotation={item.rotation}>
            <primitive object={item.geometry} attach="geometry" />
            <lineBasicMaterial color={index % 5 === 0 ? "#bdd5e2" : "#79b5d4"} transparent opacity={0} toneMapped={false} />
          </lineSegments>
        ))}
      </group>

      <group ref={elementsRef}>
        {elements.map((element, index) => (
          <mesh key={index} position={element.position} rotation={element.rotation} castShadow={!mobile} receiveShadow>
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
