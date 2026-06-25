import React from 'react';

export type Mood = 'idle' | 'happy' | 'sad' | 'think';

interface AvatarProps {
  hue: number;
  mood?: Mood;
  size?: number;
  blink?: boolean;
}

// A charming, deterministic storybook avatar drawn in SVG.
// Skin/hair derive from the character hue so each feels distinct.
const Avatar: React.FC<AvatarProps> = ({
  hue,
  mood = 'idle',
  size = 56,
  blink = true,
}) => {
  const hairCol = `hsl(${hue}, 45%, 38%)`;
  const skinCol = `hsl(${(hue + 20) % 360}, 55%, 82%)`;
  const cheek = `hsl(${(hue + 10) % 360}, 70%, 78%)`;
  const shirt = `hsl(${hue}, 60%, 55%)`;

  const eyeY = mood === 'sad' ? 27 : 26;
  const mouthPath =
    mood === 'happy'
      ? 'M26 33 Q32 40 38 33'
      : mood === 'sad'
      ? 'M26 37 Q32 32 38 37'
      : mood === 'think'
      ? 'M28 35 q4 0 6 0'
      : 'M27 34 Q32 38 37 34';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className="select-none"
      aria-hidden
    >
      {/* shoulders / shirt */}
      <path d="M10 64 Q12 46 32 46 Q52 46 54 64 Z" fill={shirt} />
      <path d="M10 64 Q12 46 32 46 Q52 46 54 64 Z" fill="#000" opacity="0.06" />
      {/* hair back */}
      <ellipse cx="32" cy="24" rx="20" ry="20" fill={hairCol} />
      {/* face */}
      <circle cx="32" cy="27" r="16" fill={skinCol} />
      {/* hair top */}
      <path
        d="M16 24 Q18 8 32 8 Q46 8 48 24 Q42 16 32 16 Q22 16 16 24 Z"
        fill={hairCol}
      />
      {/* cheeks */}
      <circle cx="23" cy="31" r="3.4" fill={cheek} opacity="0.7" />
      <circle cx="41" cy="31" r="3.4" fill={cheek} opacity="0.7" />
      {/* eyes */}
      {blink ? (
        <g className="ts-blink">
          <circle cx="26" cy={eyeY} r="2.3" fill="#2c2230" />
          <circle cx="38" cy={eyeY} r="2.3" fill="#2c2230" />
        </g>
      ) : (
        <g>
          <path d="M24 26 q2 2 4 0" stroke="#2c2230" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M36 26 q2 2 4 0" stroke="#2c2230" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
      )}
      {/* mouth */}
      <path
        d={mouthPath}
        stroke="#7a3b3b"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Avatar;
