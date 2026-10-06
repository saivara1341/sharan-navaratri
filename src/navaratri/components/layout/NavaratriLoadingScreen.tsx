import React from "react";
import { motion } from "framer-motion";
import { navaratriAsset } from "../../utils/navaratriAssets";

/** Branded first-load screen for the Sharan Navratri experience. */
export const NavaratriLoadingScreen: React.FC = () => (
  <main
    className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffaf0] px-6 text-center"
    aria-busy="true"
    aria-label="Loading Sharan Navratri"
  >
    <div
      className="absolute inset-0 opacity-[0.12]"
      style={{ backgroundImage: `url(${navaratriAsset("/navaratri/assets/golden-lotus-bg.jpg")})`, backgroundSize: "360px", backgroundPosition: "center" }}
    />
    <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl" />
    <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#8B1E1E]/15 blur-3xl" />

    <div className="relative z-10 flex max-w-sm flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.72, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32"
      >
        <motion.span
          aria-hidden="true"
          animate={{ rotate: 360 }}
          transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-amber-500/70"
        />
        <motion.span
          aria-hidden="true"
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-2 border-[#8B1E1E]/25 border-t-[#B45309]"
        />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.65rem] border border-amber-300 bg-white/90 p-3 shadow-[0_14px_32px_rgba(120,48,20,0.22)] sm:h-24 sm:w-24">
          <img src={navaratriAsset("/navaratri/assets/trishula-head.png")} alt="Sharan Navratri" className="h-full w-full object-contain" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.18 }}
        className="mt-7"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-700">॥ Om Sri Matre Namaha ॥</p>
        <h1 className="mt-3 font-serif text-3xl font-black tracking-wide text-[#8B1E1E] sm:text-4xl">Sharan Navratri</h1>
        <p className="mt-2 text-sm font-medium text-stone-600">One QR. Every Mandapam. Every blessing.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.42 }}
        className="mt-7 h-1 w-44 overflow-hidden rounded-full bg-amber-100"
      >
        <motion.span
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.15, repeat: Infinity, ease: "easeInOut" }}
          className="block h-full w-1/2 rounded-full bg-gradient-to-r from-[#8B1E1E] via-[#D97706] to-amber-300"
        />
      </motion.div>
      <p className="mt-3 text-[11px] font-semibold tracking-wide text-stone-500">Preparing your sacred journey…</p>
    </div>
  </main>
);
