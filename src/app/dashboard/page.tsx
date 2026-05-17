import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CreateNoteCard } from "@/components/CreateNoteCard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [recentNotes, totalNotes, aiUsageTotal, publicCount, weeklyNotes, allNotes] = await Promise.all([
    prisma.note.findMany({ where: { userId: session.user.id, isArchived: false }, orderBy: { updatedAt: "desc" }, take: 3 }),
    prisma.note.count({ where: { userId: session.user.id, isArchived: false } }),
    prisma.aiLog.count({ where: { note: { userId: session.user.id } } }),
    prisma.note.count({ where: { userId: session.user.id, isPublic: true } }),
    prisma.note.findMany({ where: { userId: session.user.id, updatedAt: { gte: sevenDaysAgo } }, select: { updatedAt: true } }),
    prisma.note.findMany({ where: { userId: session.user.id, isArchived: false }, select: { tagNames: true } }),
  ]);

  // Top tags
  const tagCounts: Record<string, number> = {};
  allNotes.forEach((n) => n.tagNames.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Weekly activity
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    return { label: ["S","M","T","W","T","F","S"][d.getDay()], dateStr: d.toDateString() };
  });
  const weeklyActivity = days.map(({ label, dateStr }) => ({
    label,
    count: weeklyNotes.filter((n) => new Date(n.updatedAt).toDateString() === dateStr).length,
  }));
  const maxActivity = Math.max(...weeklyActivity.map((d) => d.count), 1);

  const stats = [
    { label: "Total Notes", value: totalNotes, icon: "description" },
    { label: "AI Generations", value: aiUsageTotal, icon: "auto_awesome" },
    { label: "Public Notes", value: publicCount, icon: "public" },
    { label: "This Week", value: weeklyNotes.length, icon: "trending_up" },
  ];

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-10 flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h2 className="text-h1 font-bold text-on-surface">
          Good to see you, {session.user.name?.split(" ")[0]} 👋
        </h2>
        <p className="text-body-lg text-on-surface-variant">Here's what's happening with your workspace.</p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon }) => (
          <div
            key={label}
            className="bg-surface-container rounded-xl p-4 md:p-6 border border-outline-variant/10 relative overflow-hidden group hover:border-outline-variant/30 hover:-translate-y-[1px] transition-all duration-300"
          >
            <div className="flex flex-col gap-2 relative z-10">
              <span className="text-label-md text-on-surface-variant">{label}</span>
              <span className="text-display font-bold text-on-surface group-hover:text-primary transition-colors">{value}</span>
            </div>
            <span
              className="material-symbols-outlined absolute -top-4 -right-4 text-[80px] text-on-surface-variant/5 group-hover:text-primary/10 transition-colors duration-300 pointer-events-none"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {icon}
            </span>
          </div>
        ))}
      </section>

      {/* Activity + Tags + Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Weekly Activity */}
          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/10">
            <h3 className="text-h3 font-semibold text-on-surface mb-6">Weekly Activity</h3>
            <div className="h-40 flex items-end justify-between gap-2">
              {weeklyActivity.map(({ label, count }, i) => {
                const heightPct = maxActivity > 0 ? (count / maxActivity) * 100 : 0;
                const isToday = i === 6;
                return (
                  <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group">
                    <div
                      className={`w-full rounded-t-sm transition-colors ${
                        isToday ? "bg-primary/60 group-hover:bg-primary" : "bg-primary/20 group-hover:bg-primary/40"
                      }`}
                      style={{ height: `${Math.max(heightPct, count > 0 ? 8 : 2)}%` }}
                    />
                    <span className={`text-body-sm ${isToday ? "text-primary" : "text-on-surface-variant"}`}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Tags */}
          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/10">
            <h3 className="text-h3 font-semibold text-on-surface mb-4">Top Tags</h3>
            {topTags.length === 0 ? (
              <p className="text-body-sm text-on-surface-variant">No tags yet. Add tags in the note editor.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {topTags.map(([tag, count]) => (
                  <Link
                    key={tag}
                    href={`/dashboard/search?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-label-sm hover:bg-primary/20 transition-colors border border-primary/20"
                  >
                    #{tag}
                    <span className="bg-primary/20 px-1.5 py-0.5 rounded text-[10px] leading-none">{count}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column — Recent Notes */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-h3 font-semibold text-on-surface">Recently Edited</h3>
            <Link href="/dashboard/notes" className="text-primary text-label-md hover:underline">View All Notes</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentNotes.map((note) => (
              <Link
                key={note.id}
                href={`/dashboard/notes/${note.id}`}
                className="block bg-surface-container rounded-xl p-5 border border-outline-variant/10 hover:border-primary/50 hover:bg-surface-container-high hover:-translate-y-[1px] transition-all duration-200 group"
              >
                <h4 className="text-h3 font-medium text-on-surface line-clamp-1 group-hover:text-primary transition-colors mb-2">
                  {note.title}
                </h4>
                <p className="text-body-sm text-on-surface-variant line-clamp-3 h-[48px]">
                  {note.content || "No content..."}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/10">
                  <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                  </span>
                </div>
              </Link>
            ))}
            {/* Create New Note CTA */}
            <div className="min-h-[180px]">
              <CreateNoteCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
