"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";

// Grade point logic
function getGradePoint(marks: number): number {
  if (marks >= 90) return 10;
  if (marks >= 80) return 9;
  if (marks >= 70) return 8;
  if (marks >= 60) return 7;
  if (marks >= 50) return 6;
  if (marks >= 40) return 5;
  return 0;
}

interface Subject {
  id: number;
  credit: number;
  marks: number;
}

export default function SgpaCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, credit: 3, marks: 90 },
  ]);
  const [sgpa, setSgpa] = useState<number | null>(null);

  const handleChange = (id: number, field: keyof Subject, rawValue: string) => {
    const value = Number(rawValue); // More reliable than parseInt
    const adjusted =
      field === "marks"
        ? Math.min(Math.max(0, value), 100)
        : Math.max(0, value);

    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: adjusted } : s))
    );
  };

  const addSubject = () => {
    const newId = subjects.length ? subjects[subjects.length - 1].id + 1 : 1;
    setSubjects([...subjects, { id: newId, credit: 3, marks: 0 }]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  const calculateSGPA = () => {
    const totalCredits = subjects.reduce((sum, s) => sum + s.credit, 0);
    if (totalCredits === 0) return setSgpa(0);

    const weightedSum = subjects.reduce(
      (sum, s) => sum + s.credit * getGradePoint(s.marks),
      0
    );

    const result = weightedSum / totalCredits;
    setSgpa(parseFloat(result.toFixed(2)));
  };

  return (
    <div className="min-h-[89vh] bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-6 space-y-6">
      {/* Welcome Card */}
      <Card className="w-full bg-[#1e293b] text-white border border-gray-800 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to SGPA Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">
            Enter your subjects' credits and marks to calculate your SGPA.
          </p>
        </CardContent>
      </Card>

      {/* Calculator Card */}
      <Card className="max-w-3xl shadow-lg border border-gray-300 bg-white mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Subject Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <Input
                type="number"
                min="0"
                placeholder="Credits"
                className="w-full sm:w-32"
                value={subject.credit}
                onChange={(e) =>
                  handleChange(subject.id, "credit", e.target.value)
                }
              />
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="Marks (Max 100)"
                className="w-full sm:w-48"
                value={subject.marks}
                onChange={(e) =>
                  handleChange(subject.id, "marks", e.target.value)
                }
              />
              <div className="text-sm text-gray-600">
                🎓 Grade Point: <strong>{getGradePoint(subject.marks)}</strong>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSubject(subject.id)}
                disabled={subjects.length <= 1}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={addSubject}
              className="w-full sm:w-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
            </Button>
            <Button onClick={calculateSGPA} className="w-full sm:w-auto">
              Calculate SGPA
            </Button>
          </div>

          {sgpa !== null && (
            <div className="text-center text-lg font-semibold mt-4 p-4 rounded-md bg-blue-100 text-blue-700">
              🎯 Your SGPA is: <span className="text-blue-900">{sgpa}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
