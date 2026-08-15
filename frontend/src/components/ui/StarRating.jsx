import React, { useState } from 'react';

const StarRating = ({ value = 0, onChange = null, readOnly = false, size = 'md' }) => {
  const [hovered, setHovered] = useState(0);

  const sizes = {
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hovered || value) >= star;
        return (
          <span
            key={star}
            className={`material-symbols-outlined ${sizes[size]} transition-all duration-150 ${
              filled ? 'text-warning' : 'text-outline-variant'
            } ${!readOnly ? 'cursor-pointer hover:scale-110' : ''}`}
            style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            onClick={() => !readOnly && onChange && onChange(star)}
          >
            star
          </span>
        );
      })}
      {value > 0 && (
        <span className="ml-1 font-label-md text-label-md text-on-surface-variant">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
