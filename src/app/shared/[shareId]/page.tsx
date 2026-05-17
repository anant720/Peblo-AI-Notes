import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Sparkles, Lock, ArrowLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function generateMetadata({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const note = await prisma.note.findFirst({ where: { shareId } });
  return { title: note?.isPublic ? `${note.title} — Peblo Notes` : "Note Not Found" };
}

export default async function SharedNotePage({ params }: { params: Promise<{ shareId: string }> }) {
  const session = await getServerSession(authOptions);
  const { shareId } = await params;
  const note = await prisma.note.findFirst({
    where: { shareId },
    include: { aiLogs: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  if (!note || !note.isPublic) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-center p-8">
        <Lock size={48} className="text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">This note is private</h1>
        <p className="text-gray-400 mb-6">The link may have expired or this note is no longer shared.</p>
        <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
          Go to Peblo Notes →
        </Link>
      </div>
    );
  }

  const latestAi = note.aiLogs[0];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header - only for logged out users */}
      {!session && (
        <header className="border-b border-white/5 bg-[#111118]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <Sparkles size={20} />
              <span>Peblo Notes</span>
            </div>
            <Link
              href="/signup"
              className="text-sm px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Create free account
            </Link>
          </div>
        </header>
      )}

      {/* Note Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Back to Explore button */}
        <Link href="/explore" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Explore
        </Link>
        {/* Tags */}
        {note.tagNames.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {note.tagNames.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-purple-600/15 text-purple-400 rounded-full text-sm border border-purple-500/20">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-4xl font-bold text-white mb-8 leading-tight">{note.title}</h1>

        {/* AI Summary Callout */}
        {latestAi?.summary && (
          <div className="mb-8 p-5 bg-purple-900/20 border border-purple-500/20 rounded-xl">
            <div className="flex items-center gap-2 text-purple-300 text-sm font-semibold mb-3">
              <Sparkles size={14} />
              AI Summary
            </div>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{latestAi.summary}</p>
          </div>
        )}

        {/* Note Content */}
        <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{note.content}</div>

        {/* Action Items */}
        {latestAi?.actionItems && latestAi.actionItems.length > 0 && (
          <div className="mt-10 p-5 bg-[#111118] border border-white/5 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Action Items</h3>
            <ul className="space-y-2">
              {latestAi.actionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                  <div className="mt-0.5 w-4 h-4 rounded border border-gray-600 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <footer className="max-w-3xl mx-auto px-6 py-8 border-t border-white/5 mt-12 text-center text-gray-500 text-sm">
        Shared with <Link href="/signup" className="text-purple-400 hover:underline">Peblo Notes</Link> — AI-Powered Workspace
      </footer>
    </div>
  );
}
