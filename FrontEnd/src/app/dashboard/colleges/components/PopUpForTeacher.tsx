import axios from "axios";
import React, { useEffect, useState } from "react";

interface Props {
  tid: number;
  onclick: () => any;
}

interface Data {
  Tcontact: number;
  Temail: string;
  Tname: string;
  id: number;
}

export default function PopUpForTeacher({ tid, onclick }: Props) {
  const [collegeName, setCollegeName] = useState<string>();
  const [collegeId, setCollegeId] = useState<string | null>();
  const [detail, setDetail] = useState<Data | null>(null);

  const getTdetails = (collegeId: string) => {
    const teacherUrl = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeId}/search_teacher/${tid}?College_id=${collegeId}`;
    const collegeUrl = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeId}/details`;

    axios
      .get(collegeUrl)
      .then(({ data }) => setCollegeName(data.Colname))
      .catch(() => console.log("College fetch error"));

    axios
      .get(teacherUrl)
      .then(({ data }) => setDetail(data[0]))
      .catch(() => console.log("Teacher fetch error"));
  };

  useEffect(() => {
    const storedId = sessionStorage.getItem("collegeId");
    setCollegeId(storedId);
    if (storedId) getTdetails(storedId);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        {detail ? (
          <>
            <h2 className="text-xl font-bold text-center mb-4">
              Teacher Details
            </h2>

            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-medium text-gray-500">Teacher ID:</span>{" "}
                {detail.id}
              </p>
              <p>
                <span className="font-medium text-gray-500">Name:</span>{" "}
                {detail.Tname}
              </p>
              <p>
                <span className="font-medium text-gray-500">Contact:</span>{" "}
                {detail.Tcontact}
              </p>
              <p>
                <span className="font-medium text-gray-500">Email:</span>{" "}
                {detail.Temail}
              </p>
            </div>

            <button
              onClick={onclick}
              className="mt-6 w-full bg-black text-white py-2 rounded-md hover:bg-neutral-800 transition"
            >
              Done
            </button>
          </>
        ) : (
          <p className="text-center text-gray-500">Loading teacher info...</p>
        )}
      </div>
    </div>
  );
}
