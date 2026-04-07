"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BarChart3,
  Home,
  BookOpen,
  Target,
  TrendingUp,
  Calendar,
  Trash2,
  RefreshCw,
  Loader2,
  Flame,
  Database,
} from "lucide-react";

type BadgeDef = { id: string; name: string; emoji: string; description: string };

type SessionRecord = {
  date: string;
  user: string;
  categories: string[];
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
};

const kids = [
  { slug: "elsa", label: "Elsa", emoji: "👸", color: "purple" },
  { slug: "ivan", label: "Ivan", emoji: "🦸‍♂️", color: "teal" },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function DashboardPage() {
  const [histories, setHistories] = useState<Record<string, SessionRecord[]>>({});
  const [badgeData, setBadgeData] = useState<Record<string, { badges: string[]; stats: { streakDays: number; totalQuestions: number }; allBadges: BadgeDef[] }>>({});
  const [activeTab, setActiveTab] = useState("elsa");
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const h: Record<string, SessionRecord[]> = {};
    const b: Record<string, { badges: string[]; stats: { streakDays: number; totalQuestions: number }; allBadges: BadgeDef[] }> = {};
    for (const kid of kids) {
      try {
        const [histRes, badgeRes] = await Promise.all([
          fetch(`/api/history?user=${kid.slug}`),
          fetch(`/api/badges?user=${kid.slug}`),
        ]);
        h[kid.slug] = histRes.ok ? await histRes.json() : [];
        b[kid.slug] = badgeRes.ok ? await badgeRes.json() : { badges: [], stats: { streakDays: 0, totalQuestions: 0 }, allBadges: [] };
      } catch {
        h[kid.slug] = [];
        b[kid.slug] = { badges: [], stats: { streakDays: 0, totalQuestions: 0 }, allBadges: [] };
      }
    }
    setHistories(h);
    setBadgeData(b);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleClear = async (user: string) => {
    const label = user === "elsa" ? "Elsa" : "Ivan";
    if (confirm(`確定要清除 ${label} 的所有紀錄嗎？`)) {
      await fetch(`/api/history?user=${user}`, { method: "DELETE" });
      setHistories((prev) => ({ ...prev, [user]: [] }));
    }
  };

  const activeKid = kids.find((k) => k.slug === activeTab)!;
  const records = histories[activeTab] ?? [];
  const totalQuestions = records.reduce((s, r) => s + r.totalQuestions, 0);
  const totalCorrect = records.reduce((s, r) => s + r.correctCount, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const catStats: Record<string, { total: number; correct: number }> = {};
  for (const r of records) {
    for (const cat of r.categories) {
      if (!catStats[cat]) catStats[cat] = { total: 0, correct: 0 };
      const perCat = r.totalQuestions / r.categories.length;
      const correctPerCat = r.correctCount / r.categories.length;
      catStats[cat].total += perCat;
      catStats[cat].correct += correctPerCat;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 pb-20">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-amber-600" size={28} />
            <h1 className="text-2xl font-bold text-amber-800">成績總覽</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm text-gray-500 shadow hover:text-blue-600"
            >
              <Database size={14} />
              匯入題目
            </Link>
            <button
              onClick={fetchAll}
              disabled={loading}
              className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm text-gray-500 shadow hover:text-gray-700"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            </button>
            <Link
              href="/"
              className="flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm text-gray-500 shadow hover:text-gray-700"
            >
              <Home size={14} />
              首頁
            </Link>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mb-6 flex gap-2">
          {kids.map((kid) => (
            <button
              key={kid.slug}
              onClick={() => setActiveTab(kid.slug)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-base font-semibold transition ${
                activeTab === kid.slug
                  ? kid.color === "purple"
                    ? "bg-purple-500 text-white shadow-lg"
                    : "bg-teal-500 text-white shadow-lg"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{kid.emoji}</span>
              {kid.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-3xl bg-white p-12 shadow">
            <Loader2 size={32} className="animate-spin text-amber-400" />
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow">
            <p className="text-lg text-gray-400">{activeKid.label} 還沒有練習紀錄</p>
            <p className="mt-2 text-sm text-gray-300">開始刷題後成績就會出現在這裡</p>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white p-4 text-center shadow">
                <BookOpen size={20} className="mx-auto mb-1 text-blue-400" />
                <p className="text-2xl font-bold text-gray-800">{records.length}</p>
                <p className="text-xs text-gray-400">練習次數</p>
              </div>
              <div className="rounded-2xl bg-white p-4 text-center shadow">
                <Target size={20} className="mx-auto mb-1 text-green-400" />
                <p className="text-2xl font-bold text-gray-800">{totalQuestions}</p>
                <p className="text-xs text-gray-400">總題數</p>
              </div>
              <div className="rounded-2xl bg-white p-4 text-center shadow">
                <TrendingUp size={20} className="mx-auto mb-1 text-amber-400" />
                <p className={`text-2xl font-bold ${overallAccuracy >= 70 ? "text-green-600" : overallAccuracy >= 40 ? "text-amber-600" : "text-red-500"}`}>
                  {overallAccuracy}%
                </p>
                <p className="text-xs text-gray-400">總正確率</p>
              </div>
            </div>

            {/* Streak + Badges */}
            {badgeData[activeTab] && (
              <div className="mb-6 rounded-3xl bg-white p-5 shadow">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700">成就徽章</h3>
                  {(badgeData[activeTab]?.stats?.streakDays ?? 0) > 0 && (
                    <div className="flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1">
                      <Flame size={14} className="text-orange-500" />
                      <span className="text-xs font-bold text-orange-600">
                        連續 {badgeData[activeTab].stats.streakDays} 天
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {(badgeData[activeTab]?.allBadges ?? []).map((b) => {
                    const earned = (badgeData[activeTab]?.badges ?? []).includes(b.id);
                    return (
                      <div
                        key={b.id}
                        className={`flex flex-col items-center gap-0.5 ${earned ? "" : "opacity-25 grayscale"}`}
                        title={b.description}
                      >
                        <span className="text-2xl">{b.emoji}</span>
                        <span className="text-[10px] text-gray-500">{b.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category breakdown */}
            {Object.keys(catStats).length > 0 && (
              <div className="mb-6 rounded-3xl bg-white p-5 shadow">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">各單元表現</h3>
                <div className="space-y-2">
                  {Object.entries(catStats)
                    .sort((a, b) => {
                      const accA = a[1].total > 0 ? a[1].correct / a[1].total : 0;
                      const accB = b[1].total > 0 ? b[1].correct / b[1].total : 0;
                      return accA - accB;
                    })
                    .map(([cat, stat]) => {
                      const acc = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                      return (
                        <div key={cat} className="flex items-center gap-3">
                          <span className="w-24 shrink-0 truncate text-xs text-gray-600">{cat}</span>
                          <div className="flex-1">
                            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  acc >= 70 ? "bg-green-400" : acc >= 40 ? "bg-amber-400" : "bg-red-400"
                                }`}
                                style={{ width: `${acc}%` }}
                              />
                            </div>
                          </div>
                          <span className={`w-10 text-right text-xs font-semibold ${acc >= 70 ? "text-green-600" : acc >= 40 ? "text-amber-600" : "text-red-500"}`}>
                            {acc}%
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Recent sessions */}
            <div className="mb-6 rounded-3xl bg-white p-5 shadow">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">最近練習紀錄</h3>
              <div className="space-y-2">
                {[...records]
                  .reverse()
                  .slice(0, 15)
                  .map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-gray-300" />
                        <span className="text-xs text-gray-400">{formatDate(r.date)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">
                          {r.categories.slice(0, 2).join("、")}
                          {r.categories.length > 2 && `...等`}
                        </span>
                        <span className="text-xs text-gray-600">
                          {r.correctCount}/{r.totalQuestions}
                        </span>
                        <span
                          className={`min-w-[3rem] rounded-full px-2 py-0.5 text-center text-xs font-bold ${
                            r.accuracy >= 70
                              ? "bg-green-100 text-green-700"
                              : r.accuracy >= 40
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {r.accuracy}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Clear button */}
            <button
              onClick={() => handleClear(activeTab)}
              className="mx-auto flex items-center gap-2 text-xs text-gray-300 hover:text-red-400"
            >
              <Trash2 size={12} />
              清除 {activeKid.label} 的紀錄
            </button>
          </>
        )}
      </div>
    </div>
  );
}
