import { useEffect, useRef, useState } from "react";

/**
 * useBreathingEngine
 * -------------------
 * Core breathing timing engine.
 * NO audio side-effects in v1.
 * Deterministic, stable, testable.
 */

export default function useBreathingEngine({
  inhale,
  exhale,
  reps,
  active
}) {
  const [phase, setPhase] = useState("inhale");
  const [seconds, setSeconds] = useState(inhale);
  const [remainingReps, setRemainingReps] = useState(reps);
  const [completed, setCompleted] = useState(false);

  const timerRef = useRef(null);

  /* Reset when exercise restarts */
  const reset = () => {
    clearInterval(timerRef.current);
    setPhase("inhale");
    setSeconds(inhale);
    setRemainingReps(reps);
    setCompleted(false);
  };

  /* Main timing loop */
  useEffect(() => {
    if (!active || completed) return;

    timerRef.current = setInterval(() => {
      setSeconds(s => {
        if (s > 1) return s - 1;

        // Phase transition
        if (phase === "inhale") {
          setPhase("exhale");
          return exhale;
        }

        if (phase === "exhale") {
          if (remainingReps > 1) {
            setRemainingReps(r => r - 1);
            setPhase("inhale");
            return inhale;
          } else {
            clearInterval(timerRef.current);
            setCompleted(true);
            return 0;
          }
        }

        return s;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [
    active,
    phase,
    inhale,
    exhale,
    remainingReps,
    completed
  ]);

  return {
    phase,
    seconds,
    remainingReps,
    completed,
    reset
  };
}
