import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { ArrowUp } from "lucide-react";

export const LiquidMetalUpButton = ({ onClick }: { onClick: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    let shaderMount: any = null;
    
    // Slight delay to ensure the SVG is rendered before ShaderMount tries to read it
    const timer = setTimeout(() => {
      try {
        if (containerRef.current) {
          shaderMount = new ShaderMount(
            containerRef.current,
            liquidMetalFragmentShader,
            {
              u_repetition: 1.5,
              u_softness: 0.5,
              u_shiftRed: 0.3,
              u_shiftBlue: 0.3,
              u_distortion: 0,
              u_contour: 0,
              u_angle: 100,
              u_scale: 1.5,
              u_shape: 1,
              u_offsetX: 0.1,
              u_offsetY: -0.1
            },
            undefined,
            0.6
          );
        }
      } catch (err) {
        console.error("Failed to mount liquid metal shader:", err);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (shaderMount && typeof shaderMount.destroy === 'function') {
        shaderMount.destroy();
      } else if (containerRef.current) {
         // Fallback cleanup: remove canvas elements if injected
         const canvases = containerRef.current.querySelectorAll("canvas");
         canvases.forEach(c => c.remove());
      }
    };
  }, []);

  return (
    <motion.button
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-[calc(2rem+env(safe-area-inset-bottom,0px))] right-[calc(1.5rem+env(safe-area-inset-right,0px))] z-[90] w-14 h-14 rounded-full transition-all flex items-center justify-center cursor-pointer group hover:opacity-90"
      style={{
        backgroundColor: "#1d1d1d", // from user's --bg-color
        color: "#65615f",           // from user's --icon-color
        boxShadow: "0px 10px 30px rgba(0,0,0,0.5)"
      }}
      title="Scroll to Top"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Animated Arrow Up Icon */}
        <div className="absolute z-10 pointer-events-none flex items-center justify-center w-full h-full text-white">
          <ArrowUp className="w-6 h-6 absolute transition-all duration-300 group-hover:-translate-y-10 group-hover:opacity-0" />
          <ArrowUp className="w-6 h-6 absolute translate-y-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
        </div>

        <div id="liquid-metal" ref={containerRef} className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden rounded-full pointer-events-none opacity-60">
          {/* This outline div and svg generates the shape of the liquid metal. 
              We use a circle and make it transparent so there's no "grey cross" visible. */}
          <div className="outline w-full h-full flex items-center justify-center p-2 text-transparent">
            <svg className="svg-icon w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
    </motion.button>
  );
};
