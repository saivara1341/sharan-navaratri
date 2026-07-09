import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    Building2,
    RefreshCw,
    X,
    Paperclip,
    MessageSquare,
    BookOpen,
    HelpCircle
} from "lucide-react";

interface KbEntry {
    id: string;
    file_name: string;
    file_type: string;
    content: string;
    created_at: string;
}

const KbEntryCard = ({ entry, onDelete }: { entry: KbEntry, onDelete: (id: string) => void }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all text-left">
            <div className="flex items-center justify-between gap-4 mb-2">
                <div className="min-w-0 flex-1 text-left">
                    <h4 className="font-bold text-white text-sm truncate">
                        {entry.file_name}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-wider text-[10px] font-bold">
                            {entry.file_type}
                        </span>
                        <span>{format(new Date(entry.created_at), 'MMM dd, yyyy')}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button 
                        onClick={() => setExpanded(!expanded)} 
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                    >
                        {expanded ? "Hide Text" : "View Text"}
                    </button>
                    <button 
                        onClick={() => onDelete(entry.id)} 
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete entry"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
            {expanded && (
                <div className="mt-3 p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed text-left">
                    {entry.content}
                </div>
            )}
        </div>
    );
};

export const KnowledgeHubManager = () => {
    const [kbEntries, setKbEntries] = useState<KbEntry[]>([]);
    const [kbLoading, setKbLoading] = useState(false);
    const [kbTitle, setKbTitle] = useState("");
    const [kbContent, setKbContent] = useState("");
    const [kbFileType, setKbFileType] = useState("text");
    const [kbSaving, setKbSaving] = useState(false);
    const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('vite_gemini_api_key') || "");
    const [fileUploading, setFileUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchKbEntries = async () => {
        setKbLoading(true);
        try {
            const { data, error } = await supabase
                .from('knowledge_base')
                .select('id, file_name, file_type, content, created_at')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setKbEntries(data || []);
        } catch (error: any) {
            console.error("Error fetching knowledge base:", error);
            if (!error.message?.includes("relation") && !error.message?.includes("does not exist")) {
                toast.error(`Failed to load knowledge base: ${error.message}`);
            }
        } finally {
            setKbLoading(false);
        }
    };

    useEffect(() => {
        fetchKbEntries();
    }, []);

    const handleSaveGeminiKey = (key: string) => {
        setGeminiKey(key);
        localStorage.setItem('vite_gemini_api_key', key);
        toast.success("Gemini API Key saved locally!");
    };

    const generateEmbedding = async (text: string, apiKey: string) => {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'models/text-embedding-004',
                content: {
                    parts: [{ text: text }]
                }
            })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Embedding generation failed');
        return data.embedding.values;
    };

    const extractTextFromFile = async (base64Data: string, mimeType: string, apiKey: string) => {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: base64Data
                            }
                        },
                        {
                            text: "Extract all detailed factual information, business rules, pricing list, guidelines, and text content from this document/image. Return a comprehensive, clean, structured text output summarizing everything found. Do not add conversational intro/outro."
                        }
                    ]
                }]
            })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'File processing failed');
        return data.candidates[0].content.parts[0].text;
    };

    const handleSaveManualEntry = async () => {
        if (!kbTitle.trim() || !kbContent.trim()) {
            toast.error("Please provide both a title and content.");
            return;
        }
        if (!geminiKey) {
            toast.error("Please save your Gemini API Key first to generate vector embeddings.");
            return;
        }

        setKbSaving(true);
        try {
            toast.loading("Generating vector embeddings...", { id: "kb-save" });
            const vector = await generateEmbedding(kbContent, geminiKey);

            toast.loading("Writing to vector database...", { id: "kb-save" });
            const { error } = await supabase
                .from('knowledge_base')
                .insert({
                    file_name: kbTitle.trim(),
                    file_type: kbFileType,
                    content: kbContent.trim(),
                    embedding: vector
                });

            if (error) throw error;

            toast.success("Knowledge item added successfully!", { id: "kb-save" });
            setKbTitle("");
            setKbContent("");
            fetchKbEntries();
        } catch (err: any) {
            console.error("Save failed:", err);
            toast.error(`Save failed: ${err.message}`, { id: "kb-save" });
        } finally {
            setKbSaving(false);
        }
    };

    const handleKbFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!geminiKey) {
            toast.error("Please save your Gemini API Key first to process documents.");
            return;
        }

        setFileUploading(true);
        try {
            toast.loading(`Uploading raw file: ${file.name}...`, { id: "kb-upload" });

            // 1. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const storageFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('knowledge_base')
                .upload(storageFileName, file);

            if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

            // 2. Read file as Base64 for Gemini multimodal API
            toast.loading("Reading file context...", { id: "kb-upload" });
            const reader = new FileReader();
            
            const base64Promise = new Promise<string>((resolve, reject) => {
                reader.onload = () => {
                    const resultStr = reader.result as string;
                    const base64 = resultStr.split(',')[1];
                    resolve(base64);
                };
                reader.onerror = (err) => reject(err);
            });
            reader.readAsDataURL(file);
            const base64Data = await base64Promise;

            // 3. Process with Gemini Vision / Flash
            toast.loading("Gemini processing file (multimodal OCR)...", { id: "kb-upload" });
            let mimeType = file.type;
            if (!mimeType) {
                mimeType = file.name.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf';
            }
            const extractedText = await extractTextFromFile(base64Data, mimeType, geminiKey);

            // 4. Generate embeddings
            toast.loading("Generating vector embeddings...", { id: "kb-upload" });
            const vector = await generateEmbedding(extractedText, geminiKey);

            // 5. Save to knowledge_base
            const { error: dbError } = await supabase
                .from('knowledge_base')
                .insert({
                    file_name: file.name,
                    file_type: fileExt || 'unknown',
                    content: extractedText,
                    embedding: vector
                });

            if (dbError) throw dbError;

            toast.success(`Success! ${file.name} uploaded and indexed.`, { id: "kb-upload" });
            fetchKbEntries();
        } catch (err: any) {
            console.error("Upload failed:", err);
            toast.error(`Upload/index failed: ${err.message}`, { id: "kb-upload" });
        } finally {
            setFileUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleDeleteKbEntry = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this knowledge entry?")) return;
        try {
            const { error } = await supabase
                .from('knowledge_base')
                .delete()
                .eq('id', id);
            if (error) throw error;
            toast.success("Knowledge entry deleted successfully");
            fetchKbEntries();
        } catch (err: any) {
            toast.error(`Delete failed: ${err.message}`);
        }
    };

    const filteredEntries = kbEntries.filter(entry => 
        entry.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 text-left">
            {/* Section Header */}
            <div className="p-6 glass-card border border-primary/20 rounded-2xl">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Dynamic Knowledge Hub (Vector RAG)
                </h2>
                <p className="text-sm text-muted-foreground">
                    Upload reference documents, business pricing models, client templates, and custom rules. 
                    The client AI assistant will automatically parse them, generate 768-dimensional embeddings, and use this knowledge to resolve client portal queries.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Panel: Settings & Add Content */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Gemini API Settings */}
                    <div className="glass-card p-6 electric-border">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            ⚙️ Gemini API Key
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4">
                            An API Key is required to generate vector embeddings and run Multimodal OCR (parsing PDFs and images). The key is stored locally in your browser.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                placeholder="Paste Gemini API Key..."
                                value={geminiKey}
                                onChange={(e) => setGeminiKey(e.target.value)}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <button
                                onClick={() => handleSaveGeminiKey(geminiKey)}
                                className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md"
                            >
                                Save
                            </button>
                        </div>
                    </div>

                    {/* Upload PDF / Images */}
                    <div className="glass-card p-6 electric-border">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            📎 Ingest Documents & Images
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4">
                            Supports PDF, DOCX, PNG, JPG. The file will be parsed by Gemini Flash OCR, vectorized, and uploaded.
                        </p>
                        
                        <label className="border-2 border-dashed border-white/10 hover:border-primary/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/5 hover:bg-white/10 group relative">
                            {fileUploading ? (
                                <div className="flex flex-col items-center gap-2 text-primary">
                                    <RefreshCw className="w-8 h-8 animate-spin" />
                                    <span className="text-sm font-semibold">Processing & Vectorizing...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-foreground">
                                    <Paperclip className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors" />
                                    <span className="text-sm font-medium text-center">Click to upload document/image</span>
                                    <span className="text-xs text-muted-foreground/75 text-center">PDF, DOCX, PNG, JPEG up to 10MB</span>
                                </div>
                            )}
                            <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.docx,.png,.jpg,.jpeg"
                                onChange={handleKbFileUpload}
                                disabled={fileUploading}
                            />
                        </label>
                    </div>

                    {/* Manual Text Entry */}
                    <div className="glass-card p-6 electric-border">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            ✍️ Add Manual Guideline / Text
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Website Pricing Sheet"
                                    value={kbTitle}
                                    onChange={(e) => setKbTitle(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Content</label>
                                <textarea
                                    rows={5}
                                    placeholder="Paste pricing rules, FAQs, guidelines, or other business facts here..."
                                    value={kbContent}
                                    onChange={(e) => setKbContent(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <button
                                onClick={handleSaveManualEntry}
                                disabled={kbSaving}
                                className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                            >
                                {kbSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                                Save Entry & Vectorize
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Ingested Knowledge Items List */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="glass-card p-6 electric-border min-h-[500px] flex flex-col">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                📚 Ingested Knowledge Base ({filteredEntries.length})
                            </h3>
                            <input
                                type="text"
                                placeholder="Search guidelines..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-48"
                            />
                        </div>

                        {kbLoading ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 text-muted-foreground">
                                <RefreshCw className="w-8 h-8 animate-spin mb-4 text-primary" />
                                <p>Accessing vector indexes...</p>
                            </div>
                        ) : filteredEntries.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center text-muted-foreground border border-dashed border-white/10 rounded-2xl bg-white/5">
                                <BookOpen className="w-10 h-10 mb-4 text-muted-foreground/50" />
                                <p className="font-medium text-slate-300">No matching guidelines found</p>
                                <p className="text-xs text-muted-foreground mt-1 max-w-sm">Use the forms on the left to upload or write manual guidelines for the AI assistant.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 no-scrollbar">
                                {filteredEntries.map((entry) => (
                                    <KbEntryCard 
                                        key={entry.id} 
                                        entry={entry} 
                                        onDelete={handleDeleteKbEntry} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
