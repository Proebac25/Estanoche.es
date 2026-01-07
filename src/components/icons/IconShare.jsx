// D:\ene\src\components\icons\IconShare.jsx
import React from 'react';

export default function IconShare({
  size = 24,
  mode = 'day',
  className = '',
  ariaLabel = 'Compartir'
}) {
  const s = typeof size === 'number' ? `${size}` : size;
  const stroke = mode === 'night' ? '#EAF0EE' : '#2B3740';
  const accent = mode === 'night' ? '#F72585' : '#FFB703';

  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" role="img" aria-label={ariaLabel} xmlns="http://www.w3.org/2000/svg">
      <title>{ariaLabel}</title>

      <g fill="none" stroke={stroke} strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" fill={accent} stroke={stroke} strokeWidth="0.8" />
        <circle cx="18" cy="19" r="3" fill={accent} stroke={stroke} strokeWidth="0.8" />
        <circle cx="6" cy="12" r="3" fill="#FFF9F6" stroke={stroke} strokeWidth="0.8" />
      </g>
      <path d="M8.5 13.5l7 4" stroke={stroke} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M8.5 10.5l7-4" stroke={stroke} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
