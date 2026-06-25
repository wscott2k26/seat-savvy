import React from 'react';
import { useGame } from './GameProvider';
import Avatar from './Avatar';

const ENV_META: Record<string, { label: string; from: string; to: string }> = {
  bus: { label: 'Bus', from: '#bfe3ff', to: '#7cb8e8' },
  classroom: { label: 'Classroom', from: '#fdf0d5', to: '#f3d8a8' },
  coffee: { label: 'Cafe', from: '#f6e6d4', to: '#d8b48c' },
  restaurant: { label: 'Dinner', from: '#6d3f59', to: '#3a2440' },
  theater: { label: 'Theater', from: '#241a3a', to: '#161427' },
  airport: { label: 'Airport', from: '#cfe3f7', to: '#7f9ec0' },
  wedding: { label: 'Wedding', from: '#fbe7ef', to: '#e3a9c7' },
  cruise: { label: 'Cruise', from: '#bfe9ff', to: '#3f9fc4' },
};

const LevelSelect: React.FC<{ onPremium: () => void }> = ({ onPremium }) => {
  const { levels, progress, startLevel, isUnlocked } = useGame();
  const completedCount = progress.completed.length;
  const playerLevel = Math.floor(progress.xp / 300) + 1;
  const xpInto = progress.xp % 300;

  return (
    <div className="h-full w-full overflow-y-auto bg-gradient-to-b from-[#fff6e9] to-[#ffe6cf] pb-8">
      <div className="relative overflow-hidden rounded-b-[36px] bg-gradient-to-br from-orange-300 via-rose-300 to-amber-200 px-5 pb-7 pt-7 shadow-lg">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="ts-particle ts-dust" style={{ left: `${(i * 13) % 100}%`, animationDelay: `${i}s` }} />
          ))}
        </div>
        <div className="relative flex items-center gap-3">
          <div className="flex -space-x-3">
            {[20, 200, 330].map((h) => (
              <div key={h} className="rounded-full bg-white/80 p-0.5 shadow ring-2 ring-white">
                <Avatar hue={h} size={40} mood="happy" />
              </div>
            ))}
          </div>
        </div>
        <h1 className="relative mt-3 font-display text-3xl font-black leading-none text-white drop-shadow-sm">Tiny Worlds</h1>
        <p className="relative font-display text-lg font-bold text-white/90">Seat Savvy</p>
        <p className="relative mt-1 max-w-xs text-sm font-medium text-white/85">
          Cozy seating puzzles. Read each guest\u2019s wish, drag them to the perfect spot, and make everybody happy.
        </p>
        <div className="relative mt-4 rounded-2xl bg-white/80 p-3 shadow-inner backdrop-blur">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600">
            <span>Player Level {playerLevel}</span>
            <span>{completedCount}/{levels.length} solved</span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-stone-200">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" style={{ width: `${(xpInto / 300) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="px-4 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold text-stone-800">Story Mode</h2>
          {!progress.premium && (
            <button onClick={onPremium} className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1.5 text-xs font-extrabold text-white shadow">Go Premium</button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {levels.map((lv) => {
            const unlocked = isUnlocked(lv.id);
            const done = progress.completed.includes(lv.id);
            const meta = ENV_META[lv.env];
            return (
              <button
                key={lv.id}
                disabled={!unlocked}
                onClick={() => (unlocked ? startLevel(lv.id) : onPremium())}
                className={`group relative overflow-hidden rounded-2xl p-3 text-left shadow-md ring-1 ring-black/5 transition active:scale-95 ${unlocked ? 'hover:-translate-y-0.5' : 'opacity-90'}`}
                style={{ background: `linear-gradient(160deg, ${meta.from}, ${meta.to})` }}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-bold text-white">Lv {lv.id}</span>
                  {done && (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white shadow">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                  )}
                  {!unlocked && (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-black/30 text-white">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                    </span>
                  )}
                </div>
                <p className="mt-6 font-display text-sm font-extrabold leading-tight text-white drop-shadow">{lv.title}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-white/80">{meta.label} \u00b7 {lv.characters.length} guests</p>
              </button>
            );
          })}
        </div>
        <p className="mt-6 text-center text-xs font-medium text-stone-400">Tiny Worlds: Seat Savvy \u00b7 a cozy puzzle for calm minds</p>
      </div>
    </div>
  );
};

export default LevelSelect;
