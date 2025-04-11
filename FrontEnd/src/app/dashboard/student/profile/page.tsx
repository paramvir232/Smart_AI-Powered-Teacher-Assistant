"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface Student {
  id: number;
  Sname: string;
  Semail: string;
  Scontact: string;
  college_id: number;
  Spass?: string;
}

export default function Profile() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = sessionStorage.getItem("studentId");

    if (!studentId) {
      toast.error("No student ID found in session.");
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await axios.get<Student>(
          `https://ai-teacher-api-xnd1.onrender.com/student/${studentId}/details`
        );
        setStudent(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch student profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading student profile...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-4 text-center text-red-500">Student not found.</div>
    );
  }

  return (
    <div className="min-h-[89vh]  bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100 p-6 space-y-6">
      {/* ✅ Full Width Welcome Card */}
      <Card className="w-full shadow-lg border border-gray-800 bg-[#1e293b] text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome, {student.Sname}</CardTitle>
          <CardDescription className="text-gray-300">
            Here is your profile overview.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* ✅ Left-aligned Profile Card */}
      <Card className="w-full max-w-xl shadow-lg border border-gray-800 bg-[#1e293b] text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {student.Sname}
          </CardTitle>
          <CardDescription className="text-gray-300">
            Student ID: {student.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">📧 Email</p>
            <p className="text-base font-medium">{student.Semail}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">📞 Contact</p>
            <p className="text-base font-medium">{student.Scontact}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">🏫 College ID</p>
            <p className="text-base font-medium">{student.college_id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
