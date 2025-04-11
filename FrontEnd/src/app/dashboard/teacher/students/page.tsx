"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useState, useEffect } from "react";

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

export default function StudentAssignments() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teacherID, setTeacherID] = useState<string | null>(null);

  useEffect(() => {
    const storedTeacherID = sessionStorage.getItem("teacherId");
    setTeacherID(storedTeacherID);
  }, []);

  useEffect(() => {
    if (!teacherID) return;

    const fetchStudents = async () => {
      try {
        const classRes = await axios.get(
          `https://ai-teacher-api-xnd1.onrender.com/teacher/${teacherID}/classes`
        );

        const classId = classRes.data.find((cls: any) => cls.id === 55)?.id;

        if (!classId) {
          console.error("Class with ID 55 not found");
          return;
        }

        // Step 2: Fetch students
        const studentRes = await axios.get(
          `https://ai-teacher-api-xnd1.onrender.com/teacher/viewstudents/${teacherID}`
        );
        console.log(studentRes, classRes);
        setStudents(studentRes.data);
      } catch (error) {
        console.error("Error fetching student data", error);
      }
    };

    fetchStudents();
  }, [teacherID]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {students.length > 0 ? (
        students.map((student) => (
          <Card key={student.id} className="shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle>
                {student.Sname} (ID: {student.id})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                College ID: {student.college_id}
              </p>
              <div className="mt-2">
                <h3 className="font-semibold">Assignments:</h3>
                <ul className="mt-1 space-y-2 bg-gray-800 p-2 rounded-md">
                  {student.assignments.length > 0 ? (
                    student.assignments.map((assignment, index) => (
                      <li
                        key={index}
                        className="text-sm p-2 rounded bg-gray-700 text-secondary"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">
                            {assignment.title}
                          </span>
                          <span>Grade: {assignment.grade}</span>
                        </div>
                        {assignment.Submitted_At ? (
                          <>
                            <p className="text-xs text-green-300 mt-1">
                              Submitted At:{" "}
                              {new Date(
                                assignment.Submitted_At
                              ).toLocaleString()}
                            </p>
                            {assignment.url && (
                              <a
                                href={assignment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 text-xs underline mt-1 inline-block"
                              >
                                View Submission
                              </a>
                            )}
                          </>
                        ) : (
                          <p className="text-xs text-red-300 mt-1">
                            Not Submitted
                          </p>
                        )}
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No assignments available
                    </p>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div>
          <h1>No Students Available</h1>
        </div>
      )}
    </div>
  );
}
