import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform float uIsMobile;
  varying vec2 vUv;
  varying float vLight;

  void main() {
    vUv = uv;
    vec3 p = position;
    
    // Natural continuous flag flutter and dynamic wave amplitude
    // Reduced amplitude on mobile to eliminate bulge and keep text perfectly legible
    float amp = mix(0.22, 0.12, uIsMobile);
    float freqX = mix(7.0, 5.2, uIsMobile);
    
    float primary = sin(uv.x * freqX - uTime * 2.2 + uv.y * 1.4) * amp;
    float secondary = sin(uv.x * (freqX * 1.8) - uTime * 3.0 + uv.y * 2.6) * (amp * 0.35);
    float vertical = cos(uv.y * 5.2 + uv.x * 2.8 - uTime * 1.4) * (amp * 0.22);
    float wave = primary + secondary + vertical;

    p.z += wave;
    p.y += sin(uv.x * 5.0 - uTime * 1.5) * (amp * 0.2);
    p.x += cos(uv.y * 4.0 + uTime * 1.0) * (amp * 0.1);
    
    vLight = 0.90 + wave * 0.38 + sin(uv.x * freqX - uTime * 2.2 + 1.2) * 0.10;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = `
  uniform float uAspect;
  uniform float uIsMobile;
  varying vec2 vUv;
  varying float vLight;

  float circle(vec2 p, float radius, float blur) {
    return 1.0 - smoothstep(radius - blur, radius + blur, length(p));
  }

  void main() {
    // Authentic Indian Tiranga Colors
    vec3 saffron = vec3(1.0, 0.44, 0.08); // Vibrant Indian Saffron (Kesaria)
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
    // Responsive UV scaling so chakra remains perfectly circular on all screen ratios
    float scaleX = uAspect >= 1.0 ? uAspect * 0.92 : 1.0;
    float scaleY = uAspect >= 1.0 ? 3.0 : (1.0 / max(uAspect, 0.3)) * 1.35;
    
    vec2 chakraUv = vec2((vUv.x - 0.5) * scaleX, (vUv.y - 0.5) * scaleY);
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
    float weave = sin(vUv.x * 900.0) * sin(vUv.y * 650.0) * 0.012;
    color *= clamp(vLight + weave, 0.74, 1.20);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const FlagMesh = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const isMobile = viewport.width < viewport.height || viewport.width < 7.0;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: viewport.width / viewport.height },
      uIsMobile: { value: isMobile ? 1.0 : 0.0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      const currentIsMobile = viewport.width < viewport.height || viewport.width < 7.0;
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
      materialRef.current.uniforms.uAspect.value = viewport.width / viewport.height;
      materialRef.current.uniforms.uIsMobile.value = currentIsMobile ? 1.0 : 0.0;
    }
  });

  // Dynamically size geometry to exact camera viewport plus slight overflow margin for wave flutter
  const meshWidth = viewport.width * 1.08;
  const meshHeight = viewport.height * 1.08;

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[meshWidth, meshHeight, isMobile ? 80 : 130, isMobile ? 60 : 90]} />
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

export const CinematicIndianFlag = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <FlagMesh />
      </Canvas>
    </div>
  );
};
