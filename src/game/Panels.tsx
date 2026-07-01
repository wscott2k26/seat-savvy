import React, { useEffect, useState } from 'react';
import { Backdrop } from './Modals';
import { useGame } from './GameProvider';
import {
  getPremiumProductInfo,
  isNativePurchasePlatform,
  type PremiumPurchaseInfo,
  type PremiumPurchaseResult,
} from './premiumPurchase';

export const SettingsModal: React.FC<{
  onClose: () => void;
  onAccount: () => void;
  onCustomize: () => void;
  onPremium: () => void;
  onTutorial: () => void;
}> = ({
  onClose,
  onAccount,
  onCustomize,
  onPremium,
  onTutorial,
}) => {
  const {
    progress,
    resetProgress,
    setProgress,
    updateSettings,
    playSound,
    testSound,
  } = useGame();
  const Row: React.FC<{ label: string; on: boolean; toggle: () => void; note?: string }> = ({
    label,
    on,
    toggle,
    note,
  }) => (
    <button
      onClick={() => {
        playSound('button');
        toggle();
      }}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-left font-bold text-[#f4e6c8] shadow-[0_10px_22px_rgba(0,0,0,0.22)] transition hover:bg-white/12 active:scale-[0.99]"
    >
      <span>
        {label}
        {note && <span className="block text-xs font-medium text-[#a9a0b5]">{note}</span>}
      </span>
      <span
        className={`relative h-6 w-11 rounded-full transition ${
          on ? 'bg-[#d6a84f] shadow-[0_0_14px_rgba(214,168,79,0.35)]' : 'bg-[#4b455f]'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-[#fff5d8] shadow transition-all ${
            on ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  );
  const Slider: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
  }> = ({ label, value, onChange }) => (
    <label className="block rounded-2xl border border-white/10 bg-[#0d1930]/62 px-4 py-3 shadow-inner">
      <span className="flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.14em] text-[#d6a84f]">
        {label}
        <span className="text-[#f4e6c8]">{Math.round(value * 100)}%</span>
      </span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[#d6a84f]"
      />
    </label>
  );
  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <section className="space-y-3 rounded-3xl border border-white/10 bg-[#071022]/56 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_32px_rgba(0,0,0,0.18)]">
      <h3 className="px-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#d6a84f]">
        {title}
      </h3>
      {children}
    </section>
  );
  return (
    <Backdrop>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d6a84f]">
            Cozy controls
          </p>
          <h2 className="font-display text-2xl font-extrabold text-[#fff5d8]">
            Settings
          </h2>
        </div>
        <button
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 text-xl font-black text-[#eadfcb] shadow ring-1 ring-black/5 transition hover:bg-white/15 active:scale-95"
        >
          ×
        </button>
      </div>
      <div className="mt-4 max-h-[62dvh] space-y-3 overflow-y-auto pr-1">
        <Section title="Account & Save">
          <button
            onClick={() => {
              playSound('button');
              onAccount();
            }}
            className="w-full rounded-2xl border border-[#d6a84f]/24 bg-[#d6a84f]/12 px-4 py-3 text-left font-extrabold text-[#f6d98d] shadow-[0_10px_22px_rgba(0,0,0,0.22)] transition hover:bg-[#d6a84f]/18 active:scale-[0.99]"
            type="button"
          >
            Playing as Guest
            <span className="block text-xs font-medium text-[#d9cda9]">
              {progress.account.displayName} / progress saves on this device
            </span>
          </button>
        </Section>

        <Section title="Audio">
          <Row
            label="Mute All"
            note="Silences ambience and effects"
            on={progress.settings.muteAll}
            toggle={() => updateSettings({ muteAll: !progress.settings.muteAll })}
          />
          <Row
            label="Ambient Sounds"
            note="Location ambience from public/audio/ambient"
            on={progress.settings.ambientOn}
            toggle={() => updateSettings({ ambientOn: !progress.settings.ambientOn })}
          />
          <Row
            label="Sound Effects"
            note="Uses local files in public/audio/sfx"
            on={progress.settings.sfxOn}
            toggle={() => updateSettings({ sfxOn: !progress.settings.sfxOn })}
          />
          <Slider
            label="Ambient volume"
            value={progress.settings.ambientVolume}
            onChange={(ambientVolume) => updateSettings({ ambientVolume })}
          />
          <Slider
            label="SFX volume"
            value={progress.settings.sfxVolume}
            onChange={(sfxVolume) => updateSettings({ sfxVolume })}
          />
          <button
            onClick={() => {
              playSound('button');
              testSound();
            }}
            className="w-full rounded-2xl border border-[#d6a84f]/28 bg-[#d6a84f]/12 px-4 py-3 text-left font-extrabold text-[#f6d98d] shadow-[0_10px_22px_rgba(0,0,0,0.22)] transition hover:bg-[#d6a84f]/18 active:scale-[0.99]"
            type="button"
          >
            Test Sound
            <span className="block text-xs font-medium text-[#d9cda9]">
              Plays local SFX if present, otherwise a brief ambient sample
            </span>
          </button>
        </Section>

        <Section title="Visuals">
          <Row
            label="Real Backgrounds"
            note="Looks for local images in public/images/environments"
            on={progress.settings.environmentArt === 'real'}
            toggle={() =>
              updateSettings({
                environmentArt:
                  progress.settings.environmentArt === 'real' ? 'storybook' : 'real',
              })
            }
          />
          <Row
            label="Reduced Motion"
            on={progress.settings.reducedMotion}
            toggle={() =>
              updateSettings({ reducedMotion: !progress.settings.reducedMotion })
            }
          />
        </Section>

        <Section title="Touch">
          <Row
            label="Haptic Feedback"
            note="Gameplay feedback cues"
            on={progress.settings.hapticsOn}
            toggle={() => updateSettings({ hapticsOn: !progress.settings.hapticsOn })}
          />
          <Row
            label="Vibration"
            note="No effect on unsupported devices"
            on={progress.settings.vibrationOn}
            toggle={() => updateSettings({ vibrationOn: !progress.settings.vibrationOn })}
          />
        </Section>

        <Section title="Game">
          <button
            onClick={() => {
              playSound('button');
              onCustomize();
            }}
            className="w-full rounded-2xl border border-[#d6a84f]/24 bg-[#d6a84f]/12 px-4 py-3 text-left font-extrabold text-[#f6d98d] shadow-[0_10px_22px_rgba(0,0,0,0.22)] transition hover:bg-[#d6a84f]/18 active:scale-[0.99]"
          >
            Customize
            <span className="block text-xs font-medium text-[#d9cda9]">
              Themes, palettes, avatars, and unlockable cosmetics
            </span>
          </button>
          <Row
            label="Show Tutorial Again"
            on={progress.settings.showTutorialOnLaunch && !progress.tutorialSeen}
            toggle={() => {
              setProgress((p) => ({
                ...p,
                tutorialSeen: false,
                settings: {
                  ...p.settings,
                  showTutorialOnLaunch: true,
                },
              }));
              onTutorial();
            }}
          />
        </Section>
        {!progress.premium && (
          <button
            onClick={() => {
              playSound('button');
              onPremium();
            }}
            className="w-full rounded-2xl bg-gradient-to-r from-[#5e3b83] via-[#7b4f92] to-[#d6a84f] px-4 py-3 text-left font-extrabold text-[#fff5d8] shadow-[0_14px_30px_rgba(0,0,0,0.28)]"
          >
            Loved the free stories?
            <span className="block text-xs font-medium text-[#f5db9c]">
              Unlock the full adventure when you are ready
            </span>
          </button>
        )}
        <button
          onClick={() => {
            if (window.confirm('Reset all progress and settings?')) {
              resetProgress();
              onClose();
            }
          }}
          className="w-full rounded-2xl border border-[#a86a78]/35 bg-[#a86a78]/12 px-4 py-3 text-left font-extrabold text-[#f3a8b6] shadow ring-1 ring-black/5"
        >
          Reset Progress
          <span className="block text-xs font-medium text-[#caa6ad]">
            Clears coins, stars, completed levels, and settings
          </span>
        </button>
      </div>
      <button
        onClick={onClose}
        className="mt-5 w-full rounded-2xl border border-white/10 bg-white/10 py-3 font-extrabold text-[#f8edd2] shadow ring-1 ring-black/5 transition hover:bg-white/15 active:scale-95"
      >
        Close
      </button>
    </Backdrop>
  );
};

export const PremiumModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { progress, purchasePremium, restorePremium, playSound } = useGame();
  const [productInfo, setProductInfo] = useState<PremiumPurchaseInfo | null>(null);
  const [premiumBusy, setPremiumBusy] = useState<'purchase' | 'restore' | null>(null);
  const [premiumMessage, setPremiumMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    void getPremiumProductInfo().then((info) => {
      if (mounted) setProductInfo(info);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const premiumPerks = [
    'More handcrafted story chapters',
    'Unlimited hints, forever',
    'Layered expert puzzles',
    'Exclusive characters & worlds',
    'Premium homes, pets, and cosmetics',
  ];

  const handlePremiumResult = (result: PremiumPurchaseResult) => {
    setPremiumMessage(result.message);
    if (
      result.status === 'purchased' ||
      result.status === 'restored' ||
      result.status === 'already-owned'
    ) {
      window.setTimeout(onClose, 900);
    }
  };

  const buyPremium = async () => {
    setPremiumBusy('purchase');
    setPremiumMessage('');
    try {
      handlePremiumResult(await purchasePremium());
    } finally {
      setPremiumBusy(null);
    }
  };

  const restorePurchase = async () => {
    setPremiumBusy('restore');
    setPremiumMessage('');
    try {
      handlePremiumResult(await restorePremium());
    } finally {
      setPremiumBusy(null);
    }
  };

  const unlocked = progress.premium;
  const priceLabel = unlocked
    ? 'Active'
    : productInfo?.priceLabel ?? 'App Store purchase';
  const primaryLabel = unlocked
    ? 'Continue'
    : premiumBusy === 'purchase'
      ? 'Opening Store...'
      : productInfo?.nativeAvailable
        ? `Purchase Full Adventure${productInfo?.priceLabel ? ` - ${productInfo.priceLabel}` : ''}`
        : 'Unlock Full Adventure';

  return (
    <Backdrop>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d6a84f]">
        Tiny Worlds Premium
      </p>
      <h2 className="font-display text-2xl font-extrabold text-[#fff5d8]">
        Full Adventure
      </h2>
      <p className="mt-2 text-sm font-semibold text-[#d9cda9]">
        Unlock more cozy worlds, harder puzzles, and premium customization.
      </p>
      <ul className="mt-4 space-y-2">
        {premiumPerks.map((perk) => (
          <li key={perk} className="flex items-center gap-2 text-[15px] font-medium text-[#eadfcb]">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#d6a84f] text-[#15101f] shadow-[0_0_12px_rgba(214,168,79,0.28)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </span>
            {perk}
          </li>
        ))}
      </ul>
      <div className="mt-5 rounded-2xl border border-[#d6a84f]/30 bg-[#d6a84f]/12 px-4 py-3 text-left shadow-[0_14px_34px_rgba(214,168,79,0.14)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[#f6d98d]">
              {unlocked ? 'Full Adventure active' : productInfo?.title ?? 'Full Adventure'}
            </p>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-[#d9cda9]">
              {unlocked
                ? 'Every premium chapter, unlimited hint, premium home, and exclusive reward is unlocked.'
                : productInfo?.description ??
                  'Unlock every premium chapter, unlimited hints, and exclusive rewards.'}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-[#d6a84f] px-3 py-1 text-xs font-black text-[#15101f]">
            {priceLabel}
          </span>
        </div>
      </div>

      {premiumMessage && (
        <p className="mt-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-bold text-[#d9cda9]">
          {premiumMessage}
        </p>
      )}

      <button
        onClick={() => {
          if (unlocked) {
            playSound('button');
            onClose();
          } else {
            void buyPremium();
          }
        }}
        disabled={premiumBusy !== null}
        className="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#d6a84f] to-[#f0c76a] py-3 text-sm font-black text-[#15101f] shadow-[0_14px_30px_rgba(214,168,79,0.24)] transition active:scale-95 disabled:opacity-70"
        type="button"
      >
        {primaryLabel}
      </button>

      {isNativePurchasePlatform() && !unlocked && (
        <button
          onClick={() => void restorePurchase()}
          disabled={premiumBusy !== null}
          className="mt-2 w-full rounded-2xl border border-[#d6a84f]/24 bg-[#d6a84f]/10 py-2.5 font-bold text-[#f6d98d] shadow ring-1 ring-black/5 transition hover:bg-[#d6a84f]/14 active:scale-95 disabled:opacity-70"
          type="button"
        >
          {premiumBusy === 'restore' ? 'Checking Purchases...' : 'Restore Purchase'}
        </button>
      )}

      <button
        onClick={onClose}
        className="mt-3 w-full rounded-2xl border border-white/10 bg-white/10 py-2.5 font-bold text-[#d9cda9] shadow ring-1 ring-black/5 transition hover:bg-white/15 active:scale-95"
        type="button"
      >
        Maybe later
      </button>
    </Backdrop>
  );

};
