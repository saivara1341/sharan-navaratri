import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, Camera, RefreshCw, Upload, CheckCircle2, AlertTriangle } from "lucide-react";
import jsQR from "jsqr";
import { useNavaratriData } from "../../context/NavaratriDataContext";

export const NavaratriQrScannerModal: React.FC = () => {
  const navigate = useNavigate();
  const { mandapams, markScanned } = useNavaratriData();

  const [isOpen, setIsOpen] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [scanSuccess, setScanSuccess] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isScanningRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Listen for open-scanner event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setScanSuccess(null);
      setCameraError(null);
      setManualInput("");
    };
    window.addEventListener("navaratri:open-scanner", handleOpen);
    return () => window.removeEventListener("navaratri:open-scanner", handleOpen);
  }, []);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    isScanningRef.current = false;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const closeModal = useCallback(() => {
    stopCamera();
    setIsOpen(false);
    setScanSuccess(null);
    setCameraError(null);
    setManualInput("");
  }, [stopCamera]);

  // Handle successful code detection
  const handleDetectedCode = useCallback(
    (rawCode: string) => {
      if (isScanningRef.current) return;
      isScanningRef.current = true;
      stopCamera();

      // Play auspicious audio beep
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
        }
      } catch {
        // AudioContext not allowed or unsupported
      }

      if (navigator.vibrate) {
        try {
          navigator.vibrate([80, 40, 80]);
        } catch {
          // ignore
        }
      }

      // Match mandapam in database
      const cleanCode = rawCode.trim();
      const matched = mandapams.find(
        (m) =>
          cleanCode.includes(`/m/${m.slug}`) ||
          cleanCode.endsWith(`/${m.slug}`) ||
          cleanCode.toLowerCase() === m.slug.toLowerCase() ||
          cleanCode.toLowerCase() === m.id.toLowerCase()
      );

      let targetSlug = matched?.slug;
      if (!targetSlug && cleanCode.includes("/m/")) {
        const parts = cleanCode.split("/m/");
        targetSlug = parts[1]?.split(/[?#]/)[0];
      }
      if (!targetSlug && cleanCode.startsWith("http")) {
        try {
          const parsed = new URL(cleanCode);
          const segs = parsed.pathname.split("/").filter(Boolean);
          const mIdx = segs.indexOf("m");
          if (mIdx !== -1 && segs[mIdx + 1]) {
            targetSlug = segs[mIdx + 1];
          }
        } catch {
          // not valid URL
        }
      }
      if (!targetSlug) {
        targetSlug = cleanCode.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
      }

      if (matched) {
        markScanned(matched.id);
        setScanSuccess(matched.name);
      } else {
        setScanSuccess(targetSlug);
      }

      setTimeout(() => {
        closeModal();
        navigate(`/navaratri/m/${targetSlug}`);
      }, 700);
    },
    [closeModal, mandapams, markScanned, navigate, stopCamera]
  );

  // Scan frame loop
  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || isScanningRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert"
        });

        if (code && code.data) {
          handleDetectedCode(code.data);
          return;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  }, [handleDetectedCode]);

  // Start video stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    isScanningRef.current = false;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera access is not supported by your browser. You can upload a QR image or select a mandapam below.");
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setCameraActive(true);
        animationFrameRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err: unknown) {
      const e = err as { name?: string; message?: string };
      if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError") {
        setCameraError("Camera permission denied. Please allow camera permissions in your browser or upload a QR image.");
      } else if (e.name === "NotFoundError" || e.name === "DevicesNotFoundError") {
        setCameraError("No camera found on this device. You can upload a photo of the QR code or select a mandapam below.");
      } else {
        setCameraError("Unable to access camera. Please upload a photo of the QR code or enter mandapam code.");
      }
      setCameraActive(false);
    }
  }, [facingMode, scanFrame, stopCamera]);

  // Toggle Camera Facing Mode (back/front)
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, startCamera, stopCamera]);

  // Handle uploaded image file scanning
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleDetectedCode(code.data);
          } else {
            alert("No QR code found in the uploaded image. Please ensure the QR is clear and well lit.");
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const code = manualInput.trim();
    setManualInput("");
    handleDetectedCode(code);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
    >
      {/* Hidden offscreen canvas for frame processing */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="bg-[#FAF7F2] text-stone-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400 relative flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 bg-gradient-to-r from-[#5C1010] via-[#8B1E1E] to-[#781B1B] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-['Cinzel',serif] text-base font-black text-[#FFFBEB] leading-tight tracking-wide">
                Scan Mandapam QR
              </h2>
              <p className="text-[10px] text-amber-200/90 font-medium">
                Live Camera Scanner • Instant Devotee Darshan
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white/90 transition-colors"
            aria-label="Close Scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Section */}
        <div className="relative bg-black h-72 sm:h-80 flex items-center justify-center overflow-hidden">
          {/* Live Video */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            autoPlay
            muted
          />

          {/* Scanner Overlay Graphics */}
          {cameraActive && !scanSuccess && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {/* Darkened vignette around target */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 border-2 border-amber-400/60 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
                {/* 4 Golden Corner Reticles */}
                <span className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
                <span className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
                <span className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />

                {/* Animated Scanning Laser Beam */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_12px_#F59E0B] animate-bounce top-1/2 -translate-y-1/2" />

                <div className="absolute -bottom-7 inset-x-0 text-center">
                  <span className="px-3 py-1 rounded-full bg-black/70 text-amber-200 text-[10px] font-bold tracking-wider backdrop-blur-sm">
                    ALIGN QR CODE IN FRAME
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Success Overlay */}
          {scanSuccess && (
            <div className="absolute inset-0 bg-[#8B1E1E]/90 flex flex-col items-center justify-center text-white p-4 text-center animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-16 h-16 text-amber-300 animate-bounce mb-2" />
              <h3 className="font-['Cinzel',serif] text-lg font-black text-white">QR Code Recognized!</h3>
              <p className="text-amber-200 text-xs font-semibold mt-1">Opening {scanSuccess}...</p>
            </div>
          )}

          {/* Camera Error / Permission Denied Fallback */}
          {cameraError && !scanSuccess && (
            <div className="absolute inset-0 bg-stone-900/95 flex flex-col items-center justify-center text-center p-6 text-white space-y-3">
              <AlertTriangle className="w-10 h-10 text-amber-400" />
              <p className="text-xs text-amber-100 max-w-xs">{cameraError}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition-all shadow"
                >
                  Retry Camera
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all border border-white/30"
                >
                  Upload QR Photo
                </button>
              </div>
            </div>
          )}

          {/* Flip Camera Button */}
          {cameraActive && (
            <button
              type="button"
              onClick={toggleFacingMode}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all shadow-md active:scale-95"
              aria-label="Switch Camera"
              title="Switch Camera (Front/Back)"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Controls & Alternative Options */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Quick Upload from Gallery */}
          <div className="flex items-center justify-between gap-3 bg-amber-50 p-3 rounded-2xl border border-amber-200/90 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-200/80 flex items-center justify-center text-[#8B1E1E]">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#8B1E1E]">Have a saved QR image?</p>
                <p className="text-[10px] text-stone-600">Scan from camera roll or files</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-[#8B1E1E] hover:bg-[#781B1B] text-white text-xs font-bold transition-all shadow shrink-0"
            >
              Pick Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="pt-2 border-t border-amber-200">
            <label className="block text-[11px] font-semibold text-stone-700 mb-1.5">
              Enter Mandapam name, code, or URL:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="e.g. Subhash Nagar or slug..."
                className="flex-1 px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#8B1E1E] hover:bg-[#781B1B] text-white text-xs font-bold shadow transition-all"
              >
                Go
              </button>
            </div>
          </form>

          {/* Organizer Onboarding Section */}
          <div className="pt-3 border-t border-amber-200">
            <div
              onClick={() => {
                closeModal();
                navigate("/navaratri/register");
              }}
              className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100/70 border border-amber-300 hover:border-amber-400 transition-all cursor-pointer flex items-center justify-between group shadow-xs"
            >
              <div className="space-y-0.5 pr-2">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                  📋 Organizer Onboarding
                </span>
                <p className="text-xs font-serif font-black text-[#8B1E1E] group-hover:text-amber-900 transition-colors">
                  Register Mandapam →
                </p>
                <p className="text-[10px] text-stone-600 leading-tight">
                  Create an official digital notice board, receive permanent QR standee, and manage citizen bookings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
