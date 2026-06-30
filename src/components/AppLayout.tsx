import React, { useEffect, useState } from 'react';
import { GameProvider, useGame } from '@/game/GameProvider';
import { DragLayer } from '@/game/DragLayer';
import LevelSelect from '@/game/LevelSelect';
import PlayScreen from '@/game/PlayScreen';
import CustomizeScreen from '@/game/CustomizeScreen';
import HomeScreen from '@/game/HomeScreen';
import {
  AchievementsScreen,
  DailyRewardModal,
  LifeNoticeModal,
  MissionsScreen,
  ShopScreen,
} from '@/game/LifeScreens';
import { PremiumModal, SettingsModal } from '@/game/Panels';
import { TutorialModal } from '@/game/Modals';
import { todayKey } from '@/game/lifeData';
import { AccountModal } from '@/game/AccountModal';

const GameShell: React.FC = () => {
  const {
    markTutorialSeen,
    openAchievements,
    openCustomize,
    openHome,
    openMissions,
    openShop,
    progress,
    screen,
  } = useGame();
  const [menuPremium, setMenuPremium] = useState(false);
  const [menuSettings, setMenuSettings] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [dailyDismissed, setDailyDismissed] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  useEffect(() => {
    if (!progress.tutorialSeen && progress.settings.showTutorialOnLaunch) {
      setShowTutorial(true);
    }
  }, [progress.settings.showTutorialOnLaunch, progress.tutorialSeen]);

  useEffect(() => {
    if (!progress.account.onboardingSeen) {
      setShowAccount(true);
    }
  }, [progress.account.onboardingSeen]);

  return (
    <DragLayer>
      <div className="relative h-full w-full select-none">
        {screen === 'menu' ? (
          <LevelSelect
            onAccount={() => setShowAccount(true)}
            onAchievements={openAchievements}
            onCustomize={openCustomize}
            onHome={openHome}
            onMissions={openMissions}
            onPremium={() => setMenuPremium(true)}
            onSettings={() => setMenuSettings(true)}
            onShop={openShop}
          />
        ) : screen === 'customize' ? (
          <CustomizeScreen onPremium={() => setMenuPremium(true)} />
        ) : screen === 'home' ? (
          <HomeScreen />
        ) : screen === 'shop' ? (
          <ShopScreen />
        ) : screen === 'missions' ? (
          <MissionsScreen />
        ) : screen === 'achievements' ? (
          <AchievementsScreen />
        ) : (
          <PlayScreen />
        )}
        {menuPremium && <PremiumModal onClose={() => setMenuPremium(false)} />}
        {menuSettings && (
          <SettingsModal
            onClose={() => setMenuSettings(false)}
            onPremium={() => {
              setMenuSettings(false);
              setMenuPremium(true);
            }}
            onTutorial={() => {
              setMenuSettings(false);
              setShowTutorial(true);
            }}
            onAccount={() => {
              setMenuSettings(false);
              setShowAccount(true);
            }}
            onCustomize={() => {
              setMenuSettings(false);
              openCustomize();
            }}
          />
        )}
        {showTutorial && (
          <TutorialModal
            onClose={(dontShowAgain) => {
              markTutorialSeen(dontShowAgain);
              setShowTutorial(false);
            }}
          />
        )}
        {showAccount && <AccountModal onClose={() => setShowAccount(false)} />}
        {!dailyDismissed &&
          !showAccount &&
          screen === 'menu' &&
          progress.life.daily.claimedDailyDate !== todayKey() && (
            <DailyRewardModal onClose={() => setDailyDismissed(true)} />
          )}
        <LifeNoticeModal />
      </div>
    </DragLayer>
  );
};

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[linear-gradient(135deg,#050816_0%,#151126_34%,#2a1738_65%,#0b2138_100%)]">
      {/* ambient desktop frame */}
      <div className="mx-auto flex min-h-screen max-w-md flex-col overflow-hidden bg-[#070b1a] shadow-[0_28px_90px_rgba(0,0,0,0.62),0_0_42px_rgba(214,168,79,0.12)] ring-1 ring-[#d6a84f]/24 md:my-4 md:min-h-[calc(100vh-2rem)] md:rounded-[36px]">
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
