"use client";

import { TextRevealByWord } from "@/components/ui/text-reveal";

const REVEAL_TEXT =
  "Rahmani Perfumery — Patna's finest attar house. " +
  "We craft pure, alcohol-free attars and long-lasting perfumes " +
  "from the rarest oud, musk, rose and saffron oils. " +
  "Every drop carries the soul of Arabian perfumery, " +
  "bottled with heritage and delivered to your door.";

export default function PerfumeryTextReveal() {
  return (
    <section
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #050402 0%, #0a0804 50%, #050402 100%)",
        overflow: "hidden",
      }}
    >
      {/* Subtle gold grid lines in background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.025,
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.8) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Top label */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          paddingTop: "64px",
          paddingBottom: "8px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontSize: "0.65rem",
            fontWeight: 800,
            letterSpacing: "0.45em",
            color: "#D4AF37",
            textTransform: "uppercase",
          }}
        >
          ✦ &nbsp; Our Story &nbsp; ✦
        </span>
      </div>

      {/* Scroll-driven word reveal */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 72px" }}>
        <TextRevealByWord
          text={REVEAL_TEXT}
          className="font-black"
        />
      </div>

      {/* Bottom fade into the dark BottleCarousel section */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "80px",
          background: "linear-gradient(to bottom, transparent, #050402)",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />
    </section>
  );
}
