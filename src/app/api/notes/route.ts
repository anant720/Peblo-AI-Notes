import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all notes for the logged-in user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notes = await prisma.note.findMany({
      where: { userId: session.user.id, isArchived: false },
      orderBy: { updatedAt: "desc" },
      include: { tags: true },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("[NOTES_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

import { z } from "zod";

const createNoteSchema = z.object({
  title: z.string().max(200).optional().default("Untitled"),
  content: z.string().max(50000).optional().default(""),
  category: z.string().max(50).nullable().optional(),
});

// POST a new note
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const result = createNoteSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid payload data" }, { status: 400 });
    }

    const { title, content, category } = result.data;

    const note = await prisma.note.create({
      data: {
        userId: session.user.id,
        title: title || "Untitled",
        content: content || "",
        category: category || null,
      },
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error("[NOTES_POST]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
