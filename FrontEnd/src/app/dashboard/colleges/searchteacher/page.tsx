"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Sidebar from "../components/Sidebar";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface Teacher {
  Tcontact: string;
  Temail: string;
  Tname: string;
  Tpass: string;
  college_id: number;
  id: number;
  subject: string;
}

export default function Page() {
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [collegeName, setCollegeName] = useState<string>("");
  const [teacherData, setTeacherData] = useState<Teacher | null>(null);
  const teacherRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedId = sessionStorage.getItem("collegeId");
    setCollegeId(storedId);

    if (storedId) {
      axios
        .get(
          `https://ai-teacher-api-xnd1.onrender.com/college/${storedId}/details`
        )
        .then(({ data }) => setCollegeName(data.Colname))
        .catch(() => console.error("Error fetching college details"));
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (teacherRef.current && collegeId) {
      const URL = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeId}/search_teacher/${teacherRef.current.value}?College_id=${collegeId}`;
      axios
        .get(URL)
        .then(({ data }) => {
          setTeacherData(data[0] || null);
        })
        .catch(() => {
          setTeacherData(null);
        });
    }
  };

  return (
    <div className="add-teacher-container flex">
      <div className="sidebar-container-page">
        <Sidebar />
      </div>

      <div className="content-container w-full">
        <div className="navbar">
          <Navbar />
        </div>

        <div className="view-classes-content-container min-h-[89vh] md:pl-[300px] bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100 p-6 space-y-6">
          {/* Welcome Card */}
          <Card className="shadow-lg border border-gray-800 bg-[#1e293b] text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome, {collegeName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Search for a teacher by ID below.</p>
            </CardContent>
          </Card>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-xl mx-auto"
          >
            <input
              type="number"
              ref={teacherRef}
              placeholder="Enter Teacher ID"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-full font-semibold hover:bg-neutral-800 transition"
            >
              Search
            </button>
          </form>

          {/* Teacher Info - Dark Card */}
          <div className="max-w-2xl mx-auto">
            {teacherData ? (
              <Card className="bg-[#1e293b] text-white shadow-md rounded-xl p-6 mt-6">
                <h3 className="text-xl font-bold mb-4">Teacher Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-300 font-semibold">
                      🆔 Teacher ID:
                    </span>{" "}
                    <span className="ml-2">{teacherData.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 font-semibold">
                      📛 Name:
                    </span>{" "}
                    <span className="ml-2">{teacherData.Tname}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 font-semibold">
                      📧 Email:
                    </span>{" "}
                    <span className="ml-2">{teacherData.Temail}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 font-semibold">
                      📞 Contact:
                    </span>{" "}
                    <span className="ml-2">{teacherData.Tcontact}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 font-semibold">
                      📚 Subject:
                    </span>{" "}
                    <span className="ml-2">{teacherData.subject}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 font-semibold">
                      🏫 College ID:
                    </span>{" "}
                    <span className="ml-2">{teacherData.college_id}</span>
                  </div>
                </div>
              </Card>
            ) : (
              <p className="text-center text-gray-500 mt-6">
                {teacherRef.current?.value
                  ? "No teacher found with that ID."
                  : "Please enter a teacher ID to begin search."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
