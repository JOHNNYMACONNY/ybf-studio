import React from 'react';

interface GlowBorderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GlowBorderButton: React.FC<GlowBorderButtonProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .glow-button:hover .hover-overlay {
          opacity: 0.3;
        }
        .glow-button:hover .hover-blur-left,
        .glow-button:hover .hover-blur-right,
        .glow-button:hover .hover-blur-top,
        .glow-button:hover .hover-blur-bottom {
          opacity: 1;
          filter: blur(14px);
        }
        .glow-button:hover .hover-radial-glow {
          opacity: 1;
        }
      `}} />
      <button
        className={`glow-button cursor-pointer border-none inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition-all duration-300 text-xs font-medium text-white tracking-tight rounded-none pt-3 pr-8 pb-3 pl-8 relative items-center justify-center backdrop-blur-xl ${className}`}
        style={{
          fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          width: 'auto',
          height: 'auto',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
        {...props}
      >
        {/* Left border */}
        <div
          className="pointer-events-none absolute left-[-2px] top-[-40px] bottom-[-40px] w-[2px]"
          style={{
            background: 'linear-gradient(rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.2) 40px, rgba(16, 185, 129, 0.667) 40px, rgb(16, 185, 129), rgba(16, 185, 129, 0.667) calc(100% - 40px), rgba(16, 185, 129, 0.2) calc(100% - 40px), rgba(16, 185, 129, 0))',
            zIndex: 0
          }}
        >
          <div
            style={{
              content: "''",
              position: 'absolute',
              inset: 0,
              background: 'inherit',
              filter: 'blur(4px)',
              zIndex: -2
            }}
          />
          <div
            className="hover-blur-left"
            style={{
              content: "''",
              position: 'absolute',
              inset: '0px',
              background: 'inherit',
              filter: 'blur(10px)',
              opacity: 0,
              zIndex: -2
            }}
          />
        </div>

        {/* Right border */}
        <div
          className="pointer-events-none absolute right-[-2px] top-[-40px] bottom-[-40px] w-[2px]"
          style={{
            background: 'linear-gradient(rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.2) 40px, rgba(16, 185, 129, 0.667) 40px, rgb(16, 185, 129), rgba(16, 185, 129, 0.667) calc(100% - 40px), rgba(16, 185, 129, 0.2) calc(100% - 40px), rgba(16, 185, 129, 0))',
            zIndex: 0
          }}
        >
          <div
            style={{
              content: "''",
              position: 'absolute',
              inset: 0,
              background: 'inherit',
              filter: 'blur(4px)',
              zIndex: -2
            }}
          />
          <div
            className="hover-blur-right"
            style={{
              content: "''",
              position: 'absolute',
              inset: '0px',
              background: 'inherit',
              filter: 'blur(10px)',
              opacity: 0,
              zIndex: -2
            }}
          />
        </div>

        {/* Top border */}
        <div
          className="pointer-events-none absolute top-[-2px] left-[-40px] right-[-40px] h-[2px]"
          style={{
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.2) 40px, rgba(16, 185, 129, 0.667) 40px, rgb(16, 185, 129), rgba(16, 185, 129, 0.667) calc(100% - 40px), rgba(16, 185, 129, 0.2) calc(100% - 40px), rgba(16, 185, 129, 0))',
            zIndex: 0
          }}
        >
          <div
            style={{
              content: "''",
              position: 'absolute',
              inset: 0,
              background: 'inherit',
              filter: 'blur(4px)',
              zIndex: -2
            }}
          />
          <div
            className="hover-blur-top"
            style={{
              content: "''",
              position: 'absolute',
              inset: '0px',
              background: 'inherit',
              filter: 'blur(10px)',
              opacity: 0,
              zIndex: -2
            }}
          />
        </div>

        {/* Bottom border */}
        <div
          className="pointer-events-none absolute bottom-[-2px] left-[-40px] right-[-40px] h-[2px]"
          style={{
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.2) 40px, rgba(16, 185, 129, 0.667) 40px, rgb(16, 185, 129), rgba(16, 185, 129, 0.667) calc(100% - 40px), rgba(16, 185, 129, 0.2) calc(100% - 40px), rgba(16, 185, 129, 0))',
            zIndex: 0
          }}
        >
          <div
            style={{
              content: "''",
              position: 'absolute',
              inset: 0,
              background: 'inherit',
              filter: 'blur(4px)',
              zIndex: -2
            }}
          />
          <div
            className="hover-blur-bottom"
            style={{
              content: "''",
              position: 'absolute',
              inset: '0px',
              background: 'inherit',
              filter: 'blur(10px)',
              opacity: 0,
              zIndex: -2
            }}
          />
        </div>

        {/* Hover overlay */}
        <div
          className="hover-overlay"
          style={{
            position: 'absolute',
            inset: '0px',
            opacity: 0,
            background: 'radial-gradient(circle, rgba(0, 0, 0, 0) 0px, rgba(0, 0, 0, 0) 20%, rgba(17, 17, 17, 0.667) 50%) 0% 0% / 3px 3px, radial-gradient(100% 100%, rgb(16, 185, 129), rgba(16, 185, 129, 0)) 0% 0% / auto',
            zIndex: 0
          }}
        />

        {/* Radial glow */}
        <div
          className="hover-radial-glow"
          style={{
            position: 'absolute',
            inset: '-20px',
            opacity: 0,
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3), transparent 60%)',
            filter: 'blur(20px)',
            zIndex: -1
          }}
        />

        <span className="relative z-10">{children}</span>
      </button>
    </>
  );
};

export default GlowBorderButton;

