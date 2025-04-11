// /app/api/quiz/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const questions = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["Paris", "Madrid", "Berlin", "Rome"],
      answer: "Paris",
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      answer: "Mars",
    },
    {
      id: 3,
      question: "Who wrote 'Hamlet'?",
      options: ["Leo Tolstoy", "William Shakespeare", "Homer", "Charles Dickens"],
      answer: "William Shakespeare",
    },
    {
      id: 4,
      question: "What is the chemical symbol for water?",
      options: ["O2", "CO2", "H2O", "NaCl"],
      answer: "H2O",
    },
    {
      id: 5,
      question: "What is 9 + 10?",
      options: ["19", "21", "20", "18"],
      answer: "19",
    },
  ];

  // Shuffle the options for fun randomness
  const shuffled = questions.map((q) => ({
    ...q,
    options: q.options.sort(() => Math.random() - 0.5),
  }));

  return NextResponse.json(shuffled);
}
