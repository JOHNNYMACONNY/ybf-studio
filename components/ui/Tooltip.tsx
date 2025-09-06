import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
  className?: string;
}

const sideToClasses: Record<NonNullable<TooltipProps['side']>, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const Tooltip: React.FC<TooltipProps> = ({ content, side = 'top', children, className = '' }) => {
  const [open, setOpen] = useState(false);

  return (
    <span 
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span 
          role="tooltip"
          className={`pointer-events-none absolute z-50 px-2 py-1 rounded-md text-xs text-neutral-200 bg-neutral-900/90 border border-neutral-700 shadow-lg whitespace-pre-wrap ${sideToClasses[side]}`}
        >
          {content}
        </span>
      )}
    </span>
  );
};

export default Tooltip;


