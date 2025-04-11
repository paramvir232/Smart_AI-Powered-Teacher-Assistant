"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export const HeroScrollVideo = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 20 });

  return (
    <div
      ref={targetRef}
      className="relative pb-[100px] flex items-start justify-center "
    >
      <motion.video
        src="/dashboard.webm"
        autoPlay
        loop
        muted
        playsInline
        className="rounded-lg shadow-xl object-cover"
        style={{
          scale: smoothScale,
          width: "100%",
          maxWidth: "1000px",
          height: "auto",
        }}
      />
    </div>
  );
};
