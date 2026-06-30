import type { Character, Constraint, EnvironmentId, Level, Seat, SeatAttr } from './types';
import { ENVIRONMENT_LABELS } from './locations';

const want = (attr: SeatAttr): Constraint => ({ type: 'attr', attr });

const SEAT_COMBOS: SeatAttr[][] = [
  ['window', 'front', 'sunlight'],
  ['aisle', 'front', 'music'],
  ['window', 'quiet', 'front'],
  ['aisle', 'food', 'front'],
  ['window', 'back', 'quiet'],
  ['aisle', 'back', 'legroom'],
  ['food', 'music', 'back'],
  ['sunlight', 'music', 'aisle'],
  ['window', 'food', 'back'],
  ['quiet', 'legroom', 'aisle'],
  ['tv', 'front', 'aisle'],
  ['tv', 'quiet', 'window'],
  ['food', 'sunlight', 'front'],
  ['music', 'quiet', 'back'],
  ['legroom', 'window', 'back'],
  ['tv', 'food', 'music'],
];

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
];

interface ExpansionSpec {
  env: EnvironmentId;
  host: string;
  title: string;
  count: 10 | 12 | 14;
}

const EXPANSION_SPECS: ExpansionSpec[] = [
  { env: 'library', host: 'Librarian Luma', title: 'Whisper Row Shuffle', count: 10 },
  { env: 'hospital', host: 'Nurse Nia', title: 'Waiting Room Wave', count: 10 },
  { env: 'train', host: 'Conductor Vale', title: 'Train Car Tangle', count: 10 },
  { env: 'subway', host: 'Station Sam', title: 'Rush Hour Platform', count: 10 },
  { env: 'ferry', host: 'Captain Reed', title: 'Ferry Seat Drift', count: 10 },
  { env: 'campsite', host: 'Ranger Pip', title: 'Campfire Circle', count: 10 },
  { env: 'museum', host: 'Curator Cora', title: 'Gallery Opening', count: 10 },
  { env: 'aquarium', host: 'Guide Marina', title: 'Coral Hall Queue', count: 10 },
  { env: 'zoo', host: 'Keeper Kai', title: 'Pavilion Parade', count: 10 },
  { env: 'planetarium', host: 'Dr. Nova', title: 'Starlight Seating', count: 10 },
  { env: 'shopping-mall', host: 'Mall Host Mira', title: 'Atrium Crowd Control', count: 10 },
  { env: 'arcade', host: 'Pixel Pat', title: 'Token Rush', count: 10 },
  { env: 'bowling-alley', host: 'Coach Lane', title: 'Lane Night Lineup', count: 12 },
  { env: 'spa', host: 'Aroma Ana', title: 'Quiet Retreat Rotation', count: 12 },
  { env: 'fitness-studio', host: 'Coach Koa', title: 'Studio Class Switch', count: 12 },
  { env: 'office', host: 'Manager Mel', title: 'Office All-Hands', count: 12 },
  { env: 'coworking-space', host: 'Desk Host Dot', title: 'Coworking Crunch', count: 12 },
  { env: 'courthouse', host: 'Clerk Rowan', title: 'Hearing Room Order', count: 12 },
  { env: 'bank', host: 'Teller Theo', title: 'Lobby Line Logic', count: 12 },
  { env: 'hotel-lobby', host: 'Concierge Sol', title: 'Check-In Shuffle', count: 12 },
  { env: 'ski-lodge', host: 'Host Aspen', title: 'Lodge Fireplace Jam', count: 12 },
  { env: 'beach-resort', host: 'Lifeguard Lani', title: 'Cabana Crowd', count: 12 },
  { env: 'city-park', host: 'Ranger Rue', title: 'Picnic Bench Puzzle', count: 12 },
  { env: 'botanical-garden', host: 'Gardener Fern', title: 'Glasshouse Gathering', count: 12 },
  { env: 'rooftop-party', host: 'DJ Skyline', title: 'Rooftop Rush', count: 12 },
  { env: 'concert-hall', host: 'Usher Aria', title: 'Encore Seating', count: 12 },
  { env: 'street-festival', host: 'Planner Pop', title: 'Festival Flow', count: 12 },
  { env: 'farmers-market', host: 'Vendor Vee', title: 'Market Morning Maze', count: 12 },
  { env: 'food-truck-park', host: 'Chef Wheels', title: 'Truck Park Trouble', count: 14 },
  { env: 'diner', host: 'Server Sunny', title: 'Midnight Diner Dash', count: 14 },
  { env: 'bakery', host: 'Baker Bea', title: 'Pastry Counter Panic', count: 14 },
  { env: 'pizzeria', host: 'Chef Nico', title: 'Pizza Night Pileup', count: 14 },
  { env: 'sushi-bar', host: 'Chef Sora', title: 'Sushi Bar Switch', count: 14 },
  { env: 'board-game-cafe', host: 'Tabletop Tess', title: 'Board Game Blitz', count: 14 },
  { env: 'bookstore', host: 'Page Parker', title: 'Book Launch Line', count: 14 },
  { env: 'art-studio', host: 'Painter Pia', title: 'Studio Critique Crunch', count: 14 },
  { env: 'science-lab', host: 'Dr. Bunsen', title: 'Lab Partner Logic', count: 14 },
  { env: 'observatory', host: 'Astronomer Astra', title: 'Telescope Night Rush', count: 14 },
  { env: 'spaceship', host: 'Captain Orbit', title: 'Orbital Seat Sort', count: 14 },
  { env: 'castle-banquet', host: 'Steward Sterling', title: 'Castle Banquet Finale', count: 14 },
];

export const EXPANSION_LEVELS: Level[] = EXPANSION_SPECS.map((spec, index) =>
  makeExpansionLevel(40 + index, spec, index),
);

function makeExpansionLevel(id: number, spec: ExpansionSpec, index: number): Level {
  const label = ENVIRONMENT_LABELS[spec.env];
  const comboOffset = index % (SEAT_COMBOS.length - spec.count + 1);
  const seats = makeGridSeats(spec.count, comboOffset);

  return {
    id,
    env: spec.env,
    title: spec.title,
    hostName: spec.host,
    intro:
      `${label} is packed today. ${spec.count} guests have sharper preferences now, so match every icon before the room gets restless.`,
    outro:
      `${label} settles into a smooth rhythm. Every guest found the exact spot they were hoping for.`,
    seats,
    characters: seats.map((seat, seatIndex) =>
      makeCharacter(id, seatIndex, seat.attrs, comboOffset),
    ),
  };
}

function makeCharacter(
  levelId: number,
  seatIndex: number,
  attrs: SeatAttr[],
  comboOffset: number,
): Character {
  const nameIndex = (seatIndex + comboOffset) % NAMES.length;

  return {
    id: `l${levelId}c${seatIndex + 1}`,
    name: NAMES[nameIndex],
    hue: (levelId * 41 + seatIndex * 37) % 360,
    trait: TRAITS[(seatIndex + comboOffset) % TRAITS.length],
    constraints: attrs.map(want),
  };
}

function makeGridSeats(count: 10 | 12 | 14, comboOffset: number): Seat[] {
  const cols = count === 10 ? 2 : count === 12 ? 3 : 4;
  const rows = Math.ceil(count / cols);
  const xs =
    cols === 2
      ? [34, 60]
      : cols === 3
        ? [24, 50, 76]
        : [18, 39, 61, 82];
  const yStep = rows === 5 ? 18 : 20;
  const yStart = rows === 5 ? 14 : 20;

  const seats: Seat[] = Array.from({ length: count }).map((_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return {
      id: `S${index + 1}`,
      x: xs[col],
      y: yStart + row * yStep,
      attrs: SEAT_COMBOS[comboOffset + index],
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
