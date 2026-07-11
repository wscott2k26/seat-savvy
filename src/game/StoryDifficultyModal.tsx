import React from 'react';
import type { Level } from './types';
import type { PlayMode } from './timing';
import { formatClock, playModeLabel, timeGoalSeconds, timeLimitSeconds } from './timing';
import Avatar from './Avatar';
import { Backdrop } from './Modals';
import { cluewordForLevel } from './dailyDrama';
import { difficultyAccessFor } from './difficultyProgress';

const MODE_CARDS: { mode: PlayMode; title: string; subtitle: string }[] = [
  { mode: 'relaxed', title: 'Easy', subtitle: 'Story mode' },
  { mode: 'medium', title: 'Medium', subtitle: 'Tiered challenge' },
  { mode: 'hard', title: 'Hard', subtitle: 'Boss timing' },
];

const StoryDifficultyModal: React.FC<{
  level: Level;
  premium: boolean;
  onStart: (mode: PlayMode) => void;
}> = ({ level, premium, onStart }) => {
  const [mode, setMode] = React.useState<PlayMode>('relaxed');
  const selectedAccess = difficultyAccessFor(mode, level.id, premium);
  const clueword = cluewordForLevel(level);
  const goal = formatClock(timeGoalSeconds(level, mode));
  const limit = formatClock(timeLimitSeconds(level, mode));

  React.useEffect(() => {
    if (!selectedAccess.unlocked) setMode('relaxed');
  }, [selectedAccess.unlocked]);

  return (
    <Backdrop>
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-[#f6d98d]/12 p-1 shadow-[0_0_24px_rgba(214,168,79,0.25)] ring-2 ring-[#d6a84f]/35">
          <Avatar hue={28} size={56} mood="happy" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d6a84f]">
            Level {level.id}
          </p>
          <h2 className="font-display text-2xl font-extrabold text-[#fff5d8]">
            {level.title}
          </h2>
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-white/10 bg-[#0d1930]/72 p-4 text-[#eadfcb] shadow-inner">
        <p className="text-[15px] leading-relaxed">{level.intro}</p>
        <p className="mt-3 text-xs font-semibold text-[#d6a84f]">
          &mdash; {level.hostName}
        </p>
      </div>

      <div className="mt-3 rounded-3xl border border-[#d6a84f]/24 bg-[#d6a84f]/10 p-4 shadow-inner">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#d6a84f]">
          Clueword Warm-Up
        </p>
        <p className="mt-1 text-sm font-bold text-[#fff5d8]">
          “{clueword.clue}” = <span className="text-[#f6d98d]">{clueword.answer}</span>
        </p>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-[#d9cda9]">
          {clueword.rule}
        </p>
      </div>

      <div className="mt-4 rounded-3xl border border-white/10 bg-white/8 p-2 shadow-inner">
        <p className="mb-2 px-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#d6a84f]">
          Pick a difficulty
        </p>
        <div className="grid grid-cols-3 gap-2">
          {MODE_CARDS.map((card) => {
            const active = mode === card.mode;
            const access = difficultyAccessFor(card.mode, level.id, premium);
            return (
              <button
                key={card.mode}
                type="button"
                disabled={!access.unlocked}
                onClick={() => access.unlocked && setMode(card.mode)}
                className={`rounded-2xl px-2 py-3 text-left text-xs font-black transition active:scale-95 ${
                  active
                    ? 'bg-[#d6a84f] text-[#15101f]'
                    : access.unlocked
                      ? 'bg-[#050816]/48 text-[#d9cda9]'
                      : 'bg-[#050816]/38 text-[#a9a0b5] opacity-70'
                }`}
              >
                <span className="flex items-center justify-between gap-1">
                  {card.title}
                  <span className="rounded-full bg-black/20 px-1.5 py-0.5 text-[8px] font-black">
                    {access.badge}
                  </span>
                </span>
                <span className="mt-1 block text-[9px] font-bold opacity-80">
                  {access.unlocked ? card.subtitle : access.detail}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-extrabold text-[#d9cda9]">
        <span className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
          {playModeLabel(mode)} star goal: <b className="text-[#f6d98d]">{goal}</b>
        </span>
        <span className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
          Finish limit: <b className="text-[#f6d98d]">{limit}</b>
        </span>
      </div>

      <p className="mt-3 rounded-2xl border border-white/10 bg-black/18 px-3 py-2 text-[11px] font-bold leading-relaxed text-[#d9cda9]">
        Medium and Hard start with 6 free trial puzzles. After that, clear 6 puzzles in that difficulty to unlock the next tier. The final tiers stay part of Full Adventure.
      </p>

      <button
        disabled={!selectedAccess.unlocked}
        onClick={() => selectedAccess.unlocked && onStart(mode)}
        className="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#d6a84f] via-[#f0c76a] to-[#a86a78] py-3 text-lg font-extrabold text-[#130f20] shadow-[0_12px_28px_rgba(214,168,79,0.25)] transition hover:-translate-y-0.5 active:scale-95 disabled:opacity-45"
      >
        Start {playModeLabel(mode)}
      </button>
    </Backdrop>
  );
};

export default StoryDifficultyModal;
