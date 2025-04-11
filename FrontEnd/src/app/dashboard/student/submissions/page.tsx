"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Submission {
  sub_id: number;
  assignment_id: number;
  cloudinary_url: string;
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
}

interface Assignment {
  id: number;
  title: string;
  cloudinary_url: string;
  due_date: string;
  Cname: string;
}

interface Language {
  code: string;
  name: string;
}

export default function Submissions() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string>(""); // ✅
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackState, setFeedbackState] = useState<{
    [sub_id: number]: string;
  }>({});
  const [originalFeedback, setOriginalFeedback] = useState<{
    [sub_id: number]: string;
  }>({});
  const [visible, setVisible] = useState<{ [sub_id: number]: boolean }>({});
  const [typing, setTyping] = useState<number | null>(null);
  const [translating, setTranslating] = useState<{ [sub_id: number]: boolean }>(
    {}
  );
  const [selectedLanguage, setSelectedLanguage] = useState<{
    [sub_id: number]: string;
  }>({});

  const languages: Language[] = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "pa", name: "Punjabi" },
    { code: "bn", name: "Bengali" },
    { code: "gu", name: "Gujarati" },
    { code: "mr", name: "Marathi" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "kn", name: "Kannada" },
    { code: "ml", name: "Malayalam" },
  ];

  useEffect(() => {
    const id = sessionStorage.getItem("studentId");
    if (!id) return;
    setStudentId(id);

    const fetchData = async () => {
      try {
        const [subsRes, assignRes, detailRes] = await Promise.all([
          axios.get(
            `https://ai-teacher-api-xnd1.onrender.com/student/submissions/${id}`
          ),
          axios.get(
            `https://ai-teacher-api-xnd1.onrender.com/student/assignments/${id}`
          ),
          axios.get(
            `https://ai-teacher-api-xnd1.onrender.com/student/${id}/details`
          ),
        ]);
        setSubmissions(subsRes.data);
        setAssignments(assignRes.data);
        setStudentName(detailRes.data.Sname); // ✅ set name
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const typeFeedback = (sub_id: number, text: string) => {
    let i = 0;
    const speed = 20;
    const interval = setInterval(() => {
      setFeedbackState((prev) => ({
        ...prev,
        [sub_id]: text.slice(0, i + 1),
      }));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setTyping(null);
      }
    }, speed);
  };

  const getOrGenerateFeedback = async (submission: Submission) => {
    const { assignment_id, sub_id, feedback } = submission;
    if (!studentId) return;

    if (feedbackState[sub_id]) {
      setVisible((prev) => ({ ...prev, [sub_id]: !prev[sub_id] }));
      return;
    }

    try {
      setTyping(sub_id);

      let finalFeedback = feedback;

      if (!feedback) {
        const { data } = await axios.get(
          `https://ai-teacher-api-xnd1.onrender.com/student/FeedBack/${studentId}/${assignment_id}/${sub_id}`
        );
        finalFeedback = data.FeedBack || "No feedback available.";
      }

//@ts-ignore

      setOriginalFeedback((prev) => ({
        ...prev,
        [sub_id]: finalFeedback,
      }));

      setFeedbackState((prev) => ({
        ...prev,
        [sub_id]: "",
      }));

      setVisible((prev) => ({
        ...prev,
        [sub_id]: true,
      }));

      setSelectedLanguage((prev) => ({
        ...prev,
        [sub_id]: "hi",
      }));

//@ts-ignore


      translateFeedback(sub_id, finalFeedback, "hi");
    } catch (err) {
      console.error("Error fetching feedback", err);
      setTyping(null);
    }
  };

  const translateFeedback = async (
    sub_id: number,
    text: string,
    targetLang: string
  ) => {
    if (!text) return;

    setTranslating((prev) => ({ ...prev, [sub_id]: true }));

    try {
      if (targetLang === "en") {
        setFeedbackState((prev) => ({ ...prev, [sub_id]: "" }));
        typeFeedback(sub_id, originalFeedback[sub_id]);
        setSelectedLanguage((prev) => ({ ...prev, [sub_id]: "en" }));
        return;
      }

      const mockTranslated = await mockTranslate(text, targetLang);
      setFeedbackState((prev) => ({ ...prev, [sub_id]: "" }));
      typeFeedback(sub_id, mockTranslated);
      setSelectedLanguage((prev) => ({ ...prev, [sub_id]: targetLang }));
    } catch (err) {
      console.error("Translation error", err);
    } finally {
      setTranslating((prev) => ({ ...prev, [sub_id]: false }));
    }
  };

  const mockTranslate = async (text: string, lang: string): Promise<string> => {
    await new Promise((res) => setTimeout(res, 500));
    return `[${languages.find((l) => l.code === lang)?.name}] ${text}`;
  };

  const getAssignmentTitle = (assignmentId: number) => {
    return (
      assignments.find((a) => a.id === assignmentId)?.title ||
      `Assignment ${assignmentId}`
    );
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading submissions...</p>;
  if (!submissions.length)
    return <p className="text-center text-gray-500">No submissions found.</p>;

  return (
    <div className="flex flex-wrap justify-center mt-8 px-4">
      <div className="w-full  space-y-6">
        {/* ✅ Welcome Card */}
        {studentName && (
          <Card className="shadow-lg border border-gray-800 bg-[#1e293b] text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome, {studentName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Here are all your assignment submissions.
              </p>
            </CardContent>
          </Card>
        )}
        <div className="flex flex-wrap gap-[10px]">
          {/* ✅ Submissions */}
          {submissions.map((submission) => (
            <Card
              key={submission.sub_id}
              className="border border-gray-800 bg-[#1e293b] text-white shadow-lg max-w-[400px]"
            >
              <CardHeader>
                <CardTitle className="text-xl">
                  Assignment: {getAssignmentTitle(submission.assignment_id)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  <strong>Submitted At:</strong>{" "}
                  {new Date(submission.submitted_at).toLocaleString()}
                </p>
                <p>
                  <strong>File:</strong>{" "}
                  <a
                    href={submission.cloudinary_url}
                    target="_blank"
                    className="text-blue-400 underline"
                  >
                    View PDF
                  </a>
                </p>

                <Button
                  onClick={() => getOrGenerateFeedback(submission)}
                  disabled={typing === submission.sub_id}
                  className="bg-white text-black hover:bg-gray-300 transition"
                >
                  {typing === submission.sub_id
                    ? "Typing..."
                    : visible[submission.sub_id]
                    ? "Hide Feedback"
                    : "View Feedback"}
                </Button>

                {visible[submission.sub_id] && (
                  <div className="bg-gray-100 text-black rounded-md p-4 mt-2">
                    <div className="flex justify-between items-center mb-4">
                      <p>
                        <strong className="text-xl">Grade:</strong>{" "}
                        {submission.grade ?? "N/A"}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Language:</span>
                        <Select
                          value={selectedLanguage[submission.sub_id] || "en"}
                          onValueChange={(value) =>
                            translateFeedback(
                              submission.sub_id,
                              originalFeedback[submission.sub_id],
                              value
                            )
                          }
                          disabled={translating[submission.sub_id]}
                        >
                          <SelectTrigger className="w-32 bg-white text-black rounded-md">
                            <SelectValue placeholder="Language" />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-black">
                            {languages.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="overflow-auto max-h-[200px]">
                      <strong className="text-xl">
                        Feedback:
                        <br />
                      </strong>{" "}
                      {translating[submission.sub_id] ? (
                        <span className="italic text-gray-500">
                          Translating...
                        </span>
                      ) : (
                        <span className="whitespace-pre-line text-base">
                          {feedbackState[submission.sub_id] || (
                            <span className="italic text-gray-500 animate-pulse">
                              typing...
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
