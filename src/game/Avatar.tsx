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
}

// A charming, deterministic storybook avatar drawn in SVG.
// Skin/hair derive from the character hue so each feels distinct.
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
}) => {
  const hairCol = hairColor ?? `hsl(${hue}, 45%, 38%)`;
  const skinCol = skinTone ?? `hsl(${(hue + 20) % 360}, 55%, 82%)`;
  const cheek = `hsl(${(hue + 10) % 360}, 70%, 78%)`;
  const shirt = outfitColor ?? `hsl(${hue}, 60%, 55%)`;
  const frame = frameStyle(avatarFrame);
  const animationClass = animationClassFor(moodAnimation);

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
      <ellipse cx="32" cy="24" rx="20" ry="20" fill={hairCol} />
      {/* face */}
      <circle cx="32" cy="27" r="16" fill={skinCol} />
      {/* hair top */}
      <path
        d="M16 24 Q18 8 32 8 Q46 8 48 24 Q42 16 32 16 Q22 16 16 24 Z"
        fill={hairCol}
      />
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
      {/* mouth */}
      <path
        d={mouthPath}
        stroke="#7a3b3b"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
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
