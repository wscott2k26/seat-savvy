import React from 'react';
import type {
  AccessoryId,
  AvatarFrameId,
  HatId,
  MoodAnimationId,
} from './customization';

export type Mood = 'idle' | 'happy' | 'sad' | 'think';

interface AvatarProps {
  hue: number;
  mood?: Mood;
  size?: number;
  blink?: boolean;
  skinTone?: string;
  outfitColor?: string;
  hairColor?: string;
  hat?: HatId;
  accessory?: AccessoryId;
  avatarFrame?: AvatarFrameId;
  moodAnimation?: MoodAnimationId;
  seed?: string;
}

// A charming, deterministic storybook avatar drawn in SVG.
// Seeded variants make every puzzle guest feel like a different little person.
const Avatar: React.FC<AvatarProps> = ({
  hue,
  mood = 'idle',
  size = 56,
  blink = true,
  skinTone,
  outfitColor,
  hairColor,
  hat = 'none',
  accessory = 'none',
  avatarFrame = 'none',
  moodAnimation = 'none',
  seed,
}) => {
  const seedHash = avatarHash(seed ?? `${hue}`);
  const hairVariant = seedHash % 7;
  const faceVariant = Math.floor(seedHash / 7) % 4;
  const hairCol = hairColor ?? `hsl(${hue}, 45%, 38%)`;
  const skinCol = skinTone ?? `hsl(${(hue + 20) % 360}, 55%, 82%)`;
  const cheek = `hsl(${(hue + 10) % 360}, 70%, 78%)`;
  const shirt = outfitColor ?? `hsl(${hue}, 60%, 55%)`;
  const frame = frameStyle(avatarFrame);
  const animationClass = animationClassFor(moodAnimation);
  const face = faceStyle(faceVariant);

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
      className={`select-none ${animationClass}`}
      aria-hidden
    >
      {frame && (
        <>
          <circle cx="32" cy="32" r="30" fill={frame.fill} opacity="0.92" />
          <circle
            cx="32"
            cy="32"
            r="29"
            fill="none"
            stroke={frame.stroke}
            strokeWidth={frame.width}
            strokeDasharray={frame.dash}
            opacity="0.92"
          />
        </>
      )}
      {/* shoulders / shirt */}
      <path d="M10 64 Q12 46 32 46 Q52 46 54 64 Z" fill={shirt} />
      <path d="M10 64 Q12 46 32 46 Q52 46 54 64 Z" fill="#000" opacity="0.06" />
      {/* hair back */}
      {hairBack(hairVariant, hairCol)}
      {/* face */}
      <ellipse cx="32" cy="27" rx={face.rx} ry={face.ry} fill={skinCol} />
      {/* ears */}
      <circle cx="16.6" cy="28" r="3.5" fill={skinCol} opacity="0.9" />
      <circle cx="47.4" cy="28" r="3.5" fill={skinCol} opacity="0.9" />
      {/* hair top */}
      {hairTop(hairVariant, hairCol)}
      {accessory === 'hair-bow' && (
        <g>
          <path d="M24 13 L17 8 L18 20 Z" fill="#d86d8c" />
          <path d="M28 13 L35 8 L34 20 Z" fill="#d86d8c" />
          <circle cx="26" cy="14" r="3" fill="#f5d7e3" />
        </g>
      )}
      {hat === 'beanie' && (
        <path d="M18 20 Q22 8 32 8 Q42 8 46 20 Q32 15 18 20 Z" fill="#d6a84f" stroke="#7a5a1e" strokeWidth="1" />
      )}
      {hat === 'beret' && (
        <path d="M18 17 Q31 5 47 15 Q42 23 24 22 Q18 21 18 17 Z" fill="#a86a78" stroke="#5b2635" strokeWidth="1" />
      )}
      {hat === 'moon-cap' && (
        <g>
          <path d="M18 19 Q23 8 35 9 Q43 10 47 19 Q36 15 18 19 Z" fill="#2a2450" stroke="#9fb6d9" strokeWidth="1" />
          <path d="M38 12a5 5 0 0 1-5 6 5 5 0 0 0 7-5" fill="#f0e5b8" />
        </g>
      )}
      {hat === 'gold-halo' && (
        <ellipse cx="32" cy="9" rx="13" ry="4" fill="none" stroke="#f0c76a" strokeWidth="2.4" opacity="0.95" />
      )}
      {accessory === 'gold-crown' && (
        <path
          d="M22 12 L26 5 L32 12 L38 5 L42 12 L40 18 L24 18 Z"
          fill="#f0c76a"
          stroke="#9b6b20"
          strokeWidth="1.2"
        />
      )}
      {accessory === 'cozy-headphones' && (
        <g fill="none" stroke="#2c2230" strokeLinecap="round" strokeWidth="2.2">
          <path d="M18 27 Q18 11 32 11 Q46 11 46 27" />
          <rect x="13" y="25" width="7" height="13" rx="3" fill="#d6a84f" stroke="#2c2230" />
          <rect x="44" y="25" width="7" height="13" rx="3" fill="#d6a84f" stroke="#2c2230" />
        </g>
      )}
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
      {accessory === 'round-glasses' && (
        <g fill="none" stroke="#2c2230" strokeWidth="1.8">
          <circle cx="26" cy={eyeY} r="5" />
          <circle cx="38" cy={eyeY} r="5" />
          <path d="M31 26 H33" />
        </g>
      )}
      {seedHash % 9 === 0 && (
        <g fill="#2c2230" opacity="0.75">
          <circle cx="30" cy="31" r="0.9" />
          <circle cx="35" cy="31" r="0.9" />
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
      {seedHash % 11 === 0 && (
        <path d="M27 32 Q32 34 37 32" stroke={hairCol} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.8" />
      )}
      {accessory === 'soft-scarf' && (
        <path
          d="M23 46 Q32 51 41 46 L42 52 Q32 57 22 52 Z"
          fill="#a86a78"
          opacity="0.95"
        />
      )}
      {accessory === 'star-pin' && (
        <path
          d="M42 49 L44 53 L49 53 L45 56 L47 61 L42 58 L37 61 L39 56 L35 53 L40 53 Z"
          fill="#f0c76a"
          stroke="#9b6b20"
          strokeWidth="0.8"
        />
      )}
    </svg>
  );
};

function hairBack(variant: number, color: string): React.ReactNode {
  switch (variant) {
    case 1:
      return <path d="M15 26 Q15 8 32 7 Q49 8 49 27 Q47 46 39 48 Q44 34 39 21 Q30 15 20 24 Q18 34 24 48 Q16 44 15 26 Z" fill={color} />;
    case 2:
      return <path d="M13 30 Q14 9 32 7 Q50 9 51 30 Q51 47 43 55 Q43 38 40 22 Q31 16 21 22 Q20 38 21 55 Q13 47 13 30 Z" fill={color} />;
    case 3:
      return <ellipse cx="32" cy="28" rx="22" ry="18" fill={color} />;
    case 4:
      return <path d="M16 30 Q13 13 25 8 Q34 3 44 12 Q52 20 47 36 Q45 44 39 49 Q41 31 36 20 Q27 16 20 25 Q20 39 25 49 Q18 45 16 30 Z" fill={color} />;
    case 5:
      return <path d="M14 27 Q18 8 32 8 Q46 8 50 27 Q50 43 42 50 Q43 36 40 24 Q32 18 24 24 Q21 36 22 50 Q14 43 14 27 Z" fill={color} />;
    case 6:
      return <path d="M12 28 Q14 6 32 6 Q50 6 52 28 Q48 18 41 17 Q34 16 31 11 Q27 17 20 18 Q15 19 12 28 Z" fill={color} />;
    case 0:
    default:
      return <ellipse cx="32" cy="24" rx="20" ry="20" fill={color} />;
  }
}

function hairTop(variant: number, color: string): React.ReactNode {
  switch (variant) {
    case 1:
      return <path d="M17 24 Q20 10 32 9 Q45 10 48 24 Q39 18 31 18 Q23 18 17 24 Z" fill={color} />;
    case 2:
      return <path d="M16 22 Q19 8 32 8 Q45 8 48 22 Q42 18 37 17 Q33 15 30 10 Q28 16 22 18 Q19 19 16 22 Z" fill={color} />;
    case 3:
      return <path d="M14 24 Q18 7 33 8 Q45 9 50 24 Q39 15 29 16 Q22 17 14 24 Z" fill={color} />;
    case 4:
      return <path d="M17 23 Q20 9 32 8 Q44 8 47 23 Q37 20 32 14 Q28 21 17 23 Z" fill={color} />;
    case 5:
      return <path d="M15 25 Q18 9 32 8 Q46 9 49 25 Q43 18 37 17 Q33 15 30 11 Q25 18 15 25 Z" fill={color} />;
    case 6:
      return <path d="M16 23 Q18 8 32 8 Q46 8 48 23 Q41 19 35 19 Q32 14 29 19 Q23 19 16 23 Z" fill={color} />;
    case 0:
    default:
      return <path d="M16 24 Q18 8 32 8 Q46 8 48 24 Q42 16 32 16 Q22 16 16 24 Z" fill={color} />;
  }
}

function faceStyle(variant: number): { rx: number; ry: number } {
  switch (variant) {
    case 1:
      return { rx: 14.6, ry: 17.2 };
    case 2:
      return { rx: 17.2, ry: 15.3 };
    case 3:
      return { rx: 15.4, ry: 15.8 };
    case 0:
    default:
      return { rx: 16, ry: 16 };
  }
}

function avatarHash(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function frameStyle(frame: AvatarFrameId):
  | { fill: string; stroke: string; width: number; dash?: string }
  | null {
  switch (frame) {
    case 'storybook':
      return { fill: '#fff5d8', stroke: '#d6a84f', width: 2.2 };
    case 'gold':
      return { fill: '#241633', stroke: '#f0c76a', width: 3 };
    case 'moonlit':
      return { fill: '#0b1024', stroke: '#9fb6d9', width: 2.4, dash: '4 3' };
    case 'leaf':
      return { fill: '#0f241d', stroke: '#b7d6c8', width: 2.4, dash: '2 3' };
    case 'seashell':
      return { fill: '#2e1831', stroke: '#f0c76a', width: 2.8, dash: '6 2' };
    case 'none':
    default:
      return null;
  }
}

function animationClassFor(animation: MoodAnimationId): string {
  switch (animation) {
    case 'gentle-bounce':
      return 'ts-avatar-bounce';
    case 'dreamy-float':
      return 'ts-avatar-float';
    case 'sparkle':
      return 'ts-avatar-sparkle';
    case 'focus-glow':
      return 'ts-avatar-glow';
    case 'none':
    default:
      return '';
  }
}

export default Avatar;
