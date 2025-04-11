"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const teacherId = sessionStorage.getItem("teacherId");
    const studentId = sessionStorage.getItem("studentId");
    const collegeId = sessionStorage.getItem("collegeId");

    if (teacherId) {
      router.push("/dashboard/teacher");
    } else if (studentId) {
      router.push("/dashboard/student");
    } else if (collegeId) {
      router.push("/dashboard/college");
    } else {
      router.push("/");
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="text-center mt-10">Redirecting...</div>;
  }

  return <div className="text-center mt-10">Hello! Redirecting...</div>;
}
