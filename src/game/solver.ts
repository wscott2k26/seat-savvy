import type { Level, Seat, Character, Constraint, Solution } from './types';

function seatSatisfiesAttr(seat: Seat, c: Constraint): boolean {
  if (c.type === 'attr') return seat.attrs.includes(c.attr!);
  if (c.type === 'noAttr') return !seat.attrs.includes(c.attr!);
  return true;
}

// Check a full assignment (seatId -> charId) against all constraints.
export function isValidAssignment(level: Level, assign: Solution): boolean {
  const seatById = new Map(level.seats.map((s) => [s.id, s]));
  const seatOfChar = new Map<string, string>();
  for (const [seatId, charId] of Object.entries(assign)) {
    seatOfChar.set(charId, seatId);
  }

  for (const char of level.characters) {
    const seatId = seatOfChar.get(char.id);
    if (!seatId) return false; // not placed
    const seat = seatById.get(seatId)!;
    for (const c of char.constraints) {
      if (c.type === 'attr' || c.type === 'noAttr') {
        if (!seatSatisfiesAttr(seat, c)) return false;
      } else if (c.type === 'beside' || c.type === 'notBeside') {
        const otherSeat = seatOfChar.get(c.who!);
        if (!otherSeat) {
          // the partner isn't placed yet -> cannot fully judge.
          if (c.type === 'beside') return false;
          continue;
        }
        const adjacent = seat.adj.includes(otherSeat);
        if (c.type === 'beside' && !adjacent) return false;
        if (c.type === 'notBeside' && adjacent) return false;
      }
    }
  }
  return true;
}

// Returns true only if the *complete* placement so far has no violations.
// Used to validate live player progress (partial allowed for unplaced).
export function violationsFor(
  level: Level,
  assign: Solution,
): Set<string> {
  const seatById = new Map(level.seats.map((s) => [s.id, s]));
  const seatOfChar = new Map<string, string>();
  for (const [seatId, charId] of Object.entries(assign)) {
    seatOfChar.set(charId, seatId);
  }
  const bad = new Set<string>();
  for (const char of level.characters) {
    const seatId = seatOfChar.get(char.id);
    if (!seatId) continue;
    const seat = seatById.get(seatId)!;
    for (const c of char.constraints) {
      if (c.type === 'attr' || c.type === 'noAttr') {
        if (!seatSatisfiesAttr(seat, c)) bad.add(char.id);
      } else if (c.type === 'beside' || c.type === 'notBeside') {
        const otherSeat = seatOfChar.get(c.who!);
        if (!otherSeat) continue; // partner unplaced — neutral
        const adjacent = seat.adj.includes(otherSeat);
        if (c.type === 'beside' && !adjacent) {
          bad.add(char.id);
          bad.add(c.who!);
        }
        if (c.type === 'notBeside' && adjacent) {
          bad.add(char.id);
          bad.add(c.who!);
        }
      }
    }
  }
  return bad;
}

// Enumerate all valid full solutions (chars == seats). Stops early if more
// than `cap` solutions found. Returns the list of solutions found.
export function findSolutions(level: Level, cap = 2): Solution[] {
  const seats = level.seats;
  const chars = level.characters;
  const solutions: Solution[] = [];
  if (seats.length !== chars.length) {
    // fall back: still attempt assignment by index permutations of seats
  }
  const usedSeat = new Array(seats.length).fill(false);
  const assign: Solution = {};

  // Order characters by most-constrained first for speed.
  const order = [...chars].sort(
    (a, b) => b.constraints.length - a.constraints.length,
  );

  function backtrack(idx: number) {
    if (solutions.length >= cap) return;
    if (idx === order.length) {
      if (isValidAssignment(level, assign)) {
        solutions.push({ ...assign });
      }
      return;
    }
    const char = order[idx];
    for (let s = 0; s < seats.length; s++) {
      if (usedSeat[s]) continue;
      const seat = seats[s];
      // quick prune on attr constraints
      let ok = true;
      for (const c of char.constraints) {
        if (c.type === 'attr' && !seat.attrs.includes(c.attr!)) ok = false;
        if (c.type === 'noAttr' && seat.attrs.includes(c.attr!)) ok = false;
        if (!ok) break;
      }
      if (!ok) continue;
      usedSeat[s] = true;
      assign[seat.id] = char.id;
      backtrack(idx + 1);
      delete assign[seat.id];
      usedSeat[s] = false;
      if (solutions.length >= cap) return;
    }
  }
  backtrack(0);
  return solutions;
}

export interface ValidationResult {
  solvable: boolean;
  unique: boolean;
  solution?: Solution;
}

export function validateLevel(level: Level): ValidationResult {
  const sols = findSolutions(level, 2);
  return {
    solvable: sols.length >= 1,
    unique: sols.length === 1,
    solution: sols[0],
  };
}
