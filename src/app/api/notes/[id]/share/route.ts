import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const newIsPublic = !existing.isPublic;
    const shareId = existing.shareId || require("uuid").v4();

    const note = await prisma.note.update({
      where: { id },
      data: { isPublic: newIsPublic, shareId },
    });
    return NextResponse.json({ note });
  } catch (error) {
    console.error("[SHARE_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
