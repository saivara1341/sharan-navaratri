import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useEffect, useState } from 'react';
import { ParticleField } from './ParticleField';
import { FloatingGeometry } from './FloatingGeometry';

export const Scene3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (!isVisible) return <div ref={containerRef} className="absolute inset-0 -z-10 bg-background" />;

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10">
      {/* Gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, hsl(25 85% 55% / 0.08) 0%, transparent 50%)`
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 12], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.2} color="#dd8448" />
          <pointLight position={[-10, -10, -10]} intensity={0.6} color="#9acd32" />
          <pointLight position={[0, 5, 5]} intensity={0.4} color="#b8860b" />

          <ParticleField count={2500} mousePosition={mousePosition} />
          <FloatingGeometry />

          {/* Fog for depth */}
          <fog attach="fog" args={['#0a0705', 15, 40]} />
        </Suspense>
      </Canvas>
    </div>
  );
};
