import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

type SessionRecord = {
  date: string;
  user: string;
  categories: string[];
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
};

const VALID_USERS = ["elsa", "ivan"];

function kvKey(user: string) {
  return `quiz:history:${user}`;
}

export async function GET(request: NextRequest) {
  const user = request.nextUrl.searchParams.get("user");
  if (!user || !VALID_USERS.includes(user)) {
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  }

  const records: SessionRecord[] = (await kv.get<SessionRecord[]>(kvKey(user))) ?? [];
  return NextResponse.json(records);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { user, categories, totalQuestions, correctCount, accuracy } = body;

  if (!user || !VALID_USERS.includes(user)) {
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  }

  const record: SessionRecord = {
    date: new Date().toISOString(),
    user,
    categories: categories ?? [],
    totalQuestions: totalQuestions ?? 0,
    correctCount: correctCount ?? 0,
    accuracy: accuracy ?? 0,
  };

  const existing: SessionRecord[] = (await kv.get<SessionRecord[]>(kvKey(user))) ?? [];
  existing.push(record);

  // Keep last 100 records max
  const trimmed = existing.slice(-100);
  await kv.set(kvKey(user), trimmed);

  return NextResponse.json({ ok: true, record });
}

export async function DELETE(request: NextRequest) {
  const user = request.nextUrl.searchParams.get("user");
  if (!user || !VALID_USERS.includes(user)) {
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  }

  await kv.del(kvKey(user));
  return NextResponse.json({ ok: true });
}
