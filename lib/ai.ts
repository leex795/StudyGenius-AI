import OpenAI from "openai";
import { z } from "zod";

export const MAX_INPUT = 120000;

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("AI_NOT_CONFIGURED");
  }

  return new OpenAI({
    apiKey,
    timeout: 60000,
    maxRetries: 2,
  });
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
- Make questions stand alone so a student can understand them without seeing the original notes.
- Keep answers concise but complete.
- Add a short explanation when it helps understanding.
- Do not create information that is absent from the source.

Return ONLY valid JSON in exactly this shape:

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
It should be useful for normal revision without becoming unnecessarily long.
`,
    detailed: `
Make this a DETAILED study summary.
Cover the important concepts, definitions, relationships, processes,
examples and supporting details needed for strong understanding.
Do not simply copy the source.
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
- identify important terms and their meanings
- remain faithful to the supplied material

Return ONLY valid JSON in exactly this shape:

{
  "title": "Useful study title",
  "summary": "Study-friendly summary",
  "key_points": [
    "Important point",
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

Use the following teaching method:

1. SIMPLE:
Explain the idea using very easy words.
Imagine you are teaching a young beginner.
Do NOT use unnecessary jargon.

2. ANALOGY:
Give a familiar everyday comparison that makes the idea easier to picture.
Make sure the analogy does not introduce an incorrect scientific or factual idea.

3. EXAMPLE:
Give one concrete example.

4. REMEMBER:
Give one short memorable sentence the student can use to recall the main idea.

IMPORTANT:
- "Simple" must still be accurate.
- If a technical term is necessary, define it immediately.
- Break complicated processes into small steps.
- Do not talk down to the student.
- Do not invent information.

Return ONLY valid JSON in exactly this shape:

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
  const client = getClient();

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      instructions,
      input,
      text: {
        format: {
          type: "json_object",
        },
      },
      store: false,
    });

    if (!response.output_text?.trim()) {
      throw new Error("AI_EMPTY_RESPONSE");
    }

    return JSON.parse(response.output_text);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("AI_INVALID_RESPONSE");
    }

    if (error instanceof Error) {
      if (
        error.message === "AI_NOT_CONFIGURED" ||
        error.message === "AI_EMPTY_RESPONSE"
      ) {
        throw error;
      }
    }

    throw new Error("AI_REQUEST_FAILED");
  }
}
