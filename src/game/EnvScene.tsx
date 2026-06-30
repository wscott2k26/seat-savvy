import React from 'react';
import type { EnvironmentId } from './types';
import type { EnvironmentPaletteId } from './customization';

const Particles: React.FC<{ kind: 'dust' | 'leaf' | 'rain'; n?: number }> = ({
  kind,
  n = 14,
}) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {Array.from({ length: n }).map((_, i) => (
      <span
        key={i}
        className={`ts-particle ts-${kind}`}
        style={{
          left: `${(i * 97) % 100}%`,
          animationDelay: `${(i * 0.7) % 8}s`,
          animationDuration: `${6 + ((i * 1.3) % 7)}s`,
        }}
      />
    ))}
  </div>
);

const Sky: React.FC<{ from: string; to: string }> = ({ from, to }) => (
  <div
    className="absolute inset-0"
    style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
  />
);

type EnvironmentArtStyle = 'storybook' | 'real';

const REAL_BACKGROUND_BASE: Record<EnvironmentId, string> = {
  bus: '/images/environments/bus',
  classroom: '/images/environments/classroom',
  coffee: '/images/environments/coffee-shop',
  restaurant: '/images/environments/restaurant',
  theater: '/images/environments/theater',
  airport: '/images/environments/airport',
  wedding: '/images/environments/wedding',
  cruise: '/images/environments/cruise',
};

const IMAGE_EXTENSIONS = ['jpg', 'png', 'webp'] as const;

const PALETTE_OVERLAYS: Record<EnvironmentPaletteId, string> = {
  default: '',
  night:
    'linear-gradient(180deg,rgba(3,7,18,0.42),rgba(20,18,48,0.32)),radial-gradient(circle_at_70%_16%,rgba(159,182,217,0.18),transparent_34%)',
  rainy:
    'linear-gradient(180deg,rgba(28,54,75,0.46),rgba(9,17,31,0.38)),repeating-linear-gradient(105deg,rgba(183,214,232,0.18)_0_1px,transparent_1px_12px)',
  'golden-hour':
    'linear-gradient(135deg,rgba(240,199,106,0.3),transparent_42%),linear-gradient(180deg,transparent,rgba(123,63,47,0.26))',
  holiday:
    'radial-gradient(circle_at_20%_18%,rgba(214,168,79,0.28),transparent_24%),linear-gradient(135deg,rgba(23,61,52,0.32),rgba(180,63,85,0.2))',
  pastel:
    'linear-gradient(135deg,rgba(217,199,242,0.22),rgba(240,200,210,0.18),rgba(212,239,217,0.18))',
  'high-contrast':
    'linear-gradient(180deg,rgba(0,0,0,0.45),rgba(0,0,0,0.18)),radial-gradient(circle_at_center,transparent_38%,rgba(0,0,0,0.58)_100%)',
};

const RealEnvironmentBackground: React.FC<{
  env: EnvironmentId;
  enabled: boolean;
}> = ({ env, enabled }) => {
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => {
    setAttempt(0);
  }, [env, enabled]);

  if (!enabled || attempt >= IMAGE_EXTENSIONS.length) return null;

  return (
    <>
      <img
        aria-hidden="true"
        src={`${REAL_BACKGROUND_BASE[env]}.${IMAGE_EXTENSIONS[attempt]}`}
        onError={() => setAttempt((current) => current + 1)}
        className="absolute inset-0 h-full w-full object-cover opacity-90 saturate-[1.05]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.16),rgba(5,8,22,0.44)),radial-gradient(circle_at_center,transparent_42%,rgba(3,7,18,0.52)_100%)]" />
    </>
  );
};

const EnvironmentPaletteOverlay: React.FC<{ palette: EnvironmentPaletteId }> = ({
  palette,
}) => {
  const background = PALETTE_OVERLAYS[palette];
  if (!background) return null;
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ background, mixBlendMode: palette === 'high-contrast' ? 'normal' : 'soft-light' }}
    />
  );
};

const EnvScene: React.FC<{
  env: EnvironmentId;
  artStyle?: EnvironmentArtStyle;
  environmentPalette?: EnvironmentPaletteId;
}> = ({ env, artStyle = 'storybook', environmentPalette = 'default' }) => {
  const realBackground = (
    <RealEnvironmentBackground env={env} enabled={artStyle === 'real'} />
  );
  const paletteOverlay = (
    <EnvironmentPaletteOverlay palette={environmentPalette} />
  );

  if (env === 'bus') {
    return (
      <div className="absolute inset-0">
        <Sky from="#0a1224" to="#1f3850" />
        {realBackground}
        {paletteOverlay}
        <div className="absolute inset-x-3 bottom-0 top-[8%] rounded-t-[42px] bg-gradient-to-b from-[#283950] via-[#1a2639] to-[#101827] shadow-2xl ring-1 ring-[#f2c66d]/20" />
        <div className="absolute left-[8%] right-[8%] top-[15%] grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-gradient-to-b from-[#9fc7df] to-[#31536c] shadow-inner ring-2 ring-[#0b1220]">
              <div className="ts-scenery h-full w-[180%] opacity-50">
                <div className="mt-8 flex gap-6">
                  {Array.from({ length: 8 }).map((__, j) => (
                    <span key={j} className="block h-6 w-10 rounded-t-xl bg-[#243d2f]" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute left-[12%] right-[12%] top-[34%] h-2 rounded-full bg-[#d6a84f]/70 shadow-[0_0_18px_rgba(214,168,79,0.35)]" />
        <div className="absolute left-[7%] right-[7%] top-[25%] h-1 rounded-full bg-[#d8c18a]/45" />
        <div className="absolute left-[9%] top-[27%] flex w-[82%] justify-between">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className="h-6 w-2 rounded-full border border-[#d8c18a]/50 bg-[#0b1020]/28" />
          ))}
        </div>
        <div className="absolute right-[7%] top-[36%] h-[22%] w-[15%] rounded-t-[24px] bg-gradient-to-b from-[#172235] to-[#0b1020] shadow-xl ring-1 ring-[#f2c66d]/16">
          <div className="absolute left-1/2 top-4 h-8 w-8 -translate-x-1/2 rounded-full border-4 border-[#d6a84f]/55" />
          <div className="absolute bottom-3 left-3 right-3 h-3 rounded-full bg-[#31536c]" />
        </div>
        <div className="absolute left-[11%] right-[11%] top-[18%] grid grid-cols-3 gap-2 opacity-45">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="h-16 rounded-2xl bg-[linear-gradient(115deg,transparent_0_38%,rgba(255,255,255,0.5)_39%_43%,transparent_44%_100%)]" />
          ))}
        </div>
        <div className="absolute left-1/2 top-[34%] h-[54%] w-10 -translate-x-1/2 rounded-full bg-[#0b1020]/38" />
        <div className="absolute bottom-[8%] left-[14%] right-[14%] grid grid-cols-2 gap-x-20 gap-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 rounded-[18px] bg-gradient-to-b from-[#355069] to-[#172236] shadow-lg ring-1 ring-[#f2c66d]/18" />
          ))}
        </div>
        <Particles kind="dust" n={12} />
      </div>
    );
  }
  if (env === 'classroom') {
    return (
      <div className="absolute inset-0">
        <Sky from="#111b31" to="#3b2c45" />
        {realBackground}
        {paletteOverlay}
        <div className="absolute left-[9%] top-[8%] h-[25%] w-[50%] rounded-2xl bg-[#243f35] shadow-[0_14px_32px_rgba(0,0,0,0.35)] ring-4 ring-[#7a5638]">
          <div className="absolute left-[8%] top-[20%] font-handw text-xl text-[#e3f1df]/70">Welcome class!</div>
          <div className="absolute bottom-3 left-6 right-6 h-1 rounded-full bg-[#d6a84f]/50" />
        </div>
        <div className="absolute left-[63%] top-[9%] h-14 w-14 rounded-full border-4 border-[#d6a84f]/70 bg-[#111b31] shadow-xl">
          <span className="absolute left-1/2 top-2 h-5 w-0.5 origin-bottom -translate-x-1/2 rotate-45 rounded bg-[#f4e6c8]" />
          <span className="absolute left-1/2 top-1/2 h-4 w-0.5 origin-top -translate-x-1/2 rounded bg-[#f4e6c8]" />
        </div>
        <div className="absolute right-[8%] top-[9%] grid w-[24%] grid-cols-2 gap-1 rounded-2xl bg-[#101827] p-2 ring-4 ring-[#5e4838]">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="h-8 rounded bg-gradient-to-b from-[#9ec7d6] to-[#29465e]" />
          ))}
        </div>
        <div className="absolute left-[7%] top-[37%] h-14 w-[24%] rounded-xl bg-gradient-to-b from-[#9a653c] to-[#52301f] shadow-xl ring-1 ring-[#f2c66d]/18">
          <div className="absolute -top-2 left-5 h-3 w-12 rounded-full bg-[#caa46b]" />
          <div className="absolute -top-2 right-5 h-3 w-8 rounded-full bg-[#7fae5b]" />
        </div>
        <div className="absolute right-[8%] top-[37%] h-20 w-[18%] rounded-2xl bg-[#442d35] p-2 shadow-xl ring-2 ring-[#d6a84f]/20">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="mb-1 block h-2 rounded bg-[#d6a84f]/45" />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[21%] bg-[repeating-linear-gradient(90deg,#8a623b_0_20px,#745032_20px_40px)]" />
        <div className="absolute bottom-[18%] left-[12%] right-[12%] grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-gradient-to-b from-[#b6864e] to-[#6f4429] shadow-xl ring-1 ring-[#f2c66d]/20">
              <div className="mx-auto mt-2 h-2 w-10 rounded-full bg-[#e0c083]/50" />
              <div className="mx-auto mt-2 h-2 w-8 rounded-full bg-[#1f3850]/45" />
            </div>
          ))}
        </div>
        <Particles kind="dust" n={12} />
      </div>
    );
  }
  if (env === 'coffee') {
    return (
      <div className="absolute inset-0">
        <Sky from="#1b1221" to="#53311f" />
        {realBackground}
        {paletteOverlay}
        <div className="absolute left-[7%] top-[9%] h-[34%] w-[42%] rounded-[24px] bg-gradient-to-b from-[#d0a76d] to-[#5d3826] shadow-[0_14px_36px_rgba(0,0,0,0.35)] ring-8 ring-[#2b1a16]">
          <div className="grid h-full grid-cols-2 gap-1 p-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="rounded-xl bg-gradient-to-b from-[#b9d2d9] to-[#39556b] shadow-inner" />
            ))}
          </div>
        </div>
        <div className="absolute right-[5%] top-[15%] h-[39%] w-[38%] rounded-[24px] bg-gradient-to-b from-[#6a4129] to-[#2d1714] shadow-[0_18px_38px_rgba(0,0,0,0.4)] ring-1 ring-[#d6a84f]/25" />
        <div className="absolute right-[10%] top-[20%] h-[14%] w-[28%] rounded-xl bg-[#172235] p-2 shadow-inner ring-1 ring-[#d6a84f]/30">
          {['Latte', 'Mocha', 'Tea'].map((item) => (
            <div key={item} className="mb-1 flex justify-between text-[8px] font-bold text-[#f4e6c8]/75">
              <span>{item}</span>
              <span>★</span>
            </div>
          ))}
        </div>
        <div className="absolute right-[9%] top-[19%] h-3 w-[30%] rounded-full bg-[#d6a84f] shadow-[0_0_18px_rgba(214,168,79,0.45)]" />
        <div className="absolute right-[17%] top-[25%]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="ts-steam" style={{ left: i * 10, animationDelay: `${i * 0.6}s` }} />
          ))}
        </div>
        <div className="absolute right-[12%] top-[44%] flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="h-4 w-5 rounded-t-full bg-gradient-to-b from-[#f2c66d] to-[#9b5b32] shadow" />
          ))}
        </div>
        <div className="absolute left-[13%] top-[7%] h-10 w-5 rounded-full bg-[#f0c76a] shadow-[0_0_24px_8px_rgba(214,168,79,0.28)]" />
        <div className="absolute left-[64%] top-[8%] h-10 w-5 rounded-full bg-[#f0c76a] shadow-[0_0_24px_8px_rgba(214,168,79,0.28)]" />
        <div className="absolute left-[4%] bottom-[18%] h-24 w-12 rounded-t-full bg-[#2f6f53]/80 shadow-xl">
          <span className="absolute left-4 top-5 h-12 w-4 rounded-full bg-[#7fae5b] -rotate-12" />
          <span className="absolute left-7 top-7 h-10 w-4 rounded-full bg-[#8fbf65] rotate-12" />
          <span className="absolute bottom-0 left-2 h-7 w-8 rounded-t-lg bg-[#6a4129]" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-b from-[#6d452d] to-[#2d1b18]" />
        <div className="absolute bottom-[16%] left-[12%] right-[12%] flex justify-between">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="relative h-14 w-14 rounded-full bg-gradient-to-b from-[#8a5b38] to-[#3b2119] shadow-xl ring-2 ring-[#d6a84f]/18">
              <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#26140f]/55" />
              <span className="absolute -right-2 top-0 h-6 w-6 rounded-full bg-[#3a2238]/85 shadow" />
            </div>
          ))}
        </div>
        <Particles kind="dust" n={10} />
      </div>
    );
  }
  if (env === 'restaurant') {
    return (
      <div className="absolute inset-0">
        <Sky from="#120d1d" to="#54263e" />
        {realBackground}
        {paletteOverlay}
        <div className="absolute left-[6%] right-[6%] top-[5%] h-[9%] rounded-b-3xl bg-[#1b1024] shadow-xl ring-1 ring-[#d6a84f]/20" />
        <div className="absolute left-[16%] top-[11%] h-14 w-14 rounded-full bg-[#d6a84f] opacity-80 blur-xl" />
        <div className="absolute right-[16%] top-[11%] h-14 w-14 rounded-full bg-[#d6a84f] opacity-80 blur-xl" />
        <div className="absolute left-[38%] top-[17%] h-[25%] w-[24%] rounded-t-[28px] bg-gradient-to-b from-[#211425] to-[#0b0711] shadow-2xl ring-1 ring-[#d6a84f]/24">
          <div className="absolute inset-x-4 top-5 h-2 rounded-full bg-[#d6a84f]/50" />
          <div className="absolute inset-x-6 bottom-4 h-16 rounded-t-2xl bg-[#52301f]" />
        </div>
        <div className="absolute left-[8%] top-[28%] h-[36%] w-[24%] rounded-[28px] bg-gradient-to-b from-[#7a2e4a] to-[#2a1426] shadow-2xl ring-1 ring-[#f2c66d]/20" />
        <div className="absolute right-[8%] top-[28%] h-[36%] w-[24%] rounded-[28px] bg-gradient-to-b from-[#7a2e4a] to-[#2a1426] shadow-2xl ring-1 ring-[#f2c66d]/20" />
        <div className="absolute left-[12%] top-[34%] flex gap-2 opacity-70">
          <span className="h-7 w-7 rounded-full bg-[#0b1020] shadow" />
          <span className="h-7 w-7 rounded-full bg-[#27425a] shadow" />
        </div>
        <div className="absolute right-[12%] top-[34%] flex gap-2 opacity-70">
          <span className="h-7 w-7 rounded-full bg-[#3b2c45] shadow" />
          <span className="h-7 w-7 rounded-full bg-[#0b1020] shadow" />
        </div>
        <div className="absolute left-[38%] top-[38%] h-28 w-28 rounded-full bg-gradient-to-b from-[#7b4d35] to-[#2c1716] shadow-2xl ring-2 ring-[#d6a84f]/20" />
        <div className="absolute left-[47%] top-[42%] h-10 w-4 rounded-full bg-[#f0c76a] shadow-[0_0_20px_8px_rgba(214,168,79,0.35)]" />
        <div className="absolute left-[45%] top-[53%] h-4 w-12 rounded-full bg-[#2f6f53]/70 shadow" />
        <div className="absolute left-[7%] bottom-[18%] h-20 w-10 rounded-t-full bg-[#2f6f53]/85 shadow-xl">
          <span className="absolute bottom-0 left-2 h-6 w-7 rounded-t-lg bg-[#6a4129]" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-b from-[#3a2238] to-[#190d1d]" />
        <Particles kind="dust" n={10} />
      </div>
    );
  }
  if (env === 'airport') {
    return (
      <div className="absolute inset-0">
        <Sky from="#0b1427" to="#24435f" />
        {realBackground}
        {paletteOverlay}
        <div className="absolute left-[6%] right-[6%] top-[6%] h-[30%] rounded-[28px] bg-gradient-to-b from-[#b8d8ee] to-[#385875] shadow-2xl ring-4 ring-[#0a1224]">
          <div className="absolute left-[12%] top-[46%] h-4 w-24 rounded-full bg-[#f4e6c8]/65 shadow" />
          <div className="absolute left-[25%] top-[39%] h-8 w-14 rounded-t-full bg-[#f4e6c8]/55" />
          <div className="ts-scenery absolute left-0 top-[28%] text-[#1e344b]/70">
            <svg width="96" height="38" viewBox="0 0 24 24" fill="currentColor"><path d="M2 16l9-2 4-7 2 1-2 6 5-1 1 2-19 4z" /></svg>
          </div>
        </div>
        <div className="absolute right-[8%] top-[40%] h-[18%] w-[28%] rounded-2xl bg-[#0b1020]/88 p-3 shadow-2xl ring-1 ring-[#d6a84f]/30">
          {['SEA', 'LAX', 'JFK'].map((city, i) => (
            <div key={city} className="mb-1 flex items-center justify-between text-[9px] font-black text-[#d6a84f]">
              <span>{city}</span>
              <span className={i === 1 ? 'text-[#b7d6c8]' : 'text-[#f4e6c8]/70'}>On time</span>
            </div>
          ))}
        </div>
        <div className="absolute left-[8%] top-[43%] flex gap-3">
          {['#d6a84f', '#a86a78', '#31536c'].map((color, i) => (
            <span key={color} className="relative h-12 w-9 rounded-lg shadow-xl" style={{ backgroundColor: color }}>
              <span className="absolute -top-2 left-2 h-3 w-5 rounded-t-full border-2 border-[#f4e6c8]/55" />
              <span className="absolute -bottom-2 left-1 h-2 w-2 rounded-full bg-[#0b1020]" />
              <span className="absolute -bottom-2 right-1 h-2 w-2 rounded-full bg-[#0b1020]" />
              {i === 2 && <span className="absolute -right-7 top-2 h-8 w-8 rounded-full bg-[#1b1024]/80" />}
            </span>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[repeating-linear-gradient(90deg,#5f6975_0_28px,#4e5965_28px_56px)]" />
        <div className="absolute bottom-[18%] left-[16%] right-[16%] grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="h-9 rounded-t-2xl bg-gradient-to-b from-[#26394f] to-[#121a2a] shadow-lg ring-1 ring-[#f2c66d]/12" />
          ))}
        </div>
        <Particles kind="dust" n={8} />
      </div>
    );
  }
  if (env === 'wedding') {
    return (
      <div className="absolute inset-0">
        <Sky from="#130c1e" to="#51233c" />
        {realBackground}
        {paletteOverlay}
        <div className="absolute left-0 right-0 top-[8%] flex justify-around">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="ts-star inline-block h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_8px_2px_rgba(251,191,36,0.7)]" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
        <div className="absolute left-[12%] right-[12%] top-[15%] h-[18%] rounded-t-[44px] bg-gradient-to-b from-[#f4e6c8]/85 to-[#7a2e4a]/75 shadow-2xl ring-1 ring-[#d6a84f]/35">
          <div className="absolute left-1/2 top-3 h-14 w-20 -translate-x-1/2 rounded-t-full border-2 border-[#fff5d8]/65" />
        </div>
        <div className="absolute left-[8%] top-[40%] h-[30%] w-[22%] rounded-[28px] bg-gradient-to-b from-[#7a2e4a] to-[#2a1426] shadow-2xl ring-1 ring-[#f2c66d]/20" />
        <div className="absolute right-[8%] top-[40%] h-[30%] w-[22%] rounded-[28px] bg-gradient-to-b from-[#7a2e4a] to-[#2a1426] shadow-2xl ring-1 ring-[#f2c66d]/20" />
        <div className="absolute left-[41%] top-[48%] h-24 w-24 rounded-full bg-gradient-to-b from-[#f4e6c8] to-[#9b6b45] shadow-2xl ring-2 ring-[#d6a84f]/28" />
        <div className="absolute left-[47%] top-[52%] h-8 w-4 rounded-full bg-[#f0c76a] shadow-[0_0_20px_8px_rgba(214,168,79,0.35)]" />
        <div className="absolute inset-x-0 bottom-0 h-[16%] bg-gradient-to-b from-[#3a2238] to-[#160d1f]" />
        <Particles kind="dust" n={12} />
      </div>
    );
  }
  if (env === 'cruise') {
    return (
      <div className="absolute inset-0">
        <Sky from="#241a3a" to="#0f5272" />
        {realBackground}
        {paletteOverlay}
        <div className="absolute left-[58%] top-[9%] h-20 w-20 rounded-full bg-[#f0a85f] shadow-[0_0_60px_rgba(240,168,95,0.5)]" />
        <div className="absolute inset-x-0 top-[31%] bottom-0 bg-gradient-to-b from-[#28799e] via-[#1b5f84] to-[#123d60]" />
        <div className="ts-scenery absolute left-0 right-0 top-[33%] h-3 bg-white/40 opacity-70" />
        <div className="absolute left-[8%] right-[8%] bottom-[10%] h-[34%] rounded-t-[46px] bg-gradient-to-b from-[#f2e1bd] to-[#b78b5c] shadow-2xl ring-1 ring-[#f2c66d]/30" />
        <div className="absolute left-[16%] top-[50%] h-16 w-28 rounded-[28px] bg-gradient-to-b from-[#67b8d4] to-[#1f789d] shadow-xl ring-4 ring-[#fff5d8]/45" />
        <div className="absolute left-[50%] top-[48%] flex gap-3">
          {['#d6a84f', '#a86a78', '#f4e6c8'].map((color, i) => (
            <span key={color} className="h-9 w-16 -rotate-6 rounded-t-2xl shadow-lg" style={{ backgroundColor: color, transform: `rotate(${i % 2 ? 7 : -7}deg)` }} />
          ))}
        </div>
        <div className="absolute right-[10%] top-[36%] h-16 w-24 rounded-t-3xl bg-[#1b1024]/88 shadow-2xl ring-1 ring-[#d6a84f]/24">
          <span className="absolute left-5 top-5 h-8 w-2 rounded-full bg-[#d6a84f]" />
          <span className="absolute left-11 top-3 h-10 w-2 rounded-full bg-[#d6a84f]" />
          <span className="absolute right-5 top-6 h-7 w-2 rounded-full bg-[#d6a84f]" />
        </div>
        <div className="absolute left-[10%] right-[10%] bottom-[8%] h-4 rounded-full bg-[#7a5638]/55" />
        <Particles kind="dust" n={8} />
      </div>
    );
  }
  // theater
  return (
    <div className="absolute inset-0">
      <Sky from="#070817" to="#241a3a" />
      {realBackground}
      {paletteOverlay}
      <div className="absolute left-[5%] top-[14%] rounded-md bg-[#9f2f3e] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#fff5d8] shadow-[0_0_18px_rgba(159,47,62,0.45)]">
        Exit
      </div>
      <div className="absolute right-[5%] top-[14%] rounded-md bg-[#9f2f3e] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#fff5d8] shadow-[0_0_18px_rgba(159,47,62,0.45)]">
        Exit
      </div>
      <div className="absolute left-[7%] right-[7%] top-[6%] h-[34%] rounded-xl bg-gradient-to-b from-[#f6e8b5] to-[#6ea4d1] shadow-[0_0_90px_34px_rgba(155,208,255,0.35)]" />
      <div className="absolute left-[7%] right-[7%] top-[6%] h-[34%] rounded-xl ring-4 ring-[#080712]" />
      <div className="absolute left-[3%] top-[36%] h-[34%] w-2 rounded-full bg-[#d6a84f]/35 shadow-[0_0_20px_rgba(214,168,79,0.35)]" />
      <div className="absolute right-[3%] top-[36%] h-[34%] w-2 rounded-full bg-[#d6a84f]/35 shadow-[0_0_20px_rgba(214,168,79,0.35)]" />
      <div className="absolute left-[13%] right-[13%] top-[43%] grid grid-cols-5 gap-2">
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i} className="relative h-8 rounded-t-2xl bg-gradient-to-b from-[#7a2e4a] to-[#2a1426] shadow-lg ring-1 ring-[#f2c66d]/10">
            <span className="absolute right-1 top-3 h-2 w-2 rounded-full bg-[#d6a84f]/45" />
          </span>
        ))}
      </div>
      <div className="absolute bottom-[14%] right-[10%] h-14 w-11 rounded-b-xl rounded-t-sm bg-[#d43f4b] shadow-xl ring-1 ring-white/20">
        <div className="grid grid-cols-3 gap-0.5 p-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="h-1.5 rounded-full bg-[#f6e8b5]" />
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[16%] bg-gradient-to-b from-[#120f22] to-[#060713]" />
      <Particles kind="dust" n={8} />
    </div>
  );
};

export default EnvScene;
