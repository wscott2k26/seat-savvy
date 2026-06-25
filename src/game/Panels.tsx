import React, { useState } from 'react';
import { Backdrop } from './Modals';
import { useGame } from './GameProvider';

export const SettingsModal: React.FC<{ onClose: () => void; onPremium: () => void }> = ({
  onClose,
  onPremium,
}) => {
  const { progress, setProgress } = useGame();
  const Row: React.FC<{ label: string; on: boolean; toggle: () => void }> = ({
    label,
    on,
    toggle,
  }) => (
    <button
      onClick={toggle}
      className="flex w-full items-center justify-between rounded-2xl bg-white/70 px-4 py-3 font-bold text-stone-700 shadow-sm"
    >
      {label}
      <span
        className={`relative h-6 w-11 rounded-full transition ${
          on ? 'bg-emerald-500' : 'bg-stone-300'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            on ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  );
  return (
    <Backdrop>
      <h2 className="font-display text-2xl font-extrabold text-stone-800">
        Settings
      </h2>
      <div className="mt-4 space-y-3">
        <Row
          label="Sound & Music"
          on={progress.soundOn}
          toggle={() => setProgress((p) => ({ ...p, soundOn: !p.soundOn }))}
        />
        {!progress.premium && (
          <button
            onClick={onPremium}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-left font-extrabold text-white shadow-lg"
          >
            Unlock Premium \u00b7 $4.99
            <span className="block text-xs font-medium opacity-90">
              100+ levels, unlimited hints, no ads
            </span>
          </button>
        )}
      </div>
      <button
        onClick={onClose}
        className="mt-5 w-full rounded-2xl bg-white py-3 font-extrabold text-stone-700 shadow ring-1 ring-black/5 active:scale-95"
      >
        Close
      </button>
    </Backdrop>
  );
};

export const PremiumModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { setProgress } = useGame();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sms, setSms] = useState(true);
  const [sent, setSent] = useState(false);

  const join = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch(
        'https://famous.ai/api/crm/6a3d2fc295418d0cc27b2f7f/subscribe',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            phone: phone || undefined,
            sms_opt_in: sms,
            source: 'premium-waitlist',
            tags: ['premium', 'expansions'],
          }),
        },
      );
    } catch {}
    setSent(true);
  };

  const perks = [
    '100+ handcrafted story levels',
    'Unlimited hints, forever',
    'Expert multi-solution puzzles',
    'Exclusive characters & worlds',
    'No ads \u00b7 Cloud saves',
  ];

  return (
    <Backdrop>
      <p className="text-xs font-bold uppercase tracking-widest text-fuchsia-500">
        Tiny Worlds Premium
      </p>
      <h2 className="font-display text-2xl font-extrabold text-stone-800">
        Unlock the whole journey
      </h2>
      <ul className="mt-4 space-y-2">
        {perks.map((p) => (
          <li key={p} className="flex items-center gap-2 text-[15px] font-medium text-stone-700">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </span>
            {p}
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          setProgress((p) => ({ ...p, premium: true }));
          onClose();
        }}
        className="mt-5 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3 text-lg font-extrabold text-white shadow-lg active:scale-95"
      >
        Unlock Premium \u2014 $4.99
      </button>

      <div className="mt-5 rounded-2xl bg-white/70 p-4 shadow-inner">
        {sent ? (
          <p className="text-center text-sm font-semibold text-emerald-700">
            You\u2019re on the list! We\u2019ll let you know about Year One
            expansions.
          </p>
        ) : (
          <form onSubmit={join} className="space-y-2">
            <p className="text-sm font-bold text-stone-700">
              Get notified about new worlds & the Season Pass
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-fuchsia-400"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number (optional)"
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-fuchsia-400"
            />
            <label className="flex items-start gap-2 text-[11px] text-stone-500">
              <input
                type="checkbox"
                checked={sms}
                onChange={(e) => setSms(e.target.checked)}
                className="mt-0.5"
              />
              Text me updates. Msg &amp; data rates may apply. Reply STOP to
              unsubscribe.
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-stone-800 py-2 text-sm font-bold text-white active:scale-95"
            >
              Join the waitlist
            </button>
          </form>
        )}
      </div>

      <button
        onClick={onClose}
        className="mt-3 w-full rounded-2xl bg-white py-2.5 font-bold text-stone-600 shadow ring-1 ring-black/5 active:scale-95"
      >
        Maybe later
      </button>
    </Backdrop>
  );
};
