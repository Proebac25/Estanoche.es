// D:\ene\src\components\icons\IconClock.jsx
import React from 'react';

export default function IconClock({
  size = 24,
  mode = 'day',
  className = '',
  ariaLabel = 'Hora'
}) {
  const s = typeof size === 'number' ? `${size}` : size;
  const colors = mode === 'night' ? { ring: '#EAF0EE', face: '#0B0C14', hand: '#F72585' } : { ring: '#2B3740', face: '#FFF9F6', hand: '#7A9A7E' };

  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" role="img" aria-label={ariaLabel} xmlns="http://www.w3.org/2000/svg">
      <title>{ariaLabel}</title>

      <circle cx="12" cy="12" r="9" fill={colors.face} stroke={colors.ring} strokeWidth="0.6" />
      <path d="M12 7v5l4 2" stroke={colors.hand} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
