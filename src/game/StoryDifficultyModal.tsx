import React from 'react';
import type { Level } from './types';
import type { PlayMode } from './timing';
import { formatClock, playModeLabel, timeGoalSeconds, timeLimitSeconds } from './timing';
import Avatar from './Avatar';
import { Backdrop } from './Modals';
import { cluewordForLevel } from './dailyDrama';

const MODE_CARDS: { mode: PlayMode; title: string; subtitle: string }[] = [
  { mode: 'relaxed', title: 'Easy', subtitle: 'Learn the clues' },
  { mode: 'medium', title: 'Medium', subtitle: 'Faster rewards' },
  { mode: 'hard', title: 'Hard', subtitle: 'Tighter timer' },
];

const StoryDifficultyModal: React.FC<{
  level: Level;
  onStart: (mode: PlayMode) => void;
}> = ({ level, onStart }) => {
  const [mode, setMode] = React.useState<PlayMode>('relaxed');
  const clueword = cluewordForLevel(level);
  const goal = formatClock(timeGoalSeconds(level, mode));
  const limit = formatClock(timeLimitSeconds(level, mode));

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

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-3xl border border-white/10 bg-white/8 p-2 shadow-inner">
        {MODE_CARDS.map((card) => {
          const active = mode === card.mode;
          return (
            <button
              key={card.mode}
              type="button"
              onClick={() => setMode(card.mode)}
              className={`rounded-2xl px-2 py-3 text-left text-xs font-black transition active:scale-95 ${
                active ? 'bg-[#d6a84f] text-[#15101f]' : 'bg-[#050816]/48 text-[#d9cda9]'
              }`}
            >
              {card.title}
              <span className="block text-[9px] font-bold opacity-80">{card.subtitle}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-extrabold text-[#d9cda9]">
        <span className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
          {playModeLabel(mode)} star goal: <b className="text-[#f6d98d]">{goal}</b>
        </span>
        <span className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
          Finish limit: <b className="text-[#f6d98d]">{limit}</b>
        </span>
      </div>

      <button
        onClick={() => onStart(mode)}
        className="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#d6a84f] via-[#f0c76a] to-[#a86a78] py-3 text-lg font-extrabold text-[#130f20] shadow-[0_12px_28px_rgba(214,168,79,0.25)] transition hover:-translate-y-0.5 active:scale-95"
      >
        Start {playModeLabel(mode)}
      </button>
    </Backdrop>
  );
};

export default StoryDifficultyModal;
