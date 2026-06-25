import React from 'react';

interface Props {
  name: string;
  size?: number;
  className?: string;
}

// Minimal, charming line glyphs for each clue type. No emoji.
const ClueIcon: React.FC<Props> = ({ name, size = 16, className = '' }) => {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  };
  switch (name) {
    case 'window':
      return (
        <svg {...p}><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M12 4v16M4 12h16" /></svg>
      );
    case 'aisle':
      return (
        <svg {...p}><path d="M12 3v18" /><path d="M8 7l-4 5 4 5M16 7l4 5-4 5" /></svg>
      );
    case 'legroom':
      return (
        <svg {...p}><path d="M6 4v8a4 4 0 0 0 4 4h8" /><path d="M6 20h4" /></svg>
      );
    case 'tv':
      return (
        <svg {...p}><rect x="3" y="5" width="18" height="12" rx="2" /><path d="M8 21h8" /></svg>
      );
    case 'music':
      return (
        <svg {...p}><path d="M9 18V5l10-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></svg>
      );
    case 'food':
      return (
        <svg {...p}><path d="M4 3v7a2 2 0 0 0 2 2h0V3M6 12v9M18 3c-1.5 0-3 2-3 5s1 4 3 4v9" /></svg>
      );
    case 'sun':
      return (
        <svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></svg>
      );
    case 'quiet':
      return (
        <svg {...p}><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M22 9l-6 6M16 9l6 6" /></svg>
      );
    case 'front':
      return (
        <svg {...p}><path d="M12 19V5M5 12l7-7 7 7" /></svg>
      );
    case 'back':
      return (
        <svg {...p}><path d="M12 5v14M5 12l7 7 7-7" /></svg>
      );
    case 'heart':
      return (
        <svg {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" /></svg>
      );
    case 'ban':
    default:
      return (
        <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M5.6 5.6l12.8 12.8" /></svg>
      );
  }
};

export default ClueIcon;
