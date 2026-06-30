import React, { useEffect, useRef, useState } from 'react';
import { useGame } from './GameProvider';
import WorldStage from './WorldStage';
import CharacterTray from './CharacterTray';
import TopBar from './TopBar';
import { StoryModal, TutorialModal, WinModal } from './Modals';
import { SettingsModal, PremiumModal } from './Panels';
import { GAME_THEME_BACKGROUNDS } from './customization';
import { AccountModal } from './AccountModal';

type CelebrationKind = 'ticker' | 'sparkle' | 'ribbon' | 'bubbles' | 'stars';

const CELEBRATIONS: CelebrationKind[] = [
  'ticker',
  'sparkle',
  'ribbon',
  'bubbles',
  'stars',
];

const PlayScreen: React.FC = () => {
  const {
    level,
    openCustomize,
    progress,
    solved,
    startLevel,
    openMenu,
    completeLevel,
    applyHint,
    resetLevel,
    levels,
    levelStats,
    currentStars,
    lastRewards,
    feedback,
    dismissFeedback,
    markTutorialSeen,
  } = useGame();

  const [showStory, setShowStory] = useState(true);
  const [showWin, setShowWin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [celebration, setCelebration] = useState<CelebrationKind | null>(null);
  const winHandled = useRef(false);
  const completeLevelRef = useRef(completeLevel);
  const winTimer = useRef<number | null>(null);

  useEffect(() => {
    completeLevelRef.current = completeLevel;
  }, [completeLevel]);

  useEffect(() => () => {
    if (winTimer.current !== null) {
      window.clearTimeout(winTimer.current);
    }
  }, []);

  // reset modal state when a new level loads
  useEffect(() => {
    if (winTimer.current !== null) {
      window.clearTimeout(winTimer.current);
      winTimer.current = null;
    }
    setShowStory(true);
    setShowWin(false);
    setCelebration(null);
    winHandled.current = false;
  }, [level?.id]);

  useEffect(() => {
    if (solved && !winHandled.current) {
      winHandled.current = true;
      const celebrationIndex =
        ((level?.id ?? 0) + levelStats.moves + Date.now()) % CELEBRATIONS.length;
      setCelebration(CELEBRATIONS[celebrationIndex]);
      completeLevelRef.current();
      if (winTimer.current !== null) {
        window.clearTimeout(winTimer.current);
      }
      winTimer.current = window.setTimeout(() => {
        setCelebration(null);
        setShowWin(true);
        winTimer.current = null;
      }, 1550);
    }
  }, [solved, level?.id, levelStats.moves]);

  if (!level) return null;

  const nextLevel = levels.find((l) => l.id === level.id + 1);
  const hasNext = !!nextLevel;
  const achievements = [
    progress.completed.length <= 1 ? 'First Puzzle Solved' : '',
    levelStats.hintsUsed === 0 ? 'No Hints Used' : '',
    currentStars === 3 ? 'Perfect Placement' : '',
    progress.completed.length >= 5 ? 'Cozy Beginner' : '',
  ].filter(Boolean);
  const themeBackground =
    GAME_THEME_BACKGROUNDS[progress.customization.gameTheme] ??
    GAME_THEME_BACKGROUNDS['midnight-gold'];

  return (
    <div
      className="safe-screen relative flex h-full w-full flex-col"
      style={{ background: themeBackground }}
    >
      <div className="relative flex-1 overflow-hidden">
        <WorldStage />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.34),transparent_34%,rgba(5,8,22,0.38)),radial-gradient(circle_at_center,transparent_42%,rgba(3,7,18,0.42)_100%)]" />
        <TopBar
          onHint={() => {
            const ok = applyHint();
            if (!ok) setShowPremium(true);
          }}
          onReset={resetLevel}
          onSettings={() => setShowSettings(true)}
        />
        {celebration && !showWin && (
          <CompletionCelebration kind={celebration} />
        )}
        {feedback && (
          <button
            type="button"
            onClick={dismissFeedback}
            className={`safe-hud-top absolute left-4 right-4 z-40 rounded-3xl px-4 py-3 text-left text-sm font-extrabold shadow-xl ring-1 backdrop-blur transition active:scale-[0.99] ${
              feedback.kind === 'bad'
                ? 'ts-soft-shake bg-[#a86a78]/94 text-[#fff5d8] ring-[#f3a8b6]/30'
                : feedback.kind === 'good'
                ? 'bg-[#2f6f53]/94 text-[#fff5d8] ring-[#b7d6c8]/30 shadow-[0_0_24px_rgba(183,214,200,0.16)]'
                : feedback.kind === 'hint'
                ? 'bg-[#d6a84f]/94 text-[#15101f] ring-[#f6d98d]/40'
                : 'bg-[#0b1024]/92 text-[#f8edd2] ring-white/10'
            }`}
          >
            {feedback.text}
          </button>
        )}
      </div>
      <CharacterTray />

      {showStory && (
        <StoryModal level={level} onStart={() => setShowStory(false)} />
      )}
      {showWin && (
        <WinModal
          level={level}
          hasNext={hasNext}
          stars={currentStars}
          stats={levelStats}
          rewards={lastRewards}
          achievements={lastRewards?.achievements ?? achievements}
          onNext={() => nextLevel && startLevel(nextLevel.id)}
          onMenu={openMenu}
        />
      )}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onAccount={() => {
            setShowSettings(false);
            setShowAccount(true);
          }}
          onPremium={() => {
            setShowSettings(false);
            setShowPremium(true);
          }}
          onTutorial={() => {
            setShowSettings(false);
            setShowTutorial(true);
          }}
          onCustomize={() => {
            setShowSettings(false);
            openCustomize();
          }}
        />
      )}
      {showAccount && <AccountModal onClose={() => setShowAccount(false)} />}
      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
      {showTutorial && (
        <TutorialModal
          onClose={(dontShowAgain) => {
            markTutorialSeen(dontShowAgain);
            setShowTutorial(false);
          }}
        />
      )}
    </div>
  );
};

const CompletionCelebration: React.FC<{ kind: CelebrationKind }> = ({ kind }) => {
  const colors = ['#f6d98d', '#d6a84f', '#a86a78', '#9fb6d9', '#fff5d8'];
  const pieceClass =
    kind === 'bubbles'
      ? 'ts-celebration-bubble'
      : kind === 'stars'
      ? 'ts-celebration-starbit'
      : kind === 'ribbon'
      ? 'ts-celebration-ribbon'
      : kind === 'sparkle'
      ? 'ts-celebration-sparkle'
      : 'ts-celebration-tape';
  const message =
    kind === 'ticker'
      ? 'Ticker tape parade!'
      : kind === 'sparkle'
      ? 'Tiny sparkles!'
      : kind === 'ribbon'
      ? 'Ribbon celebration!'
      : kind === 'bubbles'
      ? 'Happy bubbles!'
      : 'Golden star shower!';

  return (
    <div className="pointer-events-none absolute inset-0 z-50 grid place-items-center overflow-hidden bg-[#030712]/20 backdrop-blur-[1px]">
      <div className="absolute inset-0 ts-confetti" />
      {Array.from({ length: 34 }).map((_, index) => {
        const left = `${4 + ((index * 17) % 92)}%`;
        const top = kind === 'bubbles' ? '100%' : `${-12 - (index % 9) * 5}%`;
        const size = 7 + (index % 5) * 3;
        const delay = `${(index % 10) * 0.08}s`;
        const duration = `${1.1 + (index % 6) * 0.18}s`;
        return (
          <span
            key={`${kind}-${index}`}
            className={`absolute ${pieceClass}`}
            style={{
              left,
              top,
              width: size,
              height: kind === 'ribbon' || kind === 'ticker' ? size * 2.4 : size,
              backgroundColor: colors[index % colors.length],
              animationDelay: delay,
              animationDuration: duration,
            }}
          />
        );
      })}
      <div className="ts-celebration-card rounded-[30px] border border-[#f6d98d]/38 bg-[linear-gradient(145deg,rgba(8,17,36,0.92),rgba(39,24,50,0.92))] px-7 py-5 text-center text-[#fff5d8] shadow-[0_28px_70px_rgba(0,0,0,0.55),0_0_36px_rgba(214,168,79,0.22)] ring-1 ring-white/10">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d6a84f]">
          Everyone’s seated
        </p>
        <p className="mt-2 font-display text-2xl font-black">{message}</p>
      </div>
    </div>
  );
};

export default PlayScreen;
