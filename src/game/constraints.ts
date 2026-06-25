import type { Constraint, SeatAttr } from './types';

export const ATTR_LABEL: Record<SeatAttr, string> = {
  window: 'Window seat',
  aisle: 'Aisle seat',
  legroom: 'Extra leg room',
  tv: 'Faces the screen',
  music: 'Near the music',
  food: 'Near food',
  sunlight: 'In the sunlight',
  quiet: 'Quiet corner',
  front: 'Up front',
  back: 'In the back',
};

// Returns a friendly clue sentence for a character constraint.
export function clueText(c: Constraint, nameOf: (id: string) => string): string {
  switch (c.type) {
    case 'attr':
      return `Wants a ${ATTR_LABEL[c.attr!].toLowerCase()}`;
    case 'noAttr':
      return `Can't be ${noAttrPhrase(c.attr!)}`;
    case 'beside':
      return `Must sit beside ${nameOf(c.who!)}`;
    case 'notBeside':
      return `Won't sit near ${nameOf(c.who!)}`;
  }
}

function noAttrPhrase(a: SeatAttr): string {
  switch (a) {
    case 'food':
      return 'near food';
    case 'sunlight':
      return 'in the sunlight';
    case 'music':
      return 'near loud music';
    case 'window':
      return 'by a window';
    case 'aisle':
      return 'on the aisle';
    case 'tv':
      return 'facing the screen';
    default:
      return `in a ${ATTR_LABEL[a].toLowerCase()}`;
  }
}

// Small icon key for each constraint, used to pick an SVG glyph.
export function clueIcon(c: Constraint): string {
  if (c.type === 'beside') return 'heart';
  if (c.type === 'notBeside') return 'ban';
  const a = c.attr!;
  if (c.type === 'attr') {
    if (a === 'window') return 'window';
    if (a === 'aisle') return 'aisle';
    if (a === 'legroom') return 'legroom';
    if (a === 'tv') return 'tv';
    if (a === 'music') return 'music';
    if (a === 'food') return 'food';
    if (a === 'sunlight') return 'sun';
    if (a === 'quiet') return 'quiet';
    if (a === 'front') return 'front';
    if (a === 'back') return 'back';
  }
  // noAttr
  return 'ban';
}
