"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Save, CheckCircle2, Sparkles, Loader2, AlignLeft, CheckSquare,
  Heading, Wand2, X, Link2, Globe, Lock, Archive, Tag, Plus, Eye, Edit3, Folder,
} from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import rehypeSanitize from "rehype-sanitize";

interface Note {
  id: string; title: string; content: string;
  category: string | null;
  tagNames: string[]; isPublic: boolean;
  shareId: string | null; isArchived: boolean; updatedAt: string;
}

interface AiState {
  isGenerating: boolean; activeAction: string | null;
  summary: string | null; actionItems: string[]; suggestedTitle: string | null;
}

export function NoteEditor({ initialNote }: { initialNote: Note }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialNote.title);
  const [content, setContent] = useState(initialNote.content);
  const [tagNames, setTagNames] = useState<string[]>(initialNote.tagNames);
  const [category, setCategory] = useState(initialNote.category || "");
  const [isPublic, setIsPublic] = useState(initialNote.isPublic);
  const [shareId, setShareId] = useState(initialNote.shareId);
  const [tagInput, setTagInput] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date(initialNote.updatedAt));
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiState, setAiState] = useState<AiState>({
    isGenerating: false, activeAction: null, summary: null, actionItems: [], suggestedTitle: null,
  });

  const saveNote = useCallback(async (patch: Record<string, unknown>) => {
    setIsSaving(true);
    try {
      await fetch(`/api/notes/${initialNote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      setLastSaved(new Date());
    } catch (e) { console.error("Save failed", e); }
    finally { setIsSaving(false); router.refresh(); }
  }, [initialNote.id, router]);

  // Debounced auto-save for title + content + tags + category
  useEffect(() => {
    const unchanged = title === initialNote.title && content === initialNote.content &&
      category === (initialNote.category || "") &&
      JSON.stringify(tagNames) === JSON.stringify(initialNote.tagNames);
    if (unchanged) return;
    const t = setTimeout(() => saveNote({ title, content, tagNames, category: category || null }), 1000);
    return () => clearTimeout(t);
  }, [title, content, tagNames, category, saveNote, initialNote]);

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveNote({ title, content, tagNames, category: category || null });
        toast.success("Note saved manually");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [title, content, tagNames, category, saveNote]);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tagNames.includes(tag)) setTagNames((prev) => [...prev, tag]);
    setTagInput("");
  };
  const removeTag = (tag: string) => setTagNames((prev) => prev.filter((t) => t !== tag));

  const toggleShare = async () => {
    const res = await fetch(`/api/notes/${initialNote.id}/share`, { method: "PATCH" });
    if (res.ok) {
      const data = await res.json();
      setIsPublic(data.note.isPublic);
      setShareId(data.note.shareId);
      toast.success(data.note.isPublic ? "Note is now public" : "Note is now private");
    } else {
      toast.error("Failed to update sharing settings");
    }
  };

  const archiveNote = async () => {
    await saveNote({ isArchived: true });
    toast.success("Note archived");
    router.push("/dashboard/notes");
  };

  const copyShareLink = () => {
    if (!shareId) return;
    navigator.clipboard.writeText(`${window.location.origin}/shared/${shareId}`);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAiAction = async (action: "summary" | "actionItems" | "title" | "all") => {
    if (!content.trim()) { toast.error("Please write some content first."); return; }
    setAiState((p) => ({ ...p, isGenerating: true, activeAction: action }));
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, noteId: initialNote.id, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAiState((p) => ({
        ...p,
        summary: data.summary ?? p.summary,
        actionItems: data.actionItems ?? p.actionItems,
        suggestedTitle: data.suggestedTitle ?? p.suggestedTitle,
      }));
      toast.success("AI Generation complete");
    } catch { toast.error("AI generation failed."); }
    finally { setAiState((p) => ({ ...p, isGenerating: false, activeAction: null })); }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-white">
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#111118]/80 backdrop-blur-sm sticky top-0 z-10">
        <span suppressHydrationWarning className="text-sm text-gray-400 flex items-center gap-2">
          {isSaving
            ? <><Save size={13} className="animate-pulse text-purple-400" /> Saving...</>
            : <><CheckCircle2 size={13} className="text-green-500" /> Saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</>}
        </span>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsPreview(!isPreview)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 transition-all">
            {isPreview ? <><Edit3 size={13} /> Edit</> : <><Eye size={13} /> Preview</>}
          </button>
          <button onClick={archiveNote} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 border border-white/5 transition-all">
            <Archive size={13} /> Archive
          </button>
          <button
            onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
              isAiPanelOpen
                ? "bg-purple-600 border-transparent text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                : "bg-purple-600/10 border-purple-500/20 text-purple-400 hover:bg-purple-600/20")}
          >
            <Sparkles size={13} /> AI Assist
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className={cn("flex flex-col h-full transition-all duration-300", isAiPanelOpen ? "w-[calc(100%-340px)]" : "w-full")}>
          <div className="flex-1 overflow-y-auto px-8 py-8">
            <div className="max-w-3xl mx-auto space-y-4">
              <input
                value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title"
                className="w-full bg-transparent text-4xl font-bold placeholder-gray-700 border-none outline-none select-text"
              />
              {isPreview ? (
                <div className="w-full text-gray-300 text-lg leading-relaxed min-h-[450px] prose prose-invert max-w-none select-text cursor-text">
                  <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content || "*No content*"}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  value={content} onChange={(e) => setContent(e.target.value)}
                  placeholder="Start typing your note here..."
                  className="w-full bg-transparent text-gray-300 text-lg leading-relaxed placeholder-gray-700 border-none outline-none resize-none min-h-[450px] select-text"
                />
              )}
            </div>
          </div>

          {/* ── Footer Toolbar ── */}
          <div className="border-t border-white/5 bg-[#111118]/60 px-6 py-3 flex flex-wrap items-center gap-4">
            {/* Tags */}
            <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
              <Tag size={14} className="text-gray-500 shrink-0" />
              {tagNames.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-purple-600/15 text-purple-400 rounded text-xs border border-purple-500/20">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-white ml-0.5"><X size={10} /></button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === ",") && (e.preventDefault(), addTag())}
                  placeholder="Add tag..."
                  className="bg-transparent text-xs text-gray-400 placeholder-gray-600 border-none outline-none w-20 select-text cursor-text"
                />
                {tagInput && <button onClick={addTag} className="text-purple-400 hover:text-purple-300"><Plus size={14} /></button>}
              </div>
            </div>

            {/* Category & Share */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-[#1a1a24] px-3 py-1.5 rounded-lg border border-white/5">
                <Folder size={12} />
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-transparent border-none outline-none text-gray-300 cursor-pointer"
                >
                  <option value="">No Category</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Ideas">Ideas</option>
                  <option value="Tasks">Tasks</option>
                  <option value="Meetings">Meetings</option>
                </select>
              </div>

              {isPublic && shareId && (
                <button onClick={copyShareLink} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#1a1a24] text-cyan-400 border border-cyan-500/20 rounded-lg hover:bg-[#22222e] transition-all">
                  <Link2 size={12} /> {copied ? "Copied!" : "Copy Link"}
                </button>
              )}
              <button
                onClick={toggleShare}
                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                  isPublic
                    ? "bg-green-600/15 text-green-400 border-green-500/20 hover:bg-green-600/25"
                    : "bg-[#1a1a24] text-gray-400 border-white/5 hover:text-white hover:bg-[#22222e]")}
              >
                {isPublic ? <><Globe size={12} /> Public</> : <><Lock size={12} /> Make Public</>}
              </button>
            </div>
          </div>
        </div>

        {/* ── AI Panel ── */}
        <div className={cn("h-full w-[340px] bg-[#111118] border-l border-white/5 flex flex-col absolute right-0 transition-transform duration-300 shadow-2xl",
          isAiPanelOpen ? "translate-x-0" : "translate-x-full")}>
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-purple-900/20 to-transparent">
            <h2 className="text-sm font-bold flex items-center gap-2 text-purple-300"><Sparkles size={16} /> Peblo AI</h2>
            <button onClick={() => setIsAiPanelOpen(false)} className="text-gray-500 hover:text-white transition-colors"><X size={18} /></button>
          </div>
          <div className="p-4 space-y-2">
            <AiBtn icon={<Wand2 size={14} />} label="Generate Everything" action="all" state={aiState} onClick={() => handleAiAction("all")} primary />
            <div className="grid grid-cols-3 gap-2">
              <AiBtn icon={<AlignLeft size={12} />} label="Summary" action="summary" state={aiState} onClick={() => handleAiAction("summary")} />
              <AiBtn icon={<Heading size={12} />} label="Title" action="title" state={aiState} onClick={() => handleAiAction("title")} />
              <AiBtn icon={<CheckSquare size={12} />} label="Tasks" action="actionItems" state={aiState} onClick={() => handleAiAction("actionItems")} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 border-t border-white/5 bg-[#0a0a0f]/50">
            {!aiState.summary && !aiState.suggestedTitle && aiState.actionItems.length === 0 && !aiState.isGenerating && (
              <div className="text-center text-gray-600 text-xs mt-8"><Sparkles size={28} className="mx-auto mb-2 opacity-20" /><p>Click a button to analyse your note.</p></div>
            )}
            {aiState.isGenerating && (
              <div className="flex items-center gap-2 text-purple-400 text-sm"><Loader2 size={16} className="animate-spin" /> Generating with Gemini AI...</div>
            )}
            {aiState.suggestedTitle && (
              <div className="bg-[#1a1a24] rounded-lg border border-purple-500/20 p-4 animate-in fade-in">
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Heading size={11} /> Suggested Title</h3>
                <p className="text-white font-medium text-sm mb-3">{aiState.suggestedTitle}</p>
                <button onClick={() => setTitle(aiState.suggestedTitle!)} className="w-full text-xs bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 py-1.5 rounded border border-purple-500/30 transition-colors">Apply Title</button>
              </div>
            )}
            {aiState.summary && (
              <div className="bg-[#1a1a24] rounded-lg border border-white/5 p-4 animate-in fade-in select-text cursor-text">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2 select-none"><AlignLeft size={11} /> Summary</h3>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{aiState.summary}</p>
              </div>
            )}
            {aiState.actionItems.length > 0 && (
              <div className="bg-[#1a1a24] rounded-lg border border-white/5 p-4 animate-in fade-in select-text cursor-text">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2 select-none"><CheckSquare size={11} /> Action Items</h3>
                <ul className="space-y-2">
                  {aiState.actionItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <div className="mt-0.5 w-3.5 h-3.5 rounded border border-gray-600 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AiBtn({ icon, label, action, state, onClick, primary = false }: {
  icon: React.ReactNode; label: string; action: string;
  state: AiState; onClick: () => void; primary?: boolean;
}) {
  const loading = state.isGenerating && state.activeAction === action;
  return (
    <button onClick={onClick} disabled={state.isGenerating}
      className={cn("flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all border disabled:opacity-50",
        primary
          ? "bg-gradient-to-r from-purple-600 to-pink-600 border-transparent text-white hover:opacity-90 shadow-lg shadow-purple-500/20"
          : "bg-[#1a1a24] border-white/5 text-gray-300 hover:bg-[#22222e]")}>
      {loading ? <Loader2 size={12} className="animate-spin" /> : icon}
      {loading ? "..." : label}
    </button>
  );
}
