import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vLight;

  void main() {
    vUv = uv;
    vec3 p = position;
    
    // Natural continuous flag flutter and wind waves
    float primary = sin(uv.x * 7.5 - uTime * 2.4 + uv.y * 1.2) * 0.28;
    float secondary = sin(uv.x * 14.0 - uTime * 3.2 + uv.y * 3.0) * 0.09;
    float vertical = cos(uv.y * 6.5 + uv.x * 3.5 - uTime * 1.5) * 0.055;
    float wave = primary + secondary + vertical;

    p.z += wave;
    p.y += sin(uv.x * 6.0 - uTime * 1.7) * 0.06;
    p.x += cos(uv.y * 4.5 + uTime * 1.1) * 0.025;
    
    vLight = 0.88 + wave * 0.45 + sin(uv.x * 7.5 - uTime * 2.4 + 1.2) * 0.12;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = `
  uniform float uAspect;
  varying vec2 vUv;
  varying float vLight;

  float circle(vec2 p, float radius, float blur) {
    return 1.0 - smoothstep(radius - blur, radius + blur, length(p));
  }

  void main() {
    // Authentic Indian Tiranga Colors
    vec3 saffron = vec3(1.0, 0.45, 0.08); // Vibrant Indian Saffron (Kesaria)
    vec3 ivory   = vec3(0.99, 0.99, 0.98); // Silk White
    vec3 green   = vec3(0.075, 0.52, 0.16); // India Green
    vec3 navy    = vec3(0.0, 0.0, 0.52);   // Ashoka Navy Blue

    // 3 Equal Horizontal Bands
    vec3 color;
    if (vUv.y > 0.6666) {
      color = saffron;
    } else if (vUv.y > 0.3333) {
      color = ivory;
    } else {
      color = green;
    }

    // Ashoka Chakra in Center White Band
    // Normalizing coordinates so chakra is perfectly circular on all aspect ratios
    vec2 chakraUv = vec2((vUv.x - 0.5) * uAspect, (vUv.y - 0.5) * 3.0);
    float radius = length(chakraUv);
    
    // Outer and Inner Rings
    float outerRing = 1.0 - smoothstep(0.003, 0.007, abs(radius - 0.18));
    float innerRing = 1.0 - smoothstep(0.002, 0.005, abs(radius - 0.155));
    float hub = circle(chakraUv, 0.032, 0.004);
    
    // 24 Spokes
    float angle = atan(chakraUv.y, chakraUv.x);
    float spokeWave = abs(sin(angle * 12.0));
    float spokes = (1.0 - smoothstep(0.16, 0.176, radius)) * smoothstep(0.91, 0.985, spokeWave);
    spokes *= smoothstep(0.035, 0.05, radius);
    
    float chakra = max(max(outerRing, max(hub, innerRing * 0.35)), spokes);
    
    // Apply Ashoka Chakra exclusively in the white band
    if (vUv.y >= 0.3333 && vUv.y <= 0.6666) {
      color = mix(color, navy, chakra * 0.92);
    }

    // Subtle cloth weave & lighting
    float weave = sin(vUv.x * 1000.0) * sin(vUv.y * 700.0) * 0.012;
    color *= clamp(vLight + weave, 0.72, 1.22);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const FlagMesh = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: viewport.width / viewport.height },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
      materialRef.current.uniforms.uAspect.value = viewport.width / viewport.height;
    }
  });

  // Ensure geometry always overflows slightly beyond viewport edges so wave crests don't show background
  const meshWidth = Math.max(viewport.width * 1.12, 12);
  const meshHeight = Math.max(viewport.height * 1.12, 8);

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[meshWidth, meshHeight, 140, 90]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export const CinematicIndianFlag = () => (
  <div className="cinematic-flag-canvas" aria-hidden="true">
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    >
      <FlagMesh />
    </Canvas>
  </div>
);

