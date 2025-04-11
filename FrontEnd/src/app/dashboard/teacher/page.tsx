"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface Class {
  id: number;
  Cname: string;
}

interface Assignment {
  title: string;
  grade: number;
  url: string | null;
  Submitted_At: string | null;
}

interface Student {
  id: number;
  Sname: string;
  college_id: number;
  assignments: Assignment[];
}

export default function Classes() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [teacherID, setTeacherID] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[] | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedTeacherID = sessionStorage.getItem("teacherId");
    setTeacherID(storedTeacherID);
  }, []);

  useEffect(() => {
    if (!teacherID) return;

    axios
      .get(
        `https://ai-teacher-api-xnd1.onrender.com/teacher/${teacherID}/detail`
      )
      .then((res) => setTeacherName(res.data.Tname))
      .catch(() => console.error("Failed to fetch teacher details"));

    axios
      .get(
        `https://ai-teacher-api-xnd1.onrender.com/teacher/${teacherID}/classes`
      )
      .then((res) => setClasses(res.data))
      .catch(() => console.error("Failed to fetch classes"));
  }, [teacherID]);

  const handleViewStudents = (classId: number) => {
    setSelectedClass(classId);
    setLoading(true);
    axios
      .get(
        `https://ai-teacher-api-xnd1.onrender.com/teacher/viewstudents/${classId}`
      )
      .then((res) => setStudents(res.data))
      .catch(() => console.error("Failed to fetch students"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100 min-h-screen space-y-6">
      {teacherName && (
        <Card className="bg-[#1e293b] text-white border border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome, {teacherName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              Choose a class to view enrolled students and their assignments.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {classes.length > 0 ? (
          classes.map((cls) => (
            <Card
              key={cls.id}
              className="bg-[#1e293b] text-white border border-gray-700 shadow-md hover:shadow-xl transition"
            >
              <CardHeader />
              <CardContent className="flex flex-col gap-4">
                <p className="text-xl font-semibold text-white">{cls.Cname}</p>
                <Button
                  onClick={() => handleViewStudents(cls.id)}
                  className="w-fit  text-black bg-white hover:bg-white"
                >
                  View Students
                  <ChevronRight className="ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">No classes available.</p>
        )}
      </div>

      {selectedClass && (
        <div className="space-y-4 mt-6 ">
          <h2 className="text-2xl font-bold text-gray-800">
            Students in Class #{selectedClass}
          </h2>
          <div className="flex flex-wrap gap-[10px]">
            {loading ? (
              <div className="flex items-center gap-4 text-lg text-indigo-600">
                <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                Loading students...
              </div>
            ) : students && students.length > 0 ? (
              students.map((student) => (
                <Card
                  key={student.id}
                  className="bg-[#1e293b] max-w-[500px] text-white border border-gray-700 shadow-md"
                >
                  <CardHeader>
                    <CardTitle>
                      {student.Sname}{" "}
                      <span className="text-sm text-gray-300">
                        (ID: {student.college_id})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold mb-2 text-gray-200">
                      Assignments:
                    </h3>
                    {student.assignments.length > 0 ? (
                      <ul className="space-y-3">
                        {student.assignments.map((assignment, index) => (
                          <li key={index}>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">
                                  {assignment.title}
                                </p>
                                {assignment.url ? (
                                  <a
                                    href={assignment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 underline text-sm"
                                  >
                                    View Submission
                                  </a>
                                ) : (
                                  <p className="text-sm text-red-400">
                                    Not submitted
                                  </p>
                                )}
                              </div>
                              <p className="text-sm font-semibold text-purple-400">
                                Grade: {assignment.grade}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-300">No assignments found.</p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-[#1e293b] text-gray-300 text-center border border-gray-700">
                <CardContent>No students found in this class.</CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
