import React, { useState } from 'react';
import { GameProvider, useGame } from '@/game/GameProvider';
import { DragLayer } from '@/game/DragLayer';
import LevelSelect from '@/game/LevelSelect';
import PlayScreen from '@/game/PlayScreen';
import { PremiumModal } from '@/game/Panels';

const GameShell: React.FC = () => {
  const { screen } = useGame();
  const [menuPremium, setMenuPremium] = useState(false);
  return (
    <DragLayer>
      <div className="relative h-full w-full select-none">
        {screen === 'menu' ? (
          <LevelSelect onPremium={() => setMenuPremium(true)} />
        ) : (
          <PlayScreen />
        )}
        {menuPremium && <PremiumModal onClose={() => setMenuPremium(false)} />}
      </div>
    </DragLayer>
  );
};

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#2b2440] via-[#3a2e52] to-[#1f1b33]">
      {/* ambient desktop frame */}
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fff6e9] shadow-2xl md:my-4 md:min-h-[calc(100vh-2rem)] md:rounded-[36px] md:ring-1 md:ring-white/10 overflow-hidden">
        <div className="relative flex h-[100dvh] w-full flex-col md:h-[calc(100vh-2rem)]">
          <GameProvider>
            <GameShell />
          </GameProvider>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
