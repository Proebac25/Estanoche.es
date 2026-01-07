// D:\ene\src\components\icons\IconMenu.jsx
import React from 'react';

export default function IconMenu({
  size = 24,
  mode = 'day',
  className = '',
  ariaLabel = 'Menú'
}) {
  const s = typeof size === 'number' ? `${size}` : size;
  const stroke = mode === 'night' ? '#EAF0EE' : '#2B3740';
  const accent = mode === 'night' ? '#F72585' : '#FFB703';

  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" role="img" aria-label={ariaLabel} xmlns="http://www.w3.org/2000/svg">
      <title>{ariaLabel}</title>

      <rect x="2.6" y="5.2" width="18.8" height="3" rx="1.5" fill={accent} opacity="0.95" stroke={stroke} strokeWidth="0.5"/>
      <rect x="2.6" y="10.7" width="18.8" height="3" rx="1.5" fill={accent} opacity="0.85" stroke={stroke} strokeWidth="0.4"/>
      <rect x="2.6" y="16.2" width="18.8" height="3" rx="1.5" fill={accent} opacity="0.75" stroke={stroke} strokeWidth="0.4"/>
    </svg>
  );
}
