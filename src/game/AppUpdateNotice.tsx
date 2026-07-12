import React from 'react';

const APP_STORE_APP_ID = '6785736750';
const APP_STORE_URL = `https://apps.apple.com/app/seatsavvy-puzzle-story/id${APP_STORE_APP_ID}`;
const CURRENT_APP_VERSION = '1.0.1';
const CHECK_CACHE_KEY = 'seat_savvy_update_check_v1';
const DISMISSED_KEY_PREFIX = 'seat_savvy_update_dismissed_';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

interface StoreLookupResult {
  resultCount?: number;
  results?: Array<{
    version?: string;
    trackViewUrl?: string;
  }>;
}

function versionParts(version: string): number[] {
  return version
    .split('.')
    .map((part) => Number.parseInt(part.replace(/[^0-9].*$/, ''), 10))
    .map((part) => (Number.isFinite(part) ? part : 0));
}

function isNewerVersion(storeVersion: string, currentVersion: string): boolean {
  const store = versionParts(storeVersion);
  const current = versionParts(currentVersion);
  const max = Math.max(store.length, current.length, 3);

  for (let i = 0; i < max; i += 1) {
    const a = store[i] ?? 0;
    const b = current[i] ?? 0;
    if (a > b) return true;
    if (a < b) return false;
  }

  return false;
}

function shouldSkipNetworkCheck(): boolean {
  try {
    const raw = window.localStorage.getItem(CHECK_CACHE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { checkedAt?: number };
    return typeof parsed.checkedAt === 'number' && Date.now() - parsed.checkedAt < ONE_DAY_MS;
  } catch {
    return false;
  }
}

function rememberCheck() {
  try {
    window.localStorage.setItem(CHECK_CACHE_KEY, JSON.stringify({ checkedAt: Date.now() }));
  } catch {
    // Ignore private browsing/storage failures.
  }
}

function wasDismissedFor(version: string): boolean {
  try {
    return window.localStorage.getItem(`${DISMISSED_KEY_PREFIX}${version}`) === '1';
  } catch {
    return false;
  }
}

function dismissVersion(version: string) {
  try {
    window.localStorage.setItem(`${DISMISSED_KEY_PREFIX}${version}`, '1');
  } catch {
    // Ignore private browsing/storage failures.
  }
}

const AppUpdateNotice: React.FC = () => {
  const [latestVersion, setLatestVersion] = React.useState<string | null>(null);
  const [storeUrl, setStoreUrl] = React.useState(APP_STORE_URL);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const checkForUpdate = async () => {
      if (shouldSkipNetworkCheck()) return;
      rememberCheck();

      try {
        const response = await fetch(
          `https://itunes.apple.com/lookup?id=${APP_STORE_APP_ID}&country=us`,
          { cache: 'no-store' },
        );
        if (!response.ok) return;
        const data = (await response.json()) as StoreLookupResult;
        const result = data.results?.[0];
        const version = result?.version;
        if (!version || !isNewerVersion(version, CURRENT_APP_VERSION)) return;
        if (wasDismissedFor(version)) return;

        if (!cancelled) {
          setLatestVersion(version);
          setStoreUrl(result.trackViewUrl || APP_STORE_URL);
        }
      } catch {
        // Silent fail: the app should never block play because update lookup failed.
      }
    };

    void checkForUpdate();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!latestVersion || dismissed) return null;

  return (
    <div className="pointer-events-none absolute inset-x-3 top-[calc(var(--safe-area-top)+0.75rem)] z-[80]">
      <div className="pointer-events-auto rounded-[26px] border border-[#f6d98d]/38 bg-[linear-gradient(145deg,rgba(13,19,42,0.96),rgba(47,30,67,0.96))] p-4 text-[#fff5d8] shadow-[0_20px_52px_rgba(0,0,0,0.54),0_0_26px_rgba(214,168,79,0.16)] ring-1 ring-white/10 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#d6a84f] text-lg font-black text-[#15101f] shadow-[0_0_18px_rgba(214,168,79,0.25)]">
            ↑
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#d6a84f]">
              Update available
            </p>
            <h3 className="font-display text-lg font-black leading-tight text-[#fff5d8]">
              SeatSavvy {latestVersion} is ready
            </h3>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-[#d9cda9]">
              A newer App Store version is available with the latest puzzle fixes and gameplay polish.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  window.location.href = storeUrl;
                }}
                className="rounded-full bg-[#d6a84f] px-4 py-2 text-xs font-black text-[#15101f] shadow-[0_10px_24px_rgba(214,168,79,0.22)] active:scale-95"
              >
                Update now
              </button>
              <button
                type="button"
                onClick={() => {
                  dismissVersion(latestVersion);
                  setDismissed(true);
                }}
                className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-extrabold text-[#d9cda9] active:scale-95"
              >
                Later
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              dismissVersion(latestVersion);
              setDismissed(true);
            }}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/8 text-sm font-black text-[#d9cda9] active:scale-95"
            aria-label="Dismiss update notice"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppUpdateNotice;
