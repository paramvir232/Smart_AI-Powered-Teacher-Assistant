"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CheckCircle, ChevronRight, Trophy, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

export default function FancyQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [language, setLanguage] = useState("english");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  const studentId =
    typeof window !== "undefined" ? sessionStorage.getItem("studentId") : null;

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const languages = [
    "english",
    "hindi",
    "punjabi",
    "bengali",
    "marathi",
    "tamil",
    "telugu",
    "gujarati",
    "kannada",
    "odia",
    "urdu",
    "malayalam",
  ];

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://ai-teacher-api-xnd1.onrender.com/student/${studentId}/get_quiz/${language}`
      );
      const data = res.data[0]?.quiz || [];

      if (!data.length && language !== "english") {
        // @ts-ignore
        toast.error(
          `Failed to load quiz in ${language}. Falling back to English.`
        );
        setLanguage("english");
        return;
      }

      setQuestions(data);
      setCurrentIndex(0);
      setScore(0);
      setSelected(null);
      setShowResult(false);
      setSubmitted(false);
    } catch {
      // @ts-ignore
      toast.error("Error fetching quiz. Please try again.");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchQuiz();
  }, [language]);

  // 🔐 Prevent fullscreen exit
  useEffect(() => {
    const handleFullscreenExit = () => {
      if (started && !showResult && !document.fullscreenElement) {
        // @ts-ignore
        toast.error("You can't exit fullscreen until the quiz is complete.");

        setTimeout(() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        }, 300);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenExit);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenExit);
  }, [started, showResult]);
  useEffect(() => {
    const preventEscapeKey = (e: KeyboardEvent) => {
      if (started && !showResult && e.key === "Escape") {
        setTimeout(() => {
          document.documentElement.requestFullscreen().catch(() => {});
        }, 100);
        // @ts-ignore
        toast.error("Escape is disabled during the quiz.");
      }
    };

    document.addEventListener("keydown", preventEscapeKey);

    return () => {
      document.removeEventListener("keydown", preventEscapeKey);
    };
  }, [started, showResult]);

  // 🛡 Prevent page reload
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (started && !showResult) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [started, showResult]);

  // ⏲ Timer logic
  useEffect(() => {
    if (!started || submitted || showResult || loading) return;
    if (timeLeft === 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted, showResult, started, loading]);

  useEffect(() => {
    setTimeLeft(120);
  }, [currentIndex]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  const handleSubmit = () => {
    if (submitted) return;
    if (selected === currentQuestion.answer) setScore((prev) => prev + 1);
    setSubmitted(true);
  };

  const handleNext = () => {
    setSubmitted(false);
    setSelected(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
      document.exitFullscreen().catch(() => {});
    }
  };

  const restartQuiz = () => {
    setStarted(false);
    document.exitFullscreen().catch(() => {});
    fetchQuiz();
  };

  const handleStart = () => {
    setStarted(true);
    document.documentElement.requestFullscreen().catch(() => {});
  };

  // 🚀 UI Rendering
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
        <Card className="w-full max-w-2xl bg-[#1e293b] text-white border border-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to EduQuiz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Click start to begin the quiz. Fullscreen will be enabled and page
              reload will be blocked.
            </p>
            <Button
              onClick={handleStart}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-3"
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading || !questions.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100">
        <div className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-lg text-gray-700">Loading quiz...</p>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / totalQuestions) * 100);
    return (
      <div className="min-h-screen flex justify-center items-center px-6 py-10 bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="bg-white rounded-3xl p-8 text-center shadow-xl w-full max-w-xl">
          <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
          <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
          <p className="text-lg text-gray-600 mb-6">
            You scored <strong>{score}</strong> out of{" "}
            <strong>{totalQuestions}</strong>
          </p>
          <Progress value={percentage} className="h-3 mb-4" />
          <p className="text-xl font-semibold text-purple-700 mb-4">
            {percentage >= 80
              ? "🎉 Excellent!"
              : percentage >= 50
              ? "👍 Good effort!"
              : "📚 Keep practicing!"}
          </p>
          <Button onClick={restartQuiz} className="w-full mt-2 text-lg py-5">
            Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-6 space-y-6">
      <Card className="w-full bg-[#1e293b] text-white border border-gray-800 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">EduQuiz</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">
            Test your knowledge. Each question has a 2-minute timer. Fullscreen
            is enforced.
          </p>
        </CardContent>
      </Card>

      <div className="max-w-5xl grid md:grid-cols-2 gap-4 mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Left */}
        <div className="bg-[#f6f8fe] px-10 py-12 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              EduQuiz
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              Question {currentIndex + 1} of {totalQuestions}
            </p>
            <h1 className="text-2xl font-bold text-gray-800 leading-snug mb-4">
              {currentQuestion?.question}
            </h1>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md px-3 py-2 inline-flex w-fit">
              <Clock className="h-4 w-4" />
              Time left: {formatTime(timeLeft)}
            </div>
          </div>
          <div className="mt-10">
            <Label className="text-sm text-gray-500 mb-2 block">
              Select Language
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full p-3 border bg-white rounded-md">
                {language.charAt(0).toUpperCase() + language.slice(1)}
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right */}
        <div className="p-10 space-y-6">
          <RadioGroup
            value={selected ?? ""}
            onValueChange={setSelected}
            className="space-y-4"
          >
            {currentQuestion?.options.map((option, idx) => {
              const isCorrect = submitted && option === currentQuestion.answer;
              const isWrong =
                submitted &&
                selected === option &&
                option !== currentQuestion.answer;

              return (
                <div
                  key={idx}
                  className={`border-2 rounded-xl px-4 py-3 cursor-pointer transition-all ${
                    isCorrect
                      ? "border-green-500 bg-green-50 text-green-700"
                      : isWrong
                      ? "border-red-500 bg-red-50 text-red-700"
                      : selected === option
                      ? "border-blue-600 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                >
                  <Label
                    htmlFor={`option-${idx}`}
                    className="flex items-center cursor-pointer text-sm font-medium"
                  >
                    <RadioGroupItem
                      id={`option-${idx}`}
                      value={option}
                      className="mr-3"
                      disabled={submitted}
                    />
                    {option}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>

          {!submitted ? (
            <Button
              onClick={handleSubmit}
              disabled={!selected}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-xl text-lg"
            >
              Submit
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg"
            >
              {currentIndex === totalQuestions - 1
                ? "Finish Quiz"
                : "Next Question"}
              <ChevronRight className="ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
