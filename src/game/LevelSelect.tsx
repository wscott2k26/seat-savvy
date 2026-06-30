import React from 'react';
import { useGame } from './GameProvider';
import Avatar from './Avatar';
import { StarMeter } from './Modals';
import { GAME_THEME_BACKGROUNDS } from './customization';
import {
  nextLevelRewardLabel,
  playerLevelForXp,
  totalStars,
  xpIntoLevel,
} from './lifeData';

const ENV_META: Record<string, { label: string; from: string; to: string; glow: string }> = {
  bus: { label: 'Bus', from: '#15263f', to: '#314a50', glow: '#d6a84f' },
  classroom: { label: 'Classroom', from: '#211930', to: '#493a56', glow: '#c7a66a' },
  coffee: { label: 'Cafe', from: '#251a2d', to: '#60402f', glow: '#d6a84f' },
  restaurant: { label: 'Dinner', from: '#1d142b', to: '#65324d', glow: '#c9868f' },
  theater: { label: 'Theater', from: '#11152b', to: '#342352', glow: '#a99ad6' },
  airport: { label: 'Airport', from: '#102037', to: '#31516c', glow: '#9fb6d9' },
  wedding: { label: 'Wedding', from: '#21172d', to: '#6a4058', glow: '#d6a84f' },
  cruise: { label: 'Cruise', from: '#0d2035', to: '#216073', glow: '#9fd1d9' },
};

const chapterFor = (id: number) => {
  if (id <= 5) return 'Chapter 1 - First Steps';
  if (id <= 10) return 'Chapter 2 - Easy Errands';
  if (id <= 15) return 'Chapter 3 - Medium Mix-Ups';
  if (id <= 20) return 'Chapter 4 - Clever Crowds';
  if (id <= 30) return 'Chapter 5 - Free Story Collection';
  return 'Chapter 6 - Full Adventure';
};

const difficultyFor = (id: number) => {
  if (id <= 5) return 'Beginner';
  if (id <= 10) return 'Easy';
  if (id <= 15) return 'Medium';
  if (id <= 20) return 'Hard';
  return 'Expert';
};

const LevelSelect: React.FC<{
  onAccount: () => void;
  onAchievements: () => void;
  onCustomize: () => void;
  onHome: () => void;
  onMissions: () => void;
  onPremium: () => void;
  onSettings: () => void;
  onShop: () => void;
}> = ({
  onAccount,
  onAchievements,
  onCustomize,
  onHome,
  onMissions,
  onPremium,
  onSettings,
  onShop,
}) => {
  const { freeLevels, levels, progress, startLevel, isUnlocked } = useGame();
  const completedCount = progress.completed.length;
  const playerLevel = playerLevelForXp(progress.xp);
  const xpInto = xpIntoLevel(progress.xp);
  const stars = totalStars(progress.stars);
  const accountLabel = 'Guest Save';
  const themeBackground =
    GAME_THEME_BACKGROUNDS[progress.customization.gameTheme] ??
    GAME_THEME_BACKGROUNDS['midnight-gold'];
  const showPremiumNudge =
    !progress.premium && completedCount >= Math.max(0, freeLevels - 5);
  const grouped = levels.reduce<Record<string, typeof levels>>((acc, level) => {
    const chapter = chapterFor(level.id);
    acc[chapter] = acc[chapter] ?? [];
    acc[chapter].push(level);
    return acc;
  }, {});

  return (
    <div
      className="safe-screen relative h-full w-full overflow-y-auto text-[#f8edd2]"
      style={{ background: themeBackground }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="ts-particle ts-stardust"
            style={{
              left: `${(i * 47) % 100}%`,
              animationDelay: `${i * 0.45}s`,
              animationDuration: `${8 + (i % 5)}s`,
            }}
          />
        ))}
      </div>
      <div className="safe-header relative overflow-hidden rounded-b-[34px] border-b border-[#d6a84f]/20 bg-[linear-gradient(145deg,rgba(14,19,42,0.96),rgba(51,30,66,0.94)_50%,rgba(13,33,58,0.96))] pb-6 shadow-[0_20px_48px_rgba(0,0,0,0.46),0_0_36px_rgba(214,168,79,0.12)]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_42%,rgba(0,0,0,0.25))]" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="ts-particle ts-dust" style={{ left: `${(i * 13) % 100}%`, animationDelay: `${i}s` }} />
          ))}
        </div>
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex -space-x-3">
            {[20, 200, 330].map((h) => (
              <div key={h} className="rounded-full bg-[#f6d98d]/12 p-0.5 shadow-[0_0_18px_rgba(214,168,79,0.18)] ring-2 ring-[#d6a84f]/35">
                <Avatar
                  hue={h}
                  size={40}
                  mood="happy"
                  {...progress.customization.playerAvatar}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAccount}
              className="safe-hit flex flex-col justify-center rounded-full border border-white/10 bg-white/10 px-3 text-left text-xs font-extrabold text-[#f8edd2] shadow-lg ring-1 ring-[#d6a84f]/15 transition hover:bg-white/15 active:scale-95"
              title="Account and save"
            >
              <span className="leading-tight">{accountLabel}</span>
              <span className="max-w-[96px] truncate text-[10px] font-bold text-[#a9a0b5]">
                {progress.account.displayName}
              </span>
            </button>
            <button
              type="button"
              onClick={onCustomize}
              className="safe-hit grid place-items-center rounded-full border border-[#d6a84f]/24 bg-[#d6a84f]/12 text-[#f6d98d] shadow-lg ring-1 ring-[#d6a84f]/15 transition hover:bg-[#d6a84f]/18 active:scale-95"
              title="Customize"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 1 10-10c0 1.7-1.3 3-3 3h-1.4c-.8 0-1.3.8-1 1.5.4 1.1-.4 2.5-1.6 2.5h-3" /><circle cx="7.5" cy="10.5" r="1" /><circle cx="10.5" cy="6.5" r="1" /><circle cx="14.5" cy="6.5" r="1" /><circle cx="17.5" cy="10.5" r="1" /></svg>
            </button>
            <button
              type="button"
              onClick={onSettings}
              className="safe-hit grid place-items-center rounded-full border border-white/10 bg-white/10 text-[#f8edd2] shadow-lg ring-1 ring-[#d6a84f]/15 transition hover:bg-white/15 active:scale-95"
              title="Settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 12a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 5" /></svg>
            </button>
          </div>
        </div>
        <h1 className="relative mt-3 font-display text-3xl font-black leading-none text-[#fff5d8] drop-shadow-[0_3px_16px_rgba(0,0,0,0.45)]">Tiny Worlds</h1>
        <p className="relative font-display text-lg font-bold text-[#d6a84f]">Seat Savvy</p>
        <p className="relative mt-1 max-w-xs text-sm font-medium text-[#d9cda9]">
          Cozy seating puzzles. Read each guest’s wish, drag them to the perfect spot, and make everybody happy.
        </p>
        <div className="relative mt-4 rounded-3xl border border-white/10 bg-[#050816]/45 p-3 shadow-inner backdrop-blur">
          <div className="flex items-center justify-between text-xs font-bold text-[#d9cda9]">
            <span>Player Level {playerLevel}</span>
            <span>{completedCount}/{levels.length} solved</span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-black/40">
            <div className="h-full rounded-full bg-gradient-to-r from-[#d6a84f] to-[#f4d98b] shadow-[0_0_14px_rgba(214,168,79,0.35)]" style={{ width: `${(xpInto / 300) * 100}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] font-black uppercase tracking-wide text-[#a9a0b5]">
            <span>{progress.coins} coins</span>
            <span>{stars} stars</span>
            <span>Next: {nextLevelRewardLabel(playerLevel)}</span>
          </div>
        </div>

        <div className="relative mt-4 grid grid-cols-3 gap-2">
          <MenuTile active label="Play" sublabel="Story" onClick={() => undefined} />
          <MenuTile featured label="Home" sublabel="Decorate" onClick={onHome} />
          <MenuTile label="Shop" sublabel="Coins" onClick={onShop} />
          <MenuTile label="Customize" sublabel="Avatar" onClick={onCustomize} />
          <MenuTile label="Missions" sublabel="Daily" onClick={onMissions} />
          <MenuTile label="Achievements" sublabel="Shelf" onClick={onAchievements} />
          <MenuTile label="Settings" sublabel="Audio" onClick={onSettings} />
        </div>
      </div>

      <div className="safe-content relative pt-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-extrabold text-[#fff5d8]">Story Mode</h2>
            <p className="text-xs font-semibold text-[#a9a0b5]">Follow each tiny scene from cozy to clever.</p>
          </div>
          {showPremiumNudge && (
            <button onClick={onPremium} className="rounded-full bg-gradient-to-r from-[#d6a84f] to-[#a86a78] px-3 py-1.5 text-xs font-extrabold text-[#15101f] shadow-[0_8px_20px_rgba(214,168,79,0.2)]">Full Adventure</button>
          )}
        </div>
        <div className="space-y-5">
          {Object.entries(grouped).map(([chapter, chapterLevels]) => (
            <section key={chapter}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-display text-sm font-black uppercase tracking-[0.12em] text-[#d6a84f]">
                  {chapter}
                </h3>
                <span className="rounded-full border border-white/10 bg-white/8 px-2 py-1 text-[10px] font-extrabold text-[#d9cda9] shadow-inner">
                  {chapterLevels.filter((lv) => progress.completed.includes(lv.id)).length}/{chapterLevels.length}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {chapterLevels.map((lv) => {
                  const unlocked = isUnlocked(lv.id);
                  const done = progress.completed.includes(lv.id);
                  const meta = ENV_META[lv.env];
                  const stars = progress.stars[String(lv.id)] ?? 0;
                  return (
                    <button
                      key={lv.id}
                      aria-disabled={!unlocked}
                      onClick={() => {
                        if (unlocked) {
                          startLevel(lv.id);
                          return;
                        }
                        if (lv.id > freeLevels && !progress.premium) {
                          onPremium();
                          return;
                        }
                        startLevel(lv.id);
                      }}
                      className={`group relative min-h-[148px] overflow-hidden rounded-3xl border border-white/10 p-3 text-left shadow-[0_16px_34px_rgba(0,0,0,0.34)] ring-1 transition hover:shadow-[0_18px_38px_rgba(0,0,0,0.42)] active:scale-95 ${unlocked ? 'hover:-translate-y-0.5 ring-white/10' : 'ring-[#d6a84f]/20'}`}
                      style={{ background: `linear-gradient(160deg, ${meta.from}, ${meta.to})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-black/28" />
                      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-25 blur-2xl" style={{ background: meta.glow }} />
                      {!unlocked && <div className="absolute inset-0 bg-[#050816]/45 backdrop-blur-[1px]" />}
                      <div className="relative flex items-center justify-between">
                        <span className="rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-bold text-[#fff5d8]">Lv {lv.id}</span>
                        {done && (
                          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#d6a84f] text-[#15101f] shadow-[0_0_14px_rgba(214,168,79,0.35)]">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                          </span>
                        )}
                        {!unlocked && (
                          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#d6a84f]/18 text-[#f6d98d] ring-1 ring-[#d6a84f]/30">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                          </span>
                        )}
                      </div>
                      <p className="relative mt-5 font-display text-sm font-extrabold leading-tight text-[#fff5d8] drop-shadow">{lv.title}</p>
                      <p className="relative mt-1 text-[10px] font-bold uppercase tracking-wide text-[#d9cda9]">
                        {meta.label} / {lv.characters.length} guests
                      </p>
                      {!unlocked && (
                        <p className="relative mt-1 text-[10px] font-black uppercase tracking-wide text-[#f6d98d]">
                          {lv.id > freeLevels && !progress.premium
                            ? 'Premium locked'
                            : `Finish Level ${lv.id - 1}`}
                        </p>
                      )}
                      <div className="relative mt-1 flex items-center justify-between">
                        <span className="rounded-full border border-white/10 bg-white/12 px-2 py-0.5 text-[10px] font-extrabold text-[#f6d98d]">
                          {difficultyFor(lv.id)}
                        </span>
                        <StarMeter stars={stars} small />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
        {showPremiumNudge && (
          <div className="mt-5 rounded-3xl border border-[#d6a84f]/25 bg-[linear-gradient(145deg,#211930,#46244d_58%,#112640)] p-4 text-[#fff5d8] shadow-[0_18px_42px_rgba(0,0,0,0.35)]">
            <p className="font-display text-lg font-black">Loved the free stories?</p>
            <p className="mt-1 text-sm font-medium text-[#d9cda9]">
              Unlock the full adventure for more handcrafted chapters, unlimited hints, and exclusive guests.
            </p>
            <button
              onClick={onPremium}
              className="mt-3 rounded-full bg-[#d6a84f] px-4 py-2 text-sm font-extrabold text-[#15101f] shadow-[0_10px_24px_rgba(214,168,79,0.24)]"
            >
              Preview Full Adventure
            </button>
          </div>
        )}
        <p className="mt-6 text-center text-xs font-medium text-[#7f7890]">Tiny Worlds: Seat Savvy / a cozy puzzle for calm minds</p>
      </div>
    </div>
  );
};

const MenuTile: React.FC<{
  active?: boolean;
  featured?: boolean;
  label: string;
  onClick: () => void;
  sublabel: string;
}> = ({ active = false, featured = false, label, onClick, sublabel }) => (
  <button
    onClick={onClick}
    className={`rounded-2xl border px-2 py-3 text-left shadow-[0_10px_20px_rgba(0,0,0,0.26)] transition active:scale-95 ${
      featured
        ? 'border-[#d6a84f]/42 bg-[#d6a84f]/18 text-[#fff5d8]'
        : active
        ? 'border-[#d6a84f]/34 bg-white/12 text-[#fff5d8]'
        : 'border-white/10 bg-white/8 text-[#d9cda9] hover:bg-white/12'
    }`}
    type="button"
  >
    <span className="block font-display text-sm font-black leading-tight">{label}</span>
    <span className="block text-[10px] font-bold uppercase tracking-wide text-[#a9a0b5]">
      {sublabel}
    </span>
  </button>
);

export default LevelSelect;
