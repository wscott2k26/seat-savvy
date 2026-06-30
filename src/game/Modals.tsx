import React from 'react';
import type { Level } from './types';
import type { LevelStats } from './GameProvider';
import type { CompletionRewards } from './lifeData';
import Avatar from './Avatar';

const Backdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#030712]/72 p-4 backdrop-blur-md">
    <div className="ts-pop max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-[28px] border border-[#f3c96a]/24 bg-[linear-gradient(160deg,rgba(20,18,40,0.96),rgba(43,26,55,0.96)_52%,rgba(13,25,45,0.96))] p-6 text-[#f8edd2] shadow-[0_28px_70px_rgba(0,0,0,0.55),0_0_36px_rgba(214,168,79,0.12)] ring-1 ring-white/10">
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
    <button
      onClick={onStart}
      className="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#d6a84f] via-[#f0c76a] to-[#a86a78] py-3 text-lg font-extrabold text-[#130f20] shadow-[0_12px_28px_rgba(214,168,79,0.25)] transition hover:-translate-y-0.5 active:scale-95"
    >
      Let&apos;s seat them!
    </button>
  </Backdrop>
);

export const WinModal: React.FC<{
  level: Level;
  onNext: () => void;
  onMenu: () => void;
  hasNext: boolean;
  stars: number;
  stats: LevelStats;
  rewards?: CompletionRewards | null;
  achievements?: string[];
}> = ({ level, onNext, onMenu, hasNext, stars, stats, rewards, achievements = [] }) => (
  <Backdrop>
    <div className="flex flex-col items-center text-center">
      <div className="ts-celebrate rounded-full bg-[#f6d98d]/12 p-1 shadow-[0_0_34px_rgba(214,168,79,0.35)] ring-2 ring-[#d6a84f]/40">
        <Avatar hue={120} size={72} mood="happy" />
      </div>
      <StarMeter stars={stars} />
      <h2 className="mt-2 font-display text-2xl font-extrabold text-[#fff5d8]">
        Puzzle Solved!
      </h2>
      <p className="mt-3 rounded-3xl border border-white/10 bg-[#0d1930]/72 p-4 text-[15px] leading-relaxed text-[#eadfcb] shadow-inner">
        {level.outro}
      </p>
      <div className="mt-3 grid w-full grid-cols-3 gap-2 text-xs font-extrabold text-[#d9cda9]">
        <RewardStat label="Score" value={scoreForWin(stars, stats, rewards)} />
        <RewardStat label="Time" value={formatTime(rewards?.elapsedSeconds)} />
        <RewardStat label="Mistakes" value={stats.mistakes} />
        <RewardStat label="Hints" value={stats.hintsUsed} />
        <RewardStat label="Stars" value={stars} />
        <RewardStat label="Coins" value={`+${rewards?.coins ?? 50 + stars * 10}`} />
        <RewardStat label="XP" value={`+${rewards?.xp ?? 100 + stars * 15}`} />
      </div>
      <p className="mt-2 text-[11px] font-bold text-[#a9a0b5]">
        Faster, cleaner solves earn the biggest coin and XP bonuses.
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm font-bold text-[#1a1326]">
        <span className="rounded-full bg-[#d6a84f] px-3 py-1 shadow-[0_0_16px_rgba(214,168,79,0.25)]">
          +{rewards?.coins ?? 50 + stars * 10} coins
        </span>
        <span className="rounded-full bg-[#b7d6c8] px-3 py-1">
          +{rewards?.xp ?? 100 + stars * 15} XP
        </span>
        {(rewards?.hint ?? 1) > 0 && (
          <span className="rounded-full bg-[#9fb6d9] px-3 py-1">
            +{rewards?.hint ?? 1} hint
          </span>
        )}
      </div>
      {rewards?.bonuses && rewards.bonuses.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {rewards.bonuses.map((bonus) => (
            <span
              key={bonus}
              className="rounded-full border border-[#d6a84f]/24 bg-[#d6a84f]/10 px-3 py-1 text-xs font-extrabold text-[#f6d98d]"
            >
              {bonus}
            </span>
          ))}
        </div>
      )}
      {rewards?.levelUp && (
        <div className="mt-3 w-full rounded-3xl border border-[#b7d6c8]/24 bg-[#b7d6c8]/12 px-4 py-3 text-left shadow-inner">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b7d6c8]">
            Level up
          </p>
          <p className="mt-1 text-sm font-extrabold text-[#fff5d8]">
            Player Level {rewards.levelUp.to} - {rewards.levelUp.reward}
          </p>
        </div>
      )}
      {achievements.length > 0 && (
        <div className="mt-3 w-full rounded-3xl border border-[#d6a84f]/30 bg-[#d6a84f]/12 px-4 py-3 text-left shadow-inner">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d6a84f]">
            Rewards unlocked
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {achievements.map((achievement) => (
              <span
                key={achievement}
                className="rounded-full bg-[#f7d889] px-3 py-1 text-xs font-extrabold text-[#181126]"
              >
                {achievement}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="mt-5 flex w-full gap-3">
        <button
          onClick={onMenu}
          className="flex-1 rounded-2xl border border-white/10 bg-white/10 py-3 font-extrabold text-[#f8edd2] shadow ring-1 ring-black/5 transition hover:bg-white/15 active:scale-95"
        >
          Back
        </button>
        {hasNext && (
          <button
            onClick={onNext}
            className="flex-[1.4] rounded-2xl bg-gradient-to-r from-[#d6a84f] to-[#f1cb78] py-3 font-extrabold text-[#15101f] shadow-[0_12px_28px_rgba(214,168,79,0.25)] transition hover:-translate-y-0.5 active:scale-95"
          >
            Next Level
          </button>
        )}
      </div>
    </div>
  </Backdrop>
);

export const TutorialModal: React.FC<{
  onClose: (dontShowAgain: boolean) => void;
}> = ({ onClose }) => {
  const [dontShowAgain, setDontShowAgain] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const lessons: TutorialLesson[] = [
    {
      title: 'Welcome to Tiny Worlds',
      text: 'Every puzzle is a tiny story. Your job is to make the seating feel just right.',
      icon: 'spark',
    },
    {
      title: 'Every guest has wishes',
      text: 'Character cards show cozy preferences, like window seats, quiet corners, or staying near a friend.',
      icon: 'guest',
    },
    {
      title: 'Drag into seats',
      text: 'Pick up a character from the tray and drop them onto a chair in the scene.',
      icon: 'drag',
    },
    {
      title: 'Read seat clues',
      text: 'Seats can be window, aisle, front, back, quiet, near music, or near food.',
      icon: 'seat',
    },
    {
      title: 'Symbol key',
      text: 'Use the key to match seat symbols with the clue words you see in each puzzle.',
      icon: 'key',
      symbolKey: true,
    },
    {
      title: 'Mind relationships',
      text: 'Some guests need to sit beside someone. Others want to avoid sitting near someone.',
      icon: 'relation',
    },
    {
      title: 'Watch reactions',
      text: 'Green means the placement currently works. Red means at least one clue is unhappy.',
      icon: 'react',
    },
    {
      title: 'Use hints when stuck',
      text: 'Hints start gentle, then narrow the area, then give a stronger nudge.',
      icon: 'hint',
    },
    {
      title: 'Unlock more stories',
      text: 'Seat everyone correctly to finish the level, earn stars, and open the next chapter.',
      icon: 'win',
    },
  ];
  const current = lessons[step];
  const isLast = step === lessons.length - 1;

  return (
    <Backdrop>
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-[#f6d98d]/12 p-1 shadow-[0_0_26px_rgba(214,168,79,0.25)] ring-2 ring-[#d6a84f]/35">
          <Avatar hue={35} size={58} mood="happy" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d6a84f]">
            How to Play
          </p>
          <h2 className="font-display text-2xl font-extrabold text-[#fff5d8]">
            Seat each tiny world
          </h2>
        </div>
      </div>
      <div className="mt-5 rounded-[26px] border border-[#d6a84f]/22 bg-[#0d1930]/72 p-5 text-center shadow-inner">
        <TutorialIcon name={current.icon} />
        <p className="mt-4 font-display text-xl font-black text-[#fff5d8]">
          {current.title}
        </p>
        <p className="mt-2 min-h-[56px] text-sm leading-relaxed text-[#d9cda9]">
          {current.text}
        </p>
        {current.symbolKey && <SymbolKey />}
        <div className="mt-4 flex justify-center gap-1.5">
          {lessons.map((lesson, index) => (
            <span
              key={lesson.title}
              className={`h-1.5 rounded-full transition-all ${
                index === step ? 'w-7 bg-[#d6a84f]' : 'w-2 bg-white/25'
              }`}
            />
          ))}
        </div>
      </div>
      <label className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-sm font-bold text-[#eadfcb] shadow-inner">
        <input
          type="checkbox"
          checked={dontShowAgain}
          onChange={(e) => setDontShowAgain(e.target.checked)}
        />
        Don&apos;t show this again
      </label>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          onClick={() => (step === 0 ? onClose(dontShowAgain) : setStep((s) => s - 1))}
          className="rounded-2xl border border-white/10 bg-white/10 py-3 text-sm font-extrabold text-[#eadfcb] shadow transition hover:bg-white/15 active:scale-95"
        >
          {step === 0 ? 'Skip' : 'Back'}
        </button>
        <button
          onClick={() => onClose(dontShowAgain)}
          className="rounded-2xl border border-white/10 bg-white/8 py-3 text-sm font-extrabold text-[#d9cda9] shadow transition hover:bg-white/12 active:scale-95"
        >
          Skip
        </button>
        <button
          onClick={() => (isLast ? onClose(dontShowAgain) : setStep((s) => s + 1))}
          className="rounded-2xl bg-gradient-to-r from-[#d6a84f] to-[#f0c76a] py-3 text-sm font-extrabold text-[#15101f] shadow-[0_10px_24px_rgba(214,168,79,0.24)] transition hover:-translate-y-0.5 active:scale-95"
        >
          {isLast ? 'Start Playing' : 'Next'}
        </button>
      </div>
    </Backdrop>
  );
};

type TutorialLesson = {
  title: string;
  text: string;
  icon: string;
  symbolKey?: boolean;
};

export const StarMeter: React.FC<{ stars: number; small?: boolean }> = ({
  stars,
  small = false,
}) => (
  <div
    className={`mt-2 flex items-center justify-center gap-1 text-[#d6a84f] ${
      small ? '' : 'text-lg'
    }`}
  >
    {[0, 1, 2].map((i) => (
      <Star key={i} delay={i * 0.12} filled={i < stars} small={small} />
    ))}
  </div>
);

const Star: React.FC<{ delay: number; filled?: boolean; small?: boolean }> = ({
  delay,
  filled = true,
  small = false,
}) => (
  <svg
    width={small ? 14 : 34}
    height={small ? 14 : 34}
    viewBox="0 0 24 24"
    fill={filled ? '#f4c64a' : 'rgba(255,255,255,0.55)'}
    stroke="#c9941f"
    className="ts-star"
    style={{ animationDelay: `${delay}s` }}
  >
    <path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z" />
  </svg>
);

const TutorialIcon: React.FC<{ name: string }> = ({ name }) => {
  const common = {
    width: 54,
    height: 54,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#d6a84f',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'mx-auto drop-shadow-[0_0_12px_rgba(214,168,79,0.35)]',
  };

  if (name === 'guest') return <svg {...common}><circle cx="12" cy="7" r="3.2" /><path d="M5 21a7 7 0 0 1 14 0" /><path d="M17 10l2 2 3-4" /></svg>;
  if (name === 'drag') return <svg {...common}><path d="M8 4v9" /><path d="M5 10l3 3 3-3" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="16" width="7" height="4" rx="1" /><path d="M12 18h6" /></svg>;
  if (name === 'seat') return <svg {...common}><path d="M7 4h10v8H7z" /><path d="M6 12h12l-1 8H7z" /><path d="M9 8h6M9 16h6" /></svg>;
  if (name === 'key') return <svg {...common}><circle cx="7.5" cy="14.5" r="3.5" /><path d="M10 12l8-8" /><path d="M15 7l2 2" /><path d="M17 5l2 2" /><path d="M6.5 14.5h.01" /></svg>;
  if (name === 'relation') return <svg {...common}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /><path d="M4 4l16 16" /></svg>;
  if (name === 'react') return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M8 10h.01M16 10h.01" /><path d="M8.5 15c2 1.5 5 1.5 7 0" /></svg>;
  if (name === 'hint') return <svg {...common}><path d="M9 18h6" /><path d="M10 22h4" /><path d="M8 14a6 6 0 1 1 8 0c-.8.7-1 1.4-1 2H9c0-.6-.2-1.3-1-2z" /></svg>;
  if (name === 'win') return <svg {...common}><path d="M12 2l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z" /></svg>;
  return <svg {...common}><path d="M12 2l1.6 5 5 .4-4 3.1 1.3 4.9L12 12.5 8.1 15.4l1.3-4.9-4-3.1 5-.4z" /><path d="M19 14l.8 2.4 2.2.2-1.8 1.4.6 2.2L19 18.9l-1.8 1.3.6-2.2-1.8-1.4 2.2-.2z" /></svg>;
};

const SymbolKey: React.FC = () => {
  const items = [
    { label: 'Window', symbol: '▭' },
    { label: 'Aisle', symbol: '↔' },
    { label: 'Front', symbol: '↑' },
    { label: 'Back', symbol: '↓' },
    { label: 'Quiet', symbol: '◌' },
    { label: 'Music', symbol: '♪' },
    { label: 'Food', symbol: '◒' },
    { label: 'Beside', symbol: '♥' },
    { label: 'Avoid', symbol: '×' },
  ];

  return (
    <div className="mt-4 grid grid-cols-3 gap-2 text-left">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/10 bg-black/22 px-2 py-2 shadow-inner"
        >
          <span className="mr-1 inline-grid h-6 w-6 place-items-center rounded-full bg-[#d6a84f]/16 text-sm font-black text-[#f6d98d] ring-1 ring-[#d6a84f]/24">
            {item.symbol}
          </span>
          <span className="text-[11px] font-black text-[#eadfcb]">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const RewardStat: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <span className="rounded-2xl border border-white/10 bg-white/8 px-2 py-2 shadow-inner">
    <span className="block text-[10px] font-black uppercase tracking-wide text-[#a9a0b5]">
      {label}
    </span>
    <span className="block text-sm font-black text-[#fff5d8]">{value}</span>
  </span>
);

function formatTime(seconds?: number): string {
  if (!seconds) return '--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : `${secs}s`;
}

function scoreForWin(
  stars: number,
  stats: LevelStats,
  rewards?: CompletionRewards | null,
): string {
  const rewardScore = rewards ? rewards.coins * 8 + rewards.xp * 4 : 0;
  const cleanScore = Math.max(0, 300 - stats.mistakes * 45 - stats.hintsUsed * 55);
  return (stars * 500 + cleanScore + rewardScore).toLocaleString();
}

export { Backdrop };
