"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

export default function SendMail() {
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingEmail, setFetchingEmail] = useState(false);

  const handleFetchEmail = async () => {
    if (!studentId) {
      // @ts-ignore
      toast.error("Please enter a student ID.");
      return;
    }

    setFetchingEmail(true);
    try {
      const response = await axios.get(
        `https://ai-teacher-api-xnd1.onrender.com/student/${studentId}/details`
      );
      const { Semail } = response.data;
      if (Semail) {
        setEmail(Semail);
        // @ts-ignore
        toast.success("Student email fetched!");
      } else {
        // @ts-ignore
        toast.error("Email not found for this student.");
      }
    } catch (error) {
      console.error(error);
      // @ts-ignore
      toast.error("Failed to fetch student details.");
    } finally {
      setFetchingEmail(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email || !message) {
      // @ts-ignore
      toast.error("Please fill out both fields.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "https://ai-teacher-api-xnd1.onrender.com/teacher/send_Mail",
        {
          email,
          msg: message,
        }
      );
      // @ts-ignore
      toast.success("Email sent successfully!");
      setEmail("");
      setMessage("");
      setStudentId("");
    } catch (error) {
      console.error(error);
      // @ts-ignore
      toast.error("Failed to send email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 ">
      {/* Welcome Message */}
      <div className="w-full bg-[#1e293b] text-white p-6 rounded-xl shadow-lg mb-6">
        <h1 className="text-2xl font-semibold ">Welcome to the Mailer Tool</h1>
        <p className="text-sm text-gray-300 ">
          Send emails to students easily. Enter the student ID and message to
          send an email.
        </p>
      </div>

      {/* Mail Form */}
      <div className="w-full max-w-[700px] bg-[#1e293b] text-white border border-gray-700 shadow-lg rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center">
          Send Email to Student
        </h2>

        {/* Student ID and Fetch Email */}
        <div className="flex gap-4">
          <Input
            type="number"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="bg-[#2d3748] text-white border border-gray-600 focus:ring-2 focus:ring-white"
          />
          <Button
            onClick={handleFetchEmail}
            disabled={fetchingEmail}
            className="bg-white text-black hover:bg-gray-200"
          >
            {fetchingEmail ? "Fetching..." : "Fetch Email"}
          </Button>
        </div>

        {/* Email */}
        <Input
          type="email"
          placeholder="Student's Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#2d3748] text-white border border-gray-600 focus:ring-2 focus:ring-white"
          disabled
        />

        {/* Message */}
        <textarea
          placeholder="Your Message"
          rows={6}
          className="w-full bg-[#2d3748] text-white border border-gray-600 rounded-md p-3 resize-none placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white shadow-md"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Send Button */}
        <Button
          onClick={handleSendEmail}
          disabled={loading}
          className="w-full bg-white text-black hover:bg-gray-200 shadow-md"
        >
          {loading ? "Sending..." : "Send Email"}
        </Button>
      </div>
    </div>
  );
}
