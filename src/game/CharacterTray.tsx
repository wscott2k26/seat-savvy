import React, { useMemo } from 'react';
import { useGame } from './GameProvider';
import { useDrag } from './DragLayer';
import Avatar from './Avatar';
import ClueIcon from './ClueIcon';
import { clueIcon, clueText } from './constraints';
import { characterLook } from './characterLooks';

type TrayCharacter = NonNullable<ReturnType<typeof useGame>['level']>['characters'][number];

function makeSeed(levelId: number, count: number): number {
  return (levelId * 2654435761 + count * 1013904223) >>> 0;
}

function shuffledTray(characters: TrayCharacter[], levelId: number): TrayCharacter[] {
  const shuffled = characters.slice();
  let state = makeSeed(levelId, characters.length) || 1;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Avoid the giveaway where the first tray card still belongs in the first seat,
  // second card still belongs in the second seat, etc. If any card lands back in
  // its original source slot, rotate it forward so the whole tray starts mixed.
  if (shuffled.length > 2) {
    for (let i = 0; i < shuffled.length; i += 1) {
      if (shuffled[i].id !== characters[i]?.id) continue;
      const swapIndex = (i + 2) % shuffled.length;
      [shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]];
    }
  }

  return shuffled;
}

const CharacterTray: React.FC = () => {
  const { level, placement, violations } = useGame();
  const { startDrag, draggingId } = useDrag();
  if (!level) return null;

  const nameOf = (id: string) =>
    level.characters.find((c) => c.id === id)?.name ?? '?';

  const trayOrder = useMemo(
    () => shuffledTray(level.characters, level.id),
    [level.characters, level.id],
  );

  const unplaced = useMemo(
    () => trayOrder.filter((c) => !placement[c.id]),
    [trayOrder, placement],
  );

  return (
    <div
      data-tray
      className="safe-bottom-tray relative z-30 w-full rounded-t-[28px] border-t border-[#d6a84f]/24 bg-[linear-gradient(180deg,rgba(18,18,38,0.94),rgba(32,22,45,0.96))] px-3 pt-3 text-[#f8edd2] shadow-[0_-16px_42px_rgba(0,0,0,0.38),0_0_28px_rgba(214,168,79,0.08)] backdrop-blur-xl"
    >
      <div className="mb-2 flex items-center justify-between gap-2 px-1">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d6a84f]">
          {unplaced.length > 0
            ? `Seat everyone - ${unplaced.length} left`
            : 'Everyone is seated!'}
        </p>
        <span className="rounded-full border border-[#d6a84f]/22 bg-[#d6a84f]/12 px-2 py-1 text-[10px] font-extrabold text-[#f6d98d]">
          Mixed clues
        </span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-2 pr-6 snap-x snap-mandatory">
        {unplaced.length === 0 && (
          <div className="flex h-[104px] flex-1 items-center justify-center rounded-3xl border border-white/10 bg-white/8 text-sm font-bold text-[#a9a0b5] shadow-inner">
            Tray empty - nicely done.
          </div>
        )}
        {unplaced.map((c) => {
          const look = characterLook(c.id, c.hue);
          return (
            <div
              key={c.id}
              className={`character-card group relative flex w-[124px] shrink-0 snap-start flex-col items-center rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,245,216,0.12),rgba(214,168,79,0.08))] p-2 shadow-[0_12px_26px_rgba(0,0,0,0.28)] ring-1 ring-[#d6a84f]/14 transition ${
                draggingId === c.id ? 'opacity-30' : 'hover:-translate-y-0.5'
              }`}
            >
              <button
                type="button"
                onPointerDown={(e) => startDrag({ charId: c.id, hue: c.hue }, e)}
                className="touch-none"
                aria-label={`Drag ${c.name}`}
              >
                <div className="character-avatar rounded-full bg-[#fff5d8] p-0.5 shadow-[0_0_16px_rgba(214,168,79,0.18)] ring-1 ring-[#d6a84f]/35">
                  <Avatar
                    hue={c.hue}
                    size={42}
                    mood={violations.has(c.id) ? 'sad' : 'idle'}
                    {...look}
                  />
                </div>
              </button>
              <p className="mt-1 max-w-full truncate text-[11px] font-bold text-[#fff5d8]">
                {c.name}
              </p>
              <p className="max-w-full truncate text-[9px] font-semibold text-[#a9a0b5]">
                {c.trait}
              </p>
              <div className="character-card-clues mt-1 grid w-full gap-1 text-[#d9cda9]">
                {c.constraints.slice(0, 3).map((cl, i) => (
                  <span
                    key={i}
                    title={clueText(cl, nameOf)}
                    className="character-clue-row flex items-start gap-1 rounded-xl border border-white/10 bg-[#050816]/45 px-1.5 py-1 text-[8px] font-bold leading-tight text-[#eadfcb] shadow-inner"
                  >
                    <span className="mt-0.5 shrink-0">
                      <ClueIcon name={clueIcon(cl)} size={11} />
                    </span>
                    <span className="character-clue-text">{clueText(cl, nameOf)}</span>
                  </span>
                ))}
                {c.constraints.length > 3 && (
                  <span className="rounded-xl border border-white/10 bg-white/8 px-1.5 py-0.5 text-center text-[8px] font-bold text-[#a9a0b5]">
                    +{c.constraints.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CharacterTray;
