export interface AudioPreferences {
  musicOn: boolean;
  sfxOn: boolean;
  ambientOn: boolean;
  muteAll: boolean;
  musicVolume: number;
  sfxVolume: number;
  ambientVolume: number;
}

export type GameSound =
  | 'button'
  | 'menu'
  | 'pickup'
  | 'drop'
  | 'correct'
  | 'wrong'
  | 'hint'
  | 'coin'
  | 'achievement'
  | 'win'
  | 'lock'
  | 'unlock';

export type AudioEnvironment =
  | 'bus'
  | 'classroom'
  | 'coffee'
  | 'restaurant'
  | 'theater'
  | 'airport'
  | 'wedding'
  | 'cruise';

const AUDIO_EXTENSIONS = ['mp3', 'ogg'] as const;

const AMBIENT_BY_ENV: Record<AudioEnvironment, string> = {
  bus: 'bus-ride',
  classroom: 'classroom',
  coffee: 'cafe-room',
  restaurant: 'restaurant-room',
  theater: 'theater-room',
  airport: 'airport',
  wedding: 'fireplace',
  cruise: 'ocean',
};

const SFX_BY_SOUND: Record<GameSound, string> = {
  button: 'button',
  menu: 'button',
  pickup: 'pickup',
  drop: 'drop',
  correct: 'correct',
  wrong: 'wrong',
  hint: 'hint',
  coin: 'coin',
  achievement: 'achievement',
  win: 'victory',
  lock: 'lock',
  unlock: 'unlock',
};

type LoopKind = 'music' | 'ambient';

interface LoopState {
  audio: HTMLAudioElement | null;
  basePath: string;
  fadeTimer: number | null;
}

class BrowserAudioEngine {
  private loops: Record<LoopKind, LoopState> = {
    music: { audio: null, basePath: '', fadeTimer: null },
    ambient: { audio: null, basePath: '', fadeTimer: null },
  };

  private missingAssets = new Set<string>();

  sync(preferences: AudioPreferences, environment?: AudioEnvironment) {
    if (typeof window === 'undefined' || typeof Audio === 'undefined') return;

    this.stopLoop('music');

    if (preferences.muteAll) {
      this.stopLoop('ambient');
      return;
    }

    if (preferences.ambientOn && environment) {
      this.ensureLoop(
        'ambient',
        `/audio/ambient/${AMBIENT_BY_ENV[environment]}`,
        preferences.ambientVolume,
      );
    } else {
      this.stopLoop('ambient');
    }
  }

  test(preferences: AudioPreferences, environment?: AudioEnvironment) {
    if (
      typeof window === 'undefined' ||
      typeof Audio === 'undefined' ||
      preferences.muteAll
    ) {
      return;
    }

    this.sync(preferences, environment);
    const primary = '/audio/sfx/button';
    const fallback = environment
      ? `/audio/ambient/${AMBIENT_BY_ENV[environment]}`
      : '/audio/ambient/rain';
    this.playOneShot(primary, preferences.sfxVolume, () => {
      this.playOneShot(fallback, preferences.ambientVolume, undefined, 1400);
    });
  }

  play(sound: GameSound, preferences: AudioPreferences) {
    if (
      typeof window === 'undefined' ||
      typeof Audio === 'undefined' ||
      preferences.muteAll ||
      !preferences.sfxOn
    ) {
      return;
    }

    const basePath = `/audio/sfx/${SFX_BY_SOUND[sound]}`;
    if (this.missingAssets.has(basePath)) return;

    this.playOneShot(basePath, preferences.sfxVolume, () => {
      this.missingAssets.add(basePath);
    });
  }

  private ensureLoop(kind: LoopKind, basePath: string, volume: number) {
    const targetVolume = clamp(volume);
    const state = this.loops[kind];
    if (this.missingAssets.has(basePath)) {
      this.stopLoop(kind);
      return;
    }

    if (state.audio && state.basePath === basePath) {
      this.fadeTo(state.audio, targetVolume);
      if (state.audio.paused) {
        void state.audio.play().catch(() => {
          // Autoplay may be blocked; sync is called again after user interaction.
        });
      }
      return;
    }

    this.stopLoop(kind);

    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;

    state.audio = audio;
    state.basePath = basePath;
    devAudioLog(`Trying ${kind}`, basePath);
    this.loadWithFallback(audio, basePath, () => {
      devAudioLog(`Missing ${kind}`, basePath);
      this.missingAssets.add(basePath);
      this.stopLoop(kind);
    });

    void audio
      .play()
      .then(() => this.fadeTo(audio, targetVolume))
      .catch(() => {
        audio.volume = targetVolume;
      });
  }

  private playOneShot(
    basePath: string,
    volume: number,
    onMissing?: () => void,
    stopAfterMs?: number,
  ) {
    if (this.missingAssets.has(basePath)) {
      onMissing?.();
      return;
    }

    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = clamp(volume);
    devAudioLog('Trying sound', basePath);
    this.loadWithFallback(audio, basePath, () => {
      devAudioLog('Missing sound', basePath);
      this.missingAssets.add(basePath);
      onMissing?.();
    });
    void audio
      .play()
      .then(() => {
        if (stopAfterMs) {
          window.setTimeout(() => {
            audio.pause();
            audio.removeAttribute('src');
            audio.load();
          }, stopAfterMs);
        }
      })
      .catch((error) => {
        devAudioLog('Playback blocked', basePath, error);
      });
  }

  private stopLoop(kind: LoopKind) {
    const state = this.loops[kind];
    if (state.fadeTimer !== null) {
      window.clearInterval(state.fadeTimer);
      state.fadeTimer = null;
    }
    if (state.audio) {
      state.audio.pause();
      state.audio.removeAttribute('src');
      state.audio.load();
    }
    state.audio = null;
    state.basePath = '';
  }

  private fadeTo(audio: HTMLAudioElement, targetVolume: number) {
    const loopState = Object.values(this.loops).find((state) => state.audio === audio);
    if (!loopState) {
      audio.volume = targetVolume;
      return;
    }

    if (loopState.fadeTimer !== null) {
      window.clearInterval(loopState.fadeTimer);
      loopState.fadeTimer = null;
    }

    loopState.fadeTimer = window.setInterval(() => {
      const delta = targetVolume - audio.volume;
      if (Math.abs(delta) < 0.015) {
        audio.volume = targetVolume;
        if (loopState.fadeTimer !== null) {
          window.clearInterval(loopState.fadeTimer);
          loopState.fadeTimer = null;
        }
        return;
      }
      audio.volume = clamp(audio.volume + delta * 0.2);
    }, 45);
  }

  private loadWithFallback(
    audio: HTMLAudioElement,
    basePath: string,
    onMissing: () => void,
  ) {
    let index = 0;

    const tryNext = () => {
      if (index >= AUDIO_EXTENSIONS.length) {
        audio.onerror = null;
        onMissing();
        return;
      }

      const shouldResume = !audio.paused;
      audio.src = `${basePath}.${AUDIO_EXTENSIONS[index]}`;
      index += 1;
      audio.load();
      if (shouldResume) {
        void audio.play().catch(() => {
          // A later user interaction can retry this same source.
        });
      }
    };

    audio.onerror = tryNext;
    tryNext();
  }
}

const audioEngine = new BrowserAudioEngine();

export function getAudioEngine() {
  return audioEngine;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

function devAudioLog(message: string, path: string, detail?: unknown) {
  if (import.meta.env.DEV) {
    console.info(`[audio] ${message}: ${path}`, detail ?? '');
  }
}
