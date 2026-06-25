import React from 'react';
import type { EnvironmentId } from './types';

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

const EnvScene: React.FC<{ env: EnvironmentId }> = ({ env }) => {
  if (env === 'bus') {
    return (
      <div className="absolute inset-0">
        <Sky from="#bfe3ff" to="#7cb8e8" />
        <div className="absolute left-0 right-0 top-[14%] h-[14%] overflow-hidden opacity-70">
          <div className="ts-scenery flex h-full items-end gap-10 px-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-t-xl bg-[#7fae6b]" style={{ width: 40 + (i % 3) * 16, height: 30 + (i % 4) * 20 }} />
            ))}
          </div>
        </div>
        <div className="absolute inset-x-3 bottom-0 top-[10%] rounded-t-[40px] bg-[#f4e7cf] shadow-2xl ring-1 ring-black/5" />
        <div className="absolute inset-x-6 top-[28%] bottom-3 rounded-t-[28px] bg-[#fbf3e2]" />
        <Particles kind="dust" n={10} />
      </div>
    );
  }
  if (env === 'classroom') {
    return (
      <div className="absolute inset-0">
        <Sky from="#fdf0d5" to="#f3d8a8" />
        <div className="absolute left-[10%] right-[10%] top-[6%] h-[20%] rounded-xl bg-[#33493f] shadow-lg ring-4 ring-[#a9794a]" />
        <div className="absolute left-[14%] top-[9%] text-[#dfeee4]/70 text-sm font-handw">Welcome class!</div>
        <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[#caa56e]" />
        <Particles kind="dust" n={12} />
      </div>
    );
  }
  if (env === 'coffee') {
    return (
      <div className="absolute inset-0">
        <Sky from="#f6e6d4" to="#e3c4a0" />
        <div className="absolute left-[8%] top-[8%] h-[36%] w-[42%] rounded-2xl bg-gradient-to-b from-[#cfe8ff] to-[#9fc8ee] ring-8 ring-[#7a4f2c]" />
        <div className="absolute right-[6%] top-[14%] h-[44%] w-[34%] rounded-xl bg-[#5b3a22] shadow-lg" />
        <div className="absolute right-[20%] top-[24%]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="ts-steam" style={{ left: i * 10, animationDelay: `${i * 0.6}s` }} />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[16%] bg-[#7a5638]" />
        <Particles kind="dust" n={10} />
      </div>
    );
  }
  if (env === 'restaurant') {
    return (
      <div className="absolute inset-0">
        <Sky from="#3a2440" to="#6d3f59" />
        <div className="absolute left-[12%] top-[10%] h-16 w-16 rounded-full bg-[#ffcaa0] blur-xl opacity-70" />
        <div className="absolute right-[12%] top-[10%] h-16 w-16 rounded-full bg-[#ffcaa0] blur-xl opacity-70" />
        <div className="absolute left-[6%] right-[6%] top-[6%] h-[8%] rounded-b-2xl bg-[#2c1a30]" />
        <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[#3a2238]" />
        <Particles kind="dust" n={10} />
      </div>
    );
  }
  if (env === 'airport') {
    return (
      <div className="absolute inset-0">
        <Sky from="#cfe3f7" to="#9bb8d6" />
        {/* big terminal window with a plane */}
        <div className="absolute left-[8%] right-[8%] top-[6%] h-[26%] rounded-xl bg-gradient-to-b from-[#dff0ff] to-[#a9cdec] ring-4 ring-[#cfd6de]" />
        <div className="ts-scenery absolute left-[10%] top-[12%] text-[#5b7088]">
          <svg width="60" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2 16l9-2 4-7 2 1-2 6 5-1 1 2-19 4z" /></svg>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[16%] bg-[#b9c2cc]" />
        <Particles kind="dust" n={8} />
      </div>
    );
  }
  if (env === 'wedding') {
    return (
      <div className="absolute inset-0">
        <Sky from="#fbe7ef" to="#f3cfe0" />
        {/* string lights */}
        <div className="absolute left-0 right-0 top-[8%] flex justify-around">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="ts-star inline-block h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_8px_2px_rgba(251,191,36,0.7)]" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
        <div className="absolute left-[10%] right-[10%] top-[14%] h-[16%] rounded-2xl bg-[#f7d9e6] ring-4 ring-white/60" />
        <div className="absolute inset-x-0 bottom-0 h-[16%] bg-[#e3b9cd]" />
        <Particles kind="dust" n={12} />
      </div>
    );
  }
  if (env === 'cruise') {
    return (
      <div className="absolute inset-0">
        <Sky from="#bfe9ff" to="#5fb6d8" />
        {/* ocean */}
        <div className="absolute inset-x-0 top-[30%] bottom-0 bg-gradient-to-b from-[#3f9fc4] to-[#2b7fa8]" />
        <div className="ts-scenery absolute left-0 right-0 top-[30%] h-3 opacity-50 bg-white/40" />
        <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[#e7d8b8]" />
        <Particles kind="dust" n={8} />
      </div>
    );
  }
  // theater
  return (
    <div className="absolute inset-0">
      <Sky from="#161427" to="#241a3a" />
      <div className="absolute left-[8%] right-[8%] top-[6%] h-[34%] rounded-lg bg-gradient-to-b from-[#fff4cf] to-[#9bd0ff] shadow-[0_0_80px_30px_rgba(155,208,255,0.45)]" />
      <div className="absolute left-[8%] right-[8%] top-[6%] h-[34%] rounded-lg ring-4 ring-[#0c0a18]" />
      <div className="absolute inset-x-0 bottom-0 h-[16%] bg-[#120f22]" />
      <Particles kind="dust" n={8} />
    </div>
  );
};

export default EnvScene;
