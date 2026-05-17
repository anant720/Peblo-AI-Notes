import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface AiOutput {
  summary: string;
  actionItems: string[];
  suggestedTitle: string;
  tokensUsed?: number;
}

const COMBINED_PROMPT = (content: string) => `
You are a smart note-taking assistant. Analyze the following note and return a JSON object with these fields:
- "summary": A concise summary in 3 bullet points (as a single string, using "• " as bullet prefix).
- "actionItems": An array of actionable task strings extracted from the note. Return [] if none.
- "suggestedTitle": A short, professional, concise title for the note (max 6 words).

Respond with ONLY valid JSON, no markdown, no code blocks, no extra text.

Note Content:
"""
${content}
"""
`;

const SUMMARY_PROMPT = (content: string) => `
Summarize the following note in exactly 3 concise bullet points. Use "• " as the bullet prefix.
Respond with only the bullet points, no extra text.

Note:
"""
${content}
"""
`;

const ACTION_ITEMS_PROMPT = (content: string) => `
Extract all actionable tasks or to-dos from the following note.
Return a JSON array of strings. Example: ["Task 1", "Task 2"]. 
If there are no action items, return [].
Respond with ONLY valid JSON.

Note:
"""
${content}
"""
`;

const TITLE_PROMPT = (content: string) => `
Suggest one concise, professional title for the following note. Max 6 words.
Respond with only the title text, nothing else.

Note:
"""
${content}
"""
`;

export async function generateAllAiOutputs(content: string): Promise<AiOutput> {
  if (!content.trim()) {
    return { summary: "", actionItems: [], suggestedTitle: "Untitled" };
  }

  const result = await model.generateContent(COMBINED_PROMPT(content));
  const text = result.response.text().trim();
  const usage = result.response.usageMetadata;

  try {
    const parsed = JSON.parse(text);
    return {
      summary: parsed.summary ?? "",
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
      suggestedTitle: parsed.suggestedTitle ?? "Untitled",
      tokensUsed: usage?.totalTokenCount,
    };
  } catch {
    // Fallback if JSON parsing fails
    return { summary: text, actionItems: [], suggestedTitle: "Untitled" };
  }
}

export async function generateSummary(content: string): Promise<string> {
  if (!content.trim()) return "";
  const result = await model.generateContent(SUMMARY_PROMPT(content));
  return result.response.text().trim();
}

export async function generateActionItems(content: string): Promise<string[]> {
  if (!content.trim()) return [];
  const result = await model.generateContent(ACTION_ITEMS_PROMPT(content));
  const text = result.response.text().trim();
  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
}

export async function generateTitle(content: string): Promise<string> {
  if (!content.trim()) return "Untitled";
  const result = await model.generateContent(TITLE_PROMPT(content));
  return result.response.text().trim();
}
