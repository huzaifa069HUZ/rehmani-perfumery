"use client";
import * as React from "react";
import { motion, useAnimation } from "framer-motion";

interface SmoothScrollHeroProps {
  desktopImage: string;
  mobileImage: string;
  initialClipPercentage?: number;
  finalClipPercentage?: number;
  label?: string;
  sublabel?: string;
}

export default function SmoothScrollHero({
  desktopImage,
  mobileImage,
  initialClipPercentage = 20,
  finalClipPercentage = 80,
  label = "Come Find Us",
  sublabel = "Visit Our Outlet",
}: SmoothScrollHeroProps) {
  const controls = useAnimation();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        // Map ratio [0 → 1] to clip inset [initialClip% → 0%]
        const inset = initialClipPercentage * (1 - ratio);
        const end = 100 - inset;
        controls.start({
          clipPath: `polygon(${inset}% ${inset}%, ${end}% ${inset}%, ${end}% ${end}%, ${inset}% ${end}%)`,
          transition: { duration: 0, ease: "linear" },
        });
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
        rootMargin: "0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [controls, initialClipPercentage]);

  const initialClip = `polygon(${initialClipPercentage}% ${initialClipPercentage}%, ${100 - initialClipPercentage}% ${initialClipPercentage}%, ${100 - initialClipPercentage}% ${100 - initialClipPercentage}%, ${initialClipPercentage}% ${100 - initialClipPercentage}%)`;

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(320px, 65vw, 640px)",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={controls}
        initial={{ clipPath: initialClip }}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${desktopImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          willChange: "clip-path",
        }}
      >
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* Text label */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "28px 24px",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#d3a958",
              marginBottom: 6,
              fontWeight: 700,
            }}
          >
            {label}
          </p>
          <h3
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: "clamp(1.2rem, 3vw, 2rem)",
              color: "#fff",
              fontWeight: 400,
              margin: 0,
              letterSpacing: "0.04em",
              textShadow: "0 2px 16px rgba(0,0,0,0.6)",
            }}
          >
            {sublabel}
          </h3>
        </div>
      </motion.div>

      {/* Mobile image (optional separate) */}
      <style>{`
        @media (max-width: 767px) {
          .ssh-desktop-bg { background-image: url(${mobileImage}) !important; }
        }
      `}</style>
    </div>
  );
}
