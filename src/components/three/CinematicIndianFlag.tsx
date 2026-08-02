import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vLight;

  void main() {
    vUv = uv;
    vec3 p = position;
    float anchored = smoothstep(0.0, 0.16, uv.x);
    float primary = sin(uv.x * 10.5 - uTime * 2.2) * 0.30;
    float secondary = sin(uv.x * 19.0 - uTime * 3.0 + uv.y * 4.0) * 0.09;
    float vertical = sin(uv.y * 7.0 + uv.x * 5.0 - uTime * 1.25) * 0.055;
    float wave = (primary + secondary + vertical) * anchored;
    p.z += wave;
    p.y += sin(uv.x * 8.0 - uTime * 1.7) * 0.075 * anchored;
    p.x += cos(uv.y * 5.0 + uTime) * 0.025 * anchored;
    vLight = 0.82 + wave * 0.55 + sin(uv.x * 10.5 - uTime * 2.2 + 1.3) * 0.10;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vLight;

  float circle(vec2 p, float radius, float blur) {
    return 1.0 - smoothstep(radius - blur, radius + blur, length(p));
  }

  void main() {
    vec3 saffron = vec3(1.0, 0.60, 0.18);
    vec3 ivory = vec3(0.985, 0.98, 0.93);
    vec3 green = vec3(0.07, 0.53, 0.11);
    vec3 navy = vec3(0.0, 0.0, 0.48);

    vec3 color = vUv.y > 0.666 ? saffron : (vUv.y > 0.333 ? ivory : green);
    vec2 chakraUv = vec2((vUv.x - 0.5) * 1.67, vUv.y - 0.5);
    float radius = length(chakraUv);
    float ring = 1.0 - smoothstep(0.003, 0.0065, abs(radius - 0.085));
    float hub = circle(chakraUv, 0.014, 0.003);
    float angle = atan(chakraUv.y, chakraUv.x);
    float spokeWave = abs(sin(angle * 12.0));
    float spokes = (1.0 - smoothstep(0.076, 0.086, radius)) * smoothstep(0.94, 0.988, spokeWave);
    spokes *= smoothstep(0.016, 0.024, radius);
    float chakra = max(max(ring, hub), spokes);
    color = mix(color, navy, chakra * 0.58 * step(0.333, vUv.y) * step(vUv.y, 0.666));

    float weave = sin(vUv.x * 900.0) * sin(vUv.y * 620.0) * 0.018;
    float edgeShade = smoothstep(0.0, 0.06, vUv.x) * smoothstep(0.0, 0.045, vUv.y) * smoothstep(0.0, 0.045, 1.0 - vUv.y);
    color *= clamp(vLight + weave, 0.62, 1.18);
    color *= mix(0.74, 1.0, edgeShade);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const FlagMesh = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock }) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh rotation={[-0.04, -0.08, -0.018]}>
      <planeGeometry args={[10.8, 6.1, 150, 90]} />
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
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 8.2], fov: 43 }}
    >
      <FlagMesh />
    </Canvas>
  </div>
);
