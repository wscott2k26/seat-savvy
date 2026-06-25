import React from 'react';
import type { Level } from './types';
import Avatar from './Avatar';

const Backdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
    <div className="ts-pop w-full max-w-md rounded-3xl bg-gradient-to-b from-amber-50 to-orange-100 p-6 shadow-2xl ring-1 ring-white/60">
      {children}
    </div>
  </div>
);

export const StoryModal: React.FC<{
  level: Level;
  onStart: () => void;
}> = ({ level, onStart }) => (
  <Backdrop>
    <div className="flex items-center gap-3">
      <Avatar hue={28} size={56} mood="happy" />
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          Level {level.id}
        </p>
        <h2 className="font-display text-2xl font-extrabold text-stone-800">
          {level.title}
        </h2>
      </div>
    </div>
    <div className="mt-4 rounded-2xl bg-white/70 p-4 text-stone-700 shadow-inner">
      <p className="text-[15px] leading-relaxed">{level.intro}</p>
      <p className="mt-3 text-xs font-semibold text-stone-500">
        \u2014 {level.hostName}
      </p>
    </div>
    <button
      onClick={onStart}
      className="mt-5 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 py-3 text-lg font-extrabold text-white shadow-lg transition active:scale-95"
    >
      Let\u2019s seat them!
    </button>
  </Backdrop>
);

export const WinModal: React.FC<{
  level: Level;
  onNext: () => void;
  onMenu: () => void;
  hasNext: boolean;
}> = ({ level, onNext, onMenu, hasNext }) => (
  <Backdrop>
    <div className="flex flex-col items-center text-center">
      <div className="ts-celebrate rounded-full bg-white p-1 shadow-lg ring-2 ring-amber-200">
        <Avatar hue={120} size={72} mood="happy" />
      </div>
      <div className="mt-2 flex items-center gap-1 text-amber-500">
        {[0, 1, 2].map((i) => (
          <Star key={i} delay={i * 0.12} />
        ))}
      </div>
      <h2 className="mt-2 font-display text-2xl font-extrabold text-stone-800">
        Puzzle Solved!
      </h2>
      <p className="mt-3 rounded-2xl bg-white/70 p-4 text-[15px] leading-relaxed text-stone-700 shadow-inner">
        {level.outro}
      </p>
      <div className="mt-3 flex items-center gap-3 text-sm font-bold text-stone-600">
        <span className="rounded-full bg-amber-200 px-3 py-1">+50 coins</span>
        <span className="rounded-full bg-emerald-200 px-3 py-1">+100 XP</span>
        <span className="rounded-full bg-sky-200 px-3 py-1">+1 hint</span>
      </div>
      <div className="mt-5 flex w-full gap-3">
        <button
          onClick={onMenu}
          className="flex-1 rounded-2xl bg-white py-3 font-extrabold text-stone-700 shadow ring-1 ring-black/5 active:scale-95"
        >
          Levels
        </button>
        {hasNext && (
          <button
            onClick={onNext}
            className="flex-[1.4] rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 font-extrabold text-white shadow-lg active:scale-95"
          >
            Next Level
          </button>
        )}
      </div>
    </div>
  </Backdrop>
);

const Star: React.FC<{ delay: number }> = ({ delay }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="#f4c64a"
    stroke="#c9941f"
    className="ts-star"
    style={{ animationDelay: `${delay}s` }}
  >
    <path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z" />
  </svg>
);

export { Backdrop };
