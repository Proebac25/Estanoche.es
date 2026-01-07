// D:\ene\src\components\icons\IconHome.jsx
import React from 'react';

/**
 * IconHome — Componente SVG full-color V11
 * Props:
 *  - size: number|string (default: 24)
 *  - mode: 'day'|'night' (default: 'day')
 *  - className: string
 *  - ariaLabel: string
 */
export default function IconHome({
  size = 24,
  mode = 'day',
  className = '',
  ariaLabel = 'Inicio'
}) {
  const s = typeof size === 'number' ? `${size}` : size;
  const colors = mode === 'night'
    ? { bg: '#0F1022', roof: '#F72585', wall: '#4B744D', stroke: '#EAF0EE' }
    : { bg: '#FFF9F6', roof: '#FF6B6B', wall: '#7A9A7E', stroke: '#2B3740' };

  return (
    <svg
      className={className}
      width={s}
      height={s}
      viewBox="0 0 24 24"
      role="img"
      aria-label={ariaLabel}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{ariaLabel}</title>

      {/* background panel */}
      <rect x="1.2" y="6" width="21.6" height="14.2" rx="3" fill={colors.bg} />

      {/* roof */}
      <path
        d="M3 10.5L12 4l9 6.5"
        fill={colors.roof}
        opacity="0.95"
        stroke={colors.stroke}
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* walls */}
      <path
        d="M5 21V11.5h14V21z"
        fill={colors.wall}
        stroke={colors.stroke}
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* door */}
      <rect
        x="9"
        y="15"
        width="6"
        height="6"
        rx="1.2"
        fill="#FFFFFF"
        opacity="0.95"
        stroke={colors.stroke}
        strokeWidth="0.5"
      />
    </svg>
  );
}
