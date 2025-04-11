"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import axios from "axios";
import "./styles/index.scss";
import StatCard from "./components/Card"; // Renamed import to avoid conflict

import {
  Card as UICard,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function Page() {
  const [collegeName, setCollegeName] = useState<string>();
  const [collegeid, setCollegeId] = useState<string | null>();
  const [classes, setClasses] = useState<number>(0);
  const [teachers, setTeachers] = useState<number>(0);

  const handleCollegeDetails = (college_id: string) => {
    const url1 = `https://ai-teacher-api-xnd1.onrender.com/college/${college_id}/details`;
    const url2 = `https://ai-teacher-api-xnd1.onrender.com/college/${college_id}/class_list/`;
    const teacher = `https://ai-teacher-api-xnd1.onrender.com/college/${college_id}/teacher_list/`;

    axios
      .get(url1)
      .then(({ data }) => {
        setCollegeName(data.Colname);
      })
      .catch(() => {
        console.log("error fetching college details");
      });

    axios
      .get(url2)
      .then(({ data }) => {
        setClasses(data.length);
      })
      .catch((e) => {
        console.log("error fetching classes", e);
      });

    axios
      .get(teacher)
      .then(({ data }) => {
        setTeachers(data.length);
      })
      .catch((e) => {
        console.log("error fetching teachers", e);
      });
  };

  useEffect(() => {
    const collegeId = sessionStorage.getItem("collegeId");
    setCollegeId(collegeId);
    if (collegeId) {
      handleCollegeDetails(collegeId);
    }
  }, []);

  return (
    <div className="parent-container flex">
      <Sidebar />
      <div className="content-container w-full">
        <div className="navbar">
          <Navbar />
        </div>

        <div className="college-details-container min-h-[89vh] md:pl-[300px] bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100 p-6 space-y-6">
          {/* ✅ Welcome Card - Styled like other dark cards */}
          <UICard className="shadow-lg border border-gray-800 bg-[#1e293b] text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome, {collegeName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Manage your college dashboard below.
              </p>
            </CardContent>
          </UICard>

          {/* ✅ Stat Cards */}
          <div className="flex flex-wrap gap-[10px]">
            <StatCard
              secondaryHeading="Total Number of Classes"
              number={classes}
              secondary=" Classes"
            />
            <StatCard
              secondaryHeading="Total Number of Teachers"
              number={teachers}
              secondary=" Teachers"
              href={"/dashboard/colleges/viewteachers"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
