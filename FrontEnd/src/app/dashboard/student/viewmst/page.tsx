"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface MstResult {
  stu_id: number;
  Number: number;
}

export default function ViewMst() {
  const [results, setResults] = useState<MstResult[]>([]);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedId = sessionStorage.getItem("studentId");
    if (storedId) {
      const id = parseInt(storedId);
      setStudentId(id);

      axios
        .get(`https://ai-teacher-api-xnd1.onrender.com/student/${id}/mst1-result`)
        .then((res) => {
          setResults(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load MST results.");
          console.error(err);
          setLoading(false);
        });
    } else {
      setError("Student ID not found in session.");
      setLoading(false);
    }
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">MST1 Results</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((result, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-2xl shadow-md border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-2">Student ID: {result.stu_id}</h3>
            <p className="text-gray-700">Marks: {result.Number}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
