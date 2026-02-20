import React, { useState } from "react";
import LandingPage from "./LandingPage";
import LiveExercise from "./LiveExercise";
import { EXERCISES } from "./exercises";

export default function App() {
  const [lang, setLang] = useState("en");
  const [exercises, setExercises] = useState(EXERCISES);
  const [level, setLevel] = useState("beginner");
  const [screen, setScreen] = useState("landing");

  // timing map exactly as intended
  const timingMap = {
    beginner: { inhale: 6, exhale: 12, hold: 16 },
    intermediate: { inhale: 8, exhale: 16, hold: 32 },
    advanced: { inhale: 12, exhale: 24, hold: 64 }
  };

  return (
    <>
      {/* LANGUAGE TOGGLE */}
      <div style={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }}>
        <button onClick={() => setLang("en")}>EN</button>
        <button onClick={() => setLang("hi")}>HI</button>
      </div>

      {/* LANDING PAGE — EXACT 11 AM CONTRACT */}
      {screen === "landing" && (
        <LandingPage
          exercises={exercises}
          lang={lang}
          level={level}
          onLevelChange={setLevel}
          onChangeReps={(index, reps) =>
            setExercises(prev =>
              prev.map((e, i) =>
                i === index ? { ...e, reps } : e
              )
            )
          }
          onStart={() => setScreen("session")}
        />
      )}

      {/* SESSION */}
      {screen === "session" && (
        <LiveExercise
          exercises={exercises.filter(e => e.reps > 0)}
          levelTiming={timingMap[level]}
          lang={lang}
          onExit={() => setScreen("landing")}
        />
      )}
    </>
  );
}
