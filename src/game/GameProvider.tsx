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

const FREE_LEVELS = 5;

interface Progress {
  coins: number;
  hints: number;
  xp: number;
  completed: number[]; // level ids
  premium: boolean;
  soundOn: boolean;
}

const DEFAULT_PROGRESS: Progress = {
  coins: 120,
  hints: 3,
  xp: 0,
  completed: [],
  premium: false,
  soundOn: true,
};

type Screen = 'menu' | 'play';

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
  openMenu: () => void;
  startLevel: (id: number) => void;
  placeCharacter: (charId: string, seatId: string) => void;
  unplace: (charId: string) => void;
  useHint: () => boolean;
  resetLevel: () => void;
  completeLevel: () => void;
  isUnlocked: (id: number) => boolean;
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
    if (raw) return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_PROGRESS;
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [progress, setProgress] = useState<Progress>(load);
  const [screen, setScreen] = useState<Screen>('menu');
  const [level, setLevel] = useState<Level | null>(null);
  const [placement, setPlacement] = useState<Record<string, string>>({});

  useEffect(() => {
    localStorage.setItem('tw_progress', JSON.stringify(progress));
  }, [progress]);

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

  const openMenu = useCallback(() => setScreen('menu'), []);

  const startLevel = useCallback((id: number) => {
    const lv = levelById(id);
    if (!lv) return;
    setLevel(lv);
    setPlacement({});
    setScreen('play');
  }, []);

  const placeCharacter = useCallback((charId: string, seatId: string) => {
    setPlacement((prev) => {
      const next = { ...prev };
      // if another char occupies this seat, send them back to tray
      for (const [cid, sid] of Object.entries(next)) {
        if (sid === seatId && cid !== charId) delete next[cid];
      }
      next[charId] = seatId;
      return next;
    });
  }, []);

  const unplace = useCallback((charId: string) => {
    setPlacement((prev) => {
      const next = { ...prev };
      delete next[charId];
      return next;
    });
  }, []);

  const resetLevel = useCallback(() => setPlacement({}), []);

  const useHint = useCallback(() => {
    if (!level || !canonical) return false;
    let used = false;
    setProgress((p) => {
      if (!p.premium && p.hints <= 0) return p;
      return { ...p, hints: p.premium ? p.hints : p.hints - 1 };
    });
    // place one currently-misplaced or unplaced character correctly
    setPlacement((prev) => {
      for (const char of level.characters) {
        const target = Object.entries(canonical).find(
          ([, cid]) => cid === char.id,
        )?.[0];
        if (!target) continue;
        if (prev[char.id] !== target) {
          used = true;
          const next = { ...prev };
          for (const [cid, sid] of Object.entries(next)) {
            if (sid === target) delete next[cid];
          }
          next[char.id] = target;
          return next;
        }
      }
      return prev;
    });
    return used;
  }, [level, canonical]);

  const completeLevel = useCallback(() => {
    if (!level) return;
    setProgress((p) => {
      if (p.completed.includes(level.id)) return p;
      return {
        ...p,
        completed: [...p.completed, level.id],
        coins: p.coins + 50,
        xp: p.xp + 100,
        hints: p.hints + 1,
      };
    });
  }, [level]);

  const isUnlocked = useCallback(
    (id: number) => {
      if (id <= FREE_LEVELS) return true;
      return progress.premium;
    },
    [progress.premium],
  );

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
    openMenu,
    startLevel,
    placeCharacter,
    unplace,
    useHint,
    resetLevel,
    completeLevel,
    isUnlocked,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
