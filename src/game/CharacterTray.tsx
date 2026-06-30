import React from 'react';
import { useGame } from './GameProvider';
import { useDrag } from './DragLayer';
import Avatar from './Avatar';
import ClueIcon from './ClueIcon';
import { clueIcon, clueText } from './constraints';

const CharacterTray: React.FC = () => {
  const { level, placement, progress, violations } = useGame();
  const { startDrag, draggingId } = useDrag();
  if (!level) return null;

  const nameOf = (id: string) =>
    level.characters.find((c) => c.id === id)?.name ?? '?';
  const unplaced = level.characters.filter((c) => !placement[c.id]);

  return (
    <div
      data-tray
      className="safe-bottom-tray relative z-30 w-full rounded-t-[28px] border-t border-[#d6a84f]/24 bg-[linear-gradient(180deg,rgba(18,18,38,0.94),rgba(32,22,45,0.96))] px-3 pt-3 text-[#f8edd2] shadow-[0_-16px_42px_rgba(0,0,0,0.38),0_0_28px_rgba(214,168,79,0.08)] backdrop-blur-xl"
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d6a84f]">
          {unplaced.length > 0
            ? `Seat everyone · ${unplaced.length} left`
            : 'Everyone is seated!'}
        </p>
        <span className="rounded-full border border-[#d6a84f]/22 bg-[#d6a84f]/12 px-2 py-1 text-[10px] font-extrabold text-[#f6d98d]">
          Clues
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {unplaced.length === 0 && (
          <div className="flex h-[104px] flex-1 items-center justify-center rounded-3xl border border-white/10 bg-white/8 text-sm font-bold text-[#a9a0b5] shadow-inner">
            Tray empty — nicely done.
          </div>
        )}
        {unplaced.map((c) => (
          <div
            key={c.id}
            className={`group relative flex w-[118px] shrink-0 flex-col items-center rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,245,216,0.12),rgba(214,168,79,0.08))] p-2.5 shadow-[0_12px_26px_rgba(0,0,0,0.28)] ring-1 ring-[#d6a84f]/14 transition ${
              draggingId === c.id ? 'opacity-30' : 'hover:-translate-y-0.5'
            }`}
          >
            <button
              type="button"
              onPointerDown={(e) => startDrag({ charId: c.id, hue: c.hue }, e)}
              className="touch-none"
              aria-label={`Drag ${c.name}`}
            >
              <div className="rounded-full bg-[#fff5d8] p-0.5 shadow-[0_0_16px_rgba(214,168,79,0.18)] ring-1 ring-[#d6a84f]/35">
                <Avatar
                  hue={c.hue}
                  size={48}
                  mood={violations.has(c.id) ? 'sad' : 'idle'}
                  {...progress.customization.characterAvatar}
                />
              </div>
            </button>
            <p className="mt-1 max-w-full truncate text-[11px] font-bold text-[#fff5d8]">
              {c.name}
            </p>
            <p className="max-w-full truncate text-[10px] font-semibold text-[#a9a0b5]">
              {c.trait}
            </p>
            <div className="mt-1 grid w-full gap-1 text-[#d9cda9]">
              {c.constraints.slice(0, 2).map((cl, i) => (
                <span
                  key={i}
                  title={clueText(cl, nameOf)}
                  className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#050816]/45 px-1.5 py-1 text-[9px] font-bold text-[#eadfcb] shadow-inner"
                >
                  <ClueIcon name={clueIcon(cl)} size={12} />
                  <span className="truncate">{clueText(cl, nameOf)}</span>
                </span>
              ))}
              {c.constraints.length > 2 && (
                <span className="rounded-xl border border-white/10 bg-white/8 px-1.5 py-0.5 text-center text-[9px] font-bold text-[#a9a0b5]">
                  +{c.constraints.length - 2} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterTray;
