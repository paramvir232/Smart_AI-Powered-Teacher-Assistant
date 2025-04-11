"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Sidebar from "../components/Sidebar";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Data {
  id: string | number;
  Sname: string;
  Semail: string;
  Scontact: string;
  Spass: string;
  college_id: number;
}

export default function Page() {
  const idRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [collegeName, setCollegeName] = useState<string>();
  const [existingIds, setExistingIds] = useState<number[]>([]);
  const [idError, setIdError] = useState<string | null>(null);

  const handleCollegeDetails = async (collegeid: string) => {
    const url1 = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/details`;
    const url2 = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/student_list/`;

    try {
      const [{ data: collegeData }, { data: studentList }] = await Promise.all([
        axios.get(url1),
        axios.get(url2),
      ]);

      setCollegeName(collegeData.Colname);
      const ids = studentList.map((student: any) => student.id);
      setExistingIds(ids);
    } catch {
      //@ts-ignore
      toast.error("Error fetching college or student details.");
    }
  };

  useEffect(() => {
    const storedId = sessionStorage.getItem("collegeId");
    setCollegeId(storedId);
    if (storedId) handleCollegeDetails(storedId);
  }, []);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (existingIds.includes(value)) {
      setIdError("Student with this ID is already enrolled.");
    } else {
      setIdError(null);
    }
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const obj: Data = {
      id: Number(idRef.current?.value || ""),
      Sname: nameRef.current?.value || "",
      Spass: passRef.current?.value || "",
      Semail: emailRef.current?.value || "",
      Scontact: phoneRef.current?.value || "",
      college_id: Number(collegeId),
    };

    if (
      obj.id &&
      obj.Sname &&
      obj.Semail &&
      obj.Scontact &&
      obj.Spass &&
      obj.college_id
    ) {
      try {
        const response = await axios.post(
          "https://ai-teacher-api-xnd1.onrender.com/college/add_student/",
          obj
        );

        if (response.status === 200) {
          //@ts-ignore

          toast.success("Student added successfully!");

          idRef.current!.value = "";
          nameRef.current!.value = "";
          emailRef.current!.value = "";
          passRef.current!.value = "";
          phoneRef.current!.value = "";
          setIdError(null);
        } else {
          //@ts-ignore

          toast.error("Failed to add student. Please check the data.");
        }
      } catch (err) {
        console.error(err);
        //@ts-ignore

        toast.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
    } else {
      //@ts-ignore

      toast.error("Please fill all fields.");
      setLoading(false);
    }
  };

  return (
    <div className="add-student-container flex">
      <div className="sidebar-container-page">
        <Sidebar />
      </div>

      <div className="content-container w-full">
        <div className="navbar">
          <Navbar />
        </div>

        <div className="add-student-content-container min-h-[89vh] md:pl-[300px] bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100 p-6 space-y-6">
          {/* Welcome Message */}
          <Card className="shadow-lg border border-gray-800 bg-[#1e293b] text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome, {collegeName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Register new students below.</p>
            </CardContent>
          </Card>

          {/* Form Section */}
          <div className="flex justify-center">
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-xl">
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">
                  Register New Student
                </h2>

                {/* ID */}
                <div>
                  <label
                    htmlFor="sid"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Student Roll Number
                  </label>
                  <input
                    id="sid"
                    type="number"
                    placeholder="Student ID"
                    onChange={handleIdChange}
                    ref={idRef}
                    className={`w-full px-4 py-2 rounded-md border ${
                      idError ? "border-red-500" : "border-gray-300"
                    } bg-white focus:outline-none focus:ring-2 ${
                      idError ? "focus:ring-red-500" : "focus:ring-black"
                    } transition`}
                  />
                  {idError && (
                    <p className="text-sm text-red-600 mt-1">{idError}</p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="sname"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="sname"
                    type="text"
                    placeholder="John Doe"
                    ref={nameRef}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="semail"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="semail"
                    type="email"
                    placeholder="abc@example.com"
                    ref={emailRef}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="snumber"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Contact Number
                  </label>
                  <input
                    id="snumber"
                    type="text"
                    placeholder="+91 98145-90391"
                    ref={phoneRef}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="spass"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    id="spass"
                    type="password"
                    placeholder="Password"
                    ref={passRef}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !!idError}
                  className="w-full bg-black hover:bg-neutral-800 text-white font-semibold py-2 rounded-md transition"
                >
                  {loading ? "Adding..." : "Add Student"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
