// D:\ene\src\components\icons\IconVip.jsx
import React from 'react';

export default function IconVip({
  size = 44,
  mode = 'day',
  className = '',
  ariaLabel = 'VIP'
}) {
  const s = typeof size === 'number' ? `${size}` : size;
  const colors = mode === 'night'
    ? { circle: '#F72585', inner: '#EAF0EE', stroke: '#EAF0EE' }
    : { circle: 'url(#vipGrad)', inner: '#FFF9F6', stroke: '#2B3740' };

  return (
    <svg className={className} width={s} height={s} viewBox="0 0 44 44" role="img" aria-label={ariaLabel} xmlns="http://www.w3.org/2000/svg">
      <title>{ariaLabel}</title>
      <defs>
        <linearGradient id="vipGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="#F72585" />
          <stop offset="100%" stopColor="#FFB703" />
        </linearGradient>
      </defs>

      <circle cx="22" cy="22" r="12" fill={colors.circle} stroke={colors.stroke || '#2B3740'} strokeWidth="0.8"/>
      <text x="22" y="26" fontSize="9" textAnchor="middle" fontFamily="Inter, Arial" fill={colors.inner} fontWeight="700">VIP</text>
    </svg>
  );
}
