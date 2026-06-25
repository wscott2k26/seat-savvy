import React, { useEffect, useRef, useState } from 'react';
import { useGame } from './GameProvider';
import WorldStage from './WorldStage';
import CharacterTray from './CharacterTray';
import TopBar from './TopBar';
import { StoryModal, WinModal } from './Modals';
import { SettingsModal, PremiumModal } from './Panels';

const PlayScreen: React.FC = () => {
  const {
    level,
    solved,
    startLevel,
    openMenu,
    completeLevel,
    useHint,
    resetLevel,
    levels,
    isUnlocked,
  } = useGame();

  const [showStory, setShowStory] = useState(true);
  const [showWin, setShowWin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const winHandled = useRef(false);

  // reset modal state when a new level loads
  useEffect(() => {
    setShowStory(true);
    setShowWin(false);
    winHandled.current = false;
  }, [level?.id]);

  useEffect(() => {
    if (solved && !winHandled.current) {
      winHandled.current = true;
      completeLevel();
      const t = setTimeout(() => setShowWin(true), 650);
      return () => clearTimeout(t);
    }
  }, [solved, completeLevel]);

  if (!level) return null;

  const nextLevel = levels.find((l) => l.id === level.id + 1);
  const hasNext = !!nextLevel && isUnlocked(nextLevel.id);

  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="relative flex-1 overflow-hidden">
        <WorldStage />
        <TopBar
          onHint={() => {
            const ok = useHint();
            if (!ok) setShowPremium(true);
          }}
          onReset={resetLevel}
          onSettings={() => setShowSettings(true)}
        />
        {solved && !showWin && (
          <div className="pointer-events-none absolute inset-0 z-30 ts-confetti" />
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
          onNext={() => nextLevel && startLevel(nextLevel.id)}
          onMenu={openMenu}
        />
      )}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onPremium={() => {
            setShowSettings(false);
            setShowPremium(true);
          }}
        />
      )}
      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
    </div>
  );
};

export default PlayScreen;
