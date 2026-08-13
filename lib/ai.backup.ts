import OpenAI from "openai";
import { z } from "zod";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const MAX_INPUT = 120000;

function assertConfig() {
  if (!process.env.OPENAI_API_KEY) throw new Error("AI is not configured on the server.");
}

export const flashcardsSchema = z.object({
  cards: z.array(z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
    explanation: z.string().optional().default("")
  })).min(1)
});

export const summarySchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  key_points: z.array(z.string()).default([]),
  terms: z.array(z.string()).default([])
});

export const explanationSchema = z.object({
  simple: z.string().min(1),
  analogy: z.string().optional().default(""),
  example: z.string().optional().default(""),
  remember: z.string().optional().default("")
});

const base = `You are StudyGenius AI, a careful educational assistant. Use only information supported by the supplied material when the user provides material. Never invent facts. Be clear, accurate, concise, and useful for real studying.`;

export async function generateFlashcards(text: string, count: number) {
  assertConfig();
  if (text.length > MAX_INPUT) throw new Error("NOTE_TOO_LONG");

  const instructions = `${base}
Create exactly ${count} high-value flashcards.
Cover the source broadly instead of repeating one idea.
Prioritize definitions, important facts, processes, steps, cause/effect, comparisons, examples, formulas, and exam-relevant details present in the source.
Questions must stand alone. Answers must be concise but sufficient.
Return ONLY JSON matching:
{"cards":[{"question":"...","answer":"...","explanation":"..."}]}`;

  return flashcardsSchema.parse(await jsonRequest(instructions, text));
}

export async function generateSummary(text: string, size: "quick" | "medium" | "detailed") {
  assertConfig();
  if (text.length > MAX_INPUT) throw new Error("NOTE_TOO_LONG");

  const instructions = `${base}
Create a ${size} effective study summary.
Preserve essential concepts, definitions, relationships, processes, examples and factual details.
Remove repetition and filler.
Organize for revision and use student-friendly language.
Return ONLY JSON matching:
{"title":"...","summary":"...","key_points":["..."],"terms":["term — simple meaning"]}`;

  return summarySchema.parse(await jsonRequest(instructions, text));
}

export async function generateExplanation(text: string) {
  assertConfig();
  const instructions = `${base}
Explain the requested topic to a complete beginner.
Use extremely simple language without becoming childish or inaccurate.
Give four parts: plain explanation, familiar analogy, concrete example, and one memorable sentence.
Return ONLY JSON matching:
{"simple":"...","analogy":"...","example":"...","remember":"..."}`;

  return explanationSchema.parse(await jsonRequest(instructions, text));
}

async function jsonRequest(instructions: string, input: string) {
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5",
    instructions,
    input,
    text: { format: { type: "json_object" } },
    store: false
  });
  return JSON.parse(response.output_text);
}
