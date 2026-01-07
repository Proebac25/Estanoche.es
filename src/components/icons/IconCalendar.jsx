// D:\ene\src\components\icons\IconCalendar.jsx
import React from 'react';

export default function IconCalendar({
  size = 24,
  mode = 'day',
  className = '',
  ariaLabel = 'Calendario'
}) {
  const s = typeof size === 'number' ? `${size}` : size;
  const colors = mode === 'night'
    ? { frame: '#121428', accent: '#F72585', stroke: '#EAF0EE', fill: '#0B0C14' }
    : { frame: '#FFFFFF', accent: '#7A9A7E', stroke: '#2B3740', fill: '#FFF9F6' };

  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" role="img" aria-label={ariaLabel} xmlns="http://www.w3.org/2000/svg">
      <title>{ariaLabel}</title>

      {/* body */}
      <rect x="2.6" y="4.4" width="18.8" height="15.6" rx="2.6" fill={colors.fill} stroke={colors.stroke} strokeWidth="0.6"/>
      {/* header dots / rings */}
      <rect x="7" y="2.2" width="2.6" height="2.6" rx="0.6" fill={colors.accent} />
      <rect x="14.4" y="2.2" width="2.6" height="2.6" rx="0.6" fill={colors.accent} />
      {/* separator */}
      <path d="M3 10.8h18" stroke={colors.stroke} strokeWidth="0.6" strokeLinecap="round"/>
      {/* small date squares */}
      <g fill={colors.accent} opacity="0.14">
        <rect x="5" y="12" width="3" height="3" rx="0.6" />
        <rect x="10" y="12" width="3" height="3" rx="0.6" />
        <rect x="15" y="12" width="3" height="3" rx="0.6" />
      </g>
    </svg>
  );
}
