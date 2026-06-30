import React from 'react';
import type { ShopItem } from './lifeData';

export const ShopItemPreview: React.FC<{ item: ShopItem }> = ({ item }) => (
  <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_30%_18%,rgba(246,217,141,0.16),transparent_34%),linear-gradient(145deg,#111827,#2a2038_58%,#091525)]">
    <span className="absolute inset-x-0 bottom-0 h-5 bg-black/18" />
    {renderPreview(item)}
  </div>
);

export const PetPreview: React.FC<{ kind: string }> = ({ kind }) => {
  const palette = petPalette(kind);
  if (kind === 'duck') {
    return (
      <div className="absolute inset-0">
        <span className="absolute bottom-[18%] left-[32%] h-[34%] w-[38%] rounded-[48%] shadow-xl" style={{ background: palette.body }} />
        <span className="absolute bottom-[44%] left-[50%] h-[25%] w-[24%] rounded-full shadow-lg" style={{ background: palette.body }} />
        <span className="absolute bottom-[49%] left-[70%] h-[9%] w-[15%] rounded-full bg-[#e88c3d]" />
        <span className="absolute bottom-[52%] left-[58%] h-1.5 w-1.5 rounded-full bg-[#15101f]" />
        <span className="absolute bottom-[13%] left-[31%] h-[7%] w-[13%] rounded-full bg-[#e88c3d]" />
        <span className="absolute bottom-[13%] left-[58%] h-[7%] w-[13%] rounded-full bg-[#e88c3d]" />
      </div>
    );
  }
  if (kind === 'bot') {
    return (
      <div className="absolute inset-0">
        <span className="absolute bottom-[20%] left-[31%] h-[35%] w-[38%] rounded-xl border border-white/20 shadow-xl" style={{ background: palette.body }} />
        <span className="absolute bottom-[56%] left-[36%] h-[24%] w-[28%] rounded-lg border border-white/20" style={{ background: palette.head }} />
        <span className="absolute bottom-[78%] left-[49%] h-[9%] w-px bg-[#d6a84f]" />
        <span className="absolute bottom-[85%] left-[47%] h-1.5 w-1.5 rounded-full bg-[#d6a84f]" />
        <span className="absolute bottom-[65%] left-[42%] h-1.5 w-1.5 rounded-full bg-[#75d7ff]" />
        <span className="absolute bottom-[65%] left-[56%] h-1.5 w-1.5 rounded-full bg-[#75d7ff]" />
      </div>
    );
  }
  if (kind === 'dragon') {
    return (
      <div className="absolute inset-0">
        <span className="absolute bottom-[28%] left-[21%] h-[25%] w-[24%] -rotate-12 rounded-[65%_20%_65%_20%] bg-[#6b4aa2]/85 shadow-lg" />
        <span className="absolute bottom-[28%] right-[21%] h-[25%] w-[24%] rotate-12 rounded-[20%_65%_20%_65%] bg-[#6b4aa2]/85 shadow-lg" />
        <span className="absolute bottom-[19%] left-[34%] h-[35%] w-[35%] rounded-[48%] shadow-xl" style={{ background: palette.body }} />
        <span className="absolute bottom-[50%] left-[39%] h-[26%] w-[25%] rounded-full shadow-lg" style={{ background: palette.head }} />
        <span className="absolute bottom-[73%] left-[39%] h-[8%] w-[7%] rotate-45 bg-[#f6d98d]" />
        <span className="absolute bottom-[73%] left-[57%] h-[8%] w-[7%] rotate-45 bg-[#f6d98d]" />
        <span className="absolute bottom-[60%] left-[47%] h-1.5 w-1.5 rounded-full bg-[#15101f]" />
        <span className="absolute bottom-[60%] left-[56%] h-1.5 w-1.5 rounded-full bg-[#15101f]" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <span className="absolute bottom-[17%] left-[30%] h-[34%] w-[42%] rounded-[48%] shadow-xl" style={{ background: palette.body }} />
      <span className="absolute bottom-[47%] left-[36%] h-[28%] w-[30%] rounded-full shadow-lg" style={{ background: palette.head }} />
      {kind !== 'ham' && (
        <>
          <span className="absolute bottom-[70%] left-[38%] h-[12%] w-[10%] rotate-45 rounded-sm" style={{ background: palette.head }} />
          <span className="absolute bottom-[70%] left-[55%] h-[12%] w-[10%] rotate-45 rounded-sm" style={{ background: palette.head }} />
        </>
      )}
      {kind === 'dog' && <span className="absolute bottom-[53%] left-[63%] h-[14%] w-[8%] rotate-12 rounded-full bg-[#5b3826]" />}
      {kind === 'fox' && <span className="absolute bottom-[24%] left-[66%] h-[10%] w-[23%] rotate-[24deg] rounded-full bg-[#f6d98d]" />}
      {kind === 'cat' && <span className="absolute bottom-[25%] left-[66%] h-[7%] w-[22%] rotate-[20deg] rounded-full" style={{ background: palette.head }} />}
      {kind === 'ham' && (
        <>
          <span className="absolute bottom-[69%] left-[38%] h-[9%] w-[9%] rounded-full" style={{ background: palette.head }} />
          <span className="absolute bottom-[69%] left-[57%] h-[9%] w-[9%] rounded-full" style={{ background: palette.head }} />
        </>
      )}
      <span className="absolute bottom-[57%] left-[45%] h-1.5 w-1.5 rounded-full bg-[#15101f]" />
      <span className="absolute bottom-[57%] left-[56%] h-1.5 w-1.5 rounded-full bg-[#15101f]" />
    </div>
  );
};

function renderPreview(item: ShopItem): React.ReactNode {
  if (item.kind === 'pet') return <PetPreview kind={item.preview} />;
  if (item.kind === 'furniture') return <FurniturePreview preview={item.preview} />;
  if (item.kind === 'decor') return <DecorPreview preview={item.preview} />;
  if (item.kind === 'cosmetic') return <CosmeticPreview preview={item.preview} />;
  if (item.kind === 'view') return <ViewPreview preview={item.preview} />;
  if (item.kind === 'wallpaper') return <WallpaperPreview preview={item.preview} />;
  if (item.kind === 'floor') return <FloorPreview preview={item.preview} />;
  if (item.kind === 'music') return <MusicPackPreview preview={item.preview} />;
  if (item.kind === 'victory') return <VictoryPreview preview={item.preview} />;
  if (item.kind === 'trail') return <TrailPreview preview={item.preview} />;
  return <DecorPreview preview={item.preview} />;
}

const FurniturePreview: React.FC<{ preview: string }> = ({ preview }) => {
  if (preview === 'table') {
    return (
      <>
        <span className="absolute bottom-[25%] left-[28%] h-[10%] w-[44%] rounded-full bg-[#9b6d3d] shadow-xl" />
        <span className="absolute bottom-[13%] left-[34%] h-[16%] w-1.5 rounded bg-[#5c3a22]" />
        <span className="absolute bottom-[13%] right-[34%] h-[16%] w-1.5 rounded bg-[#5c3a22]" />
        <span className="absolute bottom-[37%] left-[46%] h-[9%] w-[9%] rounded-full bg-[#f6d98d]/80" />
      </>
    );
  }
  if (preview === 'bed') {
    return (
      <>
        <span className="absolute bottom-[18%] left-[18%] h-[27%] w-[64%] rounded-xl bg-[#6a4a75] shadow-xl" />
        <span className="absolute bottom-[36%] left-[20%] h-[16%] w-[23%] rounded-lg bg-[#eadfcb]" />
        <span className="absolute bottom-[16%] left-[16%] h-[8%] w-[68%] rounded bg-[#3d2b32]" />
      </>
    );
  }
  if (preview === 'books') {
    return (
      <>
        <span className="absolute bottom-[13%] left-[25%] h-[54%] w-[50%] rounded-lg bg-[#5d3b25] shadow-xl" />
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="absolute bottom-[19%] h-[40%] w-[7%] rounded-sm" style={{ left: `${30 + i * 10}%`, background: ['#d6a84f', '#a86a78', '#9fb6d9', '#729d58'][i] }} />
        ))}
        <span className="absolute bottom-[38%] left-[28%] h-1 w-[44%] bg-black/30" />
      </>
    );
  }
  if (preview === 'tv') {
    return (
      <>
        <span className="absolute bottom-[31%] left-[24%] h-[34%] w-[52%] rounded-lg border-4 border-[#15101f] bg-[linear-gradient(135deg,#314b66,#101827)] shadow-xl" />
        <span className="absolute bottom-[23%] left-[46%] h-[10%] w-[8%] rounded bg-[#15101f]" />
        <span className="absolute bottom-[20%] left-[36%] h-1.5 w-[28%] rounded bg-[#15101f]" />
      </>
    );
  }
  if (preview === 'chair') {
    return (
      <>
        <span className="absolute bottom-[24%] left-[34%] h-[23%] w-[32%] rounded-xl bg-[#7b3149] shadow-xl" />
        <span className="absolute bottom-[44%] left-[36%] h-[26%] w-[28%] rounded-t-2xl bg-[#a86a78]" />
        <span className="absolute bottom-[12%] left-[48%] h-[14%] w-1.5 rounded bg-[#15101f]" />
        <span className="absolute bottom-[10%] left-[38%] h-1.5 w-[24%] rounded bg-[#15101f]" />
      </>
    );
  }
  if (preview === 'desk') {
    return (
      <>
        <span className="absolute bottom-[25%] left-[19%] h-[9%] w-[62%] rounded bg-[#8a5a2b] shadow-xl" />
        <span className="absolute bottom-[13%] left-[25%] h-[15%] w-1.5 rounded bg-[#4c311f]" />
        <span className="absolute bottom-[13%] right-[25%] h-[15%] w-1.5 rounded bg-[#4c311f]" />
        <span className="absolute bottom-[36%] left-[39%] h-[23%] w-[22%] rounded border-2 border-[#15101f] bg-[#9fb6d9]/70" />
        <span className="absolute bottom-[34%] left-[30%] h-1.5 w-[38%] rounded bg-[#d6a84f]/70" />
      </>
    );
  }
  if (preview === 'coffee') {
    return (
      <>
        <span className="absolute bottom-[18%] left-[29%] h-[44%] w-[34%] rounded-xl bg-[#2e3544] shadow-xl ring-1 ring-white/15" />
        <span className="absolute bottom-[47%] left-[35%] h-[9%] w-[22%] rounded bg-[#d6a84f]" />
        <span className="absolute bottom-[28%] left-[38%] h-[15%] w-[16%] rounded-b-lg bg-[#15101f]" />
        <span className="absolute bottom-[16%] left-[40%] h-[13%] w-[16%] rounded-b-full border-2 border-[#fff5d8]/70 bg-[#6a4129]" />
        <span className="absolute bottom-[31%] left-[64%] h-[20%] w-1.5 rounded bg-[#a9a0b5]" />
      </>
    );
  }
  return (
    <>
      <span className="absolute bottom-[21%] left-[18%] h-[25%] w-[64%] rounded-2xl bg-[linear-gradient(180deg,#6a4a38,#2e211a)] shadow-xl" />
      <span className="absolute bottom-[43%] left-[24%] h-[24%] w-[52%] rounded-t-2xl bg-[linear-gradient(180deg,#8a6a50,#493426)]" />
      <span className="absolute bottom-[15%] left-[27%] h-[8%] w-[8%] rounded-full bg-black/40" />
      <span className="absolute bottom-[15%] right-[27%] h-[8%] w-[8%] rounded-full bg-black/40" />
    </>
  );
};

const DecorPreview: React.FC<{ preview: string }> = ({ preview }) => {
  if (preview === 'plant') return <><span className="absolute bottom-[18%] left-[43%] h-[25%] w-[14%] rounded-t-full bg-[#4f7e47]" /><span className="absolute bottom-[30%] left-[34%] h-[20%] w-[18%] -rotate-12 rounded-full bg-[#729d58]" /><span className="absolute bottom-[30%] right-[34%] h-[20%] w-[18%] rotate-12 rounded-full bg-[#729d58]" /><span className="absolute bottom-[13%] left-[38%] h-[14%] w-[24%] rounded-t-lg bg-[#6a4129]" /></>;
  if (preview === 'art') return <><span className="absolute bottom-[24%] left-[29%] h-[48%] w-[42%] rounded-lg border-4 border-[#8a5a2b] bg-[linear-gradient(135deg,#9fb6d9,#d6a84f_54%,#a86a78)] shadow-xl" /><span className="absolute bottom-[45%] left-[43%] h-[13%] w-[13%] rounded-full bg-[#fff5d8]/80" /></>;
  if (preview === 'fish') return <><span className="absolute bottom-[22%] left-[22%] h-[39%] w-[56%] rounded-xl border-2 border-[#9fb6d9]/70 bg-[#1f5266]/70 shadow-xl" /><span className="absolute bottom-[38%] left-[38%] h-[12%] w-[22%] rounded-full bg-[#f0c76a]" /><span className="absolute bottom-[39%] left-[58%] h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-[#f0c76a]" /><span className="absolute bottom-[29%] left-[27%] h-1.5 w-1.5 rounded-full bg-white/60" /><span className="absolute bottom-[49%] left-[70%] h-1 w-1 rounded-full bg-white/60" /></>;
  if (preview === 'fire') return <><span className="absolute bottom-[14%] left-[26%] h-[17%] w-[48%] rounded-t-lg bg-[#5a3925]" /><span className="absolute bottom-[28%] left-[38%] h-[30%] w-[24%] rounded-full bg-[#f0c76a] shadow-[0_0_18px_rgba(240,199,106,0.7)]" /><span className="absolute bottom-[31%] left-[45%] h-[20%] w-[13%] rounded-full bg-[#a86a78]" /></>;
  if (preview === 'rug') return <span className="absolute bottom-[15%] left-[22%] h-[30%] w-[56%] rounded-[50%] bg-[radial-gradient(circle,#d6a84f_0_18%,#a86a78_19%_45%,#35213a_46%)] shadow-xl" />;
  if (preview === 'petbed') return <><span className="absolute bottom-[16%] left-[25%] h-[27%] w-[50%] rounded-[50%] bg-[#6a4a75] shadow-xl" /><span className="absolute bottom-[22%] left-[34%] h-[16%] w-[32%] rounded-[50%] bg-[#eadfcb]/80" /></>;
  if (preview === 'neon') return <><span className="absolute bottom-[29%] left-[24%] h-[32%] w-[52%] rounded-xl border-2 border-[#d6a84f] shadow-[0_0_18px_rgba(214,168,79,0.6)]" /><span className="absolute bottom-[41%] left-[35%] h-1 w-[30%] rounded bg-[#a86a78] shadow-[0_0_12px_rgba(168,106,120,0.8)]" /></>;
  return <span className="absolute bottom-[20%] left-[30%] h-[42%] w-[40%] rounded-2xl bg-[#d6a84f]/35 shadow-xl" />;
};

const CosmeticPreview: React.FC<{ preview: string }> = ({ preview }) => {
  if (preview === 'coat' || preview === 'rain' || preview === 'gold') {
    const color =
      preview === 'rain' ? '#5d7896' : preview === 'gold' ? '#d6a84f' : '#6a4a75';
    return (
      <>
        <span className="absolute bottom-[16%] left-[35%] h-[44%] w-[30%] rounded-t-2xl shadow-xl" style={{ background: color }} />
        <span className="absolute bottom-[46%] left-[39%] h-[15%] w-[22%] rounded-full bg-[#d6c7ad]" />
        <span className="absolute bottom-[36%] left-[30%] h-[24%] w-[9%] -rotate-12 rounded-full" style={{ background: color }} />
        <span className="absolute bottom-[36%] right-[30%] h-[24%] w-[9%] rotate-12 rounded-full" style={{ background: color }} />
        {preview === 'rain' && <span className="absolute bottom-[59%] left-[37%] h-[13%] w-[26%] rounded-t-full bg-[#24384c]" />}
        {preview === 'gold' && <span className="absolute bottom-[31%] left-[39%] h-1.5 w-[22%] rounded-full bg-[#fff5d8]/75" />}
      </>
    );
  }
  if (preview === 'hat' || preview === 'beret' || preview === 'moon') return <><span className="absolute bottom-[32%] left-[28%] h-[18%] w-[44%] rounded-full bg-[#a86a78] shadow-xl" /><span className="absolute bottom-[47%] left-[36%] h-[15%] w-[30%] rounded-t-full bg-[#6a4a75]" />{preview === 'moon' && <span className="absolute bottom-[50%] left-[54%] h-3 w-3 rounded-full bg-[#f6d98d] shadow-[0_0_12px_rgba(246,217,141,0.7)]" />}</>;
  if (preview === 'glasses') return <><span className="absolute bottom-[41%] left-[29%] h-[19%] w-[19%] rounded-full border-4 border-[#d6a84f] shadow-xl" /><span className="absolute bottom-[41%] right-[29%] h-[19%] w-[19%] rounded-full border-4 border-[#d6a84f] shadow-xl" /><span className="absolute bottom-[49%] left-[47%] h-1 w-[6%] bg-[#d6a84f]" /></>;
  if (preview === 'star') return <span className="absolute bottom-[30%] left-[38%] h-[34%] w-[24%] bg-[#f6d98d] shadow-[0_0_18px_rgba(246,217,141,0.6)]" style={{ clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)' }} />;
  if (preview === 'scarf') return <><span className="absolute bottom-[42%] left-[32%] h-[14%] w-[36%] rounded-full bg-[#a86a78] shadow-xl" /><span className="absolute bottom-[20%] left-[55%] h-[30%] w-[9%] rotate-12 rounded bg-[#a86a78]" /></>;
  return <><span className="absolute bottom-[15%] left-[36%] h-[42%] w-[28%] rounded-t-2xl bg-[#6a4a75] shadow-xl" /><span className="absolute bottom-[47%] left-[39%] h-[16%] w-[22%] rounded-full bg-[#d6c7ad]" /></>;
};

const ViewPreview: React.FC<{ preview: string }> = ({ preview }) => {
  if (preview === 'ocean') return <><span className="absolute inset-0 bg-[linear-gradient(180deg,#7aa5c7_0_45%,#1f5c73_46%_68%,#d6a84f_69%)]" /><span className="absolute bottom-[36%] left-0 h-2 w-full bg-white/50" /></>;
  if (preview === 'mountain') return <><span className="absolute inset-0 bg-[linear-gradient(180deg,#526b86,#101827)]" /><span className="absolute bottom-[18%] left-[12%] h-[42%] w-[36%] rotate-45 bg-[#293342]" /><span className="absolute bottom-[14%] right-[10%] h-[48%] w-[42%] rotate-45 bg-[#3b4a4d]" /></>;
  return <><span className="absolute inset-0 bg-[linear-gradient(180deg,#475c76,#101827)]" /><span className="absolute inset-y-3 left-1/2 w-px bg-white/30" /><span className="absolute left-0 top-[32%] h-px w-full bg-white/25" />{preview === 'rain' && <span className="absolute inset-0 bg-[repeating-linear-gradient(110deg,transparent_0_10px,rgba(255,255,255,0.32)_11px_12px)]" />}</>;
};

const WallpaperPreview: React.FC<{ preview: string }> = ({ preview }) => {
  const bg = preview === 'forest' ? 'linear-gradient(135deg,#10231b,#31543a)' : preview === 'plum' ? 'linear-gradient(135deg,#191527,#55335c)' : 'linear-gradient(135deg,#111827,#22365c)';
  return <div className="absolute inset-0" style={{ background: bg }}><span className="absolute inset-3 rounded-xl border border-white/10" /></div>;
};

const FloorPreview: React.FC<{ preview: string }> = ({ preview }) => (
  <div className={preview === 'rug' ? 'absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,#a86a78_0_26%,#604326_27%_45%,#2f2117_46%)]' : 'absolute inset-0 bg-[repeating-linear-gradient(105deg,#8a623b_0_18px,#5c4026_18px_36px)]'} />
);

const MusicPackPreview: React.FC<{ preview: string }> = ({ preview }) => (
  <>
    <span className="absolute bottom-[22%] left-[28%] h-[42%] w-[44%] rounded-full border-4 border-[#d6a84f]/60 bg-black/30 shadow-[0_0_18px_rgba(214,168,79,0.2)]" />
    <span className="absolute bottom-[35%] left-[41%] h-[16%] w-[18%] rounded-full bg-[#d6a84f]/70" />
    {preview === 'music' && <span className="absolute bottom-[54%] left-[62%] h-5 w-3 rounded-t-full border-r-2 border-t-2 border-[#f6d98d]" />}
  </>
);

const VictoryPreview: React.FC<{ preview: string }> = ({ preview }) => (
  <>
    <span className="absolute bottom-[29%] left-[38%] h-[34%] w-[24%] bg-[#f6d98d] shadow-[0_0_18px_rgba(246,217,141,0.6)]" style={{ clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)' }} />
    {preview === 'moon' && <span className="absolute bottom-[50%] left-[56%] h-5 w-5 rounded-full bg-[#9fb6d9] shadow-[0_0_14px_rgba(159,182,217,0.55)]" />}
  </>
);

const TrailPreview: React.FC<{ preview: string }> = ({ preview }) => (
  <>
    {[0, 1, 2, 3].map((i) => (
      <span key={i} className="absolute rounded-full shadow-[0_0_12px_rgba(246,217,141,0.4)]" style={{ bottom: `${18 + i * 10}%`, left: `${22 + i * 12}%`, width: 9 + i * 2, height: 9 + i * 2, background: preview === 'leaf' ? '#729d58' : '#f6d98d' }} />
    ))}
  </>
);

function petPalette(kind: string): { body: string; head: string } {
  if (kind === 'dog') return { body: '#b98a60', head: '#c08355' };
  if (kind === 'ham') return { body: '#caa17b', head: '#d9b58f' };
  if (kind === 'duck') return { body: '#d8b45f', head: '#e4c86d' };
  if (kind === 'bot') return { body: '#66798d', head: '#8fa6bd' };
  if (kind === 'fox') return { body: '#b96e42', head: '#d27b3f' };
  if (kind === 'dragon') return { body: '#5d8f68', head: '#78ad78' };
  return { body: '#d6c7ad', head: '#e3d5bd' };
}
