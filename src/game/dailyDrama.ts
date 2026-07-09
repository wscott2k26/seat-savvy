import type { Level } from './types';
import type { CompletionRewards } from './lifeData';

const DRAMA_TITLES = [
  'Family Reunion Drama',
  'Office Meeting Madness',
  'Church Pew Shuffle',
  'Movie Night Petty Party',
  'Wedding Table Trouble',
  'Airport Gate Gossip',
  'Thanksgiving Seat Storm',
];

const DRAMA_LEVELS = [
  'Petty Crocker',
  'Side-Eye Certified',
  'Auntie Energy',
  'Group Chat Survivor',
  'Peacekeeper Pro',
  'Table Whisperer',
];

const CLUEWORDS = [
  { clue: 'Tells everybody’s business', answer: 'GOSSIP', rule: 'The gossip wants a seat away from the quiet guest.' },
  { clue: 'Needs space to stretch', answer: 'LEGROOM', rule: 'The tall guest is looking for extra room.' },
  { clue: 'Wants snacks nearby', answer: 'FOODIE', rule: 'The hungry guest belongs near food.' },
  { clue: 'Avoids loud places', answer: 'QUIET', rule: 'The calm guest wants a quiet spot.' },
  { clue: 'Loves watching outside', answer: 'WINDOW', rule: 'The dreamer wants a window seat.' },
  { clue: 'Needs a fast exit', answer: 'AISLE', rule: 'The nervous guest prefers the aisle.' },
  { clue: 'Lives for the playlist', answer: 'MUSIC', rule: 'The dancer wants to sit near music.' },
];

export interface DailyDramaPick {
  level: Level;
  title: string;
  tagline: string;
  dramaLevel: string;
  dayNumber: number;
}

export interface Clueword {
  clue: string;
  answer: string;
  rule: string;
}

export function pickDailyDramaLevel(
  levels: Level[],
  completedCount: number,
  freeLevels: number,
): DailyDramaPick {
  const dayNumber = dayOfYear();
  const reachableMax = Math.max(1, Math.min(freeLevels, completedCount + 1));
  const pool = levels.filter((level) => level.id <= reachableMax && level.characters.length <= 10);
  const level = pool[dayNumber % Math.max(1, pool.length)] ?? levels[0];
  const title = DRAMA_TITLES[dayNumber % DRAMA_TITLES.length];
  const dramaLevel = DRAMA_LEVELS[(dayNumber + level.id) % DRAMA_LEVELS.length];
  return {
    level,
    title,
    dramaLevel,
    dayNumber,
    tagline: dramaTagline(level),
  };
}

export function cluewordForLevel(level: Level): Clueword {
  return CLUEWORDS[(level.id + level.characters.length) % CLUEWORDS.length];
}

export function shareCardForLevel(
  level: Level,
  stars: number,
  stats: { moves: number; hintsUsed: number; mistakes: number },
  rewards?: CompletionRewards | null,
): string {
  const dramaLevel = DRAMA_LEVELS[(level.id + stars + stats.moves) % DRAMA_LEVELS.length];
  const time = rewards?.elapsedSeconds ? `${rewards.elapsedSeconds}s` : 'fresh solve';
  const hintLine = stats.hintsUsed === 0 ? 'No hints used' : `${stats.hintsUsed} hints used`;
  const mistakeLine = stats.mistakes === 0 ? 'clean table' : `${stats.mistakes} seat drama slips`;
  const starBlocks = Array.from({ length: 3 })
    .map((_, index) => (index < stars ? '🟩' : '⬜'))
    .join('');

  return [
    `SeatSavvy Daily Drama #${level.id}`,
    `${level.title}`,
    `Solved in ${stats.moves} moves / ${time}`,
    `${hintLine} / ${mistakeLine}`,
    `Drama Level: ${dramaLevel}`,
    `🪑 ${starBlocks}`,
  ].join('\n');
}

function dramaTagline(level: Level): string {
  switch (level.env) {
    case 'wedding':
      return 'Keep the cake lovers apart from the dance-floor chaos.';
    case 'restaurant':
      return 'Seat the hungry folks before the side-eye gets loud.';
    case 'theater':
      return 'Popcorn, aisles, and front-row feelings are all involved.';
    case 'airport':
      return 'One gate change away from a full group-chat meltdown.';
    case 'classroom':
      return 'The quiet kids, window dreamers, and chaos crew all need peace.';
    case 'coffee':
      return 'Lattes, sunlight, and introvert seating politics.';
    case 'bus':
      return 'A tiny ride, big opinions, and everybody wants “their” seat.';
    default:
      return 'A tiny room with big feelings. Seat carefully.';
  }
}

function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime() + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / 86_400_000);
}
