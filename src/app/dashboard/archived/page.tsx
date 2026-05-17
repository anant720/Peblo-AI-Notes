import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export const metadata = { title: "Archived Notes — Peblo Notes" };

async function restoreNote(id: string) {
  "use server";
  const { prisma: p } = await import("@/lib/prisma");
  await p.note.update({ where: { id }, data: { isArchived: false } });
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/dashboard/archived");
}

async function deleteNote(id: string) {
  "use server";
  const { prisma: p } = await import("@/lib/prisma");
  await p.note.delete({ where: { id } });
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/dashboard/archived");
}

export default async function ArchivedPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id, isArchived: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-10">
      <header className="mb-8">
        <h2 className="text-h1 font-bold text-on-surface flex items-center gap-3">
          <span className="material-symbols-outlined text-[32px] text-on-surface-variant">inventory_2</span>
          Archived Notes
        </h2>
        <p className="text-body-lg text-on-surface-variant mt-1">
          {notes.length} archived {notes.length === 1 ? "note" : "notes"} — restore or permanently delete.
        </p>
      </header>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-surface-container rounded-2xl border border-outline-variant/10">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30 mb-4">inventory_2</span>
          <p className="text-h3 font-semibold text-on-surface-variant">No archived notes</p>
          <p className="text-body-md text-on-surface-variant/60 mt-1">Archive a note from the editor to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {notes.map((note) => (
            <div
              key={note.id}
              className="flex flex-col bg-surface-container rounded-xl p-5 border border-outline-variant/10 opacity-75 hover:opacity-100 transition-all group"
            >
              <h3 className="text-h3 font-medium text-on-surface line-clamp-1 mb-2">{note.title}</h3>
              <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-auto">{note.content || "No content..."}</p>
              <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center justify-between gap-2">
                <span className="text-label-sm text-on-surface-variant">
                  {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                </span>
                <div className="flex items-center gap-2">
                  <form action={restoreNote.bind(null, note.id)}>
                    <button
                      type="submit"
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary-fixed border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/10 transition-all"
                    >
                      <span className="material-symbols-outlined text-[14px]">restore</span>
                      Restore
                    </button>
                  </form>
                  <form action={deleteNote.bind(null, note.id)}>
                    <button
                      type="submit"
                      className="flex items-center gap-1 text-xs text-error hover:text-on-error border border-error/30 rounded-lg px-3 py-1.5 hover:bg-error-container transition-all"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
