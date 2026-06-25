import React from 'react';
import { useGame } from './GameProvider';

const Pill: React.FC<{ children: React.ReactNode; onClick?: () => void; title?: string }> = ({
  children,
  onClick,
  title,
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="flex items-center gap-1 rounded-full bg-white/85 px-3 py-1.5 text-sm font-bold text-stone-700 shadow ring-1 ring-black/5 backdrop-blur transition hover:bg-white active:scale-95"
  >
    {children}
  </button>
);

const Coin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#f4c64a" stroke="#c9941f" strokeWidth="1.5" /><circle cx="12" cy="12" r="6" fill="none" stroke="#c9941f" strokeWidth="1.5" /></svg>
);
const Bulb = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffe08a" stroke="#c9941f" strokeWidth="1.4"><path d="M9 18h6M10 21h4M12 2a7 7 0 0 0-4 12c.6.6 1 1.4 1 2h6c0-.6.4-1.4 1-2A7 7 0 0 0 12 2z" /></svg>
);

const TopBar: React.FC<{ onHint: () => void; onReset: () => void; onSettings: () => void }> = ({
  onHint,
  onReset,
  onSettings,
}) => {
  const { progress, openMenu, level } = useGame();
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between gap-2 p-3">
      <div className="pointer-events-auto flex items-center gap-2">
        <Pill onClick={openMenu} title="Levels">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </Pill>
        {level && (
          <div className="rounded-full bg-white/85 px-3 py-1.5 text-sm font-extrabold text-stone-800 shadow ring-1 ring-black/5 backdrop-blur">
            {level.title}
          </div>
        )}
      </div>
      <div className="pointer-events-auto flex items-center gap-2">
        <Pill title="Coins"><Coin /> {progress.coins}</Pill>
        <Pill onClick={onHint} title="Use a hint">
          <Bulb /> {progress.premium ? '\u221e' : progress.hints}
        </Pill>
        <Pill onClick={onReset} title="Reset">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
        </Pill>
        <Pill onClick={onSettings} title="Settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 12a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 5" /></svg>
        </Pill>
      </div>
    </div>
  );
};

export default TopBar;
