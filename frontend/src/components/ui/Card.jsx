import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-surface-container-lowest rounded-lg border border-outline-variant shadow-soft overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
