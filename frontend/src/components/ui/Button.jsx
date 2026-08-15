import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-label-md text-label-md transition-colors flex items-center justify-center cursor-pointer";
  
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-primary-variant",
    secondary: "bg-secondary-container text-on-secondary-container hover:bg-surface-variant",
    outline: "border border-outline text-primary hover:bg-surface-container-low",
    danger: "bg-error text-on-error hover:bg-error-container hover:text-on-error-container"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
