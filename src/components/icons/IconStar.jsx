// D:\ene\src\components\icons\IconStar.jsx
import React from 'react';

export default function IconStar({
  size = 24,
  mode = 'day',
  className = '',
  ariaLabel = 'Favorito'
}) {
  const s = typeof size === 'number' ? `${size}` : size;
  const fill = mode === 'night' ? '#F72585' : '#FFB703';
  const stroke = mode === 'night' ? '#EAF0EE' : '#2B3740';

  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" role="img" aria-label={ariaLabel} xmlns="http://www.w3.org/2000/svg">
      <title>{ariaLabel}</title>

      <path d="M12 3l2.6 5.3L20 9.1l-4 3.9.9 5.9L12 16.8 7.1 19l.9-5.9-4-3.9 5.4-.8L12 3z" fill={fill} stroke={stroke} strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
