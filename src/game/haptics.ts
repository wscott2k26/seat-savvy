export interface HapticPreferences {
  hapticsOn: boolean;
  vibrationOn: boolean;
}

export type HapticCue = 'correct' | 'wrong' | 'win' | 'tap' | 'achievement';

const PATTERNS: Record<HapticCue, number | number[]> = {
  tap: 8,
  correct: 14,
  wrong: [16, 35, 16],
  win: [24, 42, 48, 42, 76],
  achievement: [14, 30, 24],
};

export function playHaptic(cue: HapticCue, preferences: HapticPreferences) {
  if (!preferences.hapticsOn || !preferences.vibrationOn) return;
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;

  navigator.vibrate(PATTERNS[cue]);
}
