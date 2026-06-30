import React from 'react';
import type { Seat as SeatType, Character, EnvironmentId } from './types';
import Avatar from './Avatar';
import ClueIcon from './ClueIcon';
import { clueIcon, clueText } from './constraints';
import { useDrag } from './DragLayer';
import { useGame } from './GameProvider';

interface Props {
  seat: SeatType;
  env: EnvironmentId;
  occupant?: Character;
  violated: boolean;
  nameOf: (id: string) => string;
}

const seatTint: Record<EnvironmentId, string> = {
  bus: '#2f6f53',
  classroom: '#8a5a2b',
  coffee: '#6b4226',
  restaurant: '#7a2e4a',
  theater: '#3a2a6b',
  airport: '#3a6b8a',
  wedding: '#a64d77',
  cruise: '#2c6f8a',
};

const Seat: React.FC<Props> = ({ seat, env, occupant, violated, nameOf }) => {
  const { startDrag } = useDrag();
  const { progress } = useGame();
  const tint = seatTint[env];
  const occupantName = occupant ? nameOf(occupant.id) : '';

  return (
    <div
      data-seat={seat.id}
      className="seat group absolute -translate-x-1/2 -translate-y-1/2 touch-none"
      style={{ left: `${seat.x}%`, top: `${seat.y}%` }}
    >
      <div className="relative flex flex-col items-center">
        <div
          className="seat-body relative flex h-16 w-16 items-end justify-center rounded-2xl shadow-lg ring-2 ring-black/10 transition-transform"
          style={{ background: `linear-gradient(160deg, ${tint}, ${tint}cc)` }}
        >
          <div className="absolute -top-3 left-1/2 h-6 w-14 -translate-x-1/2 rounded-t-xl" style={{ background: tint }} />
          {!occupant && (
            <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 p-1 text-white/85">
              {seat.attrs.slice(0, 4).map((a) => (
                <ClueIcon key={a} name={attrGlyph(a)} size={13} />
              ))}
            </div>
          )}
          {occupant && (
            <button
              type="button"
              onPointerDown={(e) => startDrag({ charId: occupant.id, hue: occupant.hue }, e)}
              className="absolute -top-7 left-1/2 -translate-x-1/2 touch-none"
              aria-label={`Move ${occupant.name}`}
            >
              <div className="ts-sit rounded-full bg-white/80 p-0.5 shadow-md ring-1 ring-white">
                <Avatar
                  hue={occupant.hue}
                  size={52}
                  mood={violated ? 'sad' : 'happy'}
                  {...progress.customization.characterAvatar}
                />
              </div>
            </button>
          )}
        </div>
        {occupant && (
          <div
            className={`pointer-events-none absolute -right-3 -top-12 z-20 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-md ${
              violated ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
            }`}
          >
            {violated ? <Cross /> : <Check />}
          </div>
        )}
        {occupant && (
          <div className="pointer-events-none absolute left-1/2 top-[4.35rem] z-20 max-w-[6.5rem] -translate-x-1/2 rounded-full border border-[#f2c66d]/35 bg-[#071022]/88 px-2.5 py-0.5 text-center text-[10px] font-extrabold leading-tight text-[#fff5d8] shadow-[0_8px_18px_rgba(0,0,0,0.32),0_0_14px_rgba(214,168,79,0.16)] backdrop-blur">
            <span className="block truncate">{occupantName}</span>
          </div>
        )}
      </div>
    </div>
  );
};

function attrGlyph(a: string): string {
  const map: Record<string, string> = {
    window: 'window', aisle: 'aisle', legroom: 'legroom', tv: 'tv',
    music: 'music', food: 'food', sunlight: 'sun', quiet: 'quiet',
    front: 'front', back: 'back',
  };
  return map[a] || 'ban';
}

const Check = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
);
const Cross = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
);

export default Seat;
export { clueText, clueIcon };
