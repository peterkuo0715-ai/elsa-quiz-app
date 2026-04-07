"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookX, Home, Play, Trash2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

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

function WrongBookContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = searchParams.get("user") || "elsa";
  const label = user === "ivan" ? "Ivan" : "Elsa";

  const [records, setRecords] = useState<WrongRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wrong-book?user=${user}`);
      if (res.ok) setRecords(await res.json());
    } catch { /* */ }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const handleClear = async () => {
    if (confirm(`確定清除 ${label} 的全部錯題？`)) {
      await fetch(`/api/wrong-book?user=${user}`, { method: "DELETE" });
      setRecords([]);
    }
  };

  // Group by category
  const grouped: Record<string, WrongRecord[]> = {};
  records.forEach((r) => {
    if (!grouped[r.category]) grouped[r.category] = [];
    grouped[r.category].push(r);
  });

  const handlePractice = (category: string) => {
    // Navigate to quiz with wrong-book mode
    router.push(`/quiz?user=${user}&wrongBook=true&category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 p-4 pb-20">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookX className="text-red-500" size={28} />
            <div>
              <h1 className="text-2xl font-bold text-red-800">{label} 的錯題本</h1>
              <p className="text-xs text-gray-400">共 {records.length} 題待複習</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm text-gray-500 shadow hover:text-gray-700"
          >
            <Home size={14} /> 首頁
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Sparkles className="animate-pulse text-red-300" size={32} />
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-lg font-semibold text-green-600">沒有錯題！太棒了！</p>
            <p className="mt-1 text-sm text-gray-400">繼續保持，答錯的題目會自動出現在這裡</p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat} className="rounded-2xl bg-white shadow overflow-hidden">
                <button
                  onClick={() => setExpandedCat(expandedCat === cat ? null : cat)}
                  className="flex w-full items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                      {cat}
                    </span>
                    <span className="text-sm text-gray-500">{items.length} 題</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePractice(cat); }}
                      className="flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
                    >
                      <Play size={12} /> 練習
                    </button>
                    {expandedCat === cat ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </button>

                {expandedCat === cat && (
                  <div className="border-t border-gray-100 p-4 space-y-3">
                    {items.map((r, i) => (
                      <div key={i} className="rounded-xl bg-gray-50 p-3">
                        <p className="text-sm font-medium text-gray-800 mb-1">{r.question}</p>
                        <p className="text-xs text-red-500">你的答案：{r.userAnswer}</p>
                        <p className="text-xs text-green-600">正確答案：{r.correctAnswer}</p>
                        <p className="mt-1 text-xs text-blue-600 bg-blue-50 rounded p-1.5">{r.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={handleClear}
              className="mx-auto flex items-center gap-2 text-xs text-gray-300 hover:text-red-400 mt-4"
            >
              <Trash2 size={12} /> 清除全部錯題
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WrongBookPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Sparkles className="animate-pulse text-red-300" size={40} /></div>}>
      <WrongBookContent />
    </Suspense>
  );
}
