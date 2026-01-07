// D:\ene\src\components\icons\IconSearch.jsx
import React from 'react';

export default function IconSearch({
  size = 24,
  mode = 'day',
  className = '',
  ariaLabel = 'Buscar'
}) {
  const s = typeof size === 'number' ? `${size}` : size;
  const colors = mode === 'night'
    ? { ring: '#F72585', lens: '#4B744D', stroke: '#EAF0EE' }
    : { ring: '#FFB703', lens: '#FFF9F6', stroke: '#2B3740' };

  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" role="img" aria-label={ariaLabel} xmlns="http://www.w3.org/2000/svg">
      <title>{ariaLabel}</title>

      {/* lens */}
      <circle cx="11" cy="11" r="6" fill={colors.lens} stroke={colors.stroke} strokeWidth="0.8" />
      {/* ring accent */}
      <circle cx="11" cy="11" r="6.8" stroke={colors.ring} strokeWidth="0.9" fill="none" opacity="0.9" />
      {/* handle */}
      <path d="M21 21l-4.35-4.35" stroke={colors.stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
