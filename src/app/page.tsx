"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Sparkles,
  BarChart3,
  BookX,
  Target,
  Flame,
} from "lucide-react";

type BadgeDef = { id: string; name: string; emoji: string; description: string };
type UserData = {
  badges: string[];
  stats: {
    totalQuestions: number;
    streakDays: number;
    lastPracticeDate: string;
    practiceDates: string[];
  };
  allBadges: BadgeDef[];
  wrongCount: number;
  todayDone: number;
};

const users = [
  {
    name: "Elsa",
    slug: "elsa",
    emoji: "👸",
    color: "from-purple-400 to-pink-400",
    bgHover: "hover:bg-purple-50",
    border: "border-purple-200",
    textColor: "text-purple-700",
  },
  {
    name: "Ivan",
    slug: "ivan",
    emoji: "🦸‍♂️",
    color: "from-teal-400 to-cyan-400",
    bgHover: "hover:bg-teal-50",
    border: "border-teal-200",
    textColor: "text-teal-700",
  },
];

const DAILY_TARGET = 10;

export default function HomePage() {
  const [userData, setUserData] = useState<Record<string, UserData>>({});

  useEffect(() => {
    async function load() {
      const data: Record<string, UserData> = {};
      for (const u of users) {
        try {
          const [badgeRes, wrongRes, histRes] = await Promise.all([
            fetch(`/api/badges?user=${u.slug}`),
            fetch(`/api/wrong-book?user=${u.slug}`),
            fetch(`/api/history?user=${u.slug}`),
          ]);
          const badgeData = badgeRes.ok ? await badgeRes.json() : { badges: [], stats: { totalQuestions: 0, streakDays: 0, lastPracticeDate: "", practiceDates: [] }, allBadges: [] };
          const wrongData = wrongRes.ok ? await wrongRes.json() : [];
          const histData = histRes.ok ? await histRes.json() : [];

          const today = new Date().toISOString().slice(0, 10);
          const todayDone = histData
            .filter((r: { date: string; totalQuestions: number }) => r.date.startsWith(today))
            .reduce((s: number, r: { totalQuestions: number }) => s + r.totalQuestions, 0);

          data[u.slug] = {
            ...badgeData,
            wrongCount: wrongData.length,
            todayDone,
          };
        } catch {
          data[u.slug] = {
            badges: [],
            stats: { totalQuestions: 0, streakDays: 0, lastPracticeDate: "", practiceDates: [] },
            allBadges: [],
            wrongCount: 0,
            todayDone: 0,
          };
        }
      }
      setUserData(data);
    }
    load();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50 p-6 pt-10">
      <div className="w-full max-w-sm space-y-5">
        {/* Title */}
        <div className="text-center">
          <Sparkles className="mx-auto mb-3 text-purple-500" size={48} />
          <h1 className="text-3xl font-bold text-purple-700">刷題樂園</h1>
          <p className="mt-2 text-gray-500">選擇你的身分開始吧！</p>
        </div>

        {/* User sections */}
        {users.map((u) => {
          const d = userData[u.slug];
          const todayDone = d?.todayDone ?? 0;
          const dailyProgress = Math.min(todayDone / DAILY_TARGET, 1);
          const dailyComplete = todayDone >= DAILY_TARGET;
          const streak = d?.stats?.streakDays ?? 0;
          const wrongCount = d?.wrongCount ?? 0;
          const badges = d?.badges ?? [];
          const allBadges = d?.allBadges ?? [];

          return (
            <div key={u.slug} className="space-y-2">
              {/* Main card - start quiz */}
              <Link
                href={`/quiz?user=${u.slug}`}
                className={`flex items-center gap-4 rounded-3xl border-2 ${u.border} bg-white p-5 shadow-lg transition hover:scale-[1.02] hover:shadow-xl ${u.bgHover}`}
              >
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${u.color} text-3xl shadow-md`}>
                  {u.emoji}
                </div>
                <div className="flex-1">
                  <p className={`text-2xl font-bold ${u.textColor}`}>{u.name}</p>
                  <p className="text-sm text-gray-400">點我開始練習</p>
                </div>
                {streak > 0 && (
                  <div className="flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1">
                    <Flame size={14} className="text-orange-500" />
                    <span className="text-xs font-bold text-orange-600">{streak}天</span>
                  </div>
                )}
              </Link>

              {/* Daily task bar */}
              {d && (
                <div className="rounded-2xl bg-white px-4 py-3 shadow">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Target size={12} className={dailyComplete ? "text-green-500" : "text-gray-400"} />
                      <span className={dailyComplete ? "font-bold text-green-600" : "text-gray-500"}>
                        {dailyComplete ? "今日任務完成！" : `今日任務：${todayDone}/${DAILY_TARGET} 題`}
                      </span>
                    </div>
                    {wrongCount > 0 && (
                      <Link
                        href={`/wrong-book?user=${u.slug}`}
                        className="flex items-center gap-1 text-red-400 hover:text-red-600"
                      >
                        <BookX size={12} />
                        <span>錯題 {wrongCount}</span>
                      </Link>
                    )}
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${dailyComplete ? "bg-green-400" : "bg-purple-400"}`}
                      style={{ width: `${dailyProgress * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Badges */}
              {allBadges.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-1">
                  {allBadges.map((b) => {
                    const earned = badges.includes(b.id);
                    return (
                      <span
                        key={b.id}
                        title={`${b.name}: ${b.description}`}
                        className={`text-lg transition ${earned ? "" : "grayscale opacity-30"}`}
                      >
                        {b.emoji}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Dad dashboard */}
        <Link
          href="/dashboard"
          className="flex items-center gap-4 rounded-3xl border-2 border-amber-200 bg-white p-5 shadow-lg transition hover:scale-[1.02] hover:shadow-xl hover:bg-amber-50"
        >
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 shadow-md">
            <BarChart3 className="text-white" size={32} />
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-700">爸爸看成績</p>
            <p className="text-sm text-gray-400">查看練習統計</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
