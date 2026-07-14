"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, AdaptiveDpr } from "@react-three/drei";
import { useRef, useEffect, useState, Suspense } from "react";
import * as THREE from "three";
import Building from "./Building";
import Bridge from "./Bridge";
import { heroProgress } from "@/lib/heroProgress";

export type StructureKind = "building" | "bridge";

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const on = () => setMobile(mq.matches);
    on();
    if (mq.addEventListener) {
      mq.addEventListener("change", on);
      return () => mq.removeEventListener("change", on);
    }
    mq.addListener(on);
    return () => mq.removeListener(on);
  }, []);
  return mobile;
}

// Cinematic drone-style orbit — slow, confident, never aggressive.
// A gentle arc around the subject combined with a slow push-in, plus a
// near-imperceptible autonomous drift so the camera never feels static.
function CameraRig({ mobile, reducedMotion, structure }: { mobile: boolean; reducedMotion: boolean; structure: StructureKind }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.15, 0));
  useFrame(({ clock }, delta) => {
    const p = heroProgress.value;
    const damp = 1 - Math.pow(0.0012, delta);
    const drive = smoothstep(0.05, 1.0, p);
    const eased = easeInOut(drive);

    const idleDrift = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.04) * 0.035;
    const bridge = structure === "bridge";
    const finale = bridge ? smoothstep(0.74, 1, p) : 0;
    const theta = bridge
      ? 0.46 + eased * 0.12 + finale * 0.19 + idleDrift
      : 0.82 + eased * 0.44 + idleDrift;
    const radius = bridge
      ? mobile
        ? lerp(44, 39, eased) - finale * 4.5
        : lerp(31, 26, eased) - finale * 3.8
      : mobile
        ? lerp(23, 20.5, eased)
        : lerp(19.5, 15.5, eased);
    const height = bridge
      ? mobile
        ? lerp(11, 9.5, eased) - finale * 0.55
        : lerp(9, 7.2, eased) - finale * 0.4
      : mobile
        ? lerp(7.8, 6.8, eased)
        : lerp(7.2, 5.45, eased);

    const base = new THREE.Vector3(Math.cos(theta) * radius, height, Math.sin(theta) * radius);

    // Fare parallax — very subtle, only a sense of depth
    base.x += heroProgress.pointerX * 0.4;
    base.y += heroProgress.pointerY * 0.28;

    camera.position.lerp(base, damp);
    const targetX = bridge ? lerp(mobile ? -1.1 : -2.4, 0, smoothstep(0, 0.3, p)) : 0;
    const targetY = bridge ? lerp(0.28, 0.92, finale) : 0.08 + drive * 0.18;
    target.current.lerp(new THREE.Vector3(targetX, targetY, 0), damp);
    camera.lookAt(target.current);
  });
  return null;
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function easeInOut(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

// Light evolves through three moods across the whole scroll:
// dark & cool (blueprint) → soft neutral industrial → warm golden-hour.
const COOL = new THREE.Color("#a9c6ea");
const INDUSTRIAL = new THREE.Color("#e7ecf2");
const WARM = new THREE.Color("#ffcf94");
const HEMI_COOL = new THREE.Color("#cfe0f0");
const HEMI_INDUSTRIAL = new THREE.Color("#dfe6ee");
const HEMI_WARM = new THREE.Color("#ffe6c2");
const tmpColor = new THREE.Color();

function LightRig({
  keyRef,
  hemiRef,
}: {
  keyRef: React.RefObject<THREE.DirectionalLight | null>;
  hemiRef: React.RefObject<THREE.HemisphereLight | null>;
}) {
  useFrame((_, delta) => {
    const p = heroProgress.value;
    // Blueprint phase: darkness, lit only by the glowing wireframe itself.
    // Ambient light wakes gently as real construction begins (~0.09).
    const reveal = smoothstep(0.08, 0.34, p);
    const toIndustrial = smoothstep(0.3, 0.58, p);
    const toWarm = easeInOut(smoothstep(0.75, 1.0, p)); // golden-hour arrives with final lighting
    const damp = 1 - Math.pow(0.02, delta);
    if (keyRef.current) {
      tmpColor.copy(COOL).lerp(INDUSTRIAL, toIndustrial).lerp(WARM, toWarm);
      keyRef.current.color.copy(tmpColor);
      const targetInt = 0.1 + reveal * 1.3 + toWarm * 1.5;
      keyRef.current.intensity += (targetInt - keyRef.current.intensity) * damp;
    }
    if (hemiRef.current) {
      tmpColor.copy(HEMI_COOL).lerp(HEMI_INDUSTRIAL, toIndustrial).lerp(HEMI_WARM, toWarm);
      hemiRef.current.color.copy(tmpColor);
      const targetHemiInt = 0.05 + reveal * 0.35;
      hemiRef.current.intensity += (targetHemiInt - hemiRef.current.intensity) * damp;
    }
  });
  return null;
}

// Sahne HTML kapsayıcısı dışından görünürlüğe göre frameloop kontrolü
export default function BuildingScene({ active, reducedMotion, structure }: { active: boolean; reducedMotion: boolean; structure: StructureKind }) {
  const mobile = useIsMobile();
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const hemiLight = useRef<THREE.HemisphereLight>(null);

  // r3f boyut ölçümünü (react-use-measure) mount'ta kesin tetikle
  useEffect(() => {
    const kick = () => window.dispatchEvent(new Event("resize"));
    const t1 = setTimeout(kick, 50);
    const t2 = setTimeout(kick, 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <Canvas
      shadows={!mobile}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      camera={{ position: [13.3, 7.2, 14.2], fov: mobile ? 35 : 32, near: 0.1, far: 100 }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      onPointerMove={(e) => {
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        if (mobile || reducedMotion) return;
        heroProgress.pointerX = (e.clientX / w) * 2 - 1;
        heroProgress.pointerY = -((e.clientY / h) * 2 - 1);
      }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#0F1B2E"]} />
        <fog attach="fog" args={["#0F1B2E", structure === "bridge" ? 26 : 16, structure === "bridge" ? 62 : 42]} />

        <hemisphereLight ref={hemiLight} intensity={0.4} color="#cfe0f0" groundColor="#0F1B2E" />
        <directionalLight
          ref={keyLight}
          position={[7, 10, 5]}
          intensity={1.6}
          color="#a9c6ea"
          castShadow={!mobile}
          shadow-mapSize={mobile ? 512 : 1024}
          shadow-bias={-0.0004}
        >
          <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 0.1, 30]} />
        </directionalLight>
        <directionalLight position={[-6, 3, -4]} intensity={0.45} color="#8fb4e0" />
        <LightRig keyRef={keyLight} hemiRef={hemiLight} />

        {/* Stüdyo HDR ortamı — harici dosya YOK, Lightformer ile PBR yansımaları */}
        <Environment resolution={mobile ? 128 : 256}>
          <Lightformer form="rect" intensity={2.2} position={[0, 5, -6]} scale={[10, 6, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1.1} position={[6, 2, 4]} scale={[6, 8, 1]} rotation={[0, -Math.PI / 4, 0]} color="#dbe8f5" />
          <Lightformer form="rect" intensity={0.7} position={[-6, 1, 3]} scale={[6, 6, 1]} rotation={[0, Math.PI / 4, 0]} color="#e8c79a" />
          <Lightformer form="ring" intensity={1.3} position={[3, 6, -2]} scale={3} color="#fff4e0" />
        </Environment>

        <mesh position={[0, -2.19, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={structure === "bridge" ? [52, 38] : [28, 28]} />
          <meshStandardMaterial color="#101c2a" roughness={0.98} metalness={0.02} />
        </mesh>

        {structure === "bridge" ? <Bridge mobile={mobile} /> : <Building mobile={mobile} />}

        <ContactShadows
          position={[0, -2.17, 0]}
          opacity={mobile ? 0.35 : 0.55}
          scale={structure === "bridge" ? 27 : 15}
          blur={2.4}
          far={6}
          resolution={mobile ? 256 : 512}
          color="#050b14"
        />

        <CameraRig mobile={mobile} reducedMotion={reducedMotion} structure={structure} />
        <AdaptiveDpr pixelated={false} />
      </Suspense>
    </Canvas>
  );
}
