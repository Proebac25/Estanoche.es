// D:\ene\src\components\icons\IconCheck.jsx
import React from 'react';

export default function IconCheck({
  size = 24,
  mode = 'day',
  className = '',
  ariaLabel = 'Comprobar'
}) {
  const s = typeof size === 'number' ? `${size}` : size;
  const stroke = mode === 'night' ? '#EAF0EE' : '#2B3740';
  const bg = mode === 'night' ? '#0B0C14' : '#FFF9F6';
  const accent = mode === 'night' ? '#F72585' : '#7A9A7E';

  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" role="img" aria-label={ariaLabel} xmlns="http://www.w3.org/2000/svg">
      <title>{ariaLabel}</title>

      <rect x="2" y="2" width="20" height="20" rx="4" fill={bg} stroke={stroke} strokeWidth="0.6" />
      <path d="M5 13l4 4L19 7" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
