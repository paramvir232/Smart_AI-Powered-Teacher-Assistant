"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface Class {
  id: string;
  Cname: string;
}

export default function UploadAssignment() {
  const router = useRouter();
  const [teacherID, setTeacherID] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [classId, setClassId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const id = sessionStorage.getItem("teacherId");
      if (!id) {
        router.push("/");
      } else {
        setTeacherID(id);
      }
    }
  }, [router]);

  useEffect(() => {
    if (!teacherID) return;

    const fetchTeacherDetails = async () => {
      try {
        const response = await fetch(
          `https://ai-teacher-api-xnd1.onrender.com/teacher/${teacherID}/detail`
        );
        if (!response.ok) throw new Error("Failed to fetch teacher details");

        const data = await response.json();
        setTeacherName(data.Tname);
      } catch (error) {
        console.error("Error fetching teacher details:", error);
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await fetch(
          `https://ai-teacher-api-xnd1.onrender.com/teacher/${teacherID}/classes`
        );
        if (!response.ok) throw new Error("Failed to fetch classes");

        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchTeacherDetails();
    fetchClasses();
  }, [teacherID]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    } else {
      // @ts-ignore
      toast.error("Please select a file!");
    }
  };

  const handleUpload = async () => {
    if (!title || !dueDate || !classId || !file) {
      // @ts-ignore
      toast.error("All fields are required!");
      return;
    }

    if (!teacherID) {
      // @ts-ignore
      toast.error("Teacher ID not found!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("due_date", dueDate);
    formData.append("teacher_id", teacherID);
    formData.append("class_id", classId);
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://ai-teacher-api-xnd1.onrender.com/teacher/add_assignment",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Error uploading assignment.");

      await response.json();
      // @ts-ignore
      toast.success("Assignment uploaded successfully!");
      router.push("/dashboard/teacher/assignments");
    } catch (error) {
      // @ts-ignore
      toast.error("Error uploading assignment.");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100 p-6 space-y-6 flex flex-col items-center">
      {/* Welcome Card */}
      {teacherName && (
        <Card className="w-full  bg-[#1e293b] text-white border border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome, {teacherName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              Use the form below to upload a new assignment.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Assignment Form */}
      <Card className="w-full max-w-[700px] bg-white text-black border border-gray-300 shadow-lg p-6">
        <CardHeader />
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label className="text-gray-700">Assignment Title</Label>
            <Input
              type="text"
              className="bg-white text-black border border-gray-300 focus:ring-2 focus:ring-blue-600"
              placeholder="Enter assignment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-gray-700">Due Date</Label>
            <Input
              type="date"
              className="bg-white text-black border border-gray-300 focus:ring-2 focus:ring-blue-600"
              placeholder="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-gray-700">Select Class</Label>
            <Select onValueChange={(value) => setClassId(value)}>
              <SelectTrigger className="bg-white text-black border border-gray-300 rounded-md">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {classes.map((cls) => (
                  <SelectItem
                    key={cls.id}
                    value={cls.id}
                    className="hover:bg-gray-200"
                  >
                    {cls.Cname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-gray-700 mb-1">Upload Assignment</Label>
            <Input
              type="file"
              className="bg-white text-black border border-gray-300"
              onChange={handleFileChange}
            />
            <Button
              onClick={handleUpload}
              className="w-full mt-3 "
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Assignment"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
