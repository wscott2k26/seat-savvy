import React from 'react';
import { useGame } from './GameProvider';
import { useDrag } from './DragLayer';
import Avatar from './Avatar';
import ClueIcon from './ClueIcon';
import { clueIcon, clueText } from './constraints';

const CharacterTray: React.FC = () => {
  const { level, placement, violations } = useGame();
  const { startDrag, draggingId } = useDrag();
  if (!level) return null;

  const nameOf = (id: string) =>
    level.characters.find((c) => c.id === id)?.name ?? '?';
  const unplaced = level.characters.filter((c) => !placement[c.id]);

  return (
    <div
      data-tray
      className="relative z-30 w-full rounded-t-3xl border-t border-white/40 bg-white/80 px-3 pb-4 pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl"
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
          {unplaced.length > 0
            ? `Seat everyone \u00b7 ${unplaced.length} left`
            : 'Everyone is seated!'}
        </p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {unplaced.length === 0 && (
          <div className="flex h-[92px] flex-1 items-center justify-center text-sm font-medium text-stone-400">
            Tray empty \u2014 nicely done.
          </div>
        )}
        {unplaced.map((c) => (
          <div
            key={c.id}
            className={`group relative flex w-[88px] shrink-0 flex-col items-center rounded-2xl bg-gradient-to-b from-amber-50 to-orange-100 p-2 shadow-sm ring-1 ring-orange-200 transition ${
              draggingId === c.id ? 'opacity-30' : 'hover:-translate-y-0.5'
            }`}
          >
            <button
              type="button"
              onPointerDown={(e) => startDrag({ charId: c.id, hue: c.hue }, e)}
              className="touch-none"
              aria-label={`Drag ${c.name}`}
            >
              <div className="rounded-full bg-white p-0.5 shadow ring-1 ring-white">
                <Avatar
                  hue={c.hue}
                  size={48}
                  mood={violations.has(c.id) ? 'sad' : 'idle'}
                />
              </div>
            </button>
            <p className="mt-1 max-w-full truncate text-[11px] font-bold text-stone-700">
              {c.name}
            </p>
            <div className="mt-0.5 flex flex-wrap items-center justify-center gap-0.5 text-stone-500">
              {c.constraints.map((cl, i) => (
                <span
                  key={i}
                  title={clueText(cl, nameOf)}
                  className="rounded bg-white/70 p-0.5"
                >
                  <ClueIcon name={clueIcon(cl)} size={12} />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterTray;
