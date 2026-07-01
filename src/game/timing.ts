import type { Level } from './types';

export type PlayMode = 'relaxed' | 'timed';

export function timeGoalSeconds(level: Level): number {
  const count = level.characters.length;
  if (count >= 24) return 480;
  if (count >= 20) return 390;
  if (count >= 15) return 280;
  if (count >= 10) return 145;
  return 80;
}

export function timeLimitSeconds(level: Level): number {
  const goal = timeGoalSeconds(level);
  if (level.characters.length >= 24) return goal + 190;
  if (level.characters.length >= 20) return goal + 150;
  if (level.characters.length >= 15) return goal + 105;
  if (level.characters.length >= 10) return goal + 55;
  return goal + 35;
}

export function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}
