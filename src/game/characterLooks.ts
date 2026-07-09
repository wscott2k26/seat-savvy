import type { AccessoryId, AvatarFrameId, HatId, MoodAnimationId } from './customization';

export interface CharacterLook {
  seed: string;
  skinTone: string;
  outfitColor: string;
  hairColor: string;
  hat: HatId;
  accessory: AccessoryId;
  avatarFrame: AvatarFrameId;
  moodAnimation: MoodAnimationId;
}

const SKIN_TONES = [
  '#f3d1b4',
  '#e8b989',
  '#d8a06f',
  '#b8754a',
  '#9b6542',
  '#6d3f2b',
  '#f0c7cf',
  '#c7d7ef',
];

const HAIR_COLORS = [
  '#2c2230',
  '#5a3828',
  '#7a4a28',
  '#a46a35',
  '#d8b06a',
  '#6d6a7f',
  '#1d3b4f',
  '#4b2e63',
];

const OUTFITS = [
  '#d6a84f',
  '#7a5cff',
  '#2f6f53',
  '#a86a78',
  '#0f7a8a',
  '#c45c3c',
  '#2d5f9a',
  '#8a5a2b',
  '#5e3b83',
  '#b24a6f',
];

const HATS: HatId[] = ['none', 'beanie', 'beret', 'none', 'moon-cap', 'none'];
const ACCESSORIES: AccessoryId[] = [
  'none',
  'round-glasses',
  'hair-bow',
  'soft-scarf',
  'star-pin',
  'cozy-headphones',
  'none',
];
const FRAMES: AvatarFrameId[] = ['none', 'storybook', 'none', 'leaf', 'moonlit', 'none'];
const ANIMATIONS: MoodAnimationId[] = ['none', 'gentle-bounce', 'none', 'dreamy-float', 'focus-glow'];

export function characterLook(id: string, hue: number): CharacterLook {
  const seed = `${id}-${hue}`;
  const hash = hashString(seed);
  return {
    seed,
    skinTone: SKIN_TONES[hash % SKIN_TONES.length],
    hairColor: HAIR_COLORS[Math.floor(hash / 3) % HAIR_COLORS.length],
    outfitColor: OUTFITS[Math.floor(hash / 7) % OUTFITS.length],
    hat: HATS[Math.floor(hash / 11) % HATS.length],
    accessory: ACCESSORIES[Math.floor(hash / 13) % ACCESSORIES.length],
    avatarFrame: FRAMES[Math.floor(hash / 17) % FRAMES.length],
    moodAnimation: ANIMATIONS[Math.floor(hash / 19) % ANIMATIONS.length],
  };
}

export function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}
