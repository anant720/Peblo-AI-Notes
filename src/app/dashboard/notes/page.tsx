import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CreateNoteCard } from "@/components/CreateNoteCard";

export const metadata = { title: "All Notes — Peblo Notes" };

export default async function AllNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const { tag } = await searchParams;

  const notes = await prisma.note.findMany({
    where: {
      userId: session.user.id,
      isArchived: false,
      ...(tag ? { tagNames: { has: tag } } : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  // Aggregate all tags for sidebar
  const allNotes = await prisma.note.findMany({
    where: { userId: session.user.id, isArchived: false },
    select: { tagNames: true },
  });
  const tagCounts: Record<string, number> = {};
  allNotes.forEach((n) => n.tagNames.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-[32px] text-on-surface-variant"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >description</span>
          <div>
            <h2 className="text-h1 font-bold text-on-surface leading-none">All Notes</h2>
            <p className="text-body-sm text-on-surface-variant mt-1">
              {notes.length} {tag ? `note${notes.length !== 1 ? "s" : ""} tagged #${tag}` : `total note${notes.length !== 1 ? "s" : ""} organised by recent`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/search"
            className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant/20 rounded-xl text-body-md text-on-surface-variant hover:text-on-surface hover:border-outline-variant/40 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            Search Notes
          </Link>
          <Link
            href="/dashboard/archived"
            className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant/20 rounded-xl text-body-md text-on-surface-variant hover:text-on-surface hover:border-outline-variant/40 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            Archived
          </Link>
        </div>
      </header>

      <div className="flex gap-8">
        {/* Tag sidebar */}
        {sortedTags.length > 0 && (
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="bg-surface-container rounded-xl border border-outline-variant/10 p-4 sticky top-6">
              <h3 className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-3">Filter by Tag</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/dashboard/notes"
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-body-md transition-all ${
                      !tag
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    <span>All Notes</span>
                    <span className="text-label-sm opacity-60">{allNotes.length}</span>
                  </Link>
                </li>
                {sortedTags.map(([t, count]) => (
                  <li key={t}>
                    <Link
                      href={`/dashboard/notes?tag=${encodeURIComponent(t)}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-body-md transition-all ${
                        tag === t
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      <span className="truncate">#{t}</span>
                      <span className="text-label-sm opacity-60 shrink-0 ml-2">{count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

        {/* Notes grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile tag chips */}
          {sortedTags.length > 0 && (
            <div className="lg:hidden flex gap-2 flex-wrap mb-6">
              <Link
                href="/dashboard/notes"
                className={`px-3 py-1.5 rounded-full text-label-sm border transition-all ${
                  !tag ? "bg-primary/10 text-primary border-primary/30" : "bg-surface-container text-on-surface-variant border-outline-variant/20"
                }`}
              >
                All
              </Link>
              {sortedTags.map(([t, count]) => (
                <Link
                  key={t}
                  href={`/dashboard/notes?tag=${encodeURIComponent(t)}`}
                  className={`px-3 py-1.5 rounded-full text-label-sm border transition-all ${
                    tag === t ? "bg-primary/10 text-primary border-primary/30" : "bg-surface-container text-on-surface-variant border-outline-variant/20"
                  }`}
                >
                  #{t} <span className="opacity-60">{count}</span>
                </Link>
              ))}
            </div>
          )}

          {notes.length === 0 && tag ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-container rounded-2xl border border-outline-variant/10">
              <span className="material-symbols-outlined text-[56px] text-on-surface-variant/30 mb-3">sell</span>
              <p className="text-h3 font-semibold text-on-surface-variant">No notes tagged #{tag}</p>
              <Link href="/dashboard/notes" className="mt-4 text-primary text-body-md hover:underline">
                Clear filter
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {notes.map((note) => (
                <Link
                  key={note.id}
                  href={`/dashboard/notes/${note.id}`}
                  className="flex flex-col bg-surface-container rounded-xl p-5 border border-outline-variant/10 hover:border-primary/40 hover:bg-surface-container-high hover:-translate-y-[2px] transition-all duration-200 group"
                >
                  {/* Tags row */}
                  {note.tagNames.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mb-3">
                      {note.tagNames.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[11px] font-medium border border-primary/20"
                        >
                          #{t}
                        </span>
                      ))}
                      {note.tagNames.length > 3 && (
                        <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded text-[11px]">
                          +{note.tagNames.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <h3 className="text-h3 font-semibold text-on-surface line-clamp-1 group-hover:text-primary transition-colors mb-2">
                    {note.title}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant line-clamp-3 mb-auto leading-relaxed">
                    {note.content || "No content..."}
                  </p>

                  <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                    <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">schedule</span>
                      {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {note.isPublic && (
                        <span className="material-symbols-outlined text-[14px] text-tertiary" title="Public">public</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}

              {/* Create New card */}
              <CreateNoteCard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
