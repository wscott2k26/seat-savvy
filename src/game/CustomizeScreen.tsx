import React from 'react';
import { useGame } from './GameProvider';
import {
  ACCESSORY_OPTIONS,
  ENVIRONMENT_LABELS,
  ENVIRONMENT_PALETTES,
  FRAME_OPTIONS,
  GAME_THEMES,
  GAME_THEME_BACKGROUNDS,
  HAIR_OPTIONS,
  HAT_OPTIONS,
  MOOD_ANIMATION_OPTIONS,
  OUTFIT_OPTIONS,
  SKIN_TONE_OPTIONS,
  TRAIL_OPTIONS,
  VICTORY_POSE_OPTIONS,
  type AvatarCustomization,
  type CustomizationOption,
  type CustomizationSlot,
  type EnvironmentPaletteId,
  isUnlocked,
  unlockLabel,
} from './customization';
import type { EnvironmentId } from './types';

const ENVIRONMENTS = Object.keys(ENVIRONMENT_LABELS) as EnvironmentId[];

const CustomizeScreen: React.FC<{ onPremium: () => void }> = ({ onPremium }) => {
  const { openMenu, playSound, progress, updateCustomization } = useGame();
  const selectedTheme =
    GAME_THEME_BACKGROUNDS[progress.customization.gameTheme] ??
    GAME_THEME_BACKGROUNDS['midnight-gold'];

  const chooseTheme = (option: CustomizationOption) => {
    if (!selectable(option, progress, onPremium, playSound)) return;
    updateCustomization((current) => ({
      ...current,
      gameTheme: option.id as typeof current.gameTheme,
    }));
  };

  const choosePalette = (
    env: EnvironmentId,
    option: CustomizationOption<EnvironmentPaletteId>,
  ) => {
    if (!selectable(option, progress, onPremium, playSound)) return;
    updateCustomization((current) => ({
      ...current,
      envPalettes: {
        ...current.envPalettes,
        [env]: option.id,
      },
    }));
  };

  const updateAvatar = (
    slot: CustomizationSlot,
    patch: Partial<AvatarCustomization>,
  ) => {
    updateCustomization((current) => ({
      ...current,
      [slot]: {
        ...current[slot],
        ...patch,
      },
    }));
  };

  return (
    <div
      className="safe-screen relative h-full w-full overflow-y-auto text-[#f8edd2]"
      style={{ background: selectedTheme }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 22 }).map((_, i) => (
          <span
            key={i}
            className="ts-particle ts-stardust"
            style={{
              left: `${(i * 41) % 100}%`,
              animationDelay: `${i * 0.38}s`,
              animationDuration: `${8 + (i % 6)}s`,
            }}
          />
        ))}
      </div>

      <header className="safe-header relative overflow-hidden rounded-b-[34px] border-b border-[#d6a84f]/20 bg-[linear-gradient(145deg,rgba(7,11,26,0.96),rgba(36,22,51,0.94)_55%,rgba(12,24,48,0.96))] pb-6 shadow-[0_20px_48px_rgba(0,0,0,0.46),0_0_36px_rgba(214,168,79,0.12)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(214,168,79,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_50%,rgba(0,0,0,0.24))]" />
        <div className="relative flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={openMenu}
            className="safe-hit grid place-items-center rounded-full border border-white/10 bg-white/10 text-[#f8edd2] shadow-lg ring-1 ring-[#d6a84f]/15 transition hover:bg-white/15 active:scale-95"
            title="Back to levels"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="flex items-center gap-2">
            <PortraitPreview avatar={progress.customization.playerAvatar} size={48} />
            <PortraitPreview avatar={progress.customization.characterAvatar} size={48} />
          </div>
        </div>
        <p className="relative mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#d6a84f]">
          Style Studio
        </p>
        <h1 className="relative font-display text-3xl font-black leading-none text-[#fff5d8] drop-shadow-[0_3px_16px_rgba(0,0,0,0.45)]">
          Customize
        </h1>
        <p className="relative mt-2 max-w-sm text-sm font-semibold text-[#d9cda9]">
          Refine your profile portrait, guest styling, frames, trails, and victory poses with a polished studio look.
        </p>
      </header>

      <main className="safe-content relative space-y-5 pt-5">
        <Panel title="Game Theme" subtitle="Changes the overall mood of the menu and studio.">
          <div className="grid grid-cols-2 gap-3">
            {GAME_THEMES.map((theme) => {
              const locked = !isUnlocked(theme.unlock, progress);
              const selected = progress.customization.gameTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => chooseTheme(theme)}
                  className={`relative min-h-[124px] overflow-hidden rounded-3xl border p-3 text-left shadow-[0_14px_30px_rgba(0,0,0,0.28)] transition active:scale-95 ${
                    selected
                      ? 'border-[#d6a84f]/70 ring-2 ring-[#d6a84f]/34'
                      : 'border-white/10 ring-1 ring-white/8'
                  }`}
                  style={{ background: GAME_THEME_BACKGROUNDS[theme.id] }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/14 via-transparent to-black/34" />
                  <LockVeil locked={locked} label={unlockLabel(theme.unlock)} />
                  <p className="relative font-display text-sm font-black text-[#fff5d8]">
                    {theme.label}
                  </p>
                  <p className="relative mt-1 text-[11px] font-semibold leading-snug text-[#d9cda9]">
                    {theme.description}
                  </p>
                  <Swatches colors={theme.colors ?? []} />
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel title="Environment Palettes" subtitle="Each location can have its own color treatment.">
          <div className="space-y-4">
            {ENVIRONMENTS.map((env) => (
              <section
                key={env}
                className="rounded-3xl border border-white/10 bg-[#071022]/60 p-3 shadow-inner"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-display text-sm font-black text-[#fff5d8]">
                    {ENVIRONMENT_LABELS[env]}
                  </h3>
                  <span className="rounded-full border border-[#d6a84f]/24 bg-[#d6a84f]/12 px-2 py-0.5 text-[10px] font-extrabold text-[#f6d98d]">
                    {progress.customization.envPalettes[env] ?? 'default'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {ENVIRONMENT_PALETTES.map((palette) => {
                    const locked = !isUnlocked(palette.unlock, progress);
                    const selected =
                      (progress.customization.envPalettes[env] ?? 'default') ===
                      palette.id;
                    return (
                      <button
                        key={palette.id}
                        type="button"
                        onClick={() => choosePalette(env, palette)}
                        className={`relative overflow-hidden rounded-2xl border px-3 py-2 text-left shadow-[0_10px_22px_rgba(0,0,0,0.2)] transition active:scale-95 ${
                          selected
                            ? 'border-[#d6a84f]/70 bg-[#d6a84f]/18'
                            : 'border-white/10 bg-white/8'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-extrabold text-[#fff5d8]">
                            {palette.label}
                          </span>
                          <MiniLock locked={locked} />
                        </div>
                        <Swatches colors={palette.colors ?? []} compact />
                        {locked && (
                          <p className="mt-1 text-[9px] font-bold text-[#a9a0b5]">
                            {unlockLabel(palette.unlock)}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </Panel>

        <AvatarStudio
          title="Player Avatar"
          subtitle="Your profile portrait and studio preview."
          avatar={progress.customization.playerAvatar}
          hue={36}
          slot="playerAvatar"
          updateAvatar={updateAvatar}
          onPremium={onPremium}
        />

        <AvatarStudio
          title="Unlockable Characters"
          subtitle="A cosmetic style for guests you meet across story chapters."
          avatar={progress.customization.characterAvatar}
          hue={218}
          slot="characterAvatar"
          updateAvatar={updateAvatar}
          onPremium={onPremium}
        />
      </main>
    </div>
  );
};

const AvatarStudio: React.FC<{
  title: string;
  subtitle: string;
  avatar: AvatarCustomization;
  hue: number;
  slot: CustomizationSlot;
  updateAvatar: (slot: CustomizationSlot, patch: Partial<AvatarCustomization>) => void;
  onPremium: () => void;
}> = ({ title, subtitle, avatar, hue, slot, updateAvatar, onPremium }) => {
  const { playSound, progress } = useGame();
  const choose = <T extends string,>(
    option: CustomizationOption<T>,
    patch: Partial<AvatarCustomization>,
  ) => {
    if (!selectable(option, progress, onPremium, playSound)) return;
    updateAvatar(slot, patch);
  };

  return (
    <Panel title={title} subtitle={subtitle}>
      <div className="mb-4 flex items-center gap-4 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(5,8,22,0.78),rgba(32,26,48,0.72))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="rounded-[26px] border border-[#d6a84f]/22 bg-[#050816]/58 p-2 shadow-[0_16px_28px_rgba(0,0,0,0.34)]">
          <PortraitPreview avatar={avatar} hue={hue} size={92} />
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg font-black text-[#fff5d8]">
            {title}
          </p>
          <p className="mt-1 text-xs font-semibold text-[#a9a0b5]">
            {avatar.accessory === 'none' ? 'No accessory' : labelFor(ACCESSORY_OPTIONS, avatar.accessory)}
          </p>
          <p className="text-xs font-semibold text-[#d6a84f]">
            {labelFor(FRAME_OPTIONS, avatar.avatarFrame)} / {labelFor(MOOD_ANIMATION_OPTIONS, avatar.moodAnimation)}
          </p>
        </div>
      </div>

      <Picker
        title="Skin Tone"
        options={SKIN_TONE_OPTIONS}
        selected={avatar.skinTone}
        onChoose={(option) => choose(option, { skinTone: option.id })}
      />
      <Picker
        title="Outfit Color"
        options={OUTFIT_OPTIONS}
        selected={avatar.outfitColor}
        onChoose={(option) => choose(option, { outfitColor: option.id })}
      />
      <Picker
        title="Hair Color"
        options={HAIR_OPTIONS}
        selected={avatar.hairColor}
        onChoose={(option) => choose(option, { hairColor: option.id })}
      />
      <Picker
        title="Hat"
        options={HAT_OPTIONS}
        selected={avatar.hat}
        onChoose={(option) => choose(option, { hat: option.id })}
      />
      <Picker
        title="Accessory"
        options={ACCESSORY_OPTIONS}
        selected={avatar.accessory}
        onChoose={(option) => choose(option, { accessory: option.id })}
      />
      <Picker
        title="Avatar Frame"
        options={FRAME_OPTIONS}
        selected={avatar.avatarFrame}
        onChoose={(option) => choose(option, { avatarFrame: option.id })}
      />
      <Picker
        title="Mood Animation"
        options={MOOD_ANIMATION_OPTIONS}
        selected={avatar.moodAnimation}
        onChoose={(option) => choose(option, { moodAnimation: option.id })}
      />
      <Picker
        title="Character Trail"
        options={TRAIL_OPTIONS}
        selected={avatar.characterTrail}
        onChoose={(option) => choose(option, { characterTrail: option.id })}
      />
      <Picker
        title="Victory Pose"
        options={VICTORY_POSE_OPTIONS}
        selected={avatar.victoryPose}
        onChoose={(option) => choose(option, { victoryPose: option.id })}
      />
    </Panel>
  );
};

const PortraitPreview: React.FC<{
  avatar: AvatarCustomization;
  hue?: number;
  size: number;
}> = ({ avatar, hue = 36, size }) => {
  const skin = colorFor(SKIN_TONE_OPTIONS, avatar.skinTone, '#c79268');
  const hair = colorFor(HAIR_OPTIONS, avatar.hairColor, '#2f211b');
  const outfit = colorFor(OUTFIT_OPTIONS, avatar.outfitColor, `hsl(${hue} 55% 36%)`);
  const frame =
    avatar.avatarFrame === 'gold'
      ? '#d6a84f'
      : avatar.avatarFrame === 'rose'
      ? '#a86a78'
      : avatar.avatarFrame === 'moon'
      ? '#9fb6d9'
      : '#2d3850';
  const hasGlasses = avatar.accessory === 'round-glasses';

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-[28px] border bg-[radial-gradient(circle_at_50%_12%,rgba(214,168,79,0.18),transparent_38%),linear-gradient(180deg,#121a2d,#060b18)] shadow-[0_18px_32px_rgba(0,0,0,0.38)]"
      style={{ width: size, height: size, borderColor: `${frame}88` }}
    >
      <div className="absolute inset-x-[18%] bottom-[8%] h-[42%] rounded-t-[38%]" style={{ background: outfit }} />
      <div className="absolute inset-x-[28%] bottom-[37%] h-[14%] rounded-full" style={{ background: skin }} />
      <div className="absolute left-[24%] top-[18%] h-[44%] w-[52%] rounded-[46%] shadow-[inset_0_-8px_12px_rgba(0,0,0,0.18)]" style={{ background: skin }} />
      <div className="absolute left-[21%] top-[12%] h-[28%] w-[58%] rounded-t-[60%] rounded-b-[30%]" style={{ background: hair }} />
      {avatar.hat !== 'none' && (
        <div className="absolute left-[20%] top-[8%] h-[16%] w-[60%] rounded-t-full shadow-lg" style={{ background: avatar.hat === 'beret' ? '#7a2e4a' : avatar.hat === 'moon-cap' ? '#17243a' : '#2f435d' }} />
      )}
      <span className="absolute left-[35%] top-[40%] h-1.5 w-1.5 rounded-full bg-[#15101f]" />
      <span className="absolute right-[35%] top-[40%] h-1.5 w-1.5 rounded-full bg-[#15101f]" />
      <span className="absolute left-[41%] top-[51%] h-1 w-[18%] rounded-full bg-[#8a4d4d]/70" />
      {hasGlasses && (
        <div className="absolute left-[28%] top-[36%] flex gap-1">
          <span className="h-4 w-4 rounded-full border-2 border-[#15101f]/70" />
          <span className="h-4 w-4 rounded-full border-2 border-[#15101f]/70" />
        </div>
      )}
      {avatar.accessory === 'star-pin' && (
        <span className="absolute right-[25%] bottom-[25%] h-3 w-3 rounded-full bg-[#d6a84f] shadow-[0_0_10px_rgba(214,168,79,0.5)]" />
      )}
      {avatar.accessory === 'soft-scarf' && (
        <span className="absolute left-[34%] bottom-[32%] h-3 w-[34%] rounded-full bg-[#a86a78]" />
      )}
      <div className="absolute inset-0 rounded-[28px] ring-1 ring-white/10" />
    </div>
  );
};

const Picker = <T extends string,>({
  title,
  options,
  selected,
  onChoose,
}: {
  title: string;
  options: CustomizationOption<T>[];
  selected: T | string;
  onChoose: (option: CustomizationOption<T>) => void;
}) => {
  const { progress } = useGame();
  return (
    <section className="mt-4">
      <h3 className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#d6a84f]">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const locked = !isUnlocked(option.unlock, progress);
          const active = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChoose(option)}
              className={`relative min-h-12 overflow-hidden rounded-[20px] border px-3 py-2 text-left shadow-[0_12px_24px_rgba(0,0,0,0.24)] transition hover:-translate-y-0.5 active:scale-95 ${
                active
                  ? 'border-[#d6a84f]/70 bg-[#d6a84f]/16 ring-1 ring-[#d6a84f]/26'
                  : 'border-white/10 bg-[#071022]/72 hover:border-white/18'
              }`}
            >
              <div className="flex items-center gap-2">
                {option.color && (
                  <span
                    className="h-6 w-6 shrink-0 rounded-full border border-white/25 shadow-inner"
                    style={{ background: option.color }}
                  />
                )}
                {option.colors && <Swatches colors={option.colors} compact />}
                <span className="min-w-0 flex-1 text-xs font-extrabold text-[#fff5d8]">
                  {option.label}
                </span>
                <MiniLock locked={locked} />
              </div>
              {locked && (
                <p className="mt-1 text-[9px] font-bold text-[#a9a0b5]">
                  {unlockLabel(option.unlock)}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

const Panel: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,16,33,0.9),rgba(5,10,23,0.78))] p-4 shadow-[0_24px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-[#d6a84f]/10 backdrop-blur">
    <div className="mb-3">
      <h2 className="font-display text-xl font-black text-[#fff5d8]">{title}</h2>
      <p className="text-xs font-semibold text-[#a9a0b5]">{subtitle}</p>
    </div>
    {children}
  </section>
);

const Swatches: React.FC<{ colors: string[]; compact?: boolean }> = ({
  colors,
  compact = false,
}) => (
  <div className={`relative mt-3 flex ${compact ? 'gap-1' : 'gap-1.5'}`}>
    {colors.map((color) => (
      <span
        key={color}
        className={`${compact ? 'h-3 w-5' : 'h-4 w-7'} rounded-full border border-white/20 shadow-inner`}
        style={{ background: color }}
      />
    ))}
  </div>
);

const MiniLock: React.FC<{ locked: boolean }> = ({ locked }) =>
  locked ? (
    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#050816]/72 text-[#d6a84f] ring-1 ring-[#d6a84f]/22">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
    </span>
  ) : null;

const LockVeil: React.FC<{ locked: boolean; label: string }> = ({
  locked,
  label,
}) =>
  locked ? (
    <div className="absolute inset-0 z-10 flex items-end bg-[#050816]/52 p-3 backdrop-blur-[1px]">
      <span className="rounded-full border border-[#d6a84f]/25 bg-[#050816]/80 px-2 py-1 text-[10px] font-extrabold text-[#f6d98d] shadow">
        {label}
      </span>
    </div>
  ) : null;

function selectable(
  option: CustomizationOption,
  progress: { completed: number[]; premium: boolean },
  onPremium: () => void,
  playSound: (sound: 'button' | 'wrong') => void,
): boolean {
  if (isUnlocked(option.unlock, progress)) {
    playSound('button');
    return true;
  }
  if (option.unlock.type === 'premium') {
    playSound('button');
    onPremium();
    return false;
  }
  playSound('wrong');
  return false;
}

function labelFor<T extends string>(
  options: CustomizationOption<T>[],
  id: T,
): string {
  return options.find((option) => option.id === id)?.label ?? id;
}

function colorFor<T extends string>(
  options: CustomizationOption<T>[],
  id: T,
  fallback: string,
): string {
  return options.find((option) => option.id === id)?.color ?? fallback;
}

export default CustomizeScreen;
