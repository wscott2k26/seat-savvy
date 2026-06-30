import type { EnvironmentId } from './types';

export type GameThemeId =
  | 'classic-cozy'
  | 'midnight-gold'
  | 'rainy-day'
  | 'coffee-house'
  | 'beach-sunset'
  | 'forest-calm';

export type EnvironmentPaletteId =
  | 'default'
  | 'night'
  | 'rainy'
  | 'golden-hour'
  | 'holiday'
  | 'pastel'
  | 'high-contrast';

export type AccessoryId =
  | 'none'
  | 'round-glasses'
  | 'hair-bow'
  | 'gold-crown'
  | 'soft-scarf'
  | 'star-pin'
  | 'cozy-headphones';

export type AvatarFrameId =
  | 'none'
  | 'storybook'
  | 'gold'
  | 'moonlit'
  | 'leaf'
  | 'seashell';

export type HatId = 'none' | 'beanie' | 'beret' | 'moon-cap' | 'gold-halo';

export type MoodAnimationId =
  | 'none'
  | 'gentle-bounce'
  | 'dreamy-float'
  | 'sparkle'
  | 'focus-glow';

export type CharacterTrailId = 'none' | 'stardust' | 'rain-drop' | 'leaf';

export type VictoryPoseId = 'classic' | 'twirl' | 'sparkle-hop' | 'moon-bow';

export type CustomizationSlot = 'playerAvatar' | 'characterAvatar';

export interface AvatarCustomization {
  skinTone: string;
  outfitColor: string;
  hairColor: string;
  hat: HatId;
  accessory: AccessoryId;
  avatarFrame: AvatarFrameId;
  moodAnimation: MoodAnimationId;
  characterTrail: CharacterTrailId;
  victoryPose: VictoryPoseId;
}

export interface CustomizationState {
  gameTheme: GameThemeId;
  envPalettes: Partial<Record<EnvironmentId, EnvironmentPaletteId>>;
  playerAvatar: AvatarCustomization;
  characterAvatar: AvatarCustomization;
}

export type UnlockRule =
  | { type: 'free' }
  | { type: 'premium' }
  | { type: 'levels'; count: number };

export interface CustomizationOption<T extends string = string> {
  id: T;
  label: string;
  description?: string;
  color?: string;
  colors?: string[];
  unlock: UnlockRule;
}

export const DEFAULT_AVATAR_CUSTOMIZATION: AvatarCustomization = {
  skinTone: '#eec9a8',
  outfitColor: '#d6a84f',
  hairColor: '#5a3828',
  hat: 'none',
  accessory: 'none',
  avatarFrame: 'storybook',
  moodAnimation: 'none',
  characterTrail: 'none',
  victoryPose: 'classic',
};

export const DEFAULT_CUSTOMIZATION: CustomizationState = {
  gameTheme: 'midnight-gold',
  envPalettes: {},
  playerAvatar: DEFAULT_AVATAR_CUSTOMIZATION,
  characterAvatar: {
    skinTone: '#eec9a8',
    outfitColor: '#7a5cff',
    hairColor: '#5a3828',
    hat: 'none',
    accessory: 'none',
    avatarFrame: 'none',
    moodAnimation: 'none',
    characterTrail: 'none',
    victoryPose: 'classic',
  },
};

export const GAME_THEMES: CustomizationOption<GameThemeId>[] = [
  {
    id: 'classic-cozy',
    label: 'Classic Cozy',
    description: 'Warm cream, gentle rose, and soft storybook charm.',
    colors: ['#fff5d8', '#d9a6a6', '#8a5a2b'],
    unlock: { type: 'free' },
  },
  {
    id: 'midnight-gold',
    label: 'Midnight Gold',
    description: 'Deep navy glass with polished gold highlights.',
    colors: ['#050816', '#241633', '#d6a84f'],
    unlock: { type: 'free' },
  },
  {
    id: 'rainy-day',
    label: 'Rainy Day',
    description: 'Storm blue, silver mist, and soft window glow.',
    colors: ['#0f1f34', '#52677d', '#b7d6e8'],
    unlock: { type: 'levels', count: 2 },
  },
  {
    id: 'coffee-house',
    label: 'Coffee House',
    description: 'Espresso wood, warm lamps, and roasted amber.',
    colors: ['#1a1010', '#6a4129', '#d6a84f'],
    unlock: { type: 'levels', count: 4 },
  },
  {
    id: 'beach-sunset',
    label: 'Beach Sunset',
    description: 'Ocean dusk, coral warmth, and pearl sand.',
    colors: ['#0d3f5e', '#d9875f', '#f4e6c8'],
    unlock: { type: 'premium' },
  },
  {
    id: 'forest-calm',
    label: 'Forest Calm',
    description: 'Evergreen shadows, moss, and candlelit leaves.',
    colors: ['#0f241d', '#2f6f53', '#c7a66a'],
    unlock: { type: 'levels', count: 8 },
  },
];

export const ENVIRONMENT_PALETTES: CustomizationOption<EnvironmentPaletteId>[] = [
  {
    id: 'default',
    label: 'Default',
    colors: ['#0b1024', '#d6a84f'],
    unlock: { type: 'free' },
  },
  {
    id: 'night',
    label: 'Night',
    colors: ['#050816', '#2a2450'],
    unlock: { type: 'free' },
  },
  {
    id: 'rainy',
    label: 'Rainy',
    colors: ['#13243a', '#7ea1b8'],
    unlock: { type: 'levels', count: 2 },
  },
  {
    id: 'golden-hour',
    label: 'Golden Hour',
    colors: ['#7b3f2f', '#f0c76a'],
    unlock: { type: 'levels', count: 3 },
  },
  {
    id: 'holiday',
    label: 'Holiday',
    colors: ['#173d34', '#b43f55', '#f2d48a'],
    unlock: { type: 'premium' },
  },
  {
    id: 'pastel',
    label: 'Pastel',
    colors: ['#d9c7f2', '#f0c8d2', '#d4efd9'],
    unlock: { type: 'levels', count: 5 },
  },
  {
    id: 'high-contrast',
    label: 'High Contrast',
    colors: ['#000000', '#ffffff', '#ffd84a'],
    unlock: { type: 'free' },
  },
];

export const OUTFIT_OPTIONS: CustomizationOption<string>[] = [
  { id: '#d6a84f', label: 'Gold Cardigan', color: '#d6a84f', unlock: { type: 'free' } },
  { id: '#7a5cff', label: 'Plum Jacket', color: '#7a5cff', unlock: { type: 'free' } },
  { id: '#2f6f53', label: 'Forest Coat', color: '#2f6f53', unlock: { type: 'levels', count: 2 } },
  { id: '#a86a78', label: 'Rose Cape', color: '#a86a78', unlock: { type: 'levels', count: 4 } },
  { id: '#0f7a8a', label: 'Harbor Knit', color: '#0f7a8a', unlock: { type: 'levels', count: 6 } },
  { id: '#f0c76a', label: 'Premium Satin', color: '#f0c76a', unlock: { type: 'premium' } },
];

export const HAIR_OPTIONS: CustomizationOption<string>[] = [
  { id: '#5a3828', label: 'Chestnut', color: '#5a3828', unlock: { type: 'free' } },
  { id: '#2c2230', label: 'Soft Black', color: '#2c2230', unlock: { type: 'free' } },
  { id: '#a46a35', label: 'Copper', color: '#a46a35', unlock: { type: 'levels', count: 2 } },
  { id: '#d8b06a', label: 'Honey', color: '#d8b06a', unlock: { type: 'levels', count: 4 } },
  { id: '#6d6a7f', label: 'Moon Gray', color: '#6d6a7f', unlock: { type: 'levels', count: 7 } },
  { id: '#f5d7e3', label: 'Premium Rose', color: '#f5d7e3', unlock: { type: 'premium' } },
];

export const SKIN_TONE_OPTIONS: CustomizationOption<string>[] = [
  { id: '#f3d1b4', label: 'Warm Light', color: '#f3d1b4', unlock: { type: 'free' } },
  { id: '#d8a06f', label: 'Golden Tan', color: '#d8a06f', unlock: { type: 'free' } },
  { id: '#9b6542', label: 'Warm Brown', color: '#9b6542', unlock: { type: 'free' } },
  { id: '#6d3f2b', label: 'Deep Brown', color: '#6d3f2b', unlock: { type: 'free' } },
  { id: '#f0c7cf', label: 'Rose Glow', color: '#f0c7cf', unlock: { type: 'levels', count: 6 } },
  { id: '#c7d7ef', label: 'Moon Glow', color: '#c7d7ef', unlock: { type: 'premium' } },
];

export const HAT_OPTIONS: CustomizationOption<HatId>[] = [
  { id: 'none', label: 'No Hat', unlock: { type: 'free' } },
  { id: 'beanie', label: 'Cozy Beanie', colors: ['#d6a84f', '#7a5cff'], unlock: { type: 'free' } },
  { id: 'beret', label: 'Story Beret', colors: ['#a86a78', '#fff5d8'], unlock: { type: 'levels', count: 4 } },
  { id: 'moon-cap', label: 'Moon Cap', colors: ['#9fb6d9', '#2a2450'], unlock: { type: 'levels', count: 8 } },
  { id: 'gold-halo', label: 'Gold Halo', colors: ['#f0c76a', '#fff5d8'], unlock: { type: 'premium' } },
];

export const ACCESSORY_OPTIONS: CustomizationOption<AccessoryId>[] = [
  { id: 'none', label: 'No Accessory', unlock: { type: 'free' } },
  { id: 'round-glasses', label: 'Round Glasses', unlock: { type: 'free' } },
  { id: 'hair-bow', label: 'Hair Bow', unlock: { type: 'levels', count: 1 } },
  { id: 'soft-scarf', label: 'Soft Scarf', unlock: { type: 'levels', count: 3 } },
  { id: 'star-pin', label: 'Star Pin', unlock: { type: 'levels', count: 5 } },
  { id: 'cozy-headphones', label: 'Headphones', unlock: { type: 'levels', count: 8 } },
  { id: 'gold-crown', label: 'Gold Crown', unlock: { type: 'premium' } },
];

export const FRAME_OPTIONS: CustomizationOption<AvatarFrameId>[] = [
  { id: 'none', label: 'No Frame', colors: ['#ffffff00'], unlock: { type: 'free' } },
  { id: 'storybook', label: 'Storybook', colors: ['#fff5d8', '#d6a84f'], unlock: { type: 'free' } },
  { id: 'gold', label: 'Gold Halo', colors: ['#d6a84f', '#fff5d8'], unlock: { type: 'levels', count: 3 } },
  { id: 'moonlit', label: 'Moonlit', colors: ['#9fb6d9', '#2a2450'], unlock: { type: 'levels', count: 5 } },
  { id: 'leaf', label: 'Leaf Ring', colors: ['#2f6f53', '#b7d6c8'], unlock: { type: 'levels', count: 7 } },
  { id: 'seashell', label: 'Seashell', colors: ['#f0c76a', '#d9875f'], unlock: { type: 'premium' } },
];

export const MOOD_ANIMATION_OPTIONS: CustomizationOption<MoodAnimationId>[] = [
  { id: 'none', label: 'Still', unlock: { type: 'free' } },
  { id: 'gentle-bounce', label: 'Gentle Bounce', unlock: { type: 'free' } },
  { id: 'dreamy-float', label: 'Dreamy Float', unlock: { type: 'levels', count: 2 } },
  { id: 'sparkle', label: 'Sparkle', unlock: { type: 'levels', count: 6 } },
  { id: 'focus-glow', label: 'Focus Glow', unlock: { type: 'premium' } },
];

export const TRAIL_OPTIONS: CustomizationOption<CharacterTrailId>[] = [
  { id: 'none', label: 'No Trail', unlock: { type: 'free' } },
  { id: 'stardust', label: 'Stardust', colors: ['#d6a84f', '#fff5d8'], unlock: { type: 'levels', count: 3 } },
  { id: 'rain-drop', label: 'Rain Drops', colors: ['#9fb6d9', '#31536c'], unlock: { type: 'levels', count: 6 } },
  { id: 'leaf', label: 'Soft Leaves', colors: ['#2f6f53', '#b7d6c8'], unlock: { type: 'premium' } },
];

export const VICTORY_POSE_OPTIONS: CustomizationOption<VictoryPoseId>[] = [
  { id: 'classic', label: 'Classic Cheer', unlock: { type: 'free' } },
  { id: 'twirl', label: 'Tiny Twirl', unlock: { type: 'levels', count: 3 } },
  { id: 'sparkle-hop', label: 'Sparkle Hop', unlock: { type: 'levels', count: 6 } },
  { id: 'moon-bow', label: 'Moon Bow', unlock: { type: 'premium' } },
];

export const GAME_THEME_LOOKUP = Object.fromEntries(
  GAME_THEMES.map((theme) => [theme.id, theme]),
) as Record<GameThemeId, CustomizationOption<GameThemeId>>;

export const GAME_THEME_BACKGROUNDS: Record<GameThemeId, string> = {
  'classic-cozy':
    'linear-gradient(180deg,#201525 0%,#5a3440 42%,#8a5a2b 72%,#211930 100%)',
  'midnight-gold':
    'linear-gradient(180deg,#070b1a 0%,#161228 38%,#241633 70%,#0c1830 100%)',
  'rainy-day':
    'linear-gradient(180deg,#07101f 0%,#13243a 42%,#2f4d65 72%,#0a1424 100%)',
  'coffee-house':
    'linear-gradient(180deg,#120c12 0%,#2f1f24 36%,#6a4129 72%,#1a1010 100%)',
  'beach-sunset':
    'linear-gradient(180deg,#092b42 0%,#0d5d7c 38%,#d9875f 74%,#2e1831 100%)',
  'forest-calm':
    'linear-gradient(180deg,#06140f 0%,#0f241d 42%,#2f6f53 76%,#101827 100%)',
};

export const ENVIRONMENT_LABELS: Record<EnvironmentId, string> = {
  bus: 'Bus',
  classroom: 'Classroom',
  coffee: 'Coffee Shop',
  restaurant: 'Restaurant',
  theater: 'Movie Theater',
  airport: 'Airport',
  wedding: 'Wedding',
  cruise: 'Cruise Ship',
};

export function isUnlocked(
  unlock: UnlockRule,
  progress: { completed: number[]; premium: boolean },
): boolean {
  if (unlock.type === 'free') return true;
  if (unlock.type === 'premium') return progress.premium;
  return progress.completed.length >= unlock.count;
}

export function unlockLabel(unlock: UnlockRule): string {
  if (unlock.type === 'free') return 'Free';
  if (unlock.type === 'premium') return 'Premium';
  return `Solve ${unlock.count} levels`;
}

export function mergeCustomization(
  customization?: Partial<CustomizationState>,
): CustomizationState {
  return {
    ...DEFAULT_CUSTOMIZATION,
    ...(customization ?? {}),
    envPalettes: {
      ...DEFAULT_CUSTOMIZATION.envPalettes,
      ...(customization?.envPalettes ?? {}),
    },
    playerAvatar: {
      ...DEFAULT_CUSTOMIZATION.playerAvatar,
      ...(customization?.playerAvatar ?? {}),
    },
    characterAvatar: {
      ...DEFAULT_CUSTOMIZATION.characterAvatar,
      ...(customization?.characterAvatar ?? {}),
    },
  };
}
