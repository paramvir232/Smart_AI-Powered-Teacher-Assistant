"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Sidebar from "../components/Sidebar";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ViewDetails {
  id: number;
  Colname: string;
  Ccontact: string;
  Cemail: string;
}

export default function Page() {
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ViewDetails>();

  useEffect(() => {
    const storedId = sessionStorage.getItem("collegeId");
    setCollegeId(storedId);

    if (storedId) {
      axios
        .get(
          `https://ai-teacher-api-xnd1.onrender.com/college/${storedId}/details`
        )
        .then(({ data }) => setDetail(data))
        .catch(() => console.error("Failed to fetch college details"));
    }
  }, []);

  return (
    <div className="flex">
      <div className="sidebar-container-page">
        <Sidebar />
      </div>

      <div className="content-container w-full">
        <div className="navbar">
          <Navbar />
        </div>

        <div className="min-h-[89vh] md:pl-[300px] bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100 p-6 space-y-6">
          {/* Dark Welcome Card */}
          <Card className="shadow-lg border border-gray-800 bg-[#1e293b] text-white">
            <CardHeader>
              <CardTitle className="text-2xl">
                Welcome, {detail?.Colname || "Loading..."}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Below are the official details of your college.
              </p>
            </CardContent>
          </Card>

          {/* Dark College Details Card */}
          <Card className="bg-[#1e293b] text-white shadow-md rounded-xl p-6 max-w-xl">
            {detail ? (
              <div className="space-y-4 text-gray-300">
                <div>
                  <span className="font-semibold mr-2">🆔 College ID:</span>
                  <span>{detail.id}</span>
                </div>
                <div>
                  <span className="font-semibold mr-2">🏫 College Name:</span>
                  <span>{detail.Colname}</span>
                </div>
                <div>
                  <span className="font-semibold mr-2">☎️ Contact:</span>
                  <span>{detail.Ccontact}</span>
                </div>
                <div>
                  <span className="font-semibold mr-2">📧 Email:</span>
                  <span>{detail.Cemail}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Loading college details...</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
