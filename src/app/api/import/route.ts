import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

type Question = {
  id: string;
  subject: string;
  category: string;
  difficulty: string;
  question: string;
  options: string[];
  answer: string;
  hint: string;
  explanation: string;
};

const KV_KEY = "quiz:imported-questions";

// GET: return all imported questions
export async function GET() {
  const questions: Question[] = (await kv.get<Question[]>(KV_KEY)) ?? [];
  return NextResponse.json(questions);
}

// POST: add new questions
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { questions } = body as { questions: Question[] };

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return NextResponse.json({ error: "No questions provided" }, { status: 400 });
  }

  // Validate
  const errors: string[] = [];
  questions.forEach((q, i) => {
    if (!q.id) errors.push(`#${i + 1}: 缺少 id`);
    if (!q.subject) errors.push(`#${i + 1}: 缺少 subject`);
    if (!q.question) errors.push(`#${i + 1}: 缺少 question`);
    if (!q.options || q.options.length !== 4) errors.push(`#${i + 1}: options 必須有 4 個選項`);
    if (q.options && !q.options.includes(q.answer)) errors.push(`#${i + 1}: answer 不在 options 中`);
  });

  if (errors.length > 0) {
    return NextResponse.json({ error: "格式錯誤", details: errors }, { status: 400 });
  }

  const existing: Question[] = (await kv.get<Question[]>(KV_KEY)) ?? [];
  const existingIds = new Set(existing.map((q) => q.id));

  let added = 0;
  let skipped = 0;
  for (const q of questions) {
    if (existingIds.has(q.id)) {
      skipped++;
    } else {
      existing.push(q);
      existingIds.add(q.id);
      added++;
    }
  }

  await kv.set(KV_KEY, existing);
  return NextResponse.json({ ok: true, added, skipped, total: existing.length });
}

// DELETE: clear all imported questions
export async function DELETE() {
  await kv.del(KV_KEY);
  return NextResponse.json({ ok: true });
}
