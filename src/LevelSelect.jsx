export function getLevelTiming(level) {
  switch (level) {
    case "advanced":
      return { inhale: 6, exhale: 8, hold: 64 };
    case "intermediate":
      return { inhale: 5, exhale: 7, hold: 32 };
    default:
      return { inhale: 4, exhale: 6, hold: 16 }; // beginner
  }
}
