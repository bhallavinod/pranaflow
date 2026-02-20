export function createSessionLogger() {
  const events = [];
  const startTime = Date.now();

  return {
    log(event) {
      events.push({ ...event, timestamp: Date.now() });
    },

    summary() {
      let inhaleTime = 0;
      let exhaleTime = 0;
      let breaths = 0;

      events.forEach(e => {
        if (e.phase === "inhale") {
          inhaleTime += e.seconds;
          breaths += 1;
        }
        if (e.phase === "exhale") {
          exhaleTime += e.seconds;
        }
      });

      return {
        durationSeconds: Math.round((Date.now() - startTime) / 1000),
        breaths,
        inhaleTime,
        exhaleTime,
        events
      };
    }
  };
}
