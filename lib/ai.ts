import { z } from "zod";

export const MAX_INPUT = 120000;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";

function getConfig() {
  const apiKey = process.env.GROQ_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("AI_NOT_CONFIGURED");
  }

  return {
    apiKey,
    model: process.env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL,
  };
}

function cleanText(text: string) {
  return text.replace(/\u0000/g, "").trim();
}

export const flashcardsSchema = z.object({
  cards: z.array(
    z.object({
      question: z.string().min(1),
      answer: z.string().min(1),
      explanation: z.string().optional().default(""),
    })
  ).min(1),
});

export const summarySchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  key_points: z.array(z.string()).default([]),
  terms: z.array(z.string()).default([]),
});

export const explanationSchema = z.object({
  simple: z.string().min(1),
  analogy: z.string().optional().default(""),
  example: z.string().optional().default(""),
  remember: z.string().optional().default(""),
});

const BASE = `
You are StudyGenius AI, an expert educational tutor.

Your job is to help students understand and remember their study material.

IMPORTANT RULES:
- Use the supplied material as the primary source.
- Never invent facts that are not supported by the material.
- Do not remove important scientific, mathematical, historical, or technical meaning merely to make something shorter.
- Use clear student-friendly language.
- Prefer active recall and understanding over copying sentences.
- Avoid duplicate information.
- If the material contains formulas, definitions, processes, comparisons, causes, effects, examples, or important facts, preserve them when relevant.
`;

function assertInput(text: string) {
  const cleaned = cleanText(text);

  if (cleaned.length < 3) {
    throw new Error("INPUT_TOO_SHORT");
  }

  if (cleaned.length > MAX_INPUT) {
    throw new Error("NOTE_TOO_LONG");
  }

  return cleaned;
}

export async function generateFlashcards(text: string, count: number) {
  const input = assertInput(text);

  if (!Number.isInteger(count) || count < 10 || count > 40) {
    throw new Error("INVALID_CARD_COUNT");
  }

  const instructions = `
${BASE}

Create exactly ${count} high-quality flashcards from the study material.

FLASHCARD QUALITY:
- Cover different parts of the material.
- Do not make several cards ask essentially the same question.
- Prioritize important concepts over tiny unimportant details.
- Include definitions, facts, processes, steps, causes/effects, comparisons, formulas and examples when present.
- Make questions stand alone.
- Keep answers concise but complete.
- Add a short explanation when it helps understanding.
- Do not create information absent from the source.

Return ONLY valid JSON:

{
  "cards": [
    {
      "question": "Question",
      "answer": "Answer",
      "explanation": "Short explanation"
    }
  ]
}
`;

  const result = await jsonRequest(instructions, input);
  const parsed = flashcardsSchema.parse(result);

  if (parsed.cards.length !== count) {
    throw new Error("AI_RETURNED_WRONG_CARD_COUNT");
  }

  return parsed;
}

export async function generateSummary(
  text: string,
  size: "quick" | "medium" | "detailed"
) {
  const input = assertInput(text);

  const lengthInstructions = {
    quick: `
Make this a QUICK revision summary.
Focus only on the most important ideas.
Keep it compact and easy to scan.
`,
    medium: `
Make this a MEDIUM study summary.
Cover the major concepts and important supporting details.
`,
    detailed: `
Make this a DETAILED study summary.
Cover important concepts, definitions, relationships, processes,
examples and supporting details needed for strong understanding.
`,
  };

  const instructions = `
${BASE}

${lengthInstructions[size]}

Organize the result for studying.

The summary should:
- explain ideas clearly
- remove repetition and filler
- preserve important relationships
- use simple language where possible
- identify important terms and meanings
- remain faithful to the supplied material

Return ONLY valid JSON:

{
  "title": "Useful study title",
  "summary": "Study-friendly summary",
  "key_points": [
    "Important point"
  ],
  "terms": [
    "term — simple meaning"
  ]
}
`;

  return summarySchema.parse(await jsonRequest(instructions, input));
}

export async function generateExplanation(text: string) {
  const input = assertInput(text);

  if (input.length > 4000) {
    throw new Error("EXPLANATION_TOO_LONG");
  }

  const instructions = `
${BASE}

Explain the student's topic to someone who knows almost nothing about it.

1. SIMPLE:
Explain using very easy words.

2. ANALOGY:
Give a familiar everyday comparison.

3. EXAMPLE:
Give one concrete example.

4. REMEMBER:
Give one short memorable sentence.

IMPORTANT:
- Stay accurate.
- Define necessary technical terms.
- Break complicated processes into small steps.
- Do not invent information.

Return ONLY valid JSON:

{
  "simple": "Very easy explanation",
  "analogy": "Familiar analogy",
  "example": "Concrete example",
  "remember": "One memorable sentence"
}
`;

  return explanationSchema.parse(await jsonRequest(instructions, input));
}

async function jsonRequest(instructions: string, input: string) {
  const { apiKey, model } = getConfig();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    let response: Response;

    try {
      response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: instructions,
            },
            {
              role: "user",
              content: input,
            },
          ],
          temperature: 0.2,
          response_format: {
            type: "json_object",
          },
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const body = await response.text();

    let data: any;

    try {
      data = JSON.parse(body);
    } catch {
      throw new Error("AI_INVALID_RESPONSE");
    }

    if (!response.ok) {
      throw new Error("AI_REQUEST_FAILED");
    }

    const outputText =
      data?.choices?.[0]?.message?.content?.trim() || "";

    if (!outputText) {
      throw new Error("AI_EMPTY_RESPONSE");
    }

    return JSON.parse(outputText);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("AI_INVALID_RESPONSE");
    }

    if (error instanceof Error) {
      if (
        error.message === "AI_NOT_CONFIGURED" ||
        error.message === "AI_EMPTY_RESPONSE" ||
        error.message === "AI_INVALID_RESPONSE" ||
        error.message === "AI_REQUEST_FAILED"
      ) {
        throw error;
      }
    }

    throw new Error("AI_REQUEST_FAILED");
  }
}