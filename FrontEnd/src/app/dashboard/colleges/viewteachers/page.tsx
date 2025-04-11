"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Sidebar from "../components/Sidebar";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import PopUpForTeacher from "../components/PopUpForTeacher";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TeacherType {
  id: number;
  Tname: string;
}

export default function Page() {
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [collegeName, setCollegeName] = useState<string>();
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
    null
  );

  const handleCollegeDetails = async (collegeId: string) => {
    try {
      const [collegeRes, teachersRes] = await Promise.all([
        axios.get(
          `https://ai-teacher-api-xnd1.onrender.com/college/${collegeId}/details`
        ),
        axios.get(
          `https://ai-teacher-api-xnd1.onrender.com/college/${collegeId}/teacher_list/`
        ),
      ]);

      setCollegeName(collegeRes.data.Colname);
      setTeachers(teachersRes.data);
    } catch (e) {
      console.error("Error fetching data", e);
    }
  };

  const handleDetails = (id: number) => setSelectedTeacherId(id);
  const close = () => setSelectedTeacherId(null);

  useEffect(() => {
    const id = sessionStorage.getItem("collegeId");
    setCollegeId(id);
    if (id) handleCollegeDetails(id);
  }, []);

  return (
    <div className="add-teacher-container flex">
      <div className="sidebar-container-page">
        <Sidebar />
      </div>

      <div className="content-container w-full">
        <div className="navbar">
          <Navbar />
        </div>

        <div className="view-teachers-content-container min-h-[89vh] md:pl-[300px] bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100 p-6 space-y-6">
          {/* Welcome Card */}
          <Card className="shadow-lg border border-gray-800 bg-[#1e293b] text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome, {collegeName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Below are all your registered teachers.
              </p>
            </CardContent>
          </Card>

          {/* Teacher Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="p-6 rounded-xl bg-[#1e293b] text-white shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <p className="text-sm text-gray-300 mb-1">Teacher ID</p>
                  <p className="text-xl font-bold mb-2">{teacher.id}</p>

                  <p className="text-sm text-gray-300 mb-1">Teacher Name</p>
                  <p className="text-lg font-semibold mb-4">{teacher.Tname}</p>

                  <button
                    onClick={() => handleDetails(teacher.id)}
                    className="mt-2 px-4 py-2 bg-gray-100 text-black rounded-md font-semibold transition hover:bg-gray-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pop-Up */}
        {selectedTeacherId !== null && (
          <PopUpForTeacher tid={selectedTeacherId} onclick={close} />
        )}
      </div>
    </div>
  );
}
