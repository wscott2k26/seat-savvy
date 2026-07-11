import type { PlayMode } from './timing';

export type DifficultyLane = 'easy' | 'medium' | 'hard';

interface DifficultyProgressState {
  easy: number[];
  medium: number[];
  hard: number[];
}

export interface DifficultyAccess {
  unlocked: boolean;
  label: string;
  detail: string;
  badge: string;
}

const STORAGE_KEY = 'seat_savvy_difficulty_progress_v1';
const TRIAL_LEVELS = 6;
const PREMIUM_LOCK_START_LEVEL = 30;

const DEFAULT_STATE: DifficultyProgressState = {
  easy: [],
  medium: [],
  hard: [],
};

export function laneForMode(mode: PlayMode): DifficultyLane {
  if (mode === 'hard') return 'hard';
  if (mode === 'medium' || mode === 'timed') return 'medium';
  return 'easy';
}

export function readDifficultyProgress(): DifficultyProgressState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<DifficultyProgressState>;
    return {
      easy: normalizeIds(parsed.easy),
      medium: normalizeIds(parsed.medium),
      hard: normalizeIds(parsed.hard),
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function recordDifficultyCompletion(mode: PlayMode, levelId: number) {
  if (typeof window === 'undefined') return;
  const lane = laneForMode(mode);
  const current = readDifficultyProgress();
  const existing = new Set(current[lane]);
  existing.add(levelId);
  const next: DifficultyProgressState = {
    ...current,
    [lane]: Array.from(existing).sort((a, b) => a - b),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can fail in private browsing; ignore and keep the game playable.
  }
}

export function difficultyAccessFor(
  mode: PlayMode,
  levelId: number,
  premium: boolean,
): DifficultyAccess {
  const lane = laneForMode(mode);
  const label = lane === 'easy' ? 'Easy' : lane === 'medium' ? 'Medium' : 'Hard';

  if (lane === 'easy') {
    return {
      unlocked: true,
      label,
      detail: 'Story mode stays open.',
      badge: 'Open',
    };
  }

  if (!premium && levelId >= PREMIUM_LOCK_START_LEVEL) {
    return {
      unlocked: false,
      label,
      detail: `The final ${label} tier is part of Full Adventure.`,
      badge: 'Premium',
    };
  }

  if (levelId <= TRIAL_LEVELS) {
    return {
      unlocked: true,
      label,
      detail: 'Free trial tier.',
      badge: 'Try free',
    };
  }

  const progress = readDifficultyProgress();
  const completedCount = progress[lane].length;
  const required = Math.floor((levelId - 1) / TRIAL_LEVELS) * TRIAL_LEVELS;

  if (completedCount >= required) {
    return {
      unlocked: true,
      label,
      detail: `${completedCount}/${required} ${label} clears for this tier.`,
      badge: 'Unlocked',
    };
  }

  const remaining = Math.max(0, required - completedCount);
  return {
    unlocked: false,
    label,
    detail: `Solve ${remaining} more ${label} puzzle${remaining === 1 ? '' : 's'} to unlock this tier.`,
    badge: `${completedCount}/${required}`,
  };
}

function normalizeIds(value?: number[]): number[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id) && id > 0),
    ),
  ).sort((a, b) => a - b);
}
