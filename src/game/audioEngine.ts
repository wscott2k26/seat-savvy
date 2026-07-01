import { sceneForLocation, type SceneFamily } from './locations';
import type { EnvironmentId } from './types';

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

export type AudioEnvironment = EnvironmentId;

const AUDIO_EXTENSIONS = ['mp3', 'ogg'] as const;

const AMBIENT_BY_ENV: Record<SceneFamily, string> = {
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

const SYNTH_FALLBACK_SOUNDS = new Set<GameSound>([
  'correct',
  'wrong',
  'coin',
  'achievement',
  'win',
]);

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
  private audioContext: AudioContext | null = null;

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
        `/audio/ambient/${AMBIENT_BY_ENV[sceneForLocation(environment)]}`,
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
      ? `/audio/ambient/${AMBIENT_BY_ENV[sceneForLocation(environment)]}`
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

    if (SYNTH_FALLBACK_SOUNDS.has(sound)) {
      this.playFallbackSound(sound, preferences.sfxVolume);
      return;
    }

    const basePath = `/audio/sfx/${SFX_BY_SOUND[sound]}`;
    if (this.missingAssets.has(basePath)) {
      this.playFallbackSound(sound, preferences.sfxVolume);
      return;
    }

    let fallbackPlayed = false;
    const playFallbackOnce = () => {
      if (fallbackPlayed) return;
      fallbackPlayed = true;
      this.playFallbackSound(sound, preferences.sfxVolume);
    };

    this.playOneShot(
      basePath,
      preferences.sfxVolume,
      () => {
        this.missingAssets.add(basePath);
        playFallbackOnce();
      },
      undefined,
      playFallbackOnce,
    );
  }

  private playFallbackSound(sound: GameSound, volume: number) {
    if (!['correct', 'wrong', 'coin', 'win', 'achievement'].includes(sound)) return;
    if (typeof window === 'undefined') return;
    const AudioContextCtor =
      window.AudioContext ||
      (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextCtor) return;

    try {
      const context = this.audioContext ?? new AudioContextCtor();
      this.audioContext = context;
      const startSound = () => this.startFallbackSound(context, sound, volume);

      if (context.state === 'suspended') {
        void context.resume().then(startSound).catch(() => undefined);
      } else {
        startSound();
      }
    } catch (error) {
      devAudioLog('Web Audio fallback failed', sound, error);
    }
  }

  private startFallbackSound(
    context: AudioContext,
    sound: GameSound,
    volume: number,
  ) {
    const now = context.currentTime;
    const master = context.createGain();
    const peakVolume =
      sound === 'wrong'
        ? 0.32
        : sound === 'win'
          ? 0.38
          : sound === 'achievement'
            ? 0.3
            : 0.26;
    const tail =
      sound === 'wrong'
        ? 0.42
        : sound === 'correct'
          ? 0.46
          : sound === 'coin'
            ? 0.36
            : sound === 'win'
              ? 1.08
              : 0.82;
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(
      Math.max(0.0001, clamp(volume) * peakVolume),
      now + 0.02,
    );
    master.gain.exponentialRampToValueAtTime(0.0001, now + tail);
    master.connect(context.destination);

    if (sound === 'wrong') {
      this.tone(context, master, 150, now, 0.18, 'sawtooth', 0.45, 95);
      this.tone(context, master, 105, now + 0.16, 0.2, 'sawtooth', 0.45, 70);
      return;
    }

    if (sound === 'correct') {
      this.tone(context, master, 880, now, 0.16, 'triangle', 0.44);
      this.tone(context, master, 1174.66, now + 0.13, 0.22, 'triangle', 0.38);
      return;
    }

    if (sound === 'coin') {
      this.tone(context, master, 988, now, 0.12, 'triangle', 0.42);
      this.tone(context, master, 1568, now + 0.09, 0.18, 'sine', 0.34);
      return;
    }

    if (sound === 'win') {
      [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((frequency, index) => {
        this.tone(
          context,
          master,
          frequency,
          now + index * 0.09,
          index === 4 ? 0.42 : 0.26,
          index >= 3 ? 'triangle' : 'sine',
          index === 4 ? 0.36 : 0.46,
        );
      });
      [1568, 1760, 2093].forEach((frequency, index) => {
        this.tone(
          context,
          master,
          frequency,
          now + 0.42 + index * 0.075,
          0.18,
          'triangle',
          0.18,
        );
      });
      return;
    }

    [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
      this.tone(
        context,
        master,
        frequency,
        now + index * 0.095,
        0.28,
        index === 3 ? 'triangle' : 'sine',
        index === 3 ? 0.34 : 0.48,
      );
    });
  }

  private tone(
    context: AudioContext,
    destination: AudioNode,
    frequency: number,
    start: number,
    duration: number,
    type: OscillatorType,
    gainValue: number,
    endFrequency?: number,
  ) {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, start);
    if (endFrequency) {
      osc.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
    }
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(destination);
    osc.start(start);
    osc.stop(start + duration + 0.03);
  }

  private playOneShot(
    basePath: string,
    volume: number,
    onMissing?: () => void,
    stopAfterMs?: number,
    onPlaybackBlocked?: () => void,
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
        onPlaybackBlocked?.();
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
