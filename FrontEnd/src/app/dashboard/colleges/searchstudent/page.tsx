"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Sidebar from "../components/Sidebar";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface Student {
  Scontact: string;
  Semail: string;
  Sname: string;
  Spass: string;
  college_id: number;
  id: number;
}

export default function Page() {
  const [collegeid, setCollegeId] = useState<string | null>(null);
  const [collegeName, setCollegeName] = useState<string>("");
  const studentRef = useRef<HTMLInputElement>(null);
  const [studentData, setStudentData] = useState<Student | null>(null);

  const handleCollegeDetails = (collegeid: string) => {
    const url = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/details`;
    axios
      .get(url)
      .then(({ data }) => {
        setCollegeName(data.Colname);
      })
      .catch(() => {
        console.log("Error fetching college details");
      });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentRef.current && collegeid) {
      const URL = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/search_student/${studentRef.current.value}?College_id=${collegeid}`;
      axios
        .get(URL)
        .then(({ data }) => {
          setStudentData(data[0] || null);
        })
        .catch(() => {
          setStudentData(null);
        });
    }
  };

  useEffect(() => {
    const storedId = sessionStorage.getItem("collegeId");
    setCollegeId(storedId);
    if (storedId) handleCollegeDetails(storedId);
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

        <div className="p-6 min-h-[89vh] md:pl-[300px] bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100 space-y-6">
          {/* Welcome Card */}
          <Card className="shadow-lg border border-gray-800 bg-[#1e293b] text-white">
            <CardHeader>
              <CardTitle className="text-2xl">
                Welcome, {collegeName || "Loading..."}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Search and view student details by ID below.
              </p>
            </CardContent>
          </Card>

          {/* Search Form */}
          <form
            className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl mx-auto"
            onSubmit={handleSearch}
          >
            <input
              type="number"
              placeholder="Enter Student ID"
              ref={studentRef}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-full font-semibold hover:bg-neutral-800 transition"
            >
              Search
            </button>
          </form>

          {/* Student Details */}
          <div className="max-w-2xl mx-auto">
            {studentData ? (
              <Card className="bg-[#1e293b] text-white shadow-md rounded-xl p-6 mt-6">
                <h3 className="text-xl font-bold mb-4">Student Details</h3>
                <table className="min-w-full border-collapse text-sm">
                  <tbody>
                    <tr>
                      <td className="font-semibold py-1">🆔 Student ID:</td>
                      <td className="py-1">{studentData.id}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold py-1">📛 Name:</td>
                      <td className="py-1">{studentData.Sname}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold py-1">📧 Email:</td>
                      <td className="py-1">{studentData.Semail}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold py-1">📞 Contact:</td>
                      <td className="py-1">{studentData.Scontact}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold py-1">🏫 College ID:</td>
                      <td className="py-1">{studentData.college_id}</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            ) : (
              <p className="text-center text-gray-500 mt-6">
                {studentRef.current?.value
                  ? "No student found with that ID."
                  : "Please enter a student ID to begin search."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
