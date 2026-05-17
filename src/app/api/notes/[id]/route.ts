import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Next.js 16+ requires params to be awaited
type Context = { params: Promise<{ id: string }> };

import { z } from "zod";

const updateNoteSchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string().max(50000).optional(),
  isArchived: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  category: z.string().max(50).nullable().optional(),
  tagNames: z.array(z.string().max(30)).max(20).optional(),
});

export async function PATCH(req: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const json = await req.json();
    const result = updateNoteSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid payload data" }, { status: 400 });
    }

    const { title, content, isArchived, isPublic, category, tagNames } = result.data;

    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const note = await prisma.note.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(isArchived !== undefined && { isArchived }),
        ...(isPublic !== undefined && { isPublic }),
        ...(category !== undefined && { category }),
        ...(tagNames !== undefined && { tagNames }),
      },
    });
    return NextResponse.json({ note });
  } catch (error) {
    console.error("[NOTE_PATCH]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.note.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[NOTE_DELETE]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
