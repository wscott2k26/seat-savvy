import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import type { Level, Solution } from './types';
import { LEVELS, levelById } from './levels';
import { isValidAssignment, violationsFor, validateLevel } from './solver';
import {
  logLevelValidationReports,
  validateAllLevels,
} from './levelValidation';
import { getAudioEngine, type GameSound } from './audioEngine';
import { playHaptic, type HapticCue } from './haptics';
import {
  DEFAULT_CUSTOMIZATION,
  mergeCustomization,
  type CustomizationState,
} from './customization';
import {
  timeGoalSeconds,
  timeLimitSeconds,
  type PlayMode,
} from './timing';
import {
  ACHIEVEMENTS,
  DAILY_MISSIONS,
  DEFAULT_LIFE_PROGRESS,
  HOME_UPGRADES,
  SHOP_ITEMS,
  dailyRewardForDate,
  homeById,
  itemById,
  nextLevelRewardLabel,
  normalizeLife,
  playerLevelForXp,
  todayKey,
  totalStars,
  unique,
  type CompletionRewards,
  type LifeProgress,
} from './lifeData';

const FREE_LEVELS = 39;

export interface GameSettings {
  musicOn: boolean;
  sfxOn: boolean;
  ambientOn: boolean;
  muteAll: boolean;
  hapticsOn: boolean;
  vibrationOn: boolean;
  reducedMotion: boolean;
  showTutorialOnLaunch: boolean;
  environmentArt: 'storybook' | 'real';
  musicVolume: number;
  sfxVolume: number;
  ambientVolume: number;
}

interface Progress {
  coins: number;
  hints: number;
  xp: number;
  completed: number[]; // level ids
  premium: boolean;
  stars: Record<string, number>;
  tutorialSeen: boolean;
  account: PlayerAccount;
  settings: GameSettings;
  customization: CustomizationState;
  life: LifeProgress;
}

export type AccountProvider = 'guest' | 'email' | 'gmail' | 'facebook';

export interface PlayerAccount {
  provider: AccountProvider;
  displayName: string;
  email?: string;
  connectedAt?: string;
  onboardingSeen: boolean;
  shareWithFriends: boolean;
}

export interface LevelStats {
  hintsUsed: number;
  mistakes: number;
  moves: number;
}

interface FeedbackMessage {
  kind: 'good' | 'bad' | 'hint' | 'info';
  text: string;
}

interface LifeNotice {
  title: string;
  text: string;
}

const DEFAULT_SETTINGS: GameSettings = {
  musicOn: false,
  sfxOn: true,
  ambientOn: true,
  muteAll: false,
  hapticsOn: true,
  vibrationOn: true,
  reducedMotion: false,
  showTutorialOnLaunch: true,
  environmentArt: 'storybook',
  musicVolume: 0,
  sfxVolume: 0.7,
  ambientVolume: 0.35,
};

const DEFAULT_ACCOUNT: PlayerAccount = {
  provider: 'guest',
  displayName: 'Guest Player',
  onboardingSeen: false,
  shareWithFriends: false,
};

const DEFAULT_PROGRESS: Progress = {
  coins: 120,
  hints: 3,
  xp: 0,
  completed: [],
  premium: false,
  stars: {},
  tutorialSeen: false,
  account: DEFAULT_ACCOUNT,
  settings: DEFAULT_SETTINGS,
  customization: DEFAULT_CUSTOMIZATION,
  life: DEFAULT_LIFE_PROGRESS,
};

type Screen =
  | 'menu'
  | 'play'
  | 'customize'
  | 'home'
  | 'shop'
  | 'missions'
  | 'achievements';

interface GameCtx {
  progress: Progress;
  setProgress: React.Dispatch<React.SetStateAction<Progress>>;
  screen: Screen;
  levels: Level[];
  freeLevels: number;
  level: Level | null;
  placement: Record<string, string>; // charId -> seatId
  charBySeat: Record<string, string>; // seatId -> charId
  violations: Set<string>;
  solved: boolean;
  canonical: Solution | undefined;
  levelStats: LevelStats;
  currentStars: number;
  lastRewards: CompletionRewards | null;
  feedback: FeedbackMessage | null;
  notice: LifeNotice | null;
  playMode: PlayMode;
  levelStartedAt: number;
  openMenu: () => void;
  openCustomize: () => void;
  openHome: () => void;
  openShop: () => void;
  openMissions: () => void;
  openAchievements: () => void;
  startLevel: (id: number) => void;
  beginLevelRun: (mode: PlayMode) => void;
  placeCharacter: (charId: string, seatId: string) => void;
  unplace: (charId: string) => void;
  applyHint: () => boolean;
  resetLevel: () => void;
  completeLevel: () => void;
  isUnlocked: (id: number) => boolean;
  updateSettings: (settings: Partial<GameSettings>) => void;
  updateCustomization: (
    updater: (customization: CustomizationState) => CustomizationState,
  ) => void;
  buyShopItem: (itemId: string) => boolean;
  toggleDecorItem: (itemId: string) => void;
  selectPet: (itemId: string) => void;
  upgradeHome: (homeId: string) => boolean;
  claimDailyReward: () => boolean;
  claimMission: (missionId: string) => boolean;
  openMysteryBox: () => boolean;
  playAsGuest: (displayName?: string) => void;
  signOutAccount: () => void;
  markTutorialSeen: (dontShowAgain: boolean) => void;
  resetProgress: () => void;
  dismissFeedback: () => void;
  dismissNotice: () => void;
  triggerHurryCue: (text: string) => void;
  playSound: (sound: GameSound) => void;
  testSound: () => void;
}

const Ctx = createContext<GameCtx | null>(null);

export const useGame = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useGame outside provider');
  return c;
};

function load(): Progress {
  try {
    const raw = localStorage.getItem('tw_progress');
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Progress> & {
        soundOn?: boolean;
        settings?: Partial<GameSettings>;
        account?: Partial<PlayerAccount>;
        customization?: Partial<CustomizationState>;
        life?: Partial<LifeProgress>;
      };
      const legacySound = parsed.soundOn;
      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
        stars: parsed.stars ?? {},
        tutorialSeen: parsed.tutorialSeen ?? false,
        settings: {
          ...DEFAULT_SETTINGS,
          ...(legacySound === undefined
            ? {}
            : {
                musicOn: legacySound,
                sfxOn: legacySound,
                ambientOn: legacySound,
              }),
          ...(parsed.settings ?? {}),
          musicOn: false,
          musicVolume: 0,
        },
        account: normalizeAccount(parsed.account),
        customization: mergeCustomization(parsed.customization),
        life: normalizeLife(parsed.life),
      };
    }
  } catch {
    return DEFAULT_PROGRESS;
  }
  return DEFAULT_PROGRESS;
}

function normalizeAccount(account?: Partial<PlayerAccount>): PlayerAccount {
  if (!account) return DEFAULT_ACCOUNT;
  return {
    ...DEFAULT_ACCOUNT,
    provider: 'guest',
    displayName: account.displayName?.trim() || DEFAULT_ACCOUNT.displayName,
    onboardingSeen: account.onboardingSeen ?? true,
    shareWithFriends: false,
  };
}

const EMPTY_STATS: LevelStats = {
  hintsUsed: 0,
  mistakes: 0,
  moves: 0,
};

function starsFor(
  stats: LevelStats,
  level?: Level | null,
  elapsedMs = 0,
  mode: PlayMode = 'relaxed',
): number {
  let stars =
    stats.hintsUsed === 0 && stats.mistakes === 0
      ? 3
      : stats.hintsUsed <= 1 && stats.mistakes <= 2
        ? 2
        : 1;

  if (!level || elapsedMs <= 0) return stars;

  const elapsedSeconds = elapsedMs / 1000;
  if (elapsedSeconds > timeGoalSeconds(level)) {
    stars = Math.min(stars, 2);
  }
  if (mode === 'timed' && elapsedSeconds > timeLimitSeconds(level)) {
    stars = Math.min(stars, 1);
  }

  return stars;
}

function canStartLevel(id: number, progress: Progress): boolean {
  if (id === 1) return true;
  if (id > FREE_LEVELS && !progress.premium) return false;
  return progress.completed.includes(id - 1);
}

function rewardsFor(
  level: Level,
  stats: LevelStats,
  stars: number,
  alreadyCompleted: boolean,
  elapsedMs: number,
  characterCount: number,
  mode: PlayMode,
): Omit<CompletionRewards, 'levelUp' | 'achievements'> {
  const elapsedSeconds = Math.max(1, Math.round(elapsedMs / 1000));
  const goalSeconds = timeGoalSeconds(level);
  const limitSeconds = timeLimitSeconds(level);
  if (alreadyCompleted) {
    return {
      stars,
      coins: 12,
      xp: 12,
      hint: 0,
      elapsedSeconds,
      bonuses: ['Replay practice bonus'],
    };
  }

  const bonuses: string[] = [];
  let coins = 40 + stars * 18;
  let xp = 85 + stars * 30;

  const speedBonus =
    elapsedSeconds <= goalSeconds
      ? 40 + Math.max(0, characterCount - 6) * 7
      : elapsedSeconds <= limitSeconds
        ? 22 + Math.max(0, characterCount - 6) * 4
        : stats.moves <= characterCount + 2
          ? 14
          : 0;
  if (speedBonus > 0) {
    coins += speedBonus;
    xp += Math.round(speedBonus / 2);
    const speedLabel =
      elapsedSeconds <= goalSeconds
        ? mode === 'timed'
          ? 'Timed clear'
          : 'Time goal'
        : elapsedSeconds <= limitSeconds
          ? 'Hurry finish'
          : 'Efficient solve';
    bonuses.push(`${speedLabel} +${speedBonus}`);
  }
  if (stats.hintsUsed === 0) {
    coins += 25;
    xp += 20;
    bonuses.push('No hints +25');
  }
  if (stats.mistakes === 0) {
    coins += 25;
    bonuses.push('Perfect placement +25');
  } else if (stats.mistakes <= 1) {
    coins += 10;
    bonuses.push('Careful solve +10');
  }

  return {
    stars,
    coins,
    xp,
    hint: 1,
    elapsedSeconds,
    bonuses,
  };
}

function addAchievements(
  progress: Progress,
  achievementIds: string[],
): { progress: Progress; labels: string[] } {
  const current = new Set(progress.life.claimedAchievements);
  const unlocked = achievementIds.filter((id) => !current.has(id));
  if (unlocked.length === 0) return { progress, labels: [] };

  for (const id of unlocked) current.add(id);
  return {
    progress: {
      ...progress,
      life: {
        ...progress.life,
        claimedAchievements: Array.from(current),
      },
    },
    labels: unlocked.map(
      (id) => ACHIEVEMENTS.find((achievement) => achievement.id === id)?.label ?? id,
    ),
  };
}

function achievementIdsForProgress(
  progress: Progress,
  level?: Level,
  stats?: LevelStats,
  stars?: number,
): string[] {
  const ids: string[] = [];
  if (progress.completed.length >= 1) ids.push('first-puzzle');
  if ((stars ?? 0) >= 3) ids.push('perfect-seating');
  if (stats && stats.hintsUsed === 0) ids.push('no-hints-needed');
  if (progress.completed.length >= 5) ids.push('five-complete');
  if (progress.completed.length >= 10) ids.push('ten-complete');
  if (progress.life.ownedItems.length > DEFAULT_LIFE_PROGRESS.ownedItems.length) {
    ids.push('first-item');
  }
  if (progress.life.selectedPet && progress.life.selectedPet !== 'cat-pet') {
    ids.push('first-pet');
  }
  if (progress.life.homeId !== 'tiny-studio') ids.push('first-home-upgrade');
  const completedLevels = progress.completed
    .map((id) => levelById(id))
    .filter(Boolean) as Level[];
  if (level && !completedLevels.some((completed) => completed.id === level.id)) {
    completedLevels.push(level);
  }
  if (completedLevels.filter((completed) => completed.env === 'coffee').length >= 3) {
    ids.push('coffee-master');
  }
  if (completedLevels.filter((completed) => completed.env === 'airport').length >= 3) {
    ids.push('airport-expert');
  }
  return ids;
}

function friendlyAttr(attr?: string): string {
  switch (attr) {
    case 'window':
      return 'a window seat';
    case 'aisle':
      return 'an aisle seat';
    case 'legroom':
      return 'room to stretch';
    case 'tv':
      return 'a good view of the screen';
    case 'music':
      return 'a spot near the music';
    case 'food':
      return 'a seat close to snacks';
    case 'sunlight':
      return 'a sunny seat';
    case 'quiet':
      return 'a quieter seat';
    case 'front':
      return 'somewhere near the front';
    case 'back':
      return 'somewhere near the back';
    default:
      return 'a more comfortable seat';
  }
}

function friendlyArea(attrs: string[]): string {
  if (attrs.includes('window')) return 'near the window';
  if (attrs.includes('quiet')) return 'in a quieter corner';
  if (attrs.includes('front')) return 'near the front';
  if (attrs.includes('back')) return 'near the back';
  if (attrs.includes('food')) return 'near the snacks';
  if (attrs.includes('music')) return 'near the music';
  return 'in this part of the room';
}

function progressiveHintText(
  level: Level,
  char: Level['characters'][number],
  targetSeatId: string,
  stats: LevelStats,
): string {
  const attrConstraint = char.constraints.find(
    (constraint) => constraint.type === 'attr' && constraint.attr,
  );
  const noAttrConstraint = char.constraints.find(
    (constraint) => constraint.type === 'noAttr' && constraint.attr,
  );
  const relationConstraint = char.constraints.find(
    (constraint) => constraint.type === 'beside' || constraint.type === 'notBeside',
  );
  const targetSeat = level.seats.find((seat) => seat.id === targetSeatId);

  if (stats.hintsUsed === 0) {
    if (attrConstraint) {
      return `${char.name} wants ${friendlyAttr(attrConstraint.attr)}.`;
    }
    if (noAttrConstraint) {
      return `${char.name} would rather avoid ${friendlyAttr(noAttrConstraint.attr)}.`;
    }
    if (relationConstraint) {
      return `Try checking who ${char.name} wants to sit near or avoid.`;
    }
    return `Start with ${char.name}'s clue and look for a calm match.`;
  }

  if (stats.hintsUsed === 1 && targetSeat) {
    return `Someone ${friendlyArea(targetSeat.attrs)} is still unhappy.`;
  }

  if (stats.mistakes >= 2) {
    return `One person may be in the right row but wrong seat. Recheck ${char.name}'s clue.`;
  }

  return 'Try checking who wants a quieter spot, a window, or space from loud neighbors.';
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [progress, setProgress] = useState<Progress>(load);
  const [screen, setScreen] = useState<Screen>('menu');
  const [level, setLevel] = useState<Level | null>(null);
  const [placement, setPlacement] = useState<Record<string, string>>({});
  const [levelStats, setLevelStats] = useState<LevelStats>(EMPTY_STATS);
  const [levelStartedAt, setLevelStartedAt] = useState(() => Date.now());
  const [playMode, setPlayMode] = useState<PlayMode>('relaxed');
  const [lastRewards, setLastRewards] = useState<CompletionRewards | null>(null);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [notice, setNotice] = useState<LifeNotice | null>(null);
  const activeAudioEnvironment = screen === 'play' ? level?.env : undefined;

  useEffect(() => {
    if (import.meta.env.DEV) {
      logLevelValidationReports(validateAllLevels(LEVELS));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tw_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    getAudioEngine().sync(progress.settings, activeAudioEnvironment);
  }, [activeAudioEnvironment, progress.settings]);

  useEffect(() => {
    const unlockAudio = () => {
      getAudioEngine().sync(progress.settings, activeAudioEnvironment);
    };
    window.addEventListener('pointerdown', unlockAudio, { capture: true });
    window.addEventListener('keydown', unlockAudio, { capture: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAudio, true);
      window.removeEventListener('keydown', unlockAudio, true);
    };
  }, [activeAudioEnvironment, progress.settings]);

  useEffect(() => {
    document.documentElement.classList.toggle(
      'tw-reduced-motion',
      progress.settings.reducedMotion,
    );
  }, [progress.settings.reducedMotion]);

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 2600);
    return () => clearTimeout(t);
  }, [feedback]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3200);
    return () => clearTimeout(t);
  }, [notice]);

  const playSound = useCallback(
    (sound: GameSound) => {
      getAudioEngine().sync(progress.settings, activeAudioEnvironment);
      getAudioEngine().play(sound, progress.settings);
    },
    [activeAudioEnvironment, progress.settings],
  );

  const testSound = useCallback(() => {
    getAudioEngine().test(progress.settings, activeAudioEnvironment);
  }, [activeAudioEnvironment, progress.settings]);

  const triggerHaptic = useCallback(
    (cue: HapticCue) => {
      playHaptic(cue, progress.settings);
    },
    [progress.settings],
  );

  const charBySeat = useMemo(() => {
    const m: Record<string, string> = {};
    for (const [charId, seatId] of Object.entries(placement)) m[seatId] = charId;
    return m;
  }, [placement]);

  const canonical = useMemo(
    () => (level ? validateLevel(level).solution : undefined),
    [level],
  );

  const { violations, solved } = useMemo(() => {
    if (!level) return { violations: new Set<string>(), solved: false };
    // build seat->char assignment
    const assign: Record<string, string> = {};
    for (const [charId, seatId] of Object.entries(placement))
      assign[seatId] = charId;
    const v = violationsFor(level, assign);
    const allPlaced =
      Object.keys(placement).length === level.characters.length;
    const ok = allPlaced && isValidAssignment(level, assign);
    return { violations: v, solved: ok };
  }, [level, placement]);

  const openMenu = useCallback(() => {
    playSound('menu');
    triggerHaptic('tap');
    setScreen('menu');
  }, [playSound, triggerHaptic]);

  const openCustomize = useCallback(() => {
    playSound('menu');
    triggerHaptic('tap');
    setProgress((p) => ({
      ...p,
      life: {
        ...p.life,
        daily: {
          ...p.life.daily,
          customized: true,
        },
      },
    }));
    setScreen('customize');
  }, [playSound, triggerHaptic]);

  const openHome = useCallback(() => {
    playSound('menu');
    triggerHaptic('tap');
    setProgress((p) => ({
      ...p,
      life: {
        ...p.life,
        daily: {
          ...p.life.daily,
          visitedHome: true,
        },
      },
    }));
    setScreen('home');
  }, [playSound, triggerHaptic]);

  const openShop = useCallback(() => {
    playSound('menu');
    triggerHaptic('tap');
    setScreen('shop');
  }, [playSound, triggerHaptic]);

  const openMissions = useCallback(() => {
    playSound('menu');
    triggerHaptic('tap');
    setScreen('missions');
  }, [playSound, triggerHaptic]);

  const openAchievements = useCallback(() => {
    playSound('menu');
    triggerHaptic('tap');
    setScreen('achievements');
  }, [playSound, triggerHaptic]);

  const startLevel = useCallback((id: number) => {
    const lv = levelById(id);
    if (!lv) return;
    if (!canStartLevel(id, progress)) {
      const needsPremium = id > FREE_LEVELS && !progress.premium;
      playSound(needsPremium ? 'lock' : 'wrong');
      setNotice({
        title: needsPremium ? 'Full adventure locked' : 'Complete the previous story',
        text: needsPremium
          ? 'Premium chapters stay locked until the full adventure is unlocked.'
          : `Finish Level ${id - 1} before opening Level ${id}.`,
      });
      return;
    }
    playSound('button');
    triggerHaptic('tap');
    setLevel(lv);
    setPlacement({});
    setLevelStats(EMPTY_STATS);
    setLevelStartedAt(Date.now());
    setPlayMode('relaxed');
    setLastRewards(null);
    setFeedback(null);
    setScreen('play');
    getAudioEngine().sync(progress.settings, lv.env);
  }, [playSound, progress, triggerHaptic]);

  const beginLevelRun = useCallback((mode: PlayMode) => {
    setPlayMode(mode);
    setLevelStartedAt(Date.now());
    setFeedback({
      kind: mode === 'timed' ? 'hint' : 'info',
      text:
        mode === 'timed'
          ? 'Timed challenge started. Seat everyone before the countdown runs out.'
          : 'Relaxed puzzle started. Beat the time goal for the best rewards.',
    });
    playSound(mode === 'timed' ? 'hint' : 'button');
    triggerHaptic('tap');
  }, [playSound, triggerHaptic]);

  const placeCharacter = useCallback((charId: string, seatId: string) => {
    setPlacement((prev) => {
      const next = { ...prev };
      // if another char occupies this seat, send them back to tray
      for (const [cid, sid] of Object.entries(next)) {
        if (sid === seatId && cid !== charId) delete next[cid];
      }
      next[charId] = seatId;
      const assign: Record<string, string> = {};
      for (const [cid, sid] of Object.entries(next)) assign[sid] = cid;
      const bad = level ? violationsFor(level, assign) : new Set<string>();
      const wrong = bad.has(charId);
      const exact = canonical?.[seatId] === charId;

      setLevelStats((stats) => ({
        ...stats,
        moves: stats.moves + 1,
        mistakes: stats.mistakes + (wrong ? 1 : 0),
      }));

      if (wrong) {
        const nextMistakes = levelStats.mistakes + 1;
        setFeedback({
          kind: 'bad',
          text:
            nextMistakes >= 3
              ? 'That seat breaks one of their clues. Try matching every icon before dropping.'
              : 'Close, but one clue is unhappy there.',
        });
        playSound('wrong');
        triggerHaptic('wrong');
      } else if (exact) {
        setFeedback({
          kind: 'good',
          text: 'Lovely fit. That guest looks settled.',
        });
        playSound('correct');
        triggerHaptic('correct');
      } else {
        setFeedback({
          kind: 'info',
          text: 'No conflict yet. Keep checking the clues as the table fills.',
        });
        playSound('drop');
      }

      return next;
    });
  }, [canonical, level, levelStats.mistakes, playSound, triggerHaptic]);

  const unplace = useCallback((charId: string) => {
    setPlacement((prev) => {
      const next = { ...prev };
      delete next[charId];
      return next;
    });
    setLevelStats((stats) => ({ ...stats, moves: stats.moves + 1 }));
    playSound('drop');
  }, [playSound]);

  const resetLevel = useCallback(() => {
    playSound('button');
    triggerHaptic('tap');
    setPlacement({});
    setLevelStats(EMPTY_STATS);
    setFeedback({ kind: 'info', text: 'Fresh start. The guests are ready again.' });
  }, [playSound, triggerHaptic]);

  const applyHint = useCallback(() => {
    if (!level || !canonical) return false;
    if (!progress.premium && progress.hints <= 0) return false;
    const hintTarget = level.characters
      .map((char) => {
        const target = Object.entries(canonical).find(
          ([, cid]) => cid === char.id,
        )?.[0];
        return target ? { char, target } : null;
      })
      .find((item) => item && placement[item.char.id] !== item.target);

    if (!hintTarget) return false;

    setProgress((p) => {
      if (!p.premium && p.hints <= 0) return p;
      return { ...p, hints: p.premium ? p.hints : p.hints - 1 };
    });
    setLevelStats((stats) => ({
      ...stats,
      hintsUsed: stats.hintsUsed + 1,
    }));
    playSound('hint');
    triggerHaptic('tap');
    setFeedback({
      kind: 'hint',
      text: progressiveHintText(
        level,
        hintTarget.char,
        hintTarget.target,
        levelStats,
      ),
    });
    // place one currently-misplaced or unplaced character correctly
    setPlacement((prev) => {
      const next = { ...prev };
      for (const [cid, sid] of Object.entries(next)) {
        if (sid === hintTarget.target) delete next[cid];
      }
      next[hintTarget.char.id] = hintTarget.target;
      return next;
    });
    return true;
  }, [
    canonical,
    level,
    levelStats,
    placement,
    playSound,
    progress.hints,
    progress.premium,
    triggerHaptic,
  ]);

  const triggerHurryCue = useCallback((text: string) => {
    setFeedback({ kind: 'hint', text });
    playSound('hint');
    triggerHaptic('tap');
  }, [playSound, triggerHaptic]);

  const completeLevel = useCallback(() => {
    if (!level) return;
    const elapsedMs = Date.now() - levelStartedAt;
    const stars = starsFor(levelStats, level, elapsedMs, playMode);
    const alreadyCompleted = progress.completed.includes(level.id);
    const baseRewards = rewardsFor(
      level,
      levelStats,
      stars,
      alreadyCompleted,
      elapsedMs,
      level.characters.length,
      playMode,
    );
    const beforeLevel = playerLevelForXp(progress.xp);
    const afterLevel = playerLevelForXp(progress.xp + baseRewards.xp);
    const levelUp =
      afterLevel > beforeLevel
        ? {
            from: beforeLevel,
            to: afterLevel,
            reward: nextLevelRewardLabel(afterLevel),
          }
        : undefined;
    playSound('win');
    window.setTimeout(() => playSound('coin'), 260);
    if (stars === 3) window.setTimeout(() => playSound('achievement'), 460);
    triggerHaptic('win');
    if (stars === 3) window.setTimeout(() => triggerHaptic('achievement'), 420);
    setProgress((p) => {
      const nextCompleted = alreadyCompleted
        ? p.completed
        : [...p.completed, level.id];
      const nextProgress: Progress = {
        ...p,
        completed: nextCompleted,
        stars: {
          ...p.stars,
          [level.id]: Math.max(p.stars[String(level.id)] ?? 0, stars),
        },
        coins: p.coins + baseRewards.coins,
        xp: p.xp + baseRewards.xp,
        hints: p.hints + baseRewards.hint,
        life: {
          ...p.life,
          daily: {
            ...p.life.daily,
            solved: p.life.daily.solved + 1,
            stars: p.life.daily.stars + stars,
            noHintSolves:
              p.life.daily.noHintSolves + (levelStats.hintsUsed === 0 ? 1 : 0),
          },
        },
      };
      const achievementResult = addAchievements(
        nextProgress,
        achievementIdsForProgress(nextProgress, level, levelStats, stars),
      );
      const rewards: CompletionRewards = {
        ...baseRewards,
        levelUp,
        achievements: achievementResult.labels,
      };
      window.setTimeout(() => setLastRewards(rewards), 0);
      if (levelUp) {
        window.setTimeout(
          () =>
            setNotice({
              title: `Level ${levelUp.to}!`,
              text: `${levelUp.reward} is waiting in your cozy journey.`,
            }),
          700,
        );
      }
      return achievementResult.progress;
    });
  }, [level, levelStartedAt, levelStats, playMode, playSound, progress.completed, progress.xp, triggerHaptic]);

  const isUnlocked = useCallback(
    (id: number) => {
      return canStartLevel(id, progress);
    },
    [progress],
  );

  const updateSettings = useCallback((settings: Partial<GameSettings>) => {
    setProgress((p) => ({
      ...p,
      settings: {
        ...p.settings,
        ...settings,
      },
    }));
  }, []);

  const updateCustomization = useCallback(
    (updater: (customization: CustomizationState) => CustomizationState) => {
      setProgress((p) => ({
        ...p,
        customization: updater(p.customization),
        life: {
          ...p.life,
          daily: {
            ...p.life.daily,
            customized: true,
          },
        },
      }));
    },
    [],
  );

  const buyShopItem = useCallback(
    (itemId: string): boolean => {
      const item = itemById(itemId);
      if (!item) return false;
      if (progress.life.ownedItems.includes(item.id)) {
        setNotice({ title: 'Already owned', text: `${item.label} is already in your collection.` });
        return false;
      }
      if (item.premium && !progress.premium) {
        playSound('lock');
        setNotice({ title: 'Premium preview', text: `${item.label} is part of a future premium collection.` });
        return false;
      }
      const starCount = totalStars(progress.stars);
      if (item.starsRequired && starCount < item.starsRequired) {
        playSound('wrong');
        setNotice({ title: 'More stars needed', text: `${item.label} unlocks at ${item.starsRequired} total stars.` });
        return false;
      }
      const cost = item.cost ?? 0;
      if (progress.coins < cost) {
        playSound('wrong');
        setNotice({ title: 'Need more coins', text: `${item.label} costs ${cost} coins.` });
        return false;
      }

      playSound(item.kind === 'pet' ? 'achievement' : 'coin');
      setProgress((p) => {
        const nextProgress: Progress = {
          ...p,
          coins: p.coins - cost,
          life: {
            ...p.life,
            ownedItems: unique([...p.life.ownedItems, item.id]),
            selectedPet: item.kind === 'pet' ? item.id : p.life.selectedPet,
            daily: {
              ...p.life.daily,
              boughtItems: p.life.daily.boughtItems + 1,
              petAdopted:
                p.life.daily.petAdopted || (item.kind === 'pet' && item.id !== 'cat-pet'),
            },
          },
        };
        return addAchievements(
          nextProgress,
          item.kind === 'pet' && item.id !== 'cat-pet'
            ? ['first-item', 'first-pet']
            : ['first-item'],
        ).progress;
      });
      setNotice({ title: 'Item unlocked', text: `${item.label} was added to your cozy collection.` });
      return true;
    },
    [playSound, progress.coins, progress.life.ownedItems, progress.premium, progress.stars],
  );

  const toggleDecorItem = useCallback((itemId: string) => {
    const item = itemById(itemId);
    if (!item) return;
    setProgress((p) => {
      if (!p.life.ownedItems.includes(itemId)) return p;
      const equipped = new Set(p.life.equippedDecor);
      if (equipped.has(itemId)) equipped.delete(itemId);
      else equipped.add(itemId);
      return {
        ...p,
        life: {
          ...p.life,
          equippedDecor: Array.from(equipped),
        },
      };
    });
    playSound('button');
  }, [playSound]);

  const selectPet = useCallback((itemId: string) => {
    const item = itemById(itemId);
    if (!item || item.kind !== 'pet') return;
    setProgress((p) => {
      if (!p.life.ownedItems.includes(itemId)) return p;
      const nextProgress: Progress = {
        ...p,
        life: {
          ...p.life,
          selectedPet: itemId,
          daily: {
            ...p.life.daily,
            petAdopted: p.life.daily.petAdopted || itemId !== 'cat-pet',
          },
        },
      };
      return itemId !== 'cat-pet'
        ? addAchievements(nextProgress, ['first-pet']).progress
        : nextProgress;
    });
    playSound('button');
  }, [playSound]);

  const upgradeHome = useCallback(
    (homeId: string): boolean => {
      const home = homeById(homeId);
      if (home.id === progress.life.homeId) {
        setNotice({ title: 'Already home', text: `${home.label} is your current home.` });
        return false;
      }
      if (home.premium && !progress.premium) {
        playSound('lock');
        setNotice({ title: 'Premium home preview', text: `${home.label} is reserved for a future premium season.` });
        return false;
      }
      if (home.starsRequired && totalStars(progress.stars) < home.starsRequired) {
        playSound('wrong');
        setNotice({ title: 'More stars needed', text: `${home.label} unlocks at ${home.starsRequired} total stars.` });
        return false;
      }
      if (progress.coins < home.cost) {
        playSound('wrong');
        setNotice({ title: 'Need more coins', text: `${home.label} costs ${home.cost} coins.` });
        return false;
      }

      setProgress((p) => {
        const nextProgress: Progress = {
          ...p,
          coins: p.coins - home.cost,
          life: {
            ...p.life,
            homeId: home.id,
          },
        };
        return addAchievements(nextProgress, ['first-home-upgrade']).progress;
      });
      playSound('unlock');
      setNotice({ title: 'Home upgraded', text: `${home.label} is ready to decorate.` });
      return true;
    },
    [playSound, progress.coins, progress.life.homeId, progress.premium, progress.stars],
  );

  const claimDailyReward = useCallback((): boolean => {
    const today = todayKey();
    if (progress.life.daily.claimedDailyDate === today) return false;
    const reward = dailyRewardForDate(today);
    setProgress((p) => {
      if (p.life.daily.claimedDailyDate === today) return p;
      const nextLife: LifeProgress = {
        ...p.life,
        daily: {
          ...p.life.daily,
          claimedDailyDate: today,
        },
      };
      if (reward.type === 'item') {
        nextLife.ownedItems = unique([...nextLife.ownedItems, reward.itemId]);
      }
      return {
        ...p,
        coins: p.coins + (reward.type === 'coins' ? reward.amount : reward.type === 'mystery' ? 75 : 0),
        hints: p.hints + (reward.type === 'hints' ? reward.amount : 0),
        life: nextLife,
      };
    });
    playSound('win');
    setNotice({ title: 'Daily reward', text: `${reward.label} added to your cozy day.` });
    return true;
  }, [playSound, progress.life.daily.claimedDailyDate]);

  const claimMission = useCallback(
    (missionId: string): boolean => {
      const mission = DAILY_MISSIONS.find((candidate) => candidate.id === missionId);
      if (!mission) return false;
      const amount = mission.progress(progress.life.daily);
      if (amount < mission.target || progress.life.daily.claimedMissions.includes(mission.id)) {
      playSound('wrong');
      return false;
    }
      setProgress((p) => ({
        ...p,
        coins: p.coins + mission.rewardCoins,
        xp: p.xp + mission.rewardXp,
        life: {
          ...p.life,
          daily: {
            ...p.life.daily,
            claimedMissions: unique([...p.life.daily.claimedMissions, mission.id]),
          },
        },
      }));
    playSound('win');
    triggerHaptic('achievement');
    setNotice({ title: 'Mission complete', text: `+${mission.rewardCoins} coins and +${mission.rewardXp} XP.` });
    return true;
  },
    [playSound, progress.life.daily, triggerHaptic],
  );

  const openMysteryBox = useCallback((): boolean => {
    const cost = 140;
    if (progress.coins < cost) {
      playSound('wrong');
      setNotice({ title: 'Need more coins', text: `A cozy mystery box costs ${cost} in-game coins.` });
      return false;
    }
    const pool = SHOP_ITEMS.filter(
      (item) =>
        !item.premium &&
        !progress.life.ownedItems.includes(item.id) &&
        ['decor', 'furniture', 'cosmetic', 'trail', 'victory'].includes(item.kind),
    );
    const item = pool[Math.floor(Math.random() * Math.max(1, pool.length))];
    if (!item) return false;
    setProgress((p) => ({
      ...p,
      coins: p.coins - cost,
      life: {
        ...p.life,
        mysteryBoxesOpened: p.life.mysteryBoxesOpened + 1,
        ownedItems: unique([...p.life.ownedItems, item.id]),
      },
    }));
    playSound('achievement');
    setNotice({ title: 'Mystery box opened', text: `${item.label} joined your collection. In-game coins only.` });
    return true;
  }, [playSound, progress.coins, progress.life.ownedItems]);

  const playAsGuest = useCallback(
    (displayName?: string) => {
      const name = displayName?.trim() || 'Guest Player';
      setProgress((p) => ({
        ...p,
        account: {
          provider: 'guest',
          displayName: name,
          onboardingSeen: true,
          shareWithFriends: false,
        },
      }));
      playSound('button');
      setNotice({
        title: 'Guest profile ready',
        text: 'Your progress will keep saving on this device.',
      });
    },
    [playSound],
  );

  const signOutAccount = useCallback(() => {
    setProgress((p) => ({
      ...p,
      account: {
        provider: 'guest',
        displayName: 'Guest Player',
        onboardingSeen: true,
        shareWithFriends: false,
      },
    }));
    playSound('button');
    setNotice({
      title: 'Playing as guest',
      text: 'Progress remains saved locally on this device.',
    });
  }, [playSound]);

  const markTutorialSeen = useCallback((dontShowAgain: boolean) => {
    setProgress((p) => ({
      ...p,
      tutorialSeen: true,
      settings: {
        ...p.settings,
        showTutorialOnLaunch: dontShowAgain
          ? false
          : p.settings.showTutorialOnLaunch,
      },
    }));
  }, []);

  const resetProgress = useCallback(() => {
    playSound('button');
    triggerHaptic('tap');
    setProgress((p) => ({
      ...DEFAULT_PROGRESS,
      account: {
        ...p.account,
        onboardingSeen: true,
      },
    }));
    setLevel(null);
    setPlacement({});
    setLevelStats(EMPTY_STATS);
    setLastRewards(null);
    setFeedback(null);
    setNotice(null);
    setScreen('menu');
  }, [playSound, triggerHaptic]);

  const dismissFeedback = useCallback(() => setFeedback(null), []);
  const dismissNotice = useCallback(() => setNotice(null), []);

  const value: GameCtx = {
    progress,
    setProgress,
    screen,
    levels: LEVELS,
    freeLevels: FREE_LEVELS,
    level,
    placement,
    charBySeat,
    violations,
    solved,
    canonical,
    levelStats,
    currentStars: starsFor(levelStats, level, Date.now() - levelStartedAt, playMode),
    lastRewards,
    feedback,
    notice,
    playMode,
    levelStartedAt,
    openMenu,
    openCustomize,
    openHome,
    openShop,
    openMissions,
    openAchievements,
    startLevel,
    beginLevelRun,
    placeCharacter,
    unplace,
    applyHint,
    resetLevel,
    completeLevel,
    isUnlocked,
    updateSettings,
    updateCustomization,
    buyShopItem,
    toggleDecorItem,
    selectPet,
    upgradeHome,
    claimDailyReward,
    claimMission,
    openMysteryBox,
    playAsGuest,
    signOutAccount,
    markTutorialSeen,
    resetProgress,
    dismissFeedback,
    dismissNotice,
    triggerHurryCue,
    playSound,
    testSound,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
