import type { Character, Constraint, EnvironmentId, Level, Seat, SeatAttr } from './types';
import { ENVIRONMENT_LABELS } from './locations';

const ATTR_POOL: SeatAttr[] = [
  'window',
  'aisle',
  'legroom',
  'tv',
  'music',
  'food',
  'sunlight',
  'quiet',
  'front',
  'back',
];

const want = (attr: SeatAttr): Constraint => ({ type: 'attr', attr });

const NAMES = [
  'Ari',
  'Bea',
  'Cleo',
  'Dax',
  'Emi',
  'Finn',
  'Gia',
  'Hugo',
  'Ivy',
  'Joon',
  'Kira',
  'Leo',
  'Mina',
  'Nico',
  'Opal',
  'Pax',
  'Quinn',
  'Rae',
  'Sage',
  'Theo',
  'Uma',
  'Vale',
  'Wren',
  'Zuri',
  'Moss',
  'Nova',
  'Orla',
  'Pia',
  'Rune',
  'Sola',
];

const TRAITS = [
  'Window planner',
  'Music matcher',
  'Quiet thinker',
  'Snack scout',
  'Back-row calm',
  'Needs space',
  'Social listener',
  'Sunny aisle fan',
  'Food watcher',
  'Legroom seeker',
  'Screen fan',
  'Quiet viewer',
  'Bright snack fan',
  'Back music fan',
  'Window stretcher',
  'Showtime snacker',
  'Front-row focus',
  'Aisle strategist',
  'Sun spot hunter',
  'Calm corner fan',
  'Snack route planner',
  'Music row regular',
  'Quiet window fan',
  'Roomy-seat seeker',
  'Back-row reader',
  'Front snack scout',
  'Screen-and-song fan',
  'Gentle crowd watcher',
  'Corner-seat planner',
  'Bright aisle thinker',
];

type GeneratedSeatCount = 10 | 15 | 20 | 24;

interface ExpansionSpec {
  env: EnvironmentId;
  host: string;
  title: string;
  count: GeneratedSeatCount;
}

const EXPANSION_SPECS: ExpansionSpec[] = [
  { env: 'library', host: 'Librarian Luma', title: 'Whisper Row Shuffle', count: 15 },
  { env: 'hospital', host: 'Nurse Nia', title: 'Waiting Room Wave', count: 15 },
  { env: 'train', host: 'Conductor Vale', title: 'Train Car Tangle', count: 15 },
  { env: 'subway', host: 'Station Sam', title: 'Rush Hour Platform', count: 15 },
  { env: 'ferry', host: 'Captain Reed', title: 'Ferry Seat Drift', count: 15 },
  { env: 'campsite', host: 'Ranger Pip', title: 'Campfire Circle', count: 15 },
  { env: 'museum', host: 'Curator Cora', title: 'Gallery Opening', count: 15 },
  { env: 'aquarium', host: 'Guide Marina', title: 'Coral Hall Queue', count: 15 },
  { env: 'zoo', host: 'Keeper Kai', title: 'Pavilion Parade', count: 15 },
  { env: 'planetarium', host: 'Dr. Nova', title: 'Starlight Seating', count: 15 },
  { env: 'shopping-mall', host: 'Mall Host Mira', title: 'Atrium Crowd Control', count: 15 },
  { env: 'arcade', host: 'Pixel Pat', title: 'Token Rush', count: 15 },
  { env: 'bowling-alley', host: 'Coach Lane', title: 'Lane Night Lineup', count: 20 },
  { env: 'spa', host: 'Aroma Ana', title: 'Quiet Retreat Rotation', count: 20 },
  { env: 'fitness-studio', host: 'Coach Koa', title: 'Studio Class Switch', count: 20 },
  { env: 'office', host: 'Manager Mel', title: 'Office All-Hands', count: 20 },
  { env: 'coworking-space', host: 'Desk Host Dot', title: 'Coworking Crunch', count: 20 },
  { env: 'courthouse', host: 'Clerk Rowan', title: 'Hearing Room Order', count: 20 },
  { env: 'bank', host: 'Teller Theo', title: 'Lobby Line Logic', count: 20 },
  { env: 'hotel-lobby', host: 'Concierge Sol', title: 'Check-In Shuffle', count: 20 },
  { env: 'ski-lodge', host: 'Host Aspen', title: 'Lodge Fireplace Jam', count: 20 },
  { env: 'beach-resort', host: 'Lifeguard Lani', title: 'Cabana Crowd', count: 20 },
  { env: 'city-park', host: 'Ranger Rue', title: 'Picnic Bench Puzzle', count: 20 },
  { env: 'botanical-garden', host: 'Gardener Fern', title: 'Glasshouse Gathering', count: 20 },
  { env: 'rooftop-party', host: 'DJ Skyline', title: 'Rooftop Rush', count: 20 },
  { env: 'concert-hall', host: 'Usher Aria', title: 'Encore Seating', count: 20 },
  { env: 'street-festival', host: 'Planner Pop', title: 'Festival Flow', count: 20 },
  { env: 'farmers-market', host: 'Vendor Vee', title: 'Market Morning Maze', count: 20 },
  { env: 'food-truck-park', host: 'Chef Wheels', title: 'Truck Park Trouble', count: 24 },
  { env: 'diner', host: 'Server Sunny', title: 'Midnight Diner Dash', count: 24 },
  { env: 'bakery', host: 'Baker Bea', title: 'Pastry Counter Panic', count: 24 },
  { env: 'pizzeria', host: 'Chef Nico', title: 'Pizza Night Pileup', count: 24 },
  { env: 'sushi-bar', host: 'Chef Sora', title: 'Sushi Bar Switch', count: 24 },
  { env: 'board-game-cafe', host: 'Tabletop Tess', title: 'Board Game Blitz', count: 24 },
  { env: 'bookstore', host: 'Page Parker', title: 'Book Launch Line', count: 24 },
  { env: 'art-studio', host: 'Painter Pia', title: 'Studio Critique Crunch', count: 24 },
  { env: 'science-lab', host: 'Dr. Bunsen', title: 'Lab Partner Logic', count: 24 },
  { env: 'observatory', host: 'Astronomer Astra', title: 'Telescope Night Rush', count: 24 },
  { env: 'spaceship', host: 'Captain Orbit', title: 'Orbital Seat Sort', count: 24 },
  { env: 'castle-banquet', host: 'Steward Sterling', title: 'Castle Banquet Finale', count: 24 },
];

export const EXPANSION_LEVELS: Level[] = EXPANSION_SPECS.map((spec, index) =>
  makeGeneratedLevel({
    id: 40 + index,
    env: spec.env,
    title: spec.title,
    hostName: spec.host,
    intro:
      `${ENVIRONMENT_LABELS[spec.env]} is packed today. ${spec.count} guests have sharper preferences now, so match every icon before the room gets restless.`,
    outro:
      `${ENVIRONMENT_LABELS[spec.env]} settles into a smooth rhythm. Every guest found the exact spot they were hoping for.`,
    count: spec.count,
    seed: 400 + index,
  }),
);

export function rebalanceStoryLevels(levels: Level[]): Level[] {
  return levels.map((level, index) =>
    makeGeneratedLevel({
      id: level.id,
      env: level.env,
      title: level.title,
      hostName: level.hostName,
      intro:
        `${level.intro} This version seats 10 guests, and the tray order is mixed so every clue matters.`,
      outro: level.outro,
      count: 10,
      seed: 100 + index,
    }),
  );
}

function makeGeneratedLevel(input: {
  id: number;
  env: EnvironmentId;
  title: string;
  hostName: string;
  intro: string;
  outro: string;
  count: GeneratedSeatCount;
  seed: number;
}): Level {
  const comboSeed = input.seed * 37 + input.count * 11;
  const combos = shuffledCombos(comboSeed).slice(0, input.count);
  const seats = makeGridSeats(input.count, combos);
  const solvedCharacters = seats.map((seat, seatIndex) =>
    makeCharacter(input.id, seatIndex, seat.attrs, comboSeed),
  );

  return {
    id: input.id,
    env: input.env,
    title: input.title,
    hostName: input.hostName,
    intro: input.intro,
    outro: input.outro,
    seats,
    characters: deranged(solvedCharacters, input.seed + input.id),
  };
}

function makeCharacter(
  levelId: number,
  seatIndex: number,
  attrs: SeatAttr[],
  seed: number,
): Character {
  const nameIndex = (seatIndex * 7 + seed) % NAMES.length;
  const traitIndex = (seatIndex * 5 + seed) % TRAITS.length;

  return {
    id: `l${levelId}c${seatIndex + 1}`,
    name: NAMES[nameIndex],
    hue: (levelId * 41 + seatIndex * 37 + seed) % 360,
    trait: TRAITS[traitIndex],
    constraints: attrs.map(want),
  };
}

function makeGridSeats(count: GeneratedSeatCount, combos: SeatAttr[][]): Seat[] {
  const cols = count === 24 ? 6 : 5;
  const rows = Math.ceil(count / cols);
  const xs =
    cols === 6
      ? [9, 25, 41, 59, 75, 91]
      : [12, 31, 50, 69, 88];
  const yRows =
    rows === 2
      ? [34, 64]
      : rows === 3
        ? [26, 50, 74]
        : [20, 38, 56, 74];

  const seats: Seat[] = Array.from({ length: count }).map((_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return {
      id: `S${index + 1}`,
      x: xs[col],
      y: yRows[row],
      attrs: combos[index],
      adj: [],
    };
  });

  return seats.map((seat, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const adj: string[] = [];
    const maybeAdd = (candidateIndex: number) => {
      const candidate = seats[candidateIndex];
      if (candidate) adj.push(candidate.id);
    };

    if (col > 0) maybeAdd(index - 1);
    if (col < cols - 1 && index + 1 < count) maybeAdd(index + 1);
    if (row > 0) maybeAdd(index - cols);
    if (row < rows - 1 && index + cols < count) maybeAdd(index + cols);

    return { ...seat, adj };
  });
}

function shuffledCombos(seed: number): SeatAttr[][] {
  const combos: SeatAttr[][] = [];
  for (let a = 0; a < ATTR_POOL.length - 2; a += 1) {
    for (let b = a + 1; b < ATTR_POOL.length - 1; b += 1) {
      for (let c = b + 1; c < ATTR_POOL.length; c += 1) {
        combos.push([ATTR_POOL[a], ATTR_POOL[b], ATTR_POOL[c]]);
      }
    }
  }
  return shuffle(combos, seed);
}

function deranged<T>(items: T[], seed: number): T[] {
  if (items.length < 2) return items;
  const shuffled = shuffle(items, seed);
  for (let index = 0; index < shuffled.length; index += 1) {
    if (shuffled[index] !== items[index]) continue;
    const swapIndex = (index + 1) % shuffled.length;
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function shuffle<T>(items: T[], seed: number): T[] {
  const result = [...items];
  let state = seed || 1;
  const next = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(next() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}
