"use client";

import Link from "next/link";
import { Sparkles, UserRound, BarChart3 } from "lucide-react";

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

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50 p-6">
      <div className="w-full max-w-sm space-y-6">
        {/* Title */}
        <div className="text-center">
          <Sparkles className="mx-auto mb-3 text-purple-500" size={48} />
          <h1 className="text-3xl font-bold text-purple-700">刷題樂園</h1>
          <p className="mt-2 text-gray-500">選擇你的身分開始吧！</p>
        </div>

        {/* User cards */}
        {users.map((u) => (
          <Link
            key={u.slug}
            href={`/quiz?user=${u.slug}`}
            className={`flex items-center gap-4 rounded-3xl border-2 ${u.border} bg-white p-5 shadow-lg transition hover:scale-[1.02] hover:shadow-xl ${u.bgHover}`}
          >
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${u.color} text-3xl shadow-md`}
            >
              {u.emoji}
            </div>
            <div>
              <p className={`text-2xl font-bold ${u.textColor}`}>{u.name}</p>
              <p className="text-sm text-gray-400">點我開始練習</p>
            </div>
          </Link>
        ))}

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
