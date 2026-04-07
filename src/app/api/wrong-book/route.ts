import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

type WrongRecord = {
  questionId: string;
  category: string;
  difficulty: string;
  date: string;
  userAnswer: string;
  question: string;
  correctAnswer: string;
  explanation: string;
};

const VALID_USERS = ["elsa", "ivan"];
function kvKey(user: string) {
  return `quiz:wrong:${user}`;
}

export async function GET(request: NextRequest) {
  const user = request.nextUrl.searchParams.get("user");
  if (!user || !VALID_USERS.includes(user))
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  const records: WrongRecord[] = (await kv.get<WrongRecord[]>(kvKey(user))) ?? [];
  return NextResponse.json(records);
}

// POST: add wrong answers / remove mastered
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { user, add, remove } = body as {
    user: string;
    add?: WrongRecord[];
    remove?: string[]; // questionIds to remove (mastered)
  };
  if (!user || !VALID_USERS.includes(user))
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });

  let records: WrongRecord[] = (await kv.get<WrongRecord[]>(kvKey(user))) ?? [];

  // Remove mastered questions
  if (remove && remove.length > 0) {
    const removeSet = new Set(remove);
    records = records.filter((r) => !removeSet.has(r.questionId));
  }

  // Add new wrong answers (avoid duplicates by questionId)
  if (add && add.length > 0) {
    const existingIds = new Set(records.map((r) => r.questionId));
    for (const item of add) {
      if (!existingIds.has(item.questionId)) {
        records.push(item);
        existingIds.add(item.questionId);
      }
    }
  }

  // Keep max 200
  const trimmed = records.slice(-200);
  await kv.set(kvKey(user), trimmed);
  return NextResponse.json({ ok: true, count: trimmed.length });
}

export async function DELETE(request: NextRequest) {
  const user = request.nextUrl.searchParams.get("user");
  if (!user || !VALID_USERS.includes(user))
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  await kv.del(kvKey(user));
  return NextResponse.json({ ok: true });
}
