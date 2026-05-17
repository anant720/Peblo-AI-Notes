import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const tag = searchParams.get("tag") || "";

    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
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
      select: { id: true, title: true, content: true, tagNames: true, updatedAt: true },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("[SEARCH_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
