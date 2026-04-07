"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Upload,
  Home,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
  Database,
  Copy,
} from "lucide-react";

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

const TEMPLATE = `[
  {
    "id": "SS-XX",
    "subject": "康軒五下社會",
    "category": "第X單元 單元名稱",
    "difficulty": "2",
    "question": "題目內容？",
    "options": ["選項A", "選項B", "選項C", "選項D"],
    "answer": "選項B",
    "hint": "給孩子的提示",
    "explanation": "完整解析"
  }
]`;

export default function AdminPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error" | "idle";
    message: string;
  }>({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [importedBySubject, setImportedBySubject] = useState<Record<string, number>>({});
  const [fetching, setFetching] = useState(true);

  const fetchStats = useCallback(async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/import");
      if (res.ok) {
        const questions: Question[] = await res.json();
        setImportedCount(questions.length);
        const bySubject: Record<string, number> = {};
        questions.forEach((q) => {
          bySubject[q.subject] = (bySubject[q.subject] || 0) + 1;
        });
        setImportedBySubject(bySubject);
      }
    } catch { /* */ }
    setFetching(false);
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleImport = async () => {
    setLoading(true);
    setStatus({ type: "idle", message: "" });

    let parsed;
    try {
      parsed = JSON.parse(jsonInput.trim());
      if (!Array.isArray(parsed)) parsed = [parsed];
    } catch {
      setStatus({ type: "error", message: "JSON 格式錯誤，請檢查語法" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: parsed }),
      });
      const data = await res.json();

      if (!res.ok) {
        const details = data.details ? "\n" + data.details.join("\n") : "";
        setStatus({ type: "error", message: `${data.error}${details}` });
      } else {
        setStatus({
          type: "success",
          message: `匯入成功！新增 ${data.added} 題${data.skipped > 0 ? `，跳過 ${data.skipped} 題（ID 重複）` : ""}。題庫共 ${data.total} 題。`,
        });
        setJsonInput("");
        fetchStats();
      }
    } catch {
      setStatus({ type: "error", message: "網路錯誤，請重試" });
    }
    setLoading(false);
  };

  const handleClear = async () => {
    if (!confirm("確定要清除所有匯入的題目嗎？此操作無法復原。")) return;
    await fetch("/api/import", { method: "DELETE" });
    setStatus({ type: "success", message: "已清除所有匯入的題目" });
    fetchStats();
  };

  const copyTemplate = () => {
    navigator.clipboard.writeText(TEMPLATE);
    setStatus({ type: "success", message: "已複製模板到剪貼簿！" });
    setTimeout(() => setStatus({ type: "idle", message: "" }), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 p-4 pb-20">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="text-slate-600" size={28} />
            <h1 className="text-2xl font-bold text-slate-800">題目匯入</h1>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm text-gray-500 shadow hover:text-gray-700"
          >
            <Home size={14} /> 首頁
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-4 flex items-center gap-4 rounded-2xl bg-white p-4 shadow">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-blue-500" />
            <span className="text-sm text-gray-600">
              已匯入：
              {fetching ? (
                <Loader2 size={12} className="inline animate-spin ml-1" />
              ) : (
                <span className="font-bold text-blue-600"> {importedCount} 題</span>
              )}
            </span>
          </div>
          {Object.entries(importedBySubject).map(([sub, count]) => (
            <span key={sub} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              {sub}: {count}
            </span>
          ))}
          <button
            onClick={fetchStats}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Template */}
        <div className="mb-4 rounded-2xl bg-white p-4 shadow">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">JSON 格式範本</p>
            <button
              onClick={copyTemplate}
              className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-slate-200"
            >
              <Copy size={12} /> 複製給 Gemini
            </button>
          </div>
          <pre className="overflow-x-auto rounded-xl bg-slate-800 p-3 text-xs text-green-400 leading-relaxed">
            {TEMPLATE}
          </pre>
          <p className="mt-2 text-xs text-gray-400">
            difficulty: &quot;1&quot;~&quot;5&quot;（1最易5最難）。answer 必須跟 options 其中一個完全相同。
          </p>
        </div>

        {/* Input */}
        <div className="mb-4 rounded-2xl bg-white p-4 shadow">
          <p className="mb-2 text-sm font-semibold text-gray-700">
            貼上 JSON（Gemini 輸出）
          </p>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='把 Gemini 產生的 JSON 貼在這裡...'
            className="h-64 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 font-mono text-sm text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />

          {/* Status */}
          {status.type !== "idle" && (
            <div
              className={`mt-3 flex items-start gap-2 rounded-xl p-3 text-sm ${
                status.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              ) : (
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
              )}
              <pre className="whitespace-pre-wrap">{status.message}</pre>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-3 flex gap-3">
            <button
              onClick={handleImport}
              disabled={loading || !jsonInput.trim()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-base font-bold text-white shadow transition hover:bg-blue-700 disabled:opacity-40"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Upload size={18} />
              )}
              匯入題目
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <button
          onClick={handleClear}
          className="mx-auto flex items-center gap-2 text-xs text-gray-300 hover:text-red-400"
        >
          <Trash2 size={12} /> 清除所有匯入的題目
        </button>
      </div>
    </div>
  );
}
