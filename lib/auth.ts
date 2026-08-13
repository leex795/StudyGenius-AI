import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "./db";

const COOKIE = "studygenuis_session";
const DAYS = 30;

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is missing");
  return s;
}

function hashToken(token: string) {
  return crypto.createHmac("sha256", secret()).update(token).digest("hex");
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const raw = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + DAYS * 24 * 60 * 60 * 1000);

  await db.session.create({ data: { userId, tokenHash, expiresAt } });
  const store = await cookies();
  store.set(COOKIE, raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt
  });
}

export async function clearSession() {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (raw) {
    await db.session.deleteMany({ where: { tokenHash: hashToken(raw) } });
  }
  store.delete(COOKIE);
}

export async function getCurrentUser() {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;

  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(raw) },
    include: { user: true }
  });
  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await db.session.delete({ where: { id: session.id } });
    store.delete(COOKIE);
    return null;
  }
  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
