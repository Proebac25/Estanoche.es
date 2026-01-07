// D:\ene\src\components\icons\IconUser.jsx
import React from 'react';

export default function IconUser({
  size = 24,
  mode = 'day',
  className = '',
  ariaLabel = 'Usuario'
}) {
  const s = typeof size === 'number' ? `${size}` : size;
  const colors = mode === 'night'
    ? { fill: '#EAF0EE', bg: '#0B0C14', stroke: '#EAF0EE' }
    : { fill: '#FFFFFF', bg: '#FFF9F6', stroke: '#2B3740' };

  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" role="img" aria-label={ariaLabel} xmlns="http://www.w3.org/2000/svg">
      <title>{ariaLabel}</title>

      <rect x="2.4" y="3.4" width="19.2" height="17.2" rx="3" fill={colors.bg} stroke={colors.stroke} strokeWidth="0.6"/>
      <circle cx="12" cy="9" r="3.2" fill={colors.fill} stroke={colors.stroke} strokeWidth="0.6"/>
      <path d="M6.5 19c1.2-2.6 3.8-4.2 5.5-4.2s4.3 1.6 5.5 4.2" fill="none" stroke={colors.stroke} strokeWidth="0.7" strokeLinecap="round"/>
    </svg>
  );
}
