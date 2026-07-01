export type ShopCategory =
  | 'outfits'
  | 'hats'
  | 'accessories'
  | 'pets'
  | 'furniture'
  | 'decor'
  | 'wallpapers'
  | 'floors'
  | 'views'
  | 'music'
  | 'victory'
  | 'trails';

export type ShopItemKind =
  | 'cosmetic'
  | 'pet'
  | 'furniture'
  | 'decor'
  | 'wallpaper'
  | 'floor'
  | 'view'
  | 'music'
  | 'victory'
  | 'trail';

export interface ShopItem {
  id: string;
  label: string;
  description: string;
  category: ShopCategory;
  kind: ShopItemKind;
  cost?: number;
  starsRequired?: number;
  premium?: boolean;
  preview: string;
}

export interface HomeUpgrade {
  id: string;
  label: string;
  description: string;
  cost: number;
  starsRequired?: number;
  premium?: boolean;
  size: 'tiny' | 'small' | 'medium' | 'large' | 'premium';
}

export interface DailyProgress {
  date: string;
  claimedDailyDate?: string;
  claimedMissions: string[];
  solved: number;
  stars: number;
  noHintSolves: number;
  boughtItems: number;
  petAdopted: boolean;
  visitedHome: boolean;
  customized: boolean;
}

export interface LifeProgress {
  ownedItems: string[];
  equippedDecor: string[];
  selectedPet: string;
  ownedHomes: string[];
  homeId: string;
  claimedAchievements: string[];
  daily: DailyProgress;
  mysteryBoxesOpened: number;
}

export interface MissionDefinition {
  id: string;
  label: string;
  description: string;
  target: number;
  rewardCoins: number;
  rewardXp: number;
  progress: (daily: DailyProgress) => number;
}

export interface AchievementDefinition {
  id: string;
  label: string;
  description: string;
}

export interface CompletionRewards {
  stars: number;
  coins: number;
  xp: number;
  hint: number;
  elapsedSeconds: number;
  bonuses: string[];
  levelUp?: {
    from: number;
    to: number;
    reward: string;
  };
  achievements: string[];
}

export const SHOP_CATEGORY_LABELS: Record<ShopCategory, string> = {
  outfits: 'Outfits',
  hats: 'Hats',
  accessories: 'Accessories',
  pets: 'Pets',
  furniture: 'Room Furniture',
  decor: 'Room Decorations',
  wallpapers: 'Wallpapers',
  floors: 'Floors',
  views: 'Window Views',
  music: 'Music Packs',
  victory: 'Victory Effects',
  trails: 'Character Trails',
};

export const HOME_UPGRADES: HomeUpgrade[] = [
  {
    id: 'tiny-studio',
    label: 'Tiny Studio',
    description: 'A small rainy room with enough space to start dreaming.',
    cost: 0,
    size: 'tiny',
  },
  {
    id: 'small-trailer',
    label: 'Small Trailer',
    description: 'Compact, charming, and ready for road-trip memories.',
    cost: 240,
    starsRequired: 6,
    size: 'small',
  },
  {
    id: 'starter-apartment',
    label: 'Starter Apartment',
    description: 'A warmer apartment with better light and a little more room.',
    cost: 420,
    starsRequired: 12,
    size: 'small',
  },
  {
    id: 'city-apartment',
    label: 'City Apartment',
    description: 'Storm-blue skyline views and room for a proper reading nook.',
    cost: 680,
    starsRequired: 24,
    size: 'medium',
  },
  {
    id: 'cozy-cabin',
    label: 'Cozy Cabin',
    description: 'Wood beams, soft lamps, and a mountain-rain window.',
    cost: 900,
    starsRequired: 36,
    size: 'medium',
  },
  {
    id: 'beach-cottage',
    label: 'Beach Cottage',
    description: 'A breezy cottage with ocean air and sleepy gold light.',
    cost: 1180,
    starsRequired: 48,
    size: 'large',
  },
  {
    id: 'city-loft',
    label: 'City Loft',
    description: 'High ceilings, big windows, and a midnight city glow.',
    cost: 1420,
    starsRequired: 60,
    size: 'large',
  },
  {
    id: 'lake-house',
    label: 'Lake House',
    description: 'Quiet water, warm wood, and a porch full of stars.',
    cost: 1680,
    starsRequired: 72,
    size: 'large',
  },
  {
    id: 'luxury-penthouse',
    label: 'Luxury Penthouse',
    description: 'A skyline penthouse unlocked through the Full Adventure.',
    cost: 2600,
    premium: true,
    size: 'premium',
  },
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'old-couch', label: 'Old Couch', description: 'A humble starter couch.', category: 'furniture', kind: 'furniture', cost: 0, preview: 'couch' },
  { id: 'starter-plant', label: 'Starter Plant', description: 'One brave little plant.', category: 'decor', kind: 'decor', cost: 0, preview: 'plant' },
  { id: 'small-table', label: 'Small Table', description: 'Perfect for tea and puzzle notes.', category: 'furniture', kind: 'furniture', cost: 0, preview: 'table' },
  { id: 'rain-window', label: 'Rainy Window', description: 'Soft rain against the glass.', category: 'views', kind: 'view', cost: 0, preview: 'rain' },
  { id: 'studio-wallpaper', label: 'Midnight Wallpaper', description: 'Deep blue starter walls.', category: 'wallpapers', kind: 'wallpaper', cost: 0, preview: 'wall' },
  { id: 'worn-floor', label: 'Worn Wood Floor', description: 'A cozy floor with history.', category: 'floors', kind: 'floor', cost: 0, preview: 'floor' },
  { id: 'cat-pet', label: 'Window Cat', description: 'A sleepy starter friend.', category: 'pets', kind: 'pet', cost: 0, preview: 'cat' },

  { id: 'plum-outfit', label: 'Plum Coat', description: 'A richer puzzle-night outfit.', category: 'outfits', kind: 'cosmetic', cost: 120, preview: 'coat' },
  { id: 'raincoat-outfit', label: 'Raincoat', description: 'Stormy and practical.', category: 'outfits', kind: 'cosmetic', cost: 220, preview: 'rain' },
  { id: 'gold-outfit', label: 'Gold Cardigan', description: 'A warm premium-looking knit.', category: 'outfits', kind: 'cosmetic', starsRequired: 18, preview: 'gold' },

  { id: 'beanie-hat', label: 'Cozy Beanie', description: 'Soft, simple, and warm.', category: 'hats', kind: 'cosmetic', cost: 90, preview: 'hat' },
  { id: 'beret-hat', label: 'Story Beret', description: 'For thoughtful cafe days.', category: 'hats', kind: 'cosmetic', cost: 180, preview: 'beret' },
  { id: 'moon-hat', label: 'Moon Pin Hat', description: 'Unlocked by starry skill.', category: 'hats', kind: 'cosmetic', starsRequired: 30, preview: 'moon' },

  { id: 'round-glasses-item', label: 'Round Glasses', description: 'Bookish and bright.', category: 'accessories', kind: 'cosmetic', cost: 80, preview: 'glasses' },
  { id: 'star-pin-item', label: 'Star Pin', description: 'A tiny golden reward.', category: 'accessories', kind: 'cosmetic', starsRequired: 12, preview: 'star' },
  { id: 'soft-scarf-item', label: 'Soft Scarf', description: 'A rose scarf for rainy days.', category: 'accessories', kind: 'cosmetic', cost: 160, preview: 'scarf' },

  { id: 'dog-pet', label: 'Pocket Dog', description: 'Tiny paws, huge loyalty.', category: 'pets', kind: 'pet', cost: 260, preview: 'dog' },
  { id: 'hamster-pet', label: 'Hamster', description: 'A round little desk buddy.', category: 'pets', kind: 'pet', cost: 220, preview: 'ham' },
  { id: 'duck-pet', label: 'Rain Duck', description: 'Waddles best in wet weather.', category: 'pets', kind: 'pet', starsRequired: 24, preview: 'duck' },
  { id: 'robot-pet', label: 'Robot Pet', description: 'Beeps softly when puzzles go well.', category: 'pets', kind: 'pet', cost: 520, preview: 'bot' },
  { id: 'fox-pet', label: 'Fox Friend', description: 'Premium placeholder pet.', category: 'pets', kind: 'pet', cost: 900, premium: true, preview: 'fox' },
  { id: 'dragon-pet', label: 'Baby Dragon', description: 'Premium placeholder pet.', category: 'pets', kind: 'pet', cost: 1500, premium: true, preview: 'dragon' },

  { id: 'cozy-bed', label: 'Cozy Bed', description: 'A proper place to rest.', category: 'furniture', kind: 'furniture', cost: 240, preview: 'bed' },
  { id: 'bookshelf', label: 'Bookshelf', description: 'Story fuel for the walls.', category: 'furniture', kind: 'furniture', cost: 280, preview: 'books' },
  { id: 'tiny-tv', label: 'Tiny TV', description: 'Movie-night energy.', category: 'furniture', kind: 'furniture', cost: 320, preview: 'tv' },
  { id: 'gaming-chair', label: 'Gaming Chair', description: 'A bold chair for clever solvers.', category: 'furniture', kind: 'furniture', cost: 360, preview: 'chair' },
  { id: 'desk-setup', label: 'Desk Setup', description: 'Focused, tidy, and warm.', category: 'furniture', kind: 'furniture', cost: 420, preview: 'desk' },
  { id: 'coffee-maker', label: 'Coffee Maker', description: 'Cafe comfort at home.', category: 'furniture', kind: 'furniture', cost: 260, preview: 'coffee' },

  { id: 'wall-art', label: 'Wall Art', description: 'A small framed memory.', category: 'decor', kind: 'decor', cost: 140, preview: 'art' },
  { id: 'aquarium', label: 'Aquarium', description: 'Soft bubbles for calm rooms.', category: 'decor', kind: 'decor', cost: 460, preview: 'fish' },
  { id: 'fireplace', label: 'Fireplace', description: 'A warm glow for earned homes.', category: 'decor', kind: 'decor', starsRequired: 36, preview: 'fire' },
  { id: 'cozy-rug', label: 'Cozy Rug', description: 'Pulls the whole room together.', category: 'decor', kind: 'decor', cost: 190, preview: 'rug' },
  { id: 'pet-bed', label: 'Pet Bed', description: 'A soft spot for your companion.', category: 'decor', kind: 'decor', cost: 160, preview: 'petbed' },
  { id: 'neon-sign', label: 'Neon Sign', description: 'A gentle glow, not too loud.', category: 'decor', kind: 'decor', cost: 380, preview: 'neon' },

  { id: 'plum-wallpaper', label: 'Plum Wallpaper', description: 'Darker walls with soft depth.', category: 'wallpapers', kind: 'wallpaper', cost: 200, preview: 'plum' },
  { id: 'forest-wallpaper', label: 'Forest Wallpaper', description: 'Calm green walls.', category: 'wallpapers', kind: 'wallpaper', starsRequired: 20, preview: 'forest' },
  { id: 'polished-floor', label: 'Polished Floor', description: 'A glow-up underfoot.', category: 'floors', kind: 'floor', cost: 220, preview: 'floor' },
  { id: 'soft-rug-floor', label: 'Soft Rug Floor', description: 'Warm and quiet.', category: 'floors', kind: 'floor', starsRequired: 16, preview: 'rug' },
  { id: 'ocean-view', label: 'Ocean View', description: 'Blue waves beyond the window.', category: 'views', kind: 'view', cost: 500, preview: 'ocean' },
  { id: 'mountain-view', label: 'Mountain View', description: 'A misty mountain morning.', category: 'views', kind: 'view', starsRequired: 42, preview: 'mountain' },

  { id: 'rainy-music', label: 'Rainy Music Pack', description: 'Future local music slot.', category: 'music', kind: 'music', cost: 180, preview: 'music' },
  { id: 'cafe-music', label: 'Cafe Music Pack', description: 'Future local music slot.', category: 'music', kind: 'music', cost: 260, preview: 'music' },
  { id: 'gold-confetti', label: 'Gold Confetti', description: 'A warmer win sparkle.', category: 'victory', kind: 'victory', cost: 240, preview: 'spark' },
  { id: 'moon-burst', label: 'Moon Burst', description: 'A starry victory effect.', category: 'victory', kind: 'victory', starsRequired: 28, preview: 'moon' },
  { id: 'stardust-trail', label: 'Stardust Trail', description: 'A subtle drag trail idea.', category: 'trails', kind: 'trail', cost: 180, preview: 'trail' },
  { id: 'leaf-trail', label: 'Leaf Trail', description: 'A calm forest trail.', category: 'trails', kind: 'trail', starsRequired: 22, preview: 'leaf' },
];

export const DAILY_MISSIONS: MissionDefinition[] = [
  {
    id: 'solve-3',
    label: 'Solve 3 puzzles',
    description: 'Finish any three seating stories today.',
    target: 3,
    rewardCoins: 90,
    rewardXp: 70,
    progress: (daily) => daily.solved,
  },
  {
    id: 'earn-6-stars',
    label: 'Earn 6 stars',
    description: 'Collect six stars from today’s solves.',
    target: 6,
    rewardCoins: 80,
    rewardXp: 80,
    progress: (daily) => daily.stars,
  },
  {
    id: 'no-hints',
    label: 'Solve without hints',
    description: 'Finish one puzzle without using a hint.',
    target: 1,
    rewardCoins: 70,
    rewardXp: 60,
    progress: (daily) => daily.noHintSolves,
  },
  {
    id: 'buy-one',
    label: 'Buy one item',
    description: 'Pick up something cozy from the shop.',
    target: 1,
    rewardCoins: 50,
    rewardXp: 50,
    progress: (daily) => daily.boughtItems,
  },
  {
    id: 'adopt-pet',
    label: 'Adopt a pet',
    description: 'Choose or unlock a companion for your home.',
    target: 1,
    rewardCoins: 70,
    rewardXp: 60,
    progress: (daily) => (daily.petAdopted ? 1 : 0),
  },
  {
    id: 'visit-home',
    label: 'Visit home',
    description: 'Stop by your room and check the view.',
    target: 1,
    rewardCoins: 40,
    rewardXp: 40,
    progress: (daily) => (daily.visitedHome ? 1 : 0),
  },
  {
    id: 'customize',
    label: 'Customize character',
    description: 'Change one avatar or style choice.',
    target: 1,
    rewardCoins: 40,
    rewardXp: 40,
    progress: (daily) => (daily.customized ? 1 : 0),
  },
];

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: 'first-puzzle', label: 'First Puzzle Solved', description: 'Complete your first tiny seating story.' },
  { id: 'perfect-seating', label: 'Perfect Seating', description: 'Earn a 3-star clear.' },
  { id: 'no-hints-needed', label: 'No Hints Needed', description: 'Solve a puzzle without using hints.' },
  { id: 'five-complete', label: 'Five Levels Complete', description: 'Finish five levels.' },
  { id: 'ten-complete', label: 'Ten Levels Complete', description: 'Finish ten levels.' },
  { id: 'first-item', label: 'First Item Bought', description: 'Buy your first shop item.' },
  { id: 'first-pet', label: 'First Pet Adopted', description: 'Choose or buy a pet companion.' },
  { id: 'first-home-upgrade', label: 'First Home Upgrade', description: 'Move beyond the tiny studio.' },
  { id: 'coffee-master', label: 'Coffee Shop Master', description: 'Complete three coffee shop stories.' },
  { id: 'airport-expert', label: 'Airport Expert', description: 'Complete three airport stories.' },
];

export function todayKey(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function freshDaily(date = todayKey()): DailyProgress {
  return {
    date,
    claimedMissions: [],
    solved: 0,
    stars: 0,
    noHintSolves: 0,
    boughtItems: 0,
    petAdopted: false,
    visitedHome: false,
    customized: false,
  };
}

export const DEFAULT_LIFE_PROGRESS: LifeProgress = {
  ownedItems: [
    'old-couch',
    'starter-plant',
    'small-table',
    'rain-window',
    'studio-wallpaper',
    'worn-floor',
    'cat-pet',
  ],
  equippedDecor: [
    'old-couch',
    'starter-plant',
    'small-table',
    'rain-window',
    'studio-wallpaper',
    'worn-floor',
  ],
  selectedPet: 'cat-pet',
  ownedHomes: ['tiny-studio'],
  homeId: 'tiny-studio',
  claimedAchievements: [],
  daily: freshDaily(),
  mysteryBoxesOpened: 0,
};

export function normalizeLife(life?: Partial<LifeProgress>): LifeProgress {
  const date = todayKey();
  const incomingDaily = life?.daily;
  const daily =
    incomingDaily?.date === date
      ? { ...freshDaily(date), ...incomingDaily }
      : {
          ...freshDaily(date),
          claimedDailyDate: incomingDaily?.claimedDailyDate,
        };

  return {
    ...DEFAULT_LIFE_PROGRESS,
    ...(life ?? {}),
    ownedItems: unique([
      ...DEFAULT_LIFE_PROGRESS.ownedItems,
      ...(life?.ownedItems ?? []),
    ]),
    equippedDecor: unique([
      ...DEFAULT_LIFE_PROGRESS.equippedDecor,
      ...(life?.equippedDecor ?? []),
    ]),
    ownedHomes: unique([
      'tiny-studio',
      life?.homeId ?? DEFAULT_LIFE_PROGRESS.homeId,
      ...(life?.ownedHomes ?? []),
    ]),
    claimedAchievements: unique(life?.claimedAchievements ?? []),
    daily,
  };
}

export function totalStars(stars: Record<string, number>): number {
  return Object.values(stars).reduce((sum, count) => sum + count, 0);
}

export function playerLevelForXp(xp: number): number {
  return Math.floor(Math.max(0, xp) / 300) + 1;
}

export function xpIntoLevel(xp: number): number {
  return Math.max(0, xp) % 300;
}

export function nextLevelRewardLabel(level: number): string {
  if (level % 5 === 4) return 'Home upgrade discount';
  if (level % 3 === 2) return 'Mystery box discount';
  return level % 2 === 0 ? '+1 hint' : '+75 coins';
}

export function canOwnItem(
  item: ShopItem,
  progress: { coins: number; premium: boolean; stars: Record<string, number> },
): boolean {
  if (item.premium) return progress.premium;
  if (item.starsRequired && totalStars(progress.stars) < item.starsRequired) {
    return false;
  }
  return progress.coins >= (item.cost ?? 0);
}

export function shopItemPriceLabel(item: ShopItem): string {
  const parts = [`${item.cost ?? 0} coins`];
  if (item.starsRequired) parts.push(`${item.starsRequired} stars`);
  if (item.premium) parts.push('Premium');
  return parts.join(' / ');
}

export function homePriceLabel(home: HomeUpgrade): string {
  const parts = [`${home.cost} coins`];
  if (home.starsRequired) parts.push(`${home.starsRequired} stars`);
  if (home.premium) parts.push('Premium');
  return parts.join(' / ');
}

export function dailyRewardForDate(date = todayKey()):
  | { type: 'coins'; amount: number; label: string }
  | { type: 'hints'; amount: number; label: string }
  | { type: 'item'; itemId: string; label: string }
  | { type: 'mystery'; label: string } {
  const seed = Number(date.replace(/\D/g, '')) % 6;
  if (seed === 0) return { type: 'coins', amount: 120, label: '120 coins' };
  if (seed === 1) return { type: 'hints', amount: 1, label: '+1 hint' };
  if (seed === 2) return { type: 'item', itemId: 'wall-art', label: 'Wall Art' };
  if (seed === 3) return { type: 'coins', amount: 180, label: '180 coins' };
  if (seed === 4) return { type: 'item', itemId: 'pet-bed', label: 'Pet Bed' };
  return { type: 'mystery', label: 'Mystery box preview' };
}

export function itemById(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((item) => item.id === id);
}

export function homeById(id: string): HomeUpgrade {
  return HOME_UPGRADES.find((home) => home.id === id) ?? HOME_UPGRADES[0];
}

export function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}
