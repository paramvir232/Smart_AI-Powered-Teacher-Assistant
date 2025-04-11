"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/index.scss";

export default function PostNotice() {
  const router = useRouter();
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [collegeName, setCollegeName] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const id = sessionStorage.getItem("collegeId");
      if (!id) {
        toast.error("College ID not found in session!");
        router.push("/");
      } else {
        setCollegeId(id);
        fetchCollegeName(id);
      }
    }
  }, [router]);

  const fetchCollegeName = async (id: string) => {
    try {
      const response = await fetch(
        `https://ai-teacher-api-xnd1.onrender.com/college/${id}/details`
      );
      const data = await response.json();
      setCollegeName(data.Colname);
    } catch (err) {
      console.error("Error fetching college name");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    } else {
      toast.error("Please select an image!");
    }
  };

  const handlePostNotice = async () => {
    if (!title || !description || !image) {
      toast.error("All fields are required including image!");
      return;
    }

    if (!collegeId) {
      toast.error("College ID is missing!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const response = await fetch(
        `https://ai-teacher-api-xnd1.onrender.com/college/${collegeId}/send_notice/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Error posting notice.");
      await response.json();
      toast.success("Notice posted successfully!");

      setTitle("");
      setDescription("");
      setImage(null);
    } catch (error) {
      toast.error("Error posting notice.");
      console.error("Post error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="add-teacher-container flex">
      <div className="sidebar-container-page">
        <Sidebar />
      </div>

      <div className="content-container w-full">
        <div className="navbar">
          <Navbar />
        </div>

        <div className="min-h-[89vh] md:pl-[300px] bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100 p-6 space-y-6">
          {/* Welcome Card */}
          <Card className="shadow-lg border border-gray-800 bg-[#1e293b] text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome, {collegeName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Use this form to post a new notice to your college .
              </p>
            </CardContent>
          </Card>

          {/* Form Card */}
          <div className="flex justify-center">
            <Card className="bg-white w-full max-w-xl p-8 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800 mb-4">
                  Upload Notice
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="flex flex-col gap-1">
                  <Label className="text-gray-700">Notice Title</Label>
                  <Input
                    type="text"
                    placeholder="Enter notice title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-gray-700">Description</Label>
                  <Textarea
                    placeholder="Enter notice description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-gray-700">Upload Image</Label>
                  <Input type="file" onChange={handleFileChange} required />
                </div>

                <Button
                  onClick={handlePostNotice}
                  disabled={loading}
                  className="w-full bg-black text-white hover:bg-neutral-800 transition"
                >
                  {loading ? "Posting..." : "Post Notice"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
