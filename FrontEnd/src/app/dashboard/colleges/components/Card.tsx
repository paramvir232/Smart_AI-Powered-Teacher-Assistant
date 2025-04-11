"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Props {
  secondaryHeading?: string;
  number?: number;
  secondary?: string;
  href?: string;
}

export default function Card({
  secondaryHeading,
  number = 0,
  secondary,
  href,
}: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = typeof number === "number" ? number : 0;
    if (start === end) return;

    const duration = 1000;
    const stepTime = Math.abs(Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [number]);

  return (
    <div className="relative overflow-hidden p-6 rounded-xl bg-[#1e293b] text-white shadow-md hover:shadow-xl transition-all duration-300 w-full max-w-[400px]">
      {/* Content */}
      <div className="relative z-10">
        <p className="text-sm text-gray-300 mb-2">{secondaryHeading}</p>
        <p className="text-2xl font-bold">
          {count} <span>{secondary}</span>
        </p>

        {href && (
          <Link href={href}>
            <button className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md font-semibold transition hover:bg-gray-600">
              View Details
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
