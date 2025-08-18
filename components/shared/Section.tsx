import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

const Section: React.FC<SectionProps> = ({ children, className = '', title, subtitle }) => {
  return (
    <section className={`py-16 sm:py-24 ${className}`}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-12">
            <h2 className="font-display text-display-small font-bold tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-4 text-body text-neutral-400 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;