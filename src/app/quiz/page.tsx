"use client";

import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Lightbulb,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Star,
  CheckCircle2,
  XCircle,
  Play,
  BookOpen,
  Hash,
  Check,
  Layers,
  Home,
  ClipboardList,
  ArrowUpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import questionsData from "./data.json";

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

type SessionRecord = {
  date: string;
  user: string;
  categories: string[];
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
};

type WrongAnswer = {
  question: Question;
  userAnswer: string;
};

const difficultyMap: Record<string, number> = {
  "1": 1, "2": 2, "3": 3, "4": 4, "5": 5,
  Easy: 2, Medium: 3, Hard: 4,
};

const allQuestions: Question[] = questionsData as Question[];
const subjects = Array.from(new Set(allQuestions.map((q) => q.subject)));

const subjectCategoriesMap: Record<string, string[]> = {};
for (const sub of subjects) {
  subjectCategoriesMap[sub] = Array.from(
    new Set(allQuestions.filter((q) => q.subject === sub).map((q) => q.category))
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function saveSession(record: Omit<SessionRecord, "date">) {
  try {
    await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
  } catch {
    // silently fail
  }
}

function ConfettiEffect() {
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      size: Math.random() * 8 + 6,
      color: ["#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#3b82f6"][
        Math.floor(Math.random() * 5)
      ],
      duration: Math.random() * 1 + 1.5,
    }))
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti rounded-full"
          style={{
            left: `${p.left}%`,
            top: "-10px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

const QUESTION_COUNT_OPTIONS = [5, 10, 20] as const;

const userConfig: Record<string, { label: string; emoji: string; accent: string }> = {
  elsa: { label: "Elsa", emoji: "👸", accent: "purple" },
  ivan: { label: "Ivan", emoji: "🦸‍♂️", accent: "teal" },
};

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userSlug = searchParams.get("user") || "elsa";
  const config = userConfig[userSlug] ?? userConfig.elsa;

  // --- Start screen state ---
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => new Set(allQuestions.map((q) => q.category))
  );
  const [selectedCount, setSelectedCount] = useState<number | "all">(10);

  // --- Quiz state ---
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [showWrongDetails, setShowWrongDetails] = useState(false);
  const [newBadges, setNewBadges] = useState<{name: string; emoji: string}[]>([]);
  const [isWrongPracticeMode, setIsWrongPracticeMode] = useState(false);

  const currentCategories = useMemo(
    () =>
      selectedSubject === "all"
        ? Array.from(new Set(allQuestions.map((q) => q.category)))
        : subjectCategoriesMap[selectedSubject] ?? [],
    [selectedSubject]
  );

  const handleSubjectChange = useCallback((sub: string) => {
    setSelectedSubject(sub);
    if (sub === "all") {
      setSelectedCategories(new Set(allQuestions.map((q) => q.category)));
    } else {
      setSelectedCategories(new Set(subjectCategoriesMap[sub] ?? []));
    }
  }, []);

  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const toggleAllCategories = useCallback(() => {
    if (selectedCategories.size === currentCategories.length) {
      setSelectedCategories(new Set());
    } else {
      setSelectedCategories(new Set(currentCategories));
    }
  }, [selectedCategories.size, currentCategories]);

  const availableQuestions = useMemo(
    () => allQuestions.filter((q) => selectedCategories.has(q.category)),
    [selectedCategories]
  );

  const handleStart = useCallback(() => {
    const shuffled = shuffle(availableQuestions.filter((q) => !doneIds.has(q.id)));
    const count =
      selectedCount === "all" ? shuffled.length : Math.min(selectedCount, shuffled.length);
    const picked = shuffled.slice(0, count);
    setQuizQuestions(picked);
    setDoneIds((prev) => {
      const next = new Set(prev);
      picked.forEach((q) => next.add(q.id));
      return next;
    });
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowHint(false);
    setShowResult(false);
    setCorrectCount(0);
    setAnsweredCount(0);
    setWrongAnswers([]);
    setQuizFinished(false);
    setSessionSaved(false);
    setShowWrongDetails(false);
    setQuizStarted(true);
  }, [availableQuestions, selectedCount, doneIds]);

  const handleBackToStart = useCallback(() => {
    setQuizStarted(false);
    setQuizFinished(false);
    setSessionSaved(false);
    setDoneIds(new Set());
    setWrongAnswers([]);
    setShowWrongDetails(false);
  }, []);

  const currentQuestion = quizQuestions[currentIndex];
  const answerIndex = currentQuestion?.options.indexOf(currentQuestion.answer) ?? -1;
  const isCorrect = selectedOption === answerIndex;

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (showResult) return;
      setSelectedOption(optionIndex);
      setShowResult(true);
      setAnsweredCount((c) => c + 1);
      if (currentQuestion.options[optionIndex] === currentQuestion.answer) {
        setCorrectCount((c) => c + 1);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2500);
      } else {
        setWrongAnswers((prev) => [
          ...prev,
          { question: currentQuestion, userAnswer: currentQuestion.options[optionIndex] },
        ]);
      }
    },
    [showResult, currentQuestion]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= quizQuestions.length) {
      setQuizFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedOption(null);
    setShowHint(false);
    setShowResult(false);
  }, [currentIndex, quizQuestions.length]);

  // Start a new round with specific questions (for adaptive modes)
  const startAdaptiveRound = useCallback((questions: Question[]) => {
    setDoneIds((prev) => {
      const next = new Set(prev);
      questions.forEach((q) => next.add(q.id));
      return next;
    });
    setQuizQuestions(questions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowHint(false);
    setShowResult(false);
    setCorrectCount(0);
    setAnsweredCount(0);
    setWrongAnswers([]);
    setQuizFinished(false);
    setSessionSaved(false);
    setShowWrongDetails(false);
  }, []);

  const handleWrongPractice = useCallback(() => {
    const wrongCats = new Set(wrongAnswers.map((w) => w.question.category));
    const pool = allQuestions.filter(
      (q) => wrongCats.has(q.category) && !doneIds.has(q.id)
    );
    const picked = shuffle(pool).slice(0, 5);
    if (picked.length === 0) {
      alert("這些單元沒有更多新題目了！");
      return;
    }
    setIsWrongPracticeMode(true);
    startAdaptiveRound(picked);
  }, [wrongAnswers, doneIds, startAdaptiveRound]);

  const handleHarderPractice = useCallback(() => {
    const wrongCats = new Set(wrongAnswers.map((w) => w.question.category));
    const maxDiff = Math.max(...quizQuestions.map((q) => Number(q.difficulty) || 3));
    // Try harder questions first
    let pool = allQuestions.filter(
      (q) =>
        wrongCats.has(q.category) &&
        !doneIds.has(q.id) &&
        (Number(q.difficulty) || 3) > maxDiff
    );
    // If no harder, try same difficulty new questions
    if (pool.length === 0) {
      pool = allQuestions.filter(
        (q) => wrongCats.has(q.category) && !doneIds.has(q.id)
      );
    }
    const picked = shuffle(pool).slice(0, 5);
    if (picked.length === 0) {
      alert("這些單元沒有更多題目了！");
      return;
    }
    startAdaptiveRound(picked);
  }, [wrongAnswers, doneIds, quizQuestions, startAdaptiveRound]);

  // Save session, wrong-book, and check badges when quiz finishes
  useEffect(() => {
    if (quizFinished && !sessionSaved && answeredCount > 0) {
      const cats = Array.from(new Set(quizQuestions.map((q) => q.category)));
      // Save history
      saveSession({
        user: userSlug,
        categories: cats,
        totalQuestions: answeredCount,
        correctCount,
        accuracy: Math.round((correctCount / answeredCount) * 100),
      });

      // Save wrong answers to wrong-book + remove correct ones
      const wrongToAdd = wrongAnswers.map((w) => ({
        questionId: w.question.id,
        category: w.question.category,
        difficulty: w.question.difficulty,
        date: new Date().toISOString(),
        userAnswer: w.userAnswer,
        question: w.question.question,
        correctAnswer: w.question.answer,
        explanation: w.question.explanation,
      }));
      const correctIds = quizQuestions
        .filter((q) => !wrongAnswers.some((w) => w.question.id === q.id))
        .map((q) => q.id);

      fetch("/api/wrong-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userSlug, add: wrongToAdd, remove: correctIds }),
      }).catch(() => {});

      // Check badges
      const olympiadCount = quizQuestions.filter((q) => q.subject === "奧數邏輯").length;
      const hasFiveStar = quizQuestions.some((q) => q.difficulty === "5");
      fetch("/api/badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userSlug,
          questionsAnswered: answeredCount,
          olympiadAnswered: olympiadCount,
          isPerfect: wrongAnswers.length === 0,
          isWrongPractice: isWrongPracticeMode,
          hasFiveStar,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.newBadges && data.newBadges.length > 0) {
            const allBadges = data.allBadges || [];
            setNewBadges(
              data.newBadges.map((id: string) => {
                const b = allBadges.find((x: { id: string }) => x.id === id);
                return b ? { name: b.name, emoji: b.emoji } : { name: id, emoji: "🎖️" };
              })
            );
          }
        })
        .catch(() => {});

      setSessionSaved(true);
      setIsWrongPracticeMode(false);
    }
  }, [quizFinished, sessionSaved, answeredCount, correctCount, quizQuestions, userSlug, wrongAnswers, isWrongPracticeMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && showResult && !quizFinished) handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showResult, quizFinished, handleNext]);

  const progress =
    quizQuestions.length > 0
      ? ((currentIndex + (showResult ? 1 : 0)) / quizQuestions.length) * 100
      : 0;
  const accuracy =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  // ==================== START SCREEN ====================
  if (!quizStarted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50 p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="mb-2 text-4xl">{config.emoji}</div>
            <h1 className="text-3xl font-bold text-purple-700">
              {config.label} 的刷題樂園
            </h1>
            <p className="mt-2 text-gray-500">選擇單元和題數，開始練習吧！</p>
          </div>

          {/* Subject */}
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <BookOpen size={16} />
              選擇科目
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSubjectChange("all")}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  selectedSubject === "all"
                    ? "bg-purple-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-purple-50"
                }`}
              >
                全部
              </button>
              {subjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubjectChange(sub)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                    selectedSubject === sub
                      ? "bg-purple-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-purple-50"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Categories multi-select */}
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Layers size={16} />
                選擇單元（可多選）
              </div>
              <button
                onClick={toggleAllCategories}
                className="text-xs font-medium text-purple-500 hover:text-purple-700"
              >
                {selectedCategories.size === currentCategories.length ? "取消全選" : "全選"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentCategories.map((cat) => {
                const isSelected = selectedCategories.has(cat);
                const count = allQuestions.filter((q) => q.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
                      isSelected
                        ? "bg-purple-100 text-purple-700 ring-2 ring-purple-300"
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    }`}
                  >
                    {isSelected && <Check size={14} className="text-purple-500" />}
                    {cat}
                    <span className="text-xs opacity-60">({count})</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-gray-400">已選 {availableQuestions.length} 題</p>
          </div>

          {/* Count */}
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Hash size={16} />
              要練習幾題？
            </div>
            <div className="flex flex-wrap gap-2">
              {QUESTION_COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setSelectedCount(n)}
                  disabled={availableQuestions.length < n}
                  className={`rounded-full px-6 py-2.5 text-base font-semibold transition ${
                    selectedCount === n
                      ? "bg-pink-500 text-white shadow-md"
                      : availableQuestions.length < n
                        ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                        : "bg-gray-100 text-gray-600 hover:bg-pink-50"
                  }`}
                >
                  {n} 題
                </button>
              ))}
              <button
                onClick={() => setSelectedCount("all")}
                className={`rounded-full px-6 py-2.5 text-base font-semibold transition ${
                  selectedCount === "all"
                    ? "bg-pink-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-pink-50"
                }`}
              >
                全部
              </button>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={availableQuestions.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 text-xl font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
          >
            <Play size={24} />
            開始練習！
          </button>

          <button
            onClick={() => router.push("/")}
            className="mx-auto flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600"
          >
            <Home size={16} />
            回首頁
          </button>
        </div>
      </div>
    );
  }

  // ==================== FINISHED ====================
  if (quizFinished) {
    const emoji = accuracy >= 80 ? "🏆" : accuracy >= 60 ? "⭐" : "💪";
    const hasWrong = wrongAnswers.length > 0;
    return (
      <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50 p-6 pt-12">
        <div className="w-full max-w-md space-y-4">
          {/* Score card */}
          <div className="rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mb-4 text-6xl">{emoji}</div>
            <h2 className="mb-2 text-3xl font-bold text-purple-700">練習完成！</h2>
            <p className="mb-1 text-xl text-gray-600">
              答對 <span className="font-bold text-green-600">{correctCount}</span> / {answeredCount} 題
            </p>
            <p className="text-lg text-gray-500">正確率：{accuracy}%</p>

            {/* New badges */}
            {newBadges.length > 0 && (
              <div className="mt-4 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4">
                <p className="mb-2 text-sm font-bold text-amber-700">獲得新徽章！</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {newBadges.map((b, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-3xl animate-bounce">{b.emoji}</span>
                      <span className="text-xs font-medium text-amber-800">{b.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            {/* Wrong details toggle */}
            {hasWrong && (
              <button
                onClick={() => setShowWrongDetails((v) => !v)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-200 bg-white px-6 py-3 text-base font-semibold text-red-600 shadow transition hover:bg-red-50"
              >
                <ClipboardList size={20} />
                查看錯題詳解（{wrongAnswers.length} 題）
                {showWrongDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}

            {/* Wrong details list */}
            {showWrongDetails && (
              <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                {wrongAnswers.map((w, i) => (
                  <div key={i} className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="mb-2 text-sm font-medium text-gray-800">
                      {i + 1}. {w.question.question}
                    </p>
                    <div className="mb-1 flex items-center gap-2 text-sm">
                      <XCircle size={14} className="shrink-0 text-red-400" />
                      <span className="text-red-500">你的答案：{w.userAnswer}</span>
                    </div>
                    <div className="mb-2 flex items-center gap-2 text-sm">
                      <CheckCircle2 size={14} className="shrink-0 text-green-400" />
                      <span className="text-green-600">正確答案：{w.question.answer}</span>
                    </div>
                    <p className="rounded-lg bg-blue-50 p-2 text-xs leading-relaxed text-blue-700">
                      {w.question.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Wrong practice */}
            {hasWrong && (
              <button
                onClick={handleWrongPractice}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-400 px-6 py-3.5 text-base font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
              >
                <RotateCcw size={20} />
                錯題再練（同單元補強 5 題）
              </button>
            )}

            {/* Harder practice */}
            {hasWrong && (
              <button
                onClick={handleHarderPractice}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-400 to-indigo-500 px-6 py-3.5 text-base font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
              >
                <ArrowUpCircle size={20} />
                提升難度（更高星級挑戰）
              </button>
            )}

            {/* All correct message */}
            {!hasWrong && (
              <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-4 text-center">
                <p className="text-lg font-bold text-green-600">全部答對！太厲害了！</p>
                <p className="mt-1 text-sm text-green-500">可以回首頁挑戰其他單元</p>
              </div>
            )}

            {/* Home */}
            <button
              onClick={() => router.push("/")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-6 py-3 text-base font-semibold text-gray-600 shadow transition hover:bg-gray-50"
            >
              <Home size={18} />
              完成測驗
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== QUIZ ====================
  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50 p-6">
        <p className="text-xl text-gray-500">沒有題目喔！</p>
      </div>
    );
  }

  const difficultyStars = Array.from(
    { length: difficultyMap[currentQuestion.difficulty] ?? 2 },
    (_, i) => i
  );

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50">
      {showConfetti && <ConfettiEffect />}

      <header className="sticky top-0 z-10 border-b border-purple-100 bg-white/80 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.emoji}</span>
            <h1 className="text-lg font-bold text-purple-700">
              {config.label} 的刷題樂園
            </h1>
          </div>
          <span className="font-medium text-gray-600 text-sm">
            正確率{" "}
            <span className={`font-bold ${accuracy >= 70 ? "text-green-600" : accuracy >= 40 ? "text-amber-500" : "text-red-500"}`}>
              {accuracy}%
            </span>
          </span>
        </div>
        <div className="mx-auto mt-2 max-w-2xl">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>第 {currentIndex + 1} / {quizQuestions.length} 題</span>
            <span>答對 {correctCount} / {answeredCount}</span>
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-full bg-purple-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              {currentQuestion.category}
            </span>
            <div className="flex items-center gap-0.5">
              {difficultyStars.map((i) => (
                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>

          <p className="mb-6 text-xl font-semibold leading-relaxed text-gray-800">
            {currentQuestion.question}
          </p>

          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => {
              let optionStyle =
                "border-2 border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50";
              if (showResult) {
                if (idx === answerIndex) {
                  optionStyle = "border-2 border-green-400 bg-green-50 ring-2 ring-green-200";
                } else if (idx === selectedOption && !isCorrect) {
                  optionStyle = "border-2 border-red-400 bg-red-50 ring-2 ring-red-200";
                } else {
                  optionStyle = "border-2 border-gray-100 bg-gray-50 opacity-50";
                }
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showResult}
                  className={`flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left text-lg transition-all ${optionStyle} ${!showResult ? "cursor-pointer active:scale-[0.98]" : "cursor-default"}`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-200 text-sm font-bold text-purple-700">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {showResult && idx === answerIndex && (
                    <CheckCircle2 size={22} className="shrink-0 text-green-500" />
                  )}
                  {showResult && idx === selectedOption && !isCorrect && idx !== answerIndex && (
                    <XCircle size={22} className="shrink-0 text-red-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {!showResult && (
          <button
            onClick={() => setShowHint((v) => !v)}
            className="mx-auto mt-4 flex items-center gap-2 rounded-full bg-amber-100 px-5 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-200"
          >
            <Lightbulb size={18} className="text-amber-500" />
            {showHint ? "隱藏提示" : "需要提示嗎？"}
          </button>
        )}

        {showHint && !showResult && (
          <div className="mx-auto mt-3 w-full max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-base leading-relaxed text-amber-800">
            {currentQuestion.hint}
          </div>
        )}

        {showResult && (
          <div className={`mt-4 rounded-2xl border-2 p-5 ${isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <p className={`mb-2 text-lg font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
              {isCorrect ? "答對了！太棒了！" : "答錯了，沒關係！"}
            </p>
            <p className="text-base leading-relaxed text-gray-700">{currentQuestion.explanation}</p>
          </div>
        )}

        {showResult && (
          <button
            onClick={handleNext}
            className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
          >
            {currentIndex + 1 >= quizQuestions.length ? "查看成績" : "下一題"}
            <ChevronRight size={20} />
          </button>
        )}
      </main>

      <style jsx global>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti { animation: confetti-fall 2s ease-in forwards; }
      `}</style>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50">
          <Sparkles className="animate-pulse text-purple-400" size={40} />
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
