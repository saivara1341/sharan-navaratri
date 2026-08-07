import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image, Upload, Download, Trash2, Eye, X, Search,
  Filter, ChevronDown, Check, Copy, ZoomIn,
  ZoomOut, RotateCcw, Tag, Users, Calendar, Plus,
  ExternalLink, Star, Maximize2,
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OccasionCategory =
  | "Traditional & Festive"
  | "Celebration & Wishes"
  | "National & Special Days"
  | "Promotional & Offers"
  | "Social Media Templates";

interface OccasionImage {
  id: string;
  title: string;
  category: OccasionCategory;
  /** client brand id or "all" for generic */
  clientId: string;
  clientName: string;
  aspectRatio: "1:1" | "9:16" | "16:9" | "4:5";
  /** object URL (uploaded) or static path (preloaded) */
  url: string;
  caption?: string;
  tags: string[];
  uploadedAt: string;
  isPreloaded?: boolean;
  fileName: string;
}

interface ClientBrand {
  id: string;
  businessName: string;
  category: string;
}

interface OccasionDesignsSectionProps {
  clients: ClientBrand[];
  selectedBrandId: string;
  agencyName: string;
}

// ─── Preloaded Sample Occasions ───────────────────────────────────────────────
// We use curated Unsplash-style image URLs for beautiful placeholders

const PRELOADED_OCCASIONS: OccasionImage[] = [
  {
    id: "pre-1",
    title: "Happy Makar Sankranti 2026",
    category: "Traditional & Festive",
    clientId: "all",
    clientName: "All Clients",
    aspectRatio: "1:1",
    url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80",
    caption: "🪁 Wishing you a colourful & joyful Makar Sankranti! May this festival bring warmth, prosperity & new beginnings to your family. — {Business Name}",
    tags: ["sankranti", "festival", "kite", "traditional"],
    uploadedAt: "2026-01-12",
    isPreloaded: true,
    fileName: "sankranti_2026.jpg",
  },
  {
    id: "pre-2",
    title: "Happy Diwali 2026",
    category: "Traditional & Festive",
    clientId: "all",
    clientName: "All Clients",
    aspectRatio: "1:1",
    url: "https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=600&q=80",
    caption: "🪔 On this auspicious occasion of Diwali, may prosperity light up your home! Warmest wishes from {Business Name}.",
    tags: ["diwali", "festival", "lights", "traditional"],
    uploadedAt: "2026-01-12",
    isPreloaded: true,
    fileName: "diwali_2026.jpg",
  },
  {
    id: "pre-3",
    title: "New Year 2026 Wishes",
    category: "Celebration & Wishes",
    clientId: "all",
    clientName: "All Clients",
    aspectRatio: "9:16",
    url: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&h=711&q=80",
    caption: "🎆 Happy New Year 2026! Wishing you 365 days of joy, success & abundance. With love from {Business Name}.",
    tags: ["new year", "celebration", "fireworks", "wishes"],
    uploadedAt: "2026-01-01",
    isPreloaded: true,
    fileName: "new_year_2026.jpg",
  },
  {
    id: "pre-4",
    title: "Republic Day 2026",
    category: "National & Special Days",
    clientId: "all",
    clientName: "All Clients",
    aspectRatio: "16:9",
    url: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&q=80",
    caption: "🇮🇳 Happy Republic Day! Let us celebrate the spirit of unity, diversity & democracy. Jai Hind! — {Business Name}",
    tags: ["republic day", "national", "india", "tricolour"],
    uploadedAt: "2026-01-26",
    isPreloaded: true,
    fileName: "republic_day_2026.jpg",
  },
  {
    id: "pre-5",
    title: "Happy Birthday Greetings",
    category: "Celebration & Wishes",
    clientId: "all",
    clientName: "All Clients",
    aspectRatio: "1:1",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    caption: "🎂 Wishing you a very Happy Birthday! May all your dreams come true. Warmest wishes from {Business Name}.",
    tags: ["birthday", "celebration", "wishes", "cake"],
    uploadedAt: "2026-01-12",
    isPreloaded: true,
    fileName: "birthday_wishes.jpg",
  },
  {
    id: "pre-6",
    title: "Holi 2026 – Festival of Colours",
    category: "Traditional & Festive",
    clientId: "all",
    clientName: "All Clients",
    aspectRatio: "1:1",
    url: "https://images.unsplash.com/photo-1615309662534-6c6e96db6f7c?w=600&q=80",
    caption: "🌈 May the colours of Holi fill your life with happiness & love! Festive wishes from {Business Name}.",
    tags: ["holi", "colours", "festival", "traditional"],
    uploadedAt: "2026-03-14",
    isPreloaded: true,
    fileName: "holi_2026.jpg",
  },
  {
    id: "pre-7",
    title: "Eid Mubarak 2026",
    category: "Traditional & Festive",
    clientId: "all",
    clientName: "All Clients",
    aspectRatio: "1:1",
    url: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=600&q=80",
    caption: "☪️ Eid Mubarak! May this blessed occasion bring joy, peace and prosperity to you and your family. — {Business Name}",
    tags: ["eid", "ramzan", "festival", "wishes"],
    uploadedAt: "2026-03-30",
    isPreloaded: true,
    fileName: "eid_mubarak_2026.jpg",
  },
  {
    id: "pre-8",
    title: "Independence Day 2026",
    category: "National & Special Days",
    clientId: "all",
    clientName: "All Clients",
    aspectRatio: "16:9",
    url: "https://images.unsplash.com/photo-1558522195-e1201b090344?w=600&q=80",
    caption: "🇮🇳 Happy Independence Day! Proud to be Indian. Jai Hind! — {Business Name}",
    tags: ["independence day", "national", "india", "freedom"],
    uploadedAt: "2026-08-15",
    isPreloaded: true,
    fileName: "independence_day_2026.jpg",
  },
];

const CATEGORIES: OccasionCategory[] = [
  "Traditional & Festive",
  "Celebration & Wishes",
  "National & Special Days",
  "Promotional & Offers",
  "Social Media Templates",
];

const ASPECT_RATIOS: Array<{ value: OccasionImage["aspectRatio"]; label: string; desc: string }> = [
  { value: "1:1",  label: "Square 1:1",   desc: "Instagram Post" },
  { value: "9:16", label: "Story 9:16",   desc: "Instagram / WhatsApp Story" },
  { value: "16:9", label: "Banner 16:9",  desc: "Facebook Cover / YouTube" },
  { value: "4:5",  label: "Portrait 4:5", desc: "Instagram Portrait" },
];

const CATEGORY_COLORS: Record<OccasionCategory, { bg: string; text: string; border: string }> = {
  "Traditional & Festive":    { bg: "bg-amber-500/10",   text: "text-amber-600 dark:text-amber-400",   border: "border-amber-500/30" },
  "Celebration & Wishes":     { bg: "bg-pink-500/10",    text: "text-pink-600 dark:text-pink-400",     border: "border-pink-500/30" },
  "National & Special Days":  { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30" },
  "Promotional & Offers":     { bg: "bg-blue-500/10",    text: "text-blue-600 dark:text-blue-400",     border: "border-blue-500/30" },
  "Social Media Templates":   { bg: "bg-violet-500/10",  text: "text-violet-600 dark:text-violet-400", border: "border-violet-500/30" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function OccasionDesignsSection({
  clients,
  selectedBrandId,
  agencyName,
}: OccasionDesignsSectionProps) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [occasions, setOccasions] = useState<OccasionImage[]>(PRELOADED_OCCASIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<OccasionCategory | "All">("All");
  const [filterClient, setFilterClient] = useState<string>("all");

  // Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    category: "Traditional & Festive" as OccasionCategory,
    clientId: selectedBrandId !== "all" ? selectedBrandId : "all",
    aspectRatio: "1:1" as OccasionImage["aspectRatio"],
    caption: "",
    tags: "",
  });
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string>("");
  const [uploadUrlInput, setUploadUrlInput] = useState("");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview modal
  const [previewOccasion, setPreviewOccasion] = useState<OccasionImage | null>(null);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [captionCopied, setCaptionCopied] = useState(false);

  // ── Filtered Data ──────────────────────────────────────────────────────────
  const filtered = occasions.filter(occ => {
    const matchSearch = !searchQuery ||
      occ.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      occ.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCategory = filterCategory === "All" || occ.category === filterCategory;
    const matchClient =
      filterClient === "all" ||
      occ.clientId === "all" ||
      occ.clientId === filterClient;
    return matchSearch && matchCategory && matchClient;
  });

  // Pinned selected-client items first
  const sorted = [...filtered].sort((a, b) => {
    const aIsClient = a.clientId === selectedBrandId;
    const bIsClient = b.clientId === selectedBrandId;
    if (aIsClient && !bIsClient) return -1;
    if (!aIsClient && bIsClient) return 1;
    return 0;
  });

  // ── File Upload Handler ────────────────────────────────────────────────────
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are supported.");
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      setUploadPreviewUrl(ev.target?.result as string);
      setUploadFileName(file.name);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Only image files are supported.");
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      setUploadPreviewUrl(ev.target?.result as string);
      setUploadFileName(file.name);
      setUploadMode("file");
    };
    reader.readAsDataURL(file);
  }, []);

  // ── Save Uploaded Occasion ─────────────────────────────────────────────────
  const handleSaveOccasion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) {
      toast.error("Please enter a title for this occasion design.");
      return;
    }
    const finalUrl =
      uploadMode === "file" ? uploadPreviewUrl :
      uploadMode === "url"  ? uploadUrlInput.trim() : null;

    if (!finalUrl) {
      toast.error("Please upload an image file or enter an image URL.");
      return;
    }

    setUploading(true);
    setTimeout(() => {
      const clientName =
        uploadForm.clientId === "all"
          ? "All Clients"
          : clients.find(c => c.id === uploadForm.clientId)?.businessName ?? "Unknown";

      const newOccasion: OccasionImage = {
        id: `occ-${Date.now()}`,
        title: uploadForm.title.trim(),
        category: uploadForm.category,
        clientId: uploadForm.clientId,
        clientName,
        aspectRatio: uploadForm.aspectRatio,
        url: finalUrl,
        caption: uploadForm.caption.trim() || undefined,
        tags: uploadForm.tags.split(",").map(t => t.trim()).filter(Boolean),
        uploadedAt: new Date().toISOString().split("T")[0],
        isPreloaded: false,
        fileName: uploadFileName || `${uploadForm.title.replace(/\s+/g, "_").toLowerCase()}.jpg`,
      };
      setOccasions(prev => [newOccasion, ...prev]);
      setShowUploadModal(false);
      setUploading(false);
      setUploadPreviewUrl(null);
      setUploadFileName("");
      setUploadUrlInput("");
      setUploadForm({
        title: "", category: "Traditional & Festive",
        clientId: selectedBrandId !== "all" ? selectedBrandId : "all",
        aspectRatio: "1:1", caption: "", tags: "",
      });
      toast.success(`✅ "${newOccasion.title}" uploaded for ${clientName}!`);
    }, 900);
  };

  // ── Download Handler ───────────────────────────────────────────────────────
  const handleDownload = async (occ: OccasionImage) => {
    try {
      const link = document.createElement("a");
      // For data-URLs (uploaded) just use directly; for remote URLs, fetch + blob
      if (occ.url.startsWith("data:")) {
        link.href = occ.url;
        link.download = occ.fileName;
        link.click();
      } else {
        const resp = await fetch(occ.url, { mode: "cors" });
        if (!resp.ok) throw new Error("Network error");
        const blob = await resp.blob();
        const blobUrl = URL.createObjectURL(blob);
        link.href = blobUrl;
        link.download = occ.fileName;
        link.click();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      }
      toast.success(`📥 "${occ.title}" downloaded!`);
    } catch {
      // Fallback: open in new tab
      window.open(occ.url, "_blank");
      toast.info("Opening image in new tab for manual save.");
    }
  };

  // ── Delete Handler ─────────────────────────────────────────────────────────
  const handleDelete = (occ: OccasionImage) => {
    if (occ.isPreloaded) {
      toast.error("Default occasion templates cannot be deleted.");
      return;
    }
    if (window.confirm(`Delete "${occ.title}"?`)) {
      setOccasions(prev => prev.filter(o => o.id !== occ.id));
      toast.success(`Deleted "${occ.title}".`);
    }
  };

  // ── Copy Caption ───────────────────────────────────────────────────────────
  const handleCopyCaption = (caption: string, clientName: string) => {
    const formatted = caption.replace(/\{Business Name\}/g, clientName);
    navigator.clipboard.writeText(formatted);
    setCaptionCopied(true);
    toast.success("Caption copied to clipboard!");
    setTimeout(() => setCaptionCopied(false), 2000);
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const inp = "w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";
  const lbl = "block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5";

  const aspectClass = (ratio: OccasionImage["aspectRatio"]) => {
    const map: Record<string, string> = {
      "1:1":  "aspect-square",
      "9:16": "aspect-[9/16]",
      "16:9": "aspect-video",
      "4:5":  "aspect-[4/5]",
    };
    return map[ratio] ?? "aspect-square";
  };

  const clientForOcc = (occ: OccasionImage) =>
    occ.clientId === "all" ? "All Clients" : occ.clientName;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <motion.div
      key="occasions"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >

      {/* ── Header Row ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
            <Star className="w-5 h-5 text-primary fill-primary/20" />
            Occasion & Festive Designs
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload custom wishes &amp; festival images for each client. Clients can view &amp; download anytime.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-extrabold rounded-xl hover:scale-[1.03] transition-all shadow-md shadow-primary/20 shrink-0"
        >
          <Upload className="w-4 h-4" /> Upload Occasion Design
        </button>
      </div>

      {/* ── Stats Strip ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Designs",    value: occasions.length,                                          icon: <Image className="w-4 h-4 text-primary" /> },
          { label: "Client-Specific",  value: occasions.filter(o => o.clientId !== "all").length,        icon: <Users className="w-4 h-4 text-blue-500" /> },
          { label: "Festival / Trad.", value: occasions.filter(o => o.category === "Traditional & Festive").length, icon: <Star className="w-4 h-4 text-amber-500" /> },
          { label: "This Month",       value: occasions.filter(o => o.uploadedAt.startsWith(new Date().toISOString().slice(0,7))).length, icon: <Calendar className="w-4 h-4 text-emerald-500" /> },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="p-2 bg-muted rounded-xl shrink-0">{s.icon}</div>
            <div>
              <div className="text-xl font-extrabold text-foreground">{s.value}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl border border-border p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search occasion, tags…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 w-full transition-all"
          />
        </div>
        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value as OccasionCategory | "All")}
            className="pl-9 pr-8 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none min-w-[190px]"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
        {/* Client Filter */}
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <select
            value={filterClient}
            onChange={e => setFilterClient(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none min-w-[190px]"
          >
            <option value="all">All Clients (+ Generic)</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.businessName}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* ── Category Pills ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {(["All", ...CATEGORIES] as const).map(cat => {
          const isActive = filterCategory === cat;
          const col = cat === "All" ? undefined : CATEGORY_COLORS[cat as OccasionCategory];
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat === "All" ? "All" : cat as OccasionCategory)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                  : col
                  ? `${col.bg} ${col.text} ${col.border} hover:opacity-90`
                  : "bg-muted text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Results Count ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {sorted.length} design{sorted.length !== 1 ? "s" : ""} found
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear search
          </button>
        )}
      </div>

      {/* ── Design Card Grid ─────────────────────────────────────────────────── */}
      {sorted.length === 0 ? (
        <div className="glass-card rounded-2xl border border-dashed border-border p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto border border-border">
            <Image className="w-8 h-8 text-muted-foreground" />
          </div>
          <h4 className="text-base font-extrabold text-foreground">No occasion designs found</h4>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Try adjusting your filters or upload a new occasion design using the button above.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-extrabold rounded-xl hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4" /> Upload First Design
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sorted.map((occ, idx) => {
            const cat = CATEGORY_COLORS[occ.category];
            const isClientSpecific = occ.clientId !== "all";
            return (
              <motion.div
                key={occ.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="glass-card rounded-2xl border border-border overflow-hidden group hover:border-primary/40 hover:shadow-lg transition-all relative"
              >
                {/* Image area */}
                <div
                  className={`relative ${aspectClass(occ.aspectRatio)} overflow-hidden bg-muted cursor-zoom-in`}
                  onClick={() => { setPreviewOccasion(occ); setPreviewZoom(1); }}
                >
                  <img
                    src={occ.url}
                    alt={occ.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1609607169751-fd78c98ed18b?w=400&q=60";
                    }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                    <button
                      onClick={ev => { ev.stopPropagation(); setPreviewOccasion(occ); setPreviewZoom(1); }}
                      className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/40 transition-all"
                      title="Preview"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={ev => { ev.stopPropagation(); handleDownload(occ); }}
                      className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/40 transition-all"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Client badge */}
                  {isClientSpecific && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-[9px] font-extrabold rounded-lg backdrop-blur-sm shadow">
                      {occ.clientName.split(" ").slice(0,2).join(" ")}
                    </div>
                  )}

                  {/* Aspect ratio badge */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 text-white text-[9px] font-bold rounded-md backdrop-blur-sm">
                    {occ.aspectRatio}
                  </div>

                  {/* Preloaded badge */}
                  {occ.isPreloaded && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-amber-500/80 text-white text-[9px] font-bold rounded-md backdrop-blur-sm">
                      ✨ Template
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-4 space-y-2.5">
                  <div>
                    <h4 className="text-sm font-extrabold text-foreground leading-snug line-clamp-1">
                      {occ.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
                        {occ.category}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {occ.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {occ.tags.slice(0, 3).map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground font-medium border border-border">
                          #{t}
                        </span>
                      ))}
                      {occ.tags.length > 3 && (
                        <span className="text-[10px] text-muted-foreground px-1">+{occ.tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* For client chip */}
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Users className="w-3 h-3 shrink-0" />
                    <span className="truncate">{clientForOcc(occ)}</span>
                    <span className="ml-auto text-muted-foreground/60 shrink-0">
                      {occ.uploadedAt}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleDownload(occ)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-primary-foreground text-xs font-extrabold rounded-xl hover:scale-[1.02] transition-all shadow-sm shadow-primary/20"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                    <button
                      onClick={() => { setPreviewOccasion(occ); setPreviewZoom(1); }}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-muted text-foreground text-xs font-bold rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
                      title="Full Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {!occ.isPreloaded && (
                      <button
                        onClick={() => handleDelete(occ)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Caption snippet */}
                  {occ.caption && (
                    <div className="text-[10px] text-muted-foreground border border-border rounded-xl p-2.5 bg-muted leading-relaxed line-clamp-2 italic">
                      "{occ.caption.substring(0, 90)}{occ.caption.length > 90 ? "…" : ""}"
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          UPLOAD MODAL
      ════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 pt-20 pb-6 bg-black/75 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0 }}
              className="bg-card border border-border rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-muted border-b border-border shrink-0">
                <div>
                  <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" /> Upload Occasion Design
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add a festival/occasion wishes image for a specific client or all clients
                  </p>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="w-9 h-9 rounded-full bg-border hover:bg-muted-foreground/20 flex items-center justify-center text-muted-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto flex-1 px-6 py-6">
                <form id="occ-form" onSubmit={handleSaveOccasion} className="space-y-5">

                  {/* Image Source Toggle */}
                  <div>
                    <label className={lbl}>Image Source</label>
                    <div className="flex gap-2 mb-3">
                      {(["file", "url"] as const).map(mode => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setUploadMode(mode)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                            uploadMode === mode
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted text-muted-foreground border-border hover:border-primary/40"
                          }`}
                        >
                          {mode === "file" ? "📁 Upload File" : "🌐 Image URL"}
                        </button>
                      ))}
                    </div>

                    {uploadMode === "file" ? (
                      <div
                        onDragOver={e => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                          uploadPreviewUrl
                            ? "border-primary/50 bg-primary/5"
                            : "border-border hover:border-primary/40 bg-muted/50 hover:bg-muted"
                        }`}
                      >
                        {uploadPreviewUrl ? (
                          <div className="space-y-3">
                            <img
                              src={uploadPreviewUrl}
                              alt="Preview"
                              className="w-40 h-40 object-cover rounded-xl mx-auto border border-border shadow-md"
                            />
                            <p className="text-xs text-primary font-bold">{uploadFileName}</p>
                            <button
                              type="button"
                              onClick={ev => { ev.stopPropagation(); setUploadPreviewUrl(null); setUploadFileName(""); }}
                              className="text-xs text-muted-foreground hover:text-red-400 transition-colors"
                            >
                              Remove & choose different
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                              <Upload className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-sm font-bold text-foreground">Drag & drop an image here</p>
                            <p className="text-xs text-muted-foreground">or click to browse — PNG, JPG, WEBP</p>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="url"
                          placeholder="https://example.com/occasion-image.jpg"
                          value={uploadUrlInput}
                          onChange={e => setUploadUrlInput(e.target.value)}
                          className={inp}
                        />
                        {uploadUrlInput && (
                          <div className="rounded-xl overflow-hidden border border-border">
                            <img
                              src={uploadUrlInput}
                              alt="URL Preview"
                              className="w-full max-h-48 object-cover"
                              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className={lbl}>Occasion Title *</label>
                    <input
                      required
                      placeholder="e.g. Happy Diwali 2026, New Year Wishes"
                      value={uploadForm.title}
                      onChange={e => setUploadForm(p => ({ ...p, title: e.target.value }))}
                      className={inp}
                    />
                  </div>

                  {/* Category & Aspect Ratio */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={lbl}>Category</label>
                      <select
                        value={uploadForm.category}
                        onChange={e => setUploadForm(p => ({ ...p, category: e.target.value as OccasionCategory }))}
                        className={inp}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lbl}>Aspect Ratio / Format</label>
                      <select
                        value={uploadForm.aspectRatio}
                        onChange={e => setUploadForm(p => ({ ...p, aspectRatio: e.target.value as OccasionImage["aspectRatio"] }))}
                        className={inp}
                      >
                        {ASPECT_RATIOS.map(r => (
                          <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Client Assignment */}
                  <div>
                    <label className={lbl}>Assign to Client</label>
                    <select
                      value={uploadForm.clientId}
                      onChange={e => setUploadForm(p => ({ ...p, clientId: e.target.value }))}
                      className={inp}
                    >
                      <option value="all">🌟 All Clients (Generic Template)</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>🏢 {c.businessName}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      "All Clients" makes this visible to the entire portfolio. Client-specific images appear first for that client's view.
                    </p>
                  </div>

                  {/* Caption / Greeting */}
                  <div>
                    <label className={lbl}>Social Caption / Greeting Text (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. 🪔 Wishing you a joyful Diwali! May this festival bring warmth & prosperity to your family. — {Business Name}"
                      value={uploadForm.caption}
                      onChange={e => setUploadForm(p => ({ ...p, caption: e.target.value }))}
                      className={inp}
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Use <code className="bg-muted px-1 rounded">{"{Business Name}"}</code> as a placeholder — it auto-fills with the client's name on copy.
                    </p>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className={lbl}>Tags (comma-separated)</label>
                    <input
                      placeholder="diwali, festival, wishes, traditional"
                      value={uploadForm.tags}
                      onChange={e => setUploadForm(p => ({ ...p, tags: e.target.value }))}
                      className={inp}
                    />
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-muted border-t border-border flex gap-3 shrink-0">
                <button
                  type="submit"
                  form="occ-form"
                  disabled={uploading}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-extrabold text-sm rounded-xl hover:scale-[1.01] transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {uploading
                    ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
                    : <><Check className="w-4 h-4" /> Save Occasion Design</>
                  }
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-5 py-3 border border-border text-muted-foreground hover:text-foreground font-semibold text-sm rounded-xl hover:border-primary/40 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════════════
          FULL PREVIEW MODAL
      ════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {previewOccasion && (
          <div
            className="fixed inset-0 z-[350] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
            onClick={() => setPreviewOccasion(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden"
              onClick={ev => ev.stopPropagation()}
            >
              {/* Preview Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-muted border-b border-border">
                <div>
                  <p className="text-sm font-extrabold text-foreground">{previewOccasion.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {previewOccasion.category} · {previewOccasion.aspectRatio} · {clientForOcc(previewOccasion)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Zoom controls */}
                  <button
                    onClick={() => setPreviewZoom(z => Math.max(0.5, z - 0.25))}
                    className="p-2 rounded-lg bg-border hover:bg-muted-foreground/20 text-muted-foreground transition-colors"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-foreground w-10 text-center">{Math.round(previewZoom * 100)}%</span>
                  <button
                    onClick={() => setPreviewZoom(z => Math.min(3, z + 0.25))}
                    className="p-2 rounded-lg bg-border hover:bg-muted-foreground/20 text-muted-foreground transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewZoom(1)}
                    className="p-2 rounded-lg bg-border hover:bg-muted-foreground/20 text-muted-foreground transition-colors"
                    title="Reset zoom"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewOccasion(null)}
                    className="w-9 h-9 rounded-full bg-border hover:bg-muted-foreground/20 flex items-center justify-center text-muted-foreground transition-colors ml-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Image */}
              <div className="bg-muted/60 overflow-auto max-h-[55vh] flex items-center justify-center p-4">
                <img
                  src={previewOccasion.url}
                  alt={previewOccasion.title}
                  style={{ transform: `scale(${previewZoom})`, transformOrigin: "center", transition: "transform 0.2s" }}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
                />
              </div>

              {/* Caption & Actions */}
              <div className="px-6 py-5 space-y-4">
                {previewOccasion.caption && (
                  <div className="bg-muted rounded-2xl border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Social Caption / Greeting</p>
                      <button
                        onClick={() => handleCopyCaption(previewOccasion.caption!, clientForOcc(previewOccasion))}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-bold rounded-lg border border-primary/20 hover:bg-primary/20 transition-all"
                      >
                        {captionCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {captionCopied ? "Copied!" : "Copy Caption"}
                      </button>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">
                      {previewOccasion.caption}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {previewOccasion.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {previewOccasion.tags.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground border border-border font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Row */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(previewOccasion)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-extrabold text-sm rounded-xl hover:scale-[1.01] transition-all shadow-md shadow-primary/20"
                  >
                    <Download className="w-4 h-4" /> Download High-Res
                  </button>
                  <a
                    href={previewOccasion.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-muted border border-border text-muted-foreground text-sm font-bold rounded-xl hover:border-primary/40 hover:text-foreground transition-all"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
