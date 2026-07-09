import React, { useEffect, useMemo, useState } from 'react';
import { Backdrop } from './Modals';
import { useGame } from './GameProvider';
import {
  cloudAuthSetupLabel,
  createEmailPasswordAccount,
  getCurrentCloudAccount,
  isCloudAuthConfigured,
  signInWithEmailPassword,
  signOutCloud,
  startSocialSignIn,
  subscribeToCloudAccount,
  type CloudAccountProfile,
  type CloudSocialProvider,
} from './cloudAuth';

export const AccountModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    playAsGuest,
    progress,
    setProgress,
    signOutAccount,
  } = useGame();
  const [displayName, setDisplayName] = useState(
    progress.account.displayName === 'Guest Player' ? '' : progress.account.displayName,
  );
  const [email, setEmail] = useState(progress.account.email ?? '');
  const [password, setPassword] = useState('');
  const [createMode, setCreateMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const cloudReady = isCloudAuthConfigured();

  const providerLabel = useMemo(() => {
    switch (progress.account.provider) {
      case 'gmail':
        return 'Google';
      case 'facebook':
        return 'Facebook';
      case 'email':
        return 'Email / Apple';
      default:
        return 'Guest';
    }
  }, [progress.account.provider]);

  useEffect(() => {
    let cancelled = false;
    const connectIfSessionExists = async () => {
      try {
        const profile = await getCurrentCloudAccount();
        if (!cancelled && profile) connectCloudProfile(profile, false);
      } catch {
        // Keep the modal usable even when the cloud session cannot be checked yet.
      }
    };
    void connectIfSessionExists();
    const unsubscribe = subscribeToCloudAccount((profile) => {
      if (profile) connectCloudProfile(profile, true);
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const connectCloudProfile = (profile: CloudAccountProfile, showMessage = true) => {
    setProgress((p) => ({
      ...p,
      account: {
        provider: profile.provider,
        displayName: profile.displayName,
        email: profile.email,
        connectedAt: profile.connectedAt,
        onboardingSeen: true,
        shareWithFriends: p.account.shareWithFriends,
      },
    }));
    setDisplayName(profile.displayName);
    setEmail(profile.email ?? '');
    if (showMessage) setMessage('Cloud profile connected. Your account is ready.');
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

  const handleEmailAuth = async () => {
    setMessage('');
    if (!cloudReady) {
      setMessage(cloudAuthSetupLabel());
      return;
    }
    if (!email.trim() || !password.trim()) {
      setMessage('Enter an email and password first.');
      return;
    }
    if (password.trim().length < 6) {
      setMessage('Use at least 6 characters for the password.');
      return;
    }

    setBusy(true);
    try {
      const profile = createMode
        ? await createEmailPasswordAccount(email.trim(), password.trim(), displayName)
        : await signInWithEmailPassword(email.trim(), password.trim());

      if (profile) {
        connectCloudProfile(profile);
        setMessage(createMode ? 'Account created and connected.' : 'Signed in and connected.');
      } else {
        setMessage('Account created. Check your email to confirm, then sign in.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Cloud sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleSocial = async (provider: CloudSocialProvider) => {
    setMessage('');
    if (!cloudReady) {
      setMessage(cloudAuthSetupLabel());
      return;
    }
    setBusy(true);
    try {
      await startSocialSignIn(provider);
      setMessage('Opening secure sign-in. Finish the login, then return to SeatSavvy.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Social sign-in failed.');
      setBusy(false);
    }
  };

  const disconnect = async () => {
    setBusy(true);
    try {
      await signOutCloud();
    } finally {
      signOutAccount();
      setBusy(false);
      onClose();
    }
  };

  return (
    <Backdrop>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d6a84f]">
            Cloud Profile
          </p>
          <h2 className="font-display text-2xl font-extrabold text-[#fff5d8]">
            Keep your progress
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#d9cda9]">
            Sign in with Google, Apple, Facebook, or email and password. Guest mode still works too.
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
            {progress.account.email && (
              <p className="mt-1 max-w-[220px] truncate text-[11px] font-bold text-[#d9cda9]">
                {progress.account.email}
              </p>
            )}
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${
            progress.account.provider === 'guest'
              ? 'bg-white/10 text-[#d9cda9] ring-white/10'
              : 'bg-[#d6a84f]/16 text-[#f6d98d] ring-[#d6a84f]/24'
          }`}>
            {progress.account.provider === 'guest' ? 'Local save' : 'Cloud ready'}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <button
          onClick={() => handleSocial('google')}
          disabled={busy}
          className="rounded-2xl border border-white/10 bg-white px-4 py-3 text-left font-extrabold text-[#15101f] shadow transition active:scale-95 disabled:opacity-60"
          type="button"
        >
          Continue with Google / Gmail
          <span className="block text-xs font-semibold text-[#4f5563]">
            Use a Google account for cloud sign-in.
          </span>
        </button>
        <button
          onClick={() => handleSocial('apple')}
          disabled={busy}
          className="rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-left font-extrabold text-[#fff5d8] shadow transition active:scale-95 disabled:opacity-60"
          type="button"
        >
          Continue with Apple
          <span className="block text-xs font-semibold text-[#a9a0b5]">
            Included for iOS social sign-in support.
          </span>
        </button>
        <button
          onClick={() => handleSocial('facebook')}
          disabled={busy}
          className="rounded-2xl border border-[#7fb2ff]/35 bg-[#1d4ed8]/80 px-4 py-3 text-left font-extrabold text-white shadow transition active:scale-95 disabled:opacity-60"
          type="button"
        >
          Continue with Facebook
          <span className="block text-xs font-semibold text-blue-100">
            Connect a social profile.
          </span>
        </button>
      </div>

      <div className="mt-4 space-y-3 rounded-3xl border border-white/10 bg-white/8 p-4 shadow-inner">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[#fff5d8]">
              {createMode ? 'Create email account' : 'Email sign-in'}
            </p>
            <p className="text-xs font-semibold text-[#a9a0b5]">
              Use any email and password.
            </p>
          </div>
          <button
            onClick={() => setCreateMode((value) => !value)}
            className="rounded-full border border-[#d6a84f]/24 bg-[#d6a84f]/12 px-3 py-1 text-xs font-black text-[#f6d98d]"
            type="button"
          >
            {createMode ? 'Sign in' : 'Create'}
          </button>
        </div>

        {createMode && (
          <label className="block rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-left shadow-inner">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#d6a84f]">
              Player name
            </span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="SeatSavvy Player"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/24 px-3 py-2 text-sm font-bold text-[#fff5d8] outline-none placeholder:text-[#7f7890] focus:border-[#d6a84f]/45"
            />
          </label>
        )}

        <label className="block rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-left shadow-inner">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#d6a84f]">
            Email
          </span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            inputMode="email"
            autoCapitalize="none"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/24 px-3 py-2 text-sm font-bold text-[#fff5d8] outline-none placeholder:text-[#7f7890] focus:border-[#d6a84f]/45"
          />
        </label>
        <label className="block rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-left shadow-inner">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#d6a84f]">
            Password
          </span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            type="password"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/24 px-3 py-2 text-sm font-bold text-[#fff5d8] outline-none placeholder:text-[#7f7890] focus:border-[#d6a84f]/45"
          />
        </label>
        <button
          onClick={handleEmailAuth}
          disabled={busy}
          className="w-full rounded-2xl bg-gradient-to-r from-[#d6a84f] to-[#f0c76a] px-4 py-3 text-left font-extrabold text-[#15101f] shadow-[0_12px_24px_rgba(214,168,79,0.24)] transition active:scale-95 disabled:opacity-60"
          type="button"
        >
          {createMode ? 'Create account' : 'Sign in with email'}
          <span className="block text-xs font-semibold text-[#4a3412]">
            {cloudReady ? 'Cloud auth is configured.' : 'Needs Supabase env setup.'}
          </span>
        </button>
      </div>

      {message && (
        <p className="mt-3 rounded-2xl border border-[#d6a84f]/24 bg-[#d6a84f]/10 px-4 py-3 text-xs font-bold leading-relaxed text-[#f6d98d]">
          {message}
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-2">
        <button
          onClick={guest}
          className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-left font-extrabold text-[#eadfcb] shadow transition active:scale-95"
          type="button"
        >
          Continue as Guest
          <span className="block text-xs font-semibold text-[#a9a0b5]">
            Progress saves locally on this device.
          </span>
        </button>
        {progress.account.provider !== 'guest' && (
          <button
            onClick={disconnect}
            disabled={busy}
            className="rounded-2xl border border-[#a86a78]/35 bg-[#a86a78]/12 px-4 py-3 text-left text-sm font-extrabold text-[#f3a8b6] shadow transition active:scale-95 disabled:opacity-60"
            type="button"
          >
            Disconnect and play as guest
          </button>
        )}
      </div>

      <p className="mt-3 text-center text-[11px] font-semibold leading-relaxed text-[#7f7890]">
        {cloudAuthSetupLabel()} Social providers must be enabled in the Supabase dashboard.
      </p>
    </Backdrop>
  );
};
