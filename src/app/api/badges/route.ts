import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

const VALID_USERS = ["elsa", "ivan"];
function kvKey(user: string) {
  return `quiz:badges:${user}`;
}
function statsKey(user: string) {
  return `quiz:stats:${user}`;
}

type Stats = {
  totalQuestions: number;
  totalOlympiad: number;
  perfectRounds: number;
  wrongPracticeCount: number;
  fiveStarDone: boolean;
  streakDays: number;
  lastPracticeDate: string;
  practiceDates: string[]; // ISO date strings (date only)
};

const defaultStats: Stats = {
  totalQuestions: 0,
  totalOlympiad: 0,
  perfectRounds: 0,
  wrongPracticeCount: 0,
  fiveStarDone: false,
  streakDays: 0,
  lastPracticeDate: "",
  practiceDates: [],
};

export type BadgeDef = {
  id: string;
  name: string;
  emoji: string;
  description: string;
};

export const ALL_BADGES: BadgeDef[] = [
  { id: "first", name: "初試身手", emoji: "🌟", description: "完成第一次練習" },
  { id: "ten", name: "十題達人", emoji: "🔥", description: "累計做完 10 題" },
  { id: "hundred", name: "百題勇士", emoji: "⚡", description: "累計做完 100 題" },
  { id: "perfect", name: "全對王", emoji: "👑", description: "單次測驗全部答對" },
  { id: "streak3", name: "連續三天", emoji: "📅", description: "連續 3 天練習" },
  { id: "streak7", name: "連續七天", emoji: "🏅", description: "連續 7 天練習" },
  { id: "olympiad", name: "奧數新星", emoji: "🧠", description: "完成 10 題奧數" },
  { id: "fivestar", name: "挑戰者", emoji: "💎", description: "做完一題 5 星題" },
  { id: "retry3", name: "不怕錯", emoji: "💪", description: "錯題再練完成 3 次" },
  { id: "fivehundred", name: "學霸", emoji: "🏆", description: "累計做完 500 題" },
];

function calcStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function checkBadges(stats: Stats): string[] {
  const earned: string[] = [];
  if (stats.totalQuestions >= 1) earned.push("first");
  if (stats.totalQuestions >= 10) earned.push("ten");
  if (stats.totalQuestions >= 100) earned.push("hundred");
  if (stats.totalQuestions >= 500) earned.push("fivehundred");
  if (stats.perfectRounds >= 1) earned.push("perfect");
  if (stats.streakDays >= 3) earned.push("streak3");
  if (stats.streakDays >= 7) earned.push("streak7");
  if (stats.totalOlympiad >= 10) earned.push("olympiad");
  if (stats.fiveStarDone) earned.push("fivestar");
  if (stats.wrongPracticeCount >= 3) earned.push("retry3");
  return earned;
}

export async function GET(request: NextRequest) {
  const user = request.nextUrl.searchParams.get("user");
  if (!user || !VALID_USERS.includes(user))
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });

  const badges: string[] = (await kv.get<string[]>(kvKey(user))) ?? [];
  const stats: Stats = (await kv.get<Stats>(statsKey(user))) ?? defaultStats;
  return NextResponse.json({ badges, stats, allBadges: ALL_BADGES });
}

// POST: update stats after a quiz round, return newly earned badges
export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    user,
    questionsAnswered,
    olympiadAnswered,
    isPerfect,
    isWrongPractice,
    hasFiveStar,
  } = body as {
    user: string;
    questionsAnswered: number;
    olympiadAnswered: number;
    isPerfect: boolean;
    isWrongPractice: boolean;
    hasFiveStar: boolean;
  };

  if (!user || !VALID_USERS.includes(user))
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });

  const stats: Stats = (await kv.get<Stats>(statsKey(user))) ?? { ...defaultStats };
  const oldBadges: string[] = (await kv.get<string[]>(kvKey(user))) ?? [];

  // Update stats
  stats.totalQuestions += questionsAnswered;
  stats.totalOlympiad += olympiadAnswered;
  if (isPerfect) stats.perfectRounds += 1;
  if (isWrongPractice) stats.wrongPracticeCount += 1;
  if (hasFiveStar) stats.fiveStarDone = true;

  // Update streak
  const today = new Date().toISOString().slice(0, 10);
  if (!stats.practiceDates.includes(today)) {
    stats.practiceDates.push(today);
  }
  // Keep last 30 days only
  stats.practiceDates = stats.practiceDates.slice(-30);
  stats.streakDays = calcStreak(stats.practiceDates);
  stats.lastPracticeDate = today;

  // Check badges
  const allEarned = checkBadges(stats);
  const oldSet = new Set(oldBadges);
  const newBadges = allEarned.filter((b) => !oldSet.has(b));

  // Save
  await kv.set(statsKey(user), stats);
  await kv.set(kvKey(user), allEarned);

  return NextResponse.json({
    stats,
    badges: allEarned,
    newBadges,
    allBadges: ALL_BADGES,
  });
}
