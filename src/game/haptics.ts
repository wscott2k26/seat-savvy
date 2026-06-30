import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

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
  void playNativeHaptic(cue);
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;

  navigator.vibrate(PATTERNS[cue]);
}

async function playNativeHaptic(cue: HapticCue) {
  try {
    if (cue === 'correct') {
      await Haptics.notification({ type: NotificationType.Success });
      return;
    }
    if (cue === 'wrong') {
      await Haptics.notification({ type: NotificationType.Error });
      return;
    }
    if (cue === 'win' || cue === 'achievement') {
      await Haptics.notification({ type: NotificationType.Success });
      await Haptics.impact({ style: ImpactStyle.Heavy });
      return;
    }
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Native haptics are best-effort; web vibration remains the fallback path.
  }
}
