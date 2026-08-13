import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("StudyGenius project smoke checks", () => {
  const root = process.cwd();
  it("contains core screens and APIs", () => {
    for (const file of [
      "app/app/page.tsx",
      "app/app/flashcards/page.tsx",
      "app/app/summary/page.tsx",
      "app/app/explain/page.tsx",
      "app/api/study/flashcards/route.ts",
      "app/api/study/summary/route.ts",
      "app/api/study/explain/route.ts",
      "prisma/schema.prisma"
    ]) {
      expect(fs.existsSync(path.join(root, file))).toBe(true);
    }
  });

  it("does not contain a browser-exposed OpenAI key literal", () => {
    const html = fs.readFileSync(path.join(root, "components/StudyTool.tsx"), "utf8");
    expect(html).not.toContain("sk-proj-");
    expect(html).not.toContain("OPENAI_API_KEY=");
  });
});
