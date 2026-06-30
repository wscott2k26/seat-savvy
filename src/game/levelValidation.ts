import type {
  Constraint,
  ConstraintType,
  EnvironmentId,
  Level,
  SeatAttr,
} from './types';
import { findSolutions } from './solver';

const VALID_SEAT_ATTRS: SeatAttr[] = [
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

const VALID_CONSTRAINT_TYPES: ConstraintType[] = [
  'attr',
  'noAttr',
  'beside',
  'notBeside',
];

const VALID_ENVIRONMENTS: EnvironmentId[] = [
  'bus',
  'classroom',
  'coffee',
  'restaurant',
  'theater',
  'airport',
  'wedding',
  'cruise',
];

const CHARACTER_SEAT_FIELDS = [
  'seat',
  'seatId',
  'startSeat',
  'initialSeat',
  'currentSeat',
];

const SEAT_OCCUPANT_FIELDS = [
  'character',
  'characterId',
  'charId',
  'guestId',
  'occupant',
  'occupantId',
];

export type LevelValidationSeverity = 'error' | 'warning';

export interface LevelValidationIssue {
  severity: LevelValidationSeverity;
  code: string;
  message: string;
  path?: string;
}

export interface LevelValidationReport {
  levelId: number;
  title: string;
  solutionCount: number;
  solutionCountLabel: string;
  solutionCountCapped: boolean;
  unique: boolean;
  impossible: boolean;
  brokenConstraints: LevelValidationIssue[];
  issues: LevelValidationIssue[];
}

interface ValidateAllOptions {
  solutionCap?: number;
}

const DEFAULT_SOLUTION_CAP = 1000;

export function validateAllLevels(
  levels: Level[],
  options: ValidateAllOptions = {},
): LevelValidationReport[] {
  const levelIdCounts = new Map<number, number>();
  for (const level of levels) {
    levelIdCounts.set(level.id, (levelIdCounts.get(level.id) ?? 0) + 1);
  }

  return levels.map((level) =>
    validateLevelDefinition(level, {
      solutionCap: options.solutionCap ?? DEFAULT_SOLUTION_CAP,
      duplicateLevelId: (levelIdCounts.get(level.id) ?? 0) > 1,
    }),
  );
}

export function logLevelValidationReports(
  reports: LevelValidationReport[],
): void {
  const reportsWithWarnings = reports.filter(
    (report) =>
      report.issues.length > 0 || report.impossible || !report.unique,
  );

  if (reportsWithWarnings.length === 0) {
    console.info(
      `[Tiny Worlds validation] ${reports.length} levels checked. Every puzzle has exactly one valid solution.`,
    );
    return;
  }

  for (const report of reportsWithWarnings) {
    console.warn(
      `[Tiny Worlds validation] Level ${report.levelId}: "${report.title}" | valid solutions: ${report.solutionCountLabel}`,
      {
        levelId: report.levelId,
        title: report.title,
        validSolutions: report.solutionCountLabel,
        brokenConstraints:
          report.brokenConstraints.length > 0
            ? report.brokenConstraints.map(formatIssue)
            : 'none',
        issues: report.issues.map(formatIssue),
      },
    );
  }

  console.warn(
    `[Tiny Worlds validation] ${reportsWithWarnings.length}/${reports.length} levels need attention.`,
  );
}

function validateLevelDefinition(
  level: Level,
  options: { solutionCap: number; duplicateLevelId: boolean },
): LevelValidationReport {
  const issues: LevelValidationIssue[] = [];
  const seats = Array.isArray(level.seats) ? level.seats : [];
  const characters = Array.isArray(level.characters) ? level.characters : [];
  const seatIds = new Set(seats.map((seat) => seat.id));
  const characterIds = new Set(characters.map((char) => char.id));
  const seatAttrsInLevel = new Set<SeatAttr>();

  if (!Number.isInteger(level.id) || level.id <= 0) {
    addIssue(issues, 'error', 'invalid-level-id', 'Level id must be a positive integer.', 'id');
  }

  if (options.duplicateLevelId) {
    addIssue(
      issues,
      'error',
      'duplicate-level-id',
      `Level id "${level.id}" is used by more than one level.`,
      'id',
    );
  }

  if (!VALID_ENVIRONMENTS.includes(level.env)) {
    addIssue(
      issues,
      'error',
      'invalid-environment',
      `Environment "${String(level.env)}" is not registered.`,
      'env',
    );
  }

  if (!Array.isArray(level.seats)) {
    addIssue(issues, 'error', 'invalid-seats', 'Level seats must be an array.', 'seats');
  }

  if (!Array.isArray(level.characters)) {
    addIssue(
      issues,
      'error',
      'invalid-characters',
      'Level characters must be an array.',
      'characters',
    );
  }

  if (seats.length !== characters.length) {
    addIssue(
      issues,
      'warning',
      'seat-character-count-mismatch',
      `Level has ${seats.length} seats and ${characters.length} characters.`,
      'seats',
    );
  }

  validateIds(
    issues,
    seats.map((seat) => seat.id),
    'seat',
    'seats',
  );
  validateIds(
    issues,
    characters.map((char) => char.id),
    'character',
    'characters',
  );

  seats.forEach((seat, seatIndex) => {
    const seatPath = `seats[${seatIndex}]`;
    const occupiedFields = presentFields(seat, SEAT_OCCUPANT_FIELDS);

    if (occupiedFields.length > 0) {
      addIssue(
        issues,
        'error',
        'seat-starts-occupied',
        `Seat "${seat.id}" contains initial occupant data: ${occupiedFields.join(', ')}.`,
        seatPath,
      );
    }

    if (!Array.isArray(seat.attrs)) {
      addIssue(
        issues,
        'error',
        'invalid-seat-attrs',
        `Seat "${seat.id}" attrs must be an array.`,
        `${seatPath}.attrs`,
      );
    } else {
      seat.attrs.forEach((attr, attrIndex) => {
        if (!VALID_SEAT_ATTRS.includes(attr)) {
          addIssue(
            issues,
            'error',
            'invalid-seat-attr',
            `Seat "${seat.id}" uses unknown attribute "${String(attr)}".`,
            `${seatPath}.attrs[${attrIndex}]`,
          );
        } else {
          seatAttrsInLevel.add(attr);
        }
      });
    }

    if (!Array.isArray(seat.adj)) {
      addIssue(
        issues,
        'error',
        'invalid-seat-adjacency',
        `Seat "${seat.id}" adj must be an array.`,
        `${seatPath}.adj`,
      );
      return;
    }

    seat.adj.forEach((adjacentSeatId, adjIndex) => {
      const path = `${seatPath}.adj[${adjIndex}]`;
      if (!isValidId(adjacentSeatId)) {
        addIssue(
          issues,
          'error',
          'invalid-seat-reference',
          `Seat "${seat.id}" has an invalid adjacent seat id.`,
          path,
        );
        return;
      }

      if (!seatIds.has(adjacentSeatId)) {
        addIssue(
          issues,
          'error',
          'missing-seat-reference',
          `Seat "${seat.id}" references missing adjacent seat "${adjacentSeatId}".`,
          path,
        );
        return;
      }

      if (adjacentSeatId === seat.id) {
        addIssue(
          issues,
          'warning',
          'self-adjacent-seat',
          `Seat "${seat.id}" lists itself as adjacent.`,
          path,
        );
      }
    });
  });

  seats.forEach((seat, seatIndex) => {
    if (!Array.isArray(seat.adj)) return;

    seat.adj.forEach((adjacentSeatId) => {
      const otherSeat = seats.find((candidate) => candidate.id === adjacentSeatId);
      if (!otherSeat || !Array.isArray(otherSeat.adj)) return;

      if (!otherSeat.adj.includes(seat.id)) {
        addIssue(
          issues,
          'warning',
          'one-way-adjacency',
          `Seat "${seat.id}" says it is beside "${adjacentSeatId}", but not the reverse.`,
          `seats[${seatIndex}].adj`,
        );
      }
    });
  });

  characters.forEach((char, charIndex) => {
    const charPath = `characters[${charIndex}]`;
    const seatedFields = presentFields(char, CHARACTER_SEAT_FIELDS);

    if (seatedFields.length > 0) {
      addIssue(
        issues,
        'error',
        'character-starts-seated',
        `Character "${char.id}" contains initial seating data: ${seatedFields.join(', ')}.`,
        charPath,
      );
    }

    if (!Array.isArray(char.constraints)) {
      addIssue(
        issues,
        'error',
        'invalid-character-constraints',
        `Character "${char.id}" constraints must be an array.`,
        `${charPath}.constraints`,
      );
      return;
    }

    char.constraints.forEach((constraint, constraintIndex) => {
      validateConstraint(
        issues,
        constraint,
        char.id,
        characterIds,
        seatAttrsInLevel,
        `${charPath}.constraints[${constraintIndex}]`,
      );
    });
  });

  const solutionResult = countSolutions(level, options.solutionCap);
  issues.push(...solutionResult.issues);

  if (solutionResult.count === 0) {
    addIssue(
      issues,
      'error',
      'impossible-puzzle',
      'Puzzle has no valid solution.',
      'LEVEL',
    );
  } else if (solutionResult.rawCount > 1) {
    addIssue(
      issues,
      'warning',
      'multiple-solutions',
      `Puzzle has ${solutionResult.label} valid solutions; expected exactly one.`,
      'LEVEL',
    );
  }

  const brokenConstraints = issues.filter(
    (issue) =>
      issue.code.includes('constraint') ||
      issue.code.includes('reference') ||
      issue.code === 'unknown-constraint-type' ||
      issue.code === 'missing-seat-attr',
  );

  return {
    levelId: level.id,
    title: level.title,
    solutionCount: solutionResult.count,
    solutionCountLabel: solutionResult.label,
    solutionCountCapped: solutionResult.capped,
    unique: solutionResult.rawCount === 1,
    impossible: solutionResult.rawCount === 0,
    brokenConstraints,
    issues,
  };
}

function validateConstraint(
  issues: LevelValidationIssue[],
  constraint: Constraint,
  characterId: string,
  characterIds: Set<string>,
  seatAttrsInLevel: Set<SeatAttr>,
  path: string,
): void {
  if (!constraint || typeof constraint !== 'object') {
    addIssue(
      issues,
      'error',
      'invalid-constraint',
      'Constraint must be an object.',
      path,
    );
    return;
  }

  if (!VALID_CONSTRAINT_TYPES.includes(constraint.type)) {
    addIssue(
      issues,
      'error',
      'unknown-constraint-type',
      `Unknown constraint type "${String(constraint.type)}".`,
      `${path}.type`,
    );
    return;
  }

  if (constraint.type === 'attr' || constraint.type === 'noAttr') {
    if (!constraint.attr || !VALID_SEAT_ATTRS.includes(constraint.attr)) {
      addIssue(
        issues,
        'error',
        'invalid-constraint-attr',
        `Constraint references unknown seat attribute "${String(constraint.attr)}".`,
        `${path}.attr`,
      );
      return;
    }

    if (constraint.type === 'attr' && !seatAttrsInLevel.has(constraint.attr)) {
      addIssue(
        issues,
        'error',
        'missing-seat-attr',
        `Constraint requires "${constraint.attr}", but no seat in this level has that attribute.`,
        `${path}.attr`,
      );
    }

    return;
  }

  if (!isValidId(constraint.who)) {
    addIssue(
      issues,
      'error',
      'invalid-character-reference',
      `Constraint has invalid character reference "${String(constraint.who)}".`,
      `${path}.who`,
    );
    return;
  }

  if (!characterIds.has(constraint.who!)) {
    addIssue(
      issues,
      'error',
      'missing-character-reference',
      `Constraint references missing character "${constraint.who}".`,
      `${path}.who`,
    );
    return;
  }

  if (constraint.who === characterId) {
    addIssue(
      issues,
      'warning',
      'self-character-reference',
      `Character "${characterId}" has a constraint referencing itself.`,
      `${path}.who`,
    );
  }
}

function countSolutions(
  level: Level,
  solutionCap: number,
): {
  count: number;
  rawCount: number;
  label: string;
  capped: boolean;
  issues: LevelValidationIssue[];
} {
  try {
    const solutions = findSolutions(level, solutionCap + 1);
    const capped = solutions.length > solutionCap;
    const count = capped ? solutionCap : solutions.length;

    return {
      count,
      rawCount: solutions.length,
      label: capped ? `${solutionCap}+` : String(count),
      capped,
      issues: [],
    };
  } catch (error) {
    return {
      count: 0,
      rawCount: 0,
      label: '0',
      capped: false,
      issues: [
        {
          severity: 'error',
          code: 'solver-error',
          message:
            error instanceof Error
              ? `Solver failed while validating level: ${error.message}`
              : 'Solver failed while validating level.',
          path: 'LEVEL',
        },
      ],
    };
  }
}

function validateIds(
  issues: LevelValidationIssue[],
  ids: string[],
  label: string,
  path: string,
): void {
  const seen = new Map<string, number>();

  ids.forEach((id, index) => {
    if (!isValidId(id)) {
      addIssue(
        issues,
        'error',
        `invalid-${label}-id`,
        `${capitalize(label)} id must be a non-empty string without whitespace.`,
        `${path}[${index}].id`,
      );
      return;
    }

    seen.set(id, (seen.get(id) ?? 0) + 1);
  });

  for (const [id, count] of seen) {
    if (count > 1) {
      addIssue(
        issues,
        'error',
        `duplicate-${label}-id`,
        `${capitalize(label)} id "${id}" is used ${count} times in this level.`,
        path,
      );
    }
  }
}

function addIssue(
  issues: LevelValidationIssue[],
  severity: LevelValidationSeverity,
  code: string,
  message: string,
  path?: string,
): void {
  issues.push({ severity, code, message, path });
}

function presentFields(source: unknown, fields: string[]): string[] {
  if (!source || typeof source !== 'object') return [];

  return fields.filter((field) => {
    if (!Object.prototype.hasOwnProperty.call(source, field)) return false;
    const value = (source as Record<string, unknown>)[field];
    return value !== undefined && value !== null && value !== '';
  });
}

function isValidId(id: unknown): id is string {
  return (
    typeof id === 'string' &&
    id.length > 0 &&
    id.trim() === id &&
    !/\s/.test(id)
  );
}

function formatIssue(issue: LevelValidationIssue): string {
  const prefix = issue.path ? `${issue.path}: ` : '';
  return `[${issue.severity}] ${issue.code} - ${prefix}${issue.message}`;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
