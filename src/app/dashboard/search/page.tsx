"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Loader2, FileText, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NoteResult {
  id: string;
  title: string;
  content: string;
  tagNames: string[];
  updatedAt: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [notes, setNotes] = useState<NoteResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const doSearch = useCallback(async (q: string, tag: string) => {
    if (!q.trim() && !tag.trim()) { setNotes([]); setHasSearched(false); return; }
    setIsLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (tag) params.set("tag", tag);
      const res = await fetch(`/api/notes/search?${params}`);
      const data = await res.json();
      setNotes(data.notes || []);
    } catch { setNotes([]); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query, tagFilter), 300);
    return () => clearTimeout(timer);
  }, [query, tagFilter, doSearch]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Search className="text-purple-400" size={32} />
          Search Notes
        </h1>
        <p className="text-gray-400">Find anything across your workspace.</p>
      </header>

      {/* Search Inputs */}
      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or content..."
            autoFocus
            className="w-full bg-[#111118] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 transition-all"
          />
        </div>
        <div className="relative w-48">
          <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            placeholder="Filter by tag..."
            className="w-full bg-[#111118] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 transition-all"
          />
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-3">
          <Loader2 size={24} className="animate-spin" /> Searching...
        </div>
      ) : hasSearched && notes.length === 0 ? (
        <div className="text-center py-16 bg-[#111118] border border-white/5 rounded-xl">
          <FileText size={40} className="mx-auto mb-3 text-gray-600" />
          <p className="text-gray-400">No notes match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {notes.map((note) => (
            <Link
              key={note.id}
              href={`/dashboard/notes/${note.id}`}
              className="flex flex-col bg-[#111118] border border-white/5 rounded-xl p-5 hover:bg-[#1a1a24] hover:border-purple-500/30 transition-all group h-44"
            >
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-400 transition-colors truncate">
                {note.title}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-auto">{note.content || "No content..."}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {note.tagNames.slice(0, 3).map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-purple-600/15 text-purple-400 rounded text-xs border border-purple-500/20">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500 shrink-0">
                  {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
