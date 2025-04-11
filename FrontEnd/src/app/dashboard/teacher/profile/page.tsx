"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Teacher {
  Tname: string;
  id: number;
  college_id: number;
  Tcontact: string;
  Temail: string;
}

export default function TeacherDetail() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [teacherID, setTeacherID] = useState<string | null>(null);

  // Get teacher ID from sessionStorage on client-side
  useEffect(() => {
    const storedTeacherID = sessionStorage.getItem("teacherId");
    if (!storedTeacherID) {
      router.push("/"); // Redirect if no teacherID found
      return;
    }
    setTeacherID(storedTeacherID);
  }, [router]);

  // Fetch teacher details once teacherID is available
  useEffect(() => {
    if (!teacherID) return;

    axios
      .get(
        `https://ai-teacher-api-xnd1.onrender.com/teacher/${teacherID}/detail`
      )
      .then((response) => {
        setTeacher(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teacher details:", error);
      })
      .finally(() => setLoading(false));
  }, [teacherID]);

  if (loading)
    return (
      <p className="text-center text-gray-500">Loading teacher details...</p>
    );

  return (
    <div className=" min-h-screen bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100 p-6">
      {/* Welcome Card */}
      {teacher && (
        <Card className="w-full bg-[#1e293b] text-white border border-gray-700 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome, {teacher.Tname}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              Below are the details of your profile.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Teacher Details Card */}
      <Card className="w-full max-w-[700px] bg-[#1e293b] text-white border border-gray-700 shadow-lg rounded-xl p-6 mt-6">
        <CardHeader />
        <CardContent className="space-y-4">
          {teacher ? (
            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-center gap-2">
                <span role="img" aria-label="user" className="text-blue-400">
                  👤
                </span>
                <p>
                  <strong className="text-gray-300">Name:</strong>{" "}
                  {teacher.Tname}
                </p>
              </div>

              {/* Teacher ID */}
              <div className="flex items-center gap-2">
                <span role="img" aria-label="id" className="text-blue-400">
                  🆔
                </span>
                <p>
                  <strong className="text-gray-300">Teacher ID:</strong>{" "}
                  {teacher.id}
                </p>
              </div>

              {/* College ID */}
              <div className="flex items-center gap-2">
                <span role="img" aria-label="college" className="text-blue-400">
                  🏫
                </span>
                <p>
                  <strong className="text-gray-300">College ID:</strong>{" "}
                  {teacher.college_id}
                </p>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <span role="img" aria-label="email" className="text-blue-400">
                  📧
                </span>
                <p>
                  <strong className="text-gray-300">Email:</strong>{" "}
                  {teacher.Temail}
                </p>
              </div>

              {/* Contact */}
              <div className="flex items-center gap-2">
                <span role="img" aria-label="phone" className="text-blue-400">
                  📞
                </span>
                <p>
                  <strong className="text-gray-300">Contact:</strong>{" "}
                  {teacher.Tcontact}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-red-500">Teacher details not found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
