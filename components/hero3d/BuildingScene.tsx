"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, AdaptiveDpr } from "@react-three/drei";
import { useRef, useEffect, useState, Suspense } from "react";
import * as THREE from "three";
import Building from "./Building";
import { heroProgress } from "@/lib/heroProgress";

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return mobile;
}

// Sinematik kamera + fare parallax — asla abartısız, ölçülü hareket.
// Evre 1 (gizem) boyunca kamera neredeyse hareketsiz kalır; hareket ancak
// ızgara belirmeye başladığında (drive eğrisi) yavaşça uyanır.
function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.4, 0));
  useFrame((_, delta) => {
    const p = heroProgress.value;
    const damp = 1 - Math.pow(0.0012, delta);
    const drive = smoothstep(0.06, 1.0, p); // gizem evresinde durgunluk

    // Kadraj, kantilever taşmasını (mimari fotoğrafçılık açısıyla) net gösterecek şekilde
    const from = new THREE.Vector3(7.0, 1.3, 7.8);
    const to = new THREE.Vector3(5.6, 2.6, 5.8);
    const base = from.clone().lerp(to, easeInOut(drive));

    // Fare parallax — çok ince, asla agresif
    base.x += heroProgress.pointerX * 0.32;
    base.y += heroProgress.pointerY * 0.22;

    camera.position.lerp(base, damp);
    target.current.lerp(new THREE.Vector3(0.5, 0.5 + drive * 0.6, 0), damp);
    camera.lookAt(target.current);
  });
  return null;
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function easeInOut(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

// Işık evrimi — blueprint (serin mavi) → golden-hour (sıcak) scroll ile
const COOL = new THREE.Color("#a9c6ea");
const WARM = new THREE.Color("#ffcf94");
const HEMI_COOL = new THREE.Color("#cfe0f0");
const HEMI_WARM = new THREE.Color("#ffe6c2");

function LightRig({
  keyRef,
  hemiRef,
}: {
  keyRef: React.RefObject<THREE.DirectionalLight | null>;
  hemiRef: React.RefObject<THREE.HemisphereLight | null>;
}) {
  useFrame((_, delta) => {
    const p = heroProgress.value;
    // Evre 1: karanlık. Işık, ızgara belirdikçe (0.05–0.32) nazikçe uyanır.
    const reveal = smoothstep(0.05, 0.32, p);
    // Evre 5'ten itibaren (0.55–1.0) golden-hour sıcaklığı devreye girer.
    const warmth = easeInOut(smoothstep(0.55, 1.0, p));
    const damp = 1 - Math.pow(0.02, delta);
    if (keyRef.current) {
      keyRef.current.color.lerpColors(COOL, WARM, warmth * 0.85);
      const targetInt = 0.1 + reveal * 1.5 + warmth * 1.4;
      keyRef.current.intensity += (targetInt - keyRef.current.intensity) * damp;
    }
    if (hemiRef.current) {
      hemiRef.current.color.lerpColors(HEMI_COOL, HEMI_WARM, warmth * 0.7);
      const targetHemiInt = 0.05 + reveal * 0.35;
      hemiRef.current.intensity += (targetHemiInt - hemiRef.current.intensity) * damp;
    }
  });
  return null;
}

// Sahne HTML kapsayıcısı dışından görünürlüğe göre frameloop kontrolü
export default function BuildingScene({ active }: { active: boolean }) {
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
      camera={{ position: [6.4, 1.6, 7.4], fov: 38, near: 0.1, far: 100 }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      onPointerMove={(e) => {
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        heroProgress.pointerX = (e.clientX / w) * 2 - 1;
        heroProgress.pointerY = -((e.clientY / h) * 2 - 1);
      }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#0F1B2E"]} />
        <fog attach="fog" args={["#0F1B2E", 12, 26]} />

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

        <Building mobile={mobile} />

        <ContactShadows
          position={[0, -3.62, 0]}
          opacity={mobile ? 0.35 : 0.55}
          scale={16}
          blur={2.6}
          far={6}
          resolution={mobile ? 256 : 512}
          color="#050b14"
        />

        <CameraRig />
        <AdaptiveDpr pixelated={false} />
      </Suspense>
    </Canvas>
  );
}
