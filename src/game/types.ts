// Core type definitions for Tiny Worlds: Seat Savvy

export type SeatAttr =
  | 'window'
  | 'aisle'
  | 'legroom'
  | 'tv'
  | 'music'
  | 'food'
  | 'sunlight'
  | 'quiet'
  | 'front'
  | 'back';

export type ConstraintType =
  | 'attr' // seat must have attr
  | 'noAttr' // seat must NOT have attr
  | 'beside' // must be adjacent to character `who`
  | 'notBeside'; // must NOT be adjacent to character `who`

export interface Constraint {
  type: ConstraintType;
  attr?: SeatAttr;
  who?: string; // character id
}

export interface Character {
  id: string;
  name: string;
  hue: number; // base color hue for the avatar
  trait: string; // short personality label
  constraints: Constraint[];
}

export interface Seat {
  id: string;
  attrs: SeatAttr[];
  adj: string[]; // adjacent seat ids
  x: number; // 0..100 relative position in the scene
  y: number; // 0..100 relative position in the scene
}

export type EnvironmentId =
  | 'bus'
  | 'classroom'
  | 'coffee'
  | 'restaurant'
  | 'theater'
  | 'airport'
  | 'wedding'
  | 'cruise';

export interface Level {
  id: number;
  env: EnvironmentId;
  title: string;
  intro: string;
  outro: string;
  hostName: string;
  seats: Seat[];
  characters: Character[];
}

// solution: map of seatId -> characterId
export type Solution = Record<string, string>;
