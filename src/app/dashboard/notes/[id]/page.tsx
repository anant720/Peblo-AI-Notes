import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NoteEditor } from "@/components/NoteEditor";

// Next.js 16+ requires params to be awaited
export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const note = await prisma.note.findUnique({ where: { id } });

  if (!note || note.userId !== session.user.id || note.isArchived) {
    redirect("/dashboard/notes");
  }

  return (
    <NoteEditor
      initialNote={{
        id: note.id,
        title: note.title,
        content: note.content,
        category: note.category,
        tagNames: note.tagNames,
        isPublic: note.isPublic,
        shareId: note.shareId,
        isArchived: note.isArchived,
        updatedAt: note.updatedAt.toISOString(),
      }}
    />
  );
}
