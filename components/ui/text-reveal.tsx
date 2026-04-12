"use client";

import { FC, ReactNode, useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealByWordProps {
  text: string;
  progress: MotionValue<number>;
  className?: string;
}

const TextRevealByWord: FC<TextRevealByWordProps> = ({ text, progress, className }) => {
  const words = text.split(" ");

  return (
    <div className={cn("relative z-0", className)}>
      <p
        className={cn(
          "flex flex-wrap gap-x-2 gap-y-1 p-5",
          "text-3xl font-black text-white/10 md:p-8 md:text-4xl lg:p-10 lg:text-5xl xl:text-6xl",
          "leading-tight tracking-tight"
        )}
      >
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return (
            <Word key={i} progress={progress} range={[start, end]}>
              {word}
            </Word>
          );
        })}
      </p>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative inline-block">
      {/* Ghost placeholder keeps layout stable */}
      <span className="absolute select-none text-white/8">{children}</span>
      <motion.span
        style={{ opacity }}
        className="text-white"
      >
        {children}
      </motion.span>
    </span>
  );
};

export { TextRevealByWord };
