import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Panel */}
      <div
        className={`relative bg-surface rounded-xl shadow-2xl w-full ${sizes[size]} animate-[fadeIn_0.2s_ease] z-10`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">{title}</h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:bg-surface-container-low p-1 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-lg py-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
