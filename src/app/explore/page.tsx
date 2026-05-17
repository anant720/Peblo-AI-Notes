import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Explore Public Notes — Peblo Notes",
  description: "Discover public notes shared by the Peblo Notes community.",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; q?: string }>;
}) {
  const { tag, q } = await searchParams;
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  const notes = await prisma.note.findMany({
    where: {
      isPublic: true,
      isArchived: false,
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
        ],
      }),
      ...(tag && { tagNames: { has: tag } }),
    },
    orderBy: { updatedAt: "desc" },
    take: 30,
    select: {
      id: true, title: true, content: true, tagNames: true,
      shareId: true, updatedAt: true,
      user: { select: { name: true } },
    },
  });

  // Collect all tags from public notes for the tag cloud
  const allPublicNotes = await prisma.note.findMany({
    where: { isPublic: true, isArchived: false },
    select: { tagNames: true },
  });
  const tagCounts: Record<string, number> = {};
  allPublicNotes.forEach((n) => n.tagNames.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <div className="min-h-screen bg-[#15121b] text-[#e7e0ed]">
      {/* Top Bar — only shown to logged-out visitors; logged-in users have the sidebar */}
      {!isLoggedIn && (
        <header className="border-b border-white/5 bg-[#1d1a23]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-[#d0bcff] font-bold text-lg">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              Peblo Notes
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-[#cbc3d7] hover:text-white transition-colors">Sign in</Link>
              <Link
                href="/signup"
                className="text-sm px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore Public Notes
          </h1>
          <p className="text-[#cbc3d7] text-lg max-w-xl mx-auto">
            Discover knowledge shared by the Peblo Notes community. AI-powered summaries included.
          </p>
        </div>

        {/* Search */}
        <form method="GET" className="flex gap-3 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#958ea0] text-[20px]">search</span>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search public notes..."
              className="w-full bg-[#211e27] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-[#958ea0] text-sm focus:border-[#8b5cf6]/60 focus:ring-2 focus:ring-[#8b5cf6]/10 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-[#d0bcff]/10 hover:bg-[#d0bcff]/20 text-[#d0bcff] border border-[#d0bcff]/20 rounded-xl text-sm font-medium transition-all"
          >
            Search
          </button>
        </form>

        {/* Tag Cloud */}
        {topTags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            <Link
              href="/explore"
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${!tag ? "bg-[#d0bcff]/20 text-[#d0bcff] border-[#d0bcff]/30" : "bg-[#211e27] text-[#958ea0] border-white/10 hover:border-[#d0bcff]/20"}`}
            >
              All
            </Link>
            {topTags.map(([t, count]) => (
              <Link
                key={t}
                href={`/explore?tag=${encodeURIComponent(t)}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${tag === t ? "bg-[#d0bcff]/20 text-[#d0bcff] border-[#d0bcff]/30" : "bg-[#211e27] text-[#958ea0] border-white/10 hover:border-[#d0bcff]/20 hover:text-[#d0bcff]"}`}
              >
                #{t} <span className="opacity-60">{count}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-[64px] text-[#494454] mb-4 block">article</span>
            <p className="text-[#cbc3d7] text-lg font-semibold">No public notes yet</p>
            <p className="text-[#958ea0] mt-1">Be the first to share a note with the world!</p>
            <Link
              href={isLoggedIn ? "/dashboard" : "/signup"}
              className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {isLoggedIn ? "Go to Dashboard" : "Create your workspace"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Link
                key={note.id}
                href={note.shareId ? `/shared/${note.shareId}` : "#"}
                className="flex flex-col bg-[#211e27] border border-white/5 rounded-2xl p-6 hover:bg-[#2c2832] hover:border-[#d0bcff]/20 hover:-translate-y-[2px] transition-all group"
              >
                {/* Tags */}
                {note.tagNames.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {note.tagNames.slice(0, 3).map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-[#d0bcff]/10 text-[#d0bcff] rounded text-[11px] border border-[#d0bcff]/20">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#d0bcff] transition-colors line-clamp-2">
                  {note.title}
                </h3>
                <p className="text-[#cbc3d7] text-sm line-clamp-3 mb-auto leading-relaxed">
                  {note.content || "No content..."}
                </p>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#d0bcff] to-[#ffb0cd] flex items-center justify-center text-[10px] font-bold text-[#3c0091]">
                      {note.user?.name?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <span className="text-xs text-[#958ea0]">{note.user?.name || "Anonymous"}</span>
                  </div>
                  <span className="text-xs text-[#494454]">
                    {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-10 mt-10 border-t border-white/5 text-center text-[#494454] text-sm">
        Built with{" "}
        <Link href={isLoggedIn ? "/dashboard" : "/signup"} className="text-[#d0bcff] hover:underline">Peblo Notes</Link>{" "}
        — AI-Powered Workspace
        {isLoggedIn && (
          <span className="ml-2">·{" "}
            <Link href="/dashboard" className="text-[#d0bcff] hover:underline">Back to your workspace</Link>
          </span>
        )}
      </footer>
    </div>
  );
}
