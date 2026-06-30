import React, { useState } from 'react';
import { Backdrop } from './Modals';
import { useGame } from './GameProvider';

export const AccountModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    playAsGuest,
    progress,
    signOutAccount,
  } = useGame();
  const [displayName, setDisplayName] = useState(
    progress.account.displayName === 'Guest Player' ? '' : progress.account.displayName,
  );

  const guest = () => {
    playAsGuest(displayName);
    onClose();
  };

  const dismiss = () => {
    if (!progress.account.onboardingSeen) {
      playAsGuest(displayName);
    }
    onClose();
  };

  const providerLabel = 'Guest';

  return (
    <Backdrop>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d6a84f]">
            Save Profile
          </p>
          <h2 className="font-display text-2xl font-extrabold text-[#fff5d8]">
            Keep your progress
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#d9cda9]">
            Continue as a guest for this build. Your current progress stays intact on this device.
          </p>
        </div>
        <button
          onClick={dismiss}
          className="safe-hit grid shrink-0 place-items-center rounded-full border border-white/10 bg-white/10 text-xl font-black text-[#eadfcb] shadow transition hover:bg-white/15 active:scale-95"
          type="button"
        >
          ×
        </button>
      </div>

      <div className="mt-4 rounded-3xl border border-[#d6a84f]/24 bg-[#071022]/72 p-4 shadow-inner">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d6a84f]">
              Current save
            </p>
            <p className="mt-1 font-display text-lg font-black text-[#fff5d8]">
              {progress.account.displayName}
            </p>
            <p className="text-xs font-semibold text-[#a9a0b5]">
              {providerLabel} / {progress.completed.length} levels / {progress.coins} coins
            </p>
          </div>
          <span className="rounded-full bg-[#d6a84f]/16 px-3 py-1 text-xs font-black text-[#f6d98d] ring-1 ring-[#d6a84f]/24">
            Saved locally
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <label className="block rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-left shadow-inner">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#d6a84f]">
            Player name
          </span>
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Guest Player"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/24 px-3 py-2 text-sm font-bold text-[#fff5d8] outline-none placeholder:text-[#7f7890] focus:border-[#d6a84f]/45"
          />
        </label>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <button
          onClick={guest}
          className="rounded-2xl bg-gradient-to-r from-[#d6a84f] to-[#f0c76a] px-4 py-3 text-left font-extrabold text-[#15101f] shadow-[0_12px_24px_rgba(214,168,79,0.24)] transition active:scale-95"
          type="button"
        >
          Continue as Guest
          <span className="block text-xs font-semibold text-[#4a3412]">
            Progress saves locally on this device.
          </span>
        </button>
        <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-left shadow-inner">
          <p className="text-sm font-black text-[#fff5d8]">Cloud sign-in coming soon</p>
          <p className="mt-1 text-xs font-semibold text-[#a9a0b5]">
            This build only supports local guest saves.
          </p>
        </div>
        {progress.account.provider !== 'guest' && (
          <button
            onClick={() => {
              signOutAccount();
              onClose();
            }}
            className="rounded-2xl border border-[#a86a78]/35 bg-[#a86a78]/12 px-4 py-3 text-left text-sm font-extrabold text-[#f3a8b6] shadow transition active:scale-95"
            type="button"
          >
            Disconnect and play as guest
          </button>
        )}
      </div>

      <p className="mt-3 text-center text-[11px] font-semibold leading-relaxed text-[#7f7890]">
        This App Store build uses local guest saves only.
      </p>
    </Backdrop>
  );
};
