import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from 'react';
import Avatar from './Avatar';
import { useGame } from './GameProvider';

interface DragPayload {
  charId: string;
  hue: number;
}

interface DragCtx {
  startDrag: (payload: DragPayload, e: React.PointerEvent) => void;
  draggingId: string | null;
}

const Ctx = createContext<DragCtx | null>(null);
export const useDrag = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useDrag outside provider');
  return c;
};

export const DragLayer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { placeCharacter, playSound, progress, unplace } = useGame();
  const floatRef = useRef<HTMLDivElement>(null);
  const payloadRef = useRef<DragPayload | null>(null);
  const [dragging, setDragging] = useState<DragPayload | null>(null);

  const move = useCallback((x: number, y: number) => {
    const el = floatRef.current;
    if (el) {
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    }
    // highlight seat under pointer
    const target = document
      .elementFromPoint(x, y)
      ?.closest('[data-seat]') as HTMLElement | null;
    document
      .querySelectorAll('[data-seat].seat-hot')
      .forEach((n) => n.classList.remove('seat-hot'));
    if (target) target.classList.add('seat-hot');
  }, []);

  const endDrag = useCallback(
    (x: number, y: number) => {
      const p = payloadRef.current;
      document
        .querySelectorAll('[data-seat].seat-hot')
        .forEach((n) => n.classList.remove('seat-hot'));
      if (p) {
        const el = document.elementFromPoint(x, y) as HTMLElement | null;
        const seatEl = el?.closest('[data-seat]') as HTMLElement | null;
        const trayEl = el?.closest('[data-tray]');
        if (seatEl) {
          const seatId = seatEl.getAttribute('data-seat')!;
          placeCharacter(p.charId, seatId);
        } else if (trayEl) {
          unplace(p.charId);
        }
      }
      payloadRef.current = null;
      setDragging(null);
    },
    [placeCharacter, unplace],
  );

  const startDrag = useCallback(
    (payload: DragPayload, e: React.PointerEvent) => {
      e.preventDefault();
      playSound('pickup');
      payloadRef.current = payload;
      setDragging(payload);
      const onMove = (ev: PointerEvent) => move(ev.clientX, ev.clientY);
      const onUp = (ev: PointerEvent) => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        endDrag(ev.clientX, ev.clientY);
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      // place immediately at start point
      requestAnimationFrame(() => move(e.clientX, e.clientY));
    },
    [move, endDrag, playSound],
  );

  return (
    <Ctx.Provider value={{ startDrag, draggingId: dragging?.charId ?? null }}>
      {children}
      {dragging && (
        <div
          ref={floatRef}
          className="pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-1/2"
          style={{ left: -100, top: -100 }}
        >
          <div className="ts-drag-pop rounded-full bg-white/90 p-1 shadow-2xl ring-2 ring-white">
            <Avatar
              hue={dragging.hue}
              mood="happy"
              size={64}
              {...progress.customization.characterAvatar}
            />
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
};
