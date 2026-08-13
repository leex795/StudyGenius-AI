import { db } from "./db";
import type { StudyType } from "@prisma/client";

const DAILY_CHARS = 250000;

export async function enforceDailyLimit(userId: string, type: StudyType, chars: number) {
  const since = new Date();
  since.setHours(0, 0, 0, 0);

  const used = await db.usageEvent.aggregate({
    _sum: { chars: true },
    where: { userId, createdAt: { gte: since } }
  });

  if ((used._sum.chars ?? 0) + chars > DAILY_CHARS) {
    throw new Error("DAILY_LIMIT");
  }

  await db.usageEvent.create({ data: { userId, type, chars } });
}
