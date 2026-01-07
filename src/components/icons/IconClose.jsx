// D:\ene\src\components\icons\IconClose.jsx
import React from 'react';

export default function IconClose({
  size = 24,
  mode = 'day',
  className = '',
  ariaLabel = 'Cerrar'
}) {
  const s = typeof size === 'number' ? `${size}` : size;
  const stroke = mode === 'night' ? '#EAF0EE' : '#2B3740';
  const bg = mode === 'night' ? '#0B0C14' : '#FFF9F6';

  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" role="img" aria-label={ariaLabel} xmlns="http://www.w3.org/2000/svg">
      <title>{ariaLabel}</title>

      <rect x="1.6" y="1.6" width="20.8" height="20.8" rx="4" fill={bg} stroke={stroke} strokeWidth="0.6"/>
      <path d="M18 6L6 18" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 6l12 12" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
