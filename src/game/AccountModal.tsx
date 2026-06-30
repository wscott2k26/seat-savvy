import React, { useState } from 'react';
import { Backdrop } from './Modals';
import { useGame, type AccountProvider } from './GameProvider';

type ConnectedProvider = Exclude<AccountProvider, 'guest'>;

export const AccountModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    connectAccount,
    playAsGuest,
    progress,
    signOutAccount,
  } = useGame();
  const [displayName, setDisplayName] = useState(
    progress.account.displayName === 'Guest Player' ? '' : progress.account.displayName,
  );
  const [email, setEmail] = useState(progress.account.email ?? '');
  const [shareWithFriends, setShareWithFriends] = useState(
    progress.account.shareWithFriends,
  );
  const [error, setError] = useState('');

  const connect = (provider: ConnectedProvider) => {
    if ((provider === 'email' || provider === 'gmail') && !email.trim()) {
      setError('Add an email address first.');
      return;
    }
    connectAccount(provider, {
      displayName,
      email,
      shareWithFriends,
    });
    onClose();
  };

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

  const providerLabel =
    progress.account.provider === 'guest'
      ? 'Guest'
      : progress.account.provider === 'gmail'
      ? 'Gmail'
      : progress.account.provider === 'facebook'
      ? 'Facebook'
      : 'Email';

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
            Choose guest play or connect a profile. Your current progress stays intact.
          </p>
        </div>
        <button
          onClick={dismiss}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/10 text-xl font-black text-[#eadfcb] shadow transition hover:bg-white/15 active:scale-95"
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

        <label className="block rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-left shadow-inner">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#d6a84f]">
            Email
          </span>
          <input
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError('');
            }}
            placeholder="you@example.com"
            type="email"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/24 px-3 py-2 text-sm font-bold text-[#fff5d8] outline-none placeholder:text-[#7f7890] focus:border-[#d6a84f]/45"
          />
        </label>

        <button
          onClick={() => setShareWithFriends((value) => !value)}
          className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-left shadow-inner transition active:scale-[0.99]"
          type="button"
        >
          <span>
            <span className="block text-sm font-black text-[#fff5d8]">
              Facebook friend sharing
            </span>
            <span className="block text-xs font-semibold text-[#a9a0b5]">
              Stores your sharing preference for future social features.
            </span>
          </span>
          <span
            className={`relative h-6 w-11 rounded-full transition ${
              shareWithFriends ? 'bg-[#d6a84f]' : 'bg-[#4b455f]'
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-[#fff5d8] transition ${
                shareWithFriends ? 'left-6' : 'left-1'
              }`}
            />
          </span>
        </button>

        {error && (
          <p className="rounded-2xl border border-[#a86a78]/35 bg-[#a86a78]/12 px-3 py-2 text-sm font-bold text-[#f3a8b6]">
            {error}
          </p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <button
          onClick={guest}
          className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-left font-extrabold text-[#f8edd2] shadow transition hover:bg-white/15 active:scale-95"
          type="button"
        >
          Play as Guest
          <span className="block text-xs font-medium text-[#a9a0b5]">
            Progress saves on this browser.
          </span>
        </button>
        <button
          onClick={() => connect('email')}
          className="rounded-2xl bg-gradient-to-r from-[#d6a84f] to-[#f0c76a] px-4 py-3 text-left font-extrabold text-[#15101f] shadow-[0_12px_24px_rgba(214,168,79,0.24)] transition active:scale-95"
          type="button"
        >
          Connect Email
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => connect('gmail')}
            className="rounded-2xl border border-[#d6a84f]/28 bg-[#d6a84f]/12 px-4 py-3 text-sm font-extrabold text-[#f6d98d] shadow transition hover:bg-[#d6a84f]/18 active:scale-95"
            type="button"
          >
            Connect Gmail
          </button>
          <button
            onClick={() => connect('facebook')}
            className="rounded-2xl border border-[#9fb6d9]/28 bg-[#274c86]/26 px-4 py-3 text-sm font-extrabold text-[#dbeafe] shadow transition hover:bg-[#274c86]/36 active:scale-95"
            type="button"
          >
            Connect Facebook
          </button>
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
        This build saves locally. Real cloud sync can plug into this profile screen later.
      </p>
    </Backdrop>
  );
};
