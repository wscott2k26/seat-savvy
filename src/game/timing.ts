import type { Level } from './types';

export type PlayMode = 'relaxed' | 'medium' | 'hard' | 'timed';

export function playModeLabel(mode: PlayMode): string {
  if (mode === 'hard') return 'Hard';
  if (mode === 'medium' || mode === 'timed') return 'Medium';
  return 'Easy';
}

function baseGoalSeconds(level: Level): number {
  const count = level.characters.length;
  if (count >= 30) return 620;
  if (count >= 28) return 570;
  if (count >= 26) return 530;
  if (count >= 24) return 480;
  if (count >= 20) return 390;
  if (count >= 15) return 280;
  if (count >= 10) return 145;
  return 80;
}

export function timeGoalSeconds(level: Level, mode: PlayMode = 'relaxed'): number {
  const base = baseGoalSeconds(level);
  if (mode === 'hard') return Math.round(base * 0.62);
  if (mode === 'medium' || mode === 'timed') return Math.round(base * 0.8);
  return base;
}

export function timeLimitSeconds(level: Level, mode: PlayMode = 'relaxed'): number {
  const goal = timeGoalSeconds(level, mode);
  const count = level.characters.length;
  if (mode === 'hard') {
    if (count >= 30) return goal + 120;
    if (count >= 24) return goal + 105;
    if (count >= 20) return goal + 85;
    if (count >= 15) return goal + 65;
    if (count >= 10) return goal + 40;
    return goal + 22;
  }
  if (mode === 'medium' || mode === 'timed') {
    if (count >= 30) return goal + 170;
    if (count >= 24) return goal + 150;
    if (count >= 20) return goal + 120;
    if (count >= 15) return goal + 90;
    if (count >= 10) return goal + 50;
    return goal + 30;
  }
  if (count >= 30) return goal + 230;
  if (count >= 24) return goal + 190;
  if (count >= 20) return goal + 150;
  if (count >= 15) return goal + 105;
  if (count >= 10) return goal + 55;
  return goal + 35;
}

export function rewardMultiplier(mode: PlayMode): number {
  if (mode === 'hard') return 1.45;
  if (mode === 'medium' || mode === 'timed') return 1.2;
  return 1;
}

export function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}
