import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  generateSummary,
  generateActionItems,
  generateTitle,
  generateAllAiOutputs,
} from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, noteId, content } = await req.json();

    if (!noteId || !content || !content.trim()) {
      return NextResponse.json(
        { error: "Note ID and content are required." },
        { status: 400 }
      );
    }

    // Verify ownership
    const note = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note || note.userId !== session.user.id) {
      return NextResponse.json({ error: "Note not found." }, { status: 404 });
    }

    let result: any = {};
    let tokensUsed = 0; // Gemini doesn't always reliably return tokens in the standard SDK wrapper without extra config, we'll estimate or pass it through if available.

    switch (action) {
      case "summary":
        const summary = await generateSummary(content);
        result = { summary };
        await prisma.aiLog.create({
          data: { noteId, summary },
        });
        break;

      case "actionItems":
        const actionItems = await generateActionItems(content);
        result = { actionItems };
        await prisma.aiLog.create({
          data: { noteId, actionItems },
        });
        break;

      case "title":
        const suggestedTitle = await generateTitle(content);
        result = { suggestedTitle };
        await prisma.aiLog.create({
          data: { noteId, suggestedTitle },
        });
        break;

      case "all":
        const allOutputs = await generateAllAiOutputs(content);
        result = allOutputs;
        await prisma.aiLog.create({
          data: {
            noteId,
            summary: allOutputs.summary,
            actionItems: allOutputs.actionItems,
            suggestedTitle: allOutputs.suggestedTitle,
            tokensUsed: allOutputs.tokensUsed || null,
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action." },
          { status: 400 }
        );
    }

    // Optional: Log activity for productivity insights
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        actionType: `AI_GENERATED_${action.toUpperCase()}`,
        metadata: { noteId },
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[AI_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to generate AI content." },
      { status: 500 }
    );
  }
}
