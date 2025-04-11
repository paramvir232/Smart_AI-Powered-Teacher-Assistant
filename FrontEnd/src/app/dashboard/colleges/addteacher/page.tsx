"use client";

import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import "../styles/index.scss";
import "../styles/addteacher.scss";
import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card";

export default function Page() {
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [collegeName, setCollegeName] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [existingIds, setExistingIds] = useState<number[]>([]);
  const [idError, setIdError] = useState<string | null>(null);
  const [idValue, setIdValue] = useState<string>(""); // ✅ Live value for Teacher ID input

  const idRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const storedCollegeId = sessionStorage.getItem("collegeId");
    setCollegeId(storedCollegeId);

    if (storedCollegeId) {
      axios
        .get(
          `https://ai-teacher-api-xnd1.onrender.com/college/${storedCollegeId}/details`
        )
        .then(({ data }) => setCollegeName(data.Colname))
        .catch(() => console.log("Error fetching college details"));

      axios
        .get(
          `https://ai-teacher-api-xnd1.onrender.com/college/${storedCollegeId}/teacher_list/`
        )
        .then(({ data }) => {
          const ids = data.map((teacher: any) => teacher.id);
          setExistingIds(ids);
        })
        .catch(() => console.log("Error fetching teacher list"));
    }
  }, []);

  // ✅ Live validation
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setIdValue(val);

    const parsed = Number(val);
    if (!val || isNaN(parsed)) {
      setIdError(null);
      return;
    }

    if (existingIds.includes(parsed)) {
      setIdError("Teacher with this ID is already enrolled.");
    } else {
      setIdError(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      idRef.current &&
      nameRef.current &&
      emailRef.current &&
      phoneRef.current &&
      passRef.current &&
      collegeId
    ) {
      const payload = {
        id: Number(idRef.current.value),
        Tname: nameRef.current.value,
        Tpass: passRef.current.value,
        college_id: Number(collegeId),
        Temail: emailRef.current.value,
        Tcontact: phoneRef.current.value,
      };

      try {
        const response = await axios.post(
          "https://ai-teacher-api-xnd1.onrender.com/college/add_teacher/",
          payload
        );

        if (response.status === 200) {
          toast.success("Teacher Added Successfully!");

          // Reset form
          setIdValue("");
          nameRef.current.value = "";
          emailRef.current.value = "";
          phoneRef.current.value = "";
          passRef.current.value = "";
          setIdError(null);
        } else {
          toast.error("Failed to add teacher.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please fill in all fields.");
      setLoading(false);
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

        <div className="add-teacher-content-container min-h-[89vh] md:pl-[300px] bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100 p-6 space-y-6">
          {/* Welcome Card */}
          <Card className="shadow-lg border border-gray-800 bg-[#1e293b] text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome, {collegeName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Register new teachers to your college below.
              </p>
            </CardContent>
          </Card>

          {/* Add Teacher Form */}
          <div className="flex justify-center">
            <div className="add-teacher-form-container bg-white rounded-xl shadow-md p-8 w-full max-w-xl">
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">
                  Register New Teacher
                </h2>

                {/* Teacher ID */}
                <div>
                  <label
                    htmlFor="tid"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Teacher ID
                  </label>
                  <input
                    type="number"
                    id="tid"
                    value={idValue}
                    ref={idRef}
                    onChange={handleIdChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      idError ? "border-red-500" : "border-gray-300"
                    } bg-white focus:outline-none focus:ring-2 ${
                      idError ? "focus:ring-red-500" : "focus:ring-black"
                    } transition`}
                    placeholder="Enter teacher ID"
                    required
                  />
                  {idError && (
                    <p className="text-sm text-red-600 mt-1">{idError}</p>
                  )}
                </div>

                {/* Teacher Name */}
                <div>
                  <label
                    htmlFor="tname"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="tname"
                    ref={nameRef}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-black transition"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                {/* Teacher Email */}
                <div>
                  <label
                    htmlFor="temail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="temail"
                    ref={emailRef}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-black transition"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                {/* Teacher Contact */}
                <div>
                  <label
                    htmlFor="tphone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contact Number
                  </label>
                  <input
                    type="text"
                    id="tphone"
                    ref={phoneRef}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-black transition"
                    placeholder="+91 98765-43210"
                    required
                  />
                </div>

                {/* Teacher Password */}
                <div>
                  <label
                    htmlFor="tpass"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="tpass"
                    ref={passRef}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-black transition"
                    placeholder="Enter a secure password"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !!idError}
                  className="w-full bg-black text-white hover:bg-neutral-800 font-semibold py-2 rounded-md transition mt-4"
                >
                  {loading ? "Adding..." : "Add Teacher"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
