import type { Level } from './types';

export type PlayMode = 'relaxed' | 'timed';

export function timeGoalSeconds(level: Level): number {
  const count = level.characters.length;
  if (count >= 14) return 240;
  if (count >= 12) return 190;
  if (count >= 10) return 145;
  return 80;
}

export function timeLimitSeconds(level: Level): number {
  const goal = timeGoalSeconds(level);
  if (level.characters.length >= 14) return goal + 95;
  if (level.characters.length >= 12) return goal + 70;
  if (level.characters.length >= 10) return goal + 55;
  return goal + 35;
}

export function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}
