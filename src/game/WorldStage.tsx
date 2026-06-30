import React, { useState } from 'react';
import { useGame } from './GameProvider';
import EnvScene from './EnvScene';
import Seat from './Seat';

// A couple of tappable, animated props per scene for charm.
const InteractiveObject: React.FC<{
  label: string;
  x: number;
  y: number;
  children: React.ReactNode;
}> = ({ label, x, y, children }) => {
  const [tapped, setTapped] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        setTapped(true);
        setTimeout(() => setTapped(false), 700);
      }}
      className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-transform ${
        tapped ? 'ts-wiggle' : 'hover:scale-110'
      }`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {children}
    </button>
  );
};

const Globe = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" className="drop-shadow"><circle cx="12" cy="12" r="9" fill="#6db4d8" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" stroke="#2f6f53" strokeWidth="1.3" fill="none" /></svg>
);
const Bell = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="#e6b94e" stroke="#7a5a1e"><path d="M12 3a6 6 0 0 0-6 6c0 5-2 6-2 6h16s-2-1-2-6a6 6 0 0 0-6-6z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
);
const Plant = () => (
  <svg width="32" height="32" viewBox="0 0 24 24"><path d="M12 20V11" stroke="#5b7d3a" strokeWidth="2" /><path d="M12 12C8 12 6 8 7 5c3 0 5 3 5 7zM12 12c4 0 6-4 5-7-3 0-5 3-5 7z" fill="#7fae5b" /><path d="M8 20h8l-1 2H9z" fill="#b3743f" /></svg>
);

const objectsFor = (env: string) => {
  switch (env) {
    case 'bus':
      return (
        <>
          <InteractiveObject label="Globe" x={84} y={20}><Globe /></InteractiveObject>
          <InteractiveObject label="Bell" x={14} y={20}><Bell /></InteractiveObject>
        </>
      );
    case 'classroom':
      return (
        <>
          <InteractiveObject label="Globe" x={86} y={26}><Globe /></InteractiveObject>
          <InteractiveObject label="Plant" x={12} y={30}><Plant /></InteractiveObject>
        </>
      );
    case 'coffee':
      return (
        <InteractiveObject label="Bell" x={88} y={66}><Bell /></InteractiveObject>
      );
    case 'restaurant':
      return (
        <InteractiveObject label="Plant" x={88} y={30}><Plant /></InteractiveObject>
      );
    default:
      return null;
  }
};

const WorldStage: React.FC = () => {
  const { level, charBySeat, violations, progress } = useGame();
  if (!level) return null;
  const charById = Object.fromEntries(level.characters.map((c) => [c.id, c]));
  const nameOf = (id: string) => charById[id]?.name ?? '?';

  return (
    <div className="relative h-full w-full overflow-hidden">
      <EnvScene
        env={level.env}
        artStyle={progress.settings.environmentArt}
        environmentPalette={
          progress.customization.envPalettes[level.env] ?? 'default'
        }
      />
      {objectsFor(level.env)}
      <div data-seat-field className="safe-seat-field">
        {level.seats.map((seat) => {
          const occId = charBySeat[seat.id];
          const occ = occId ? charById[occId] : undefined;
          return (
            <Seat
              key={seat.id}
              seat={seat}
              env={level.env}
              occupant={occ}
              violated={occ ? violations.has(occ.id) : false}
              nameOf={nameOf}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WorldStage;
