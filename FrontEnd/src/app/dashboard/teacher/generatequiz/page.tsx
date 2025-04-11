"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Class = {
  id: number;
  Cname: string;
};

type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export default function GenerateQuiz() {
  const [teacherId] = useState(1); // static teacher ID
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [numQues, setNumQues] = useState(5);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch class list
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch(
          `https://ai-teacher-api-xnd1.onrender.com/teacher/${teacherId}/classes`
        );
        const data = await res.json();
        setClasses(data);
      } catch (err) {
        console.error("Failed to fetch classes", err);
      }
    };
    fetchClasses();
  }, [teacherId]);

  const handleGenerate = async () => {
    if (!selectedClass) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://ai-teacher-api-xnd1.onrender.com/teacher/${selectedClass}/generate_quiz`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            difficulty,
            num_ques: numQues,
          }),
        }
      );
      const data = await res.json();
      setQuiz(data);
    } catch (error) {
      console.error("Quiz generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  px-6 py-10 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">
      {/* Welcome Message */}
      <div className="w-full   text-black p-6 rounded-xl shadow-lg mb-6 bg-[#1e293b]">
        <h1 className="text-3xl font-semibold text-white ">
          Welcome to the AI Quiz Generator!
        </h1>
        <p className="text-sm text-gray-100 ">
          Generate quizzes based on topics, difficulty, and more. Fill in the
          fields below and get started!
        </p>
      </div>

      {/* Form to Generate Quiz */}
      <Card className="space-y-6 bg-white text-black shadow-lg rounded-xl p-6 max-w-[700px]">
        <CardHeader>
          <CardTitle className="text-xl ">Enter Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-2 text-gray-600">Select Class</label>
            <Select
              value={selectedClass?.toString()}
              onValueChange={(value) => setSelectedClass(Number(value))}
            >
              <SelectTrigger className="w-full bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="-- Choose a Class --" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.Cname} (ID: {cls.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2 text-gray-600">Topic</label>
            <Input
              type="text"
              className="w-full bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-blue-500"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. OOPS, Data Structures"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-600">Difficulty</label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="w-full bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2 text-gray-600">
              Number of Questions
            </label>
            <Input
              type="number"
              className="w-full bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-blue-500"
              value={numQues}
              onChange={(e) => setNumQues(Number(e.target.value))}
              min={1}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading || !selectedClass || !topic}
            className="w-full py-3 bg-black text-white rounded font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Generating Quiz..." : "Generate Quiz"}
          </Button>
        </CardContent>
      </Card>

      {/* Display Generated Quiz */}
      {quiz.length > 0 && (
        <motion.div
          className="mt-10 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-black">
            📋 Generated Quiz
          </h2>
          <div className="space-y-4">
            {quiz.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <h3 className="font-semibold text-xl text-black">
                  {i + 1}. {q.question}
                </h3>
                <ul className="space-y-2">
                  {q.options.map((opt, j) => (
                    <li
                      key={j}
                      className={`pl-2 border-l-4 ${
                        opt === q.answer
                          ? "border-green-500 font-bold text-green-700"
                          : "border-transparent"
                      }`}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
