import React from "react";

/**
 * AnimatedHuman
 * A breathing-synchronized schematic human
 * No video, no images, fully deterministic
 */
export default function AnimatedHuman({ phase, exercise }) {
  const inhale = phase === "inhale";
  const exhale = phase === "exhale";

  // Exercise-specific emphasis
  const chestScale =
    exercise === "Dirgha" || exercise === "Ujjayi"
      ? inhale ? 1.08 : 0.96
      : inhale ? 1.04 : 0.98;

  const bellyScale =
    exercise === "Dirgha"
      ? inhale ? 1.12 : 0.94
      : inhale ? 1.03 : 0.98;

  return (
    <svg
      width="240"
      height="360"
      viewBox="0 0 240 360"
      style={{
        transition: inhale
          ? "all 7s linear"
          : "all 16s linear"
      }}
    >
      {/* Head */}
      <circle cx="120" cy="50" r="24" fill="#cfdfe3" />

      {/* Throat cue (Ujjayi) */}
      {exercise === "Ujjayi" && (
        <rect
          x="105"
          y="78"
          width="30"
          height="14"
          rx="7"
          fill={inhale ? "#9bcad8" : "#cfe6ec"}
        />
      )}

      {/* Chest */}
      <ellipse
        cx="120"
        cy="140"
        rx="46"
        ry="36"
        fill="#b7d7df"
        style={{
          transform: `scale(${chestScale})`,
          transformOrigin: "center",
          transition: inhale
            ? "all 7s linear"
            : "all 16s linear"
        }}
      />

      {/* Abdomen */}
      <ellipse
        cx="120"
        cy="210"
        rx="42"
        ry="32"
        fill="#cde8ec"
        style={{
          transform: `scale(${bellyScale})`,
          transformOrigin: "center",
          transition: inhale
            ? "all 7s linear"
            : "all 16s linear"
        }}
      />

      {/* Nose cue (Nadi Shodhan) */}
      {exercise === "Nadi Shodhan" && (
        <circle
          cx={inhale ? 112 : 128}
          cy="58"
          r="4"
          fill="#6aaac1"
        />
      )}

      {/* Bhramari vibration cue */}
      {exercise === "Bhramari" && exhale && (
        <circle
          cx="120"
          cy="60"
          r="30"
          fill="none"
          stroke="#9fbfc9"
          strokeWidth="2"
          opacity="0.6"
        />
      )}
    </svg>
  );
}
