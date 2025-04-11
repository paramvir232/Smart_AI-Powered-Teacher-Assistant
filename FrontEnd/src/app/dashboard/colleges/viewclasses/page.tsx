/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Sidebar from "../components/Sidebar";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../styles/index.scss";
import "../styles/card.scss";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ClassType {
  id: number;
  Cname: string;
}

export default function Page() {
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [collegeName, setCollegeName] = useState<string>();
  const [classes, setClasses] = useState<ClassType[]>([]);

  const handleCollegeDetails = async (collegeid: string) => {
    try {
      const [collegeRes, classesRes] = await Promise.all([
        axios.get(
          `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/details`
        ),
        axios.get(
          `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/class_list/`
        ),
      ]);

      setCollegeName(collegeRes.data.Colname);
      setClasses(classesRes.data);
    } catch (err) {
      console.error("Error fetching college or class data", err);
    }
  };

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

        <div className="view-classes-content-container min-h-[89vh] md:pl-[300px] bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100 p-6 space-y-6">
          {/* Welcome Card */}
          <Card className="shadow-lg border border-gray-800 bg-[#1e293b] text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome, {collegeName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Here are your registered classes.</p>
            </CardContent>
          </Card>

          {/* Class Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((data) => (
              <div
                key={data.id}
                className="relative p-6 rounded-xl bg-[#1e293b] text-white shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative z-10">
                  <p className="text-sm text-gray-300 mb-2">
                    Class ID: {data.id}
                  </p>
                  <p className="text-2xl font-bold">Class Name: {data.Cname}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
