// D:\ene\src\components\icons\IconLocation.jsx
import React from 'react';

export default function IconLocation({
  size = 24,
  mode = 'day',
  className = '',
  ariaLabel = 'Lugar'
}) {
  const s = typeof size === 'number' ? `${size}` : size;
  const colors = mode === 'night' ? { fill: '#F72585', inner: '#0B0C14', stroke: '#EAF0EE' } : { fill: '#7A9A7E', inner: '#FFF9F6', stroke: '#2B3740' };

  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" role="img" aria-label={ariaLabel} xmlns="http://www.w3.org/2000/svg">
      <title>{ariaLabel}</title>

      <path d="M12 3C8.1 3 5 6 5 10c0 5 7 11 7 11s7-6 7-11c0-4-3.1-7-7-7z" fill={colors.fill} stroke={colors.stroke} strokeWidth="0.6" />
      <circle cx="12" cy="10" r="2.6" fill={colors.inner} stroke={colors.stroke} strokeWidth="0.5" />
    </svg>
  );
}
