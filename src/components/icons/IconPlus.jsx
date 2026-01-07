// D:\ene\src\components\icons\IconPlus.jsx
import React from 'react';

export default function IconPlus({
  size = 24,
  mode = 'day',
  className = '',
  ariaLabel = 'Agregar'
}) {
  const s = typeof size === 'number' ? `${size}` : size;
  const colors = mode === 'night' ? { stroke: '#EAF0EE', fill: '#0B0C14', accent: '#F72585' } : { stroke: '#2B3740', fill: '#FFF9F6', accent: '#FFB703' };

  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" role="img" aria-label={ariaLabel} xmlns="http://www.w3.org/2000/svg">
      <title>{ariaLabel}</title>

      <rect x="2" y="2" width="20" height="20" rx="4" fill={colors.fill} stroke={colors.stroke} strokeWidth="0.6" />
      <g stroke={colors.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M12 6v12" />
        <path d="M6 12h12" />
      </g>
    </svg>
  );
}
