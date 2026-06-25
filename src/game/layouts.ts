import type { Seat, SeatAttr } from './types';

function S(
  id: string,
  x: number,
  y: number,
  attrs: SeatAttr[],
  adj: string[],
): Seat {
  return { id, x, y, attrs, adj };
}

// ---- BUS ----
export const busLayout: Seat[] = [
  S('L1', 34, 30, ['window', 'front', 'sunlight'], ['R1']),
  S('R1', 60, 30, ['aisle', 'front'], ['L1']),
  S('L2', 34, 50, ['window'], ['R2']),
  S('R2', 60, 50, ['aisle'], ['L2']),
  S('L3', 34, 70, ['window', 'back'], ['R3']),
  S('R3', 60, 70, ['aisle', 'back', 'legroom'], ['L3']),
];

// ---- CLASSROOM ----
export const classroomLayout: Seat[] = [
  S('A', 26, 40, ['front', 'window'], ['B']),
  S('B', 50, 40, ['front'], ['A', 'C']),
  S('C', 74, 40, ['front', 'quiet'], ['B']),
  S('D', 26, 66, ['back', 'window', 'sunlight'], ['E']),
  S('E', 50, 66, ['back'], ['D', 'F']),
  S('F', 74, 66, ['back', 'quiet'], ['E']),
];

// ---- COFFEE SHOP ----
export const coffeeLayout: Seat[] = [
  S('W1', 24, 34, ['window', 'sunlight'], ['W2']),
  S('W2', 44, 34, ['window'], ['W1']),
  S('C1', 70, 38, ['music', 'food'], ['C2']),
  S('C2', 70, 58, ['music', 'food'], ['C1']),
  S('S1', 30, 70, ['quiet'], ['S2']),
  S('S2', 50, 70, ['quiet'], ['S1']),
];

// ---- RESTAURANT ----
export const restaurantLayout: Seat[] = [
  S('B1', 26, 36, ['window', 'quiet'], ['B2']),
  S('B2', 26, 58, ['window', 'quiet'], ['B1']),
  S('T1', 54, 46, ['food'], ['T2']),
  S('T2', 74, 46, ['food', 'aisle'], ['T1']),
  S('B3', 50, 74, ['music'], ['B4']),
  S('B4', 70, 74, ['music', 'sunlight'], ['B3']),
];

// ---- THEATER ----
export const theaterLayout: Seat[] = [
  S('F1', 30, 56, ['front', 'tv', 'aisle'], ['F2']),
  S('F2', 50, 56, ['front', 'tv'], ['F1', 'F3']),
  S('F3', 70, 56, ['front', 'tv'], ['F2']),
  S('K1', 30, 76, ['back', 'tv', 'aisle', 'quiet'], ['K2']),
  S('K2', 50, 76, ['back', 'tv', 'quiet'], ['K1', 'K3']),
  S('K3', 70, 76, ['back', 'tv', 'quiet', 'food'], ['K2']),
];

// ---- AIRPORT: gate windows, charging row (legroom), cafe seats ----
export const airportLayout: Seat[] = [
  S('G1', 28, 32, ['window', 'quiet'], ['G2']),
  S('G2', 50, 32, ['window'], ['G1']),
  S('G3', 28, 54, ['aisle', 'legroom'], ['G4']),
  S('G4', 50, 54, ['aisle'], ['G3']),
  S('G5', 30, 76, ['food'], ['G6']),
  S('G6', 52, 76, ['food', 'music'], ['G5']),
];

// ---- WEDDING: garden window table, dance-floor table, dinner table ----
export const weddingLayout: Seat[] = [
  S('H1', 28, 34, ['window', 'quiet'], ['H2']),
  S('H2', 50, 34, ['quiet'], ['H1']),
  S('M1', 30, 56, ['music'], ['M2']),
  S('M2', 52, 56, ['music', 'sunlight'], ['M1']),
  S('F1', 30, 78, ['food'], ['F2']),
  S('F2', 52, 78, ['food'], ['F1']),
];

// ---- CRUISE SHIP: sun deck, ocean-view, pool bar, quiet lounge ----
export const cruiseLayout: Seat[] = [
  S('D1', 28, 32, ['sunlight', 'window'], ['D2']),
  S('D2', 50, 32, ['window'], ['D1']),
  S('P1', 30, 54, ['music'], ['P2']),
  S('P2', 52, 54, ['music', 'food'], ['P1']),
  S('Q1', 30, 76, ['quiet'], ['Q2']),
  S('Q2', 52, 76, ['quiet'], ['Q1']),
];
