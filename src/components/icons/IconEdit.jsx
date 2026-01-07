// D:\ene\src\components\icons\IconEdit.jsx
import React from 'react';

export default function IconEdit({
  size = 24,
  mode = 'day',
  className = '',
  ariaLabel = 'Editar'
}) {
  const s = typeof size === 'number' ? `${size}` : size;
  const colors = mode === 'night'
    ? { accent: '#F72585', base: '#EAF0EE', stroke: '#EAF0EE' }
    : { accent: '#FF6B6B', base: '#FFF9F6', stroke: '#2B3740' };

  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" role="img" aria-label={ariaLabel} xmlns="http://www.w3.org/2000/svg">
      <title>{ariaLabel}</title>

      <rect x="1.8" y="3" width="20.4" height="18.4" rx="3" fill={colors.base} stroke={colors.stroke} strokeWidth="0.5" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" fill={colors.accent} stroke={colors.stroke} strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 20h6" stroke={colors.stroke} strokeWidth="0.6" strokeLinecap="round" />
    </svg>
  );
}
