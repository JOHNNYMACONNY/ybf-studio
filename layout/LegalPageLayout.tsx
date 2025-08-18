import React from 'react';
import Section from '../components/shared/Section';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ title, lastUpdated, children }) => {
  return (
    <div className="animate-fade-up-stagger animate-delay-1">
      <Section>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-display-medium">{title}</h1>
          <p className="mt-4 text-neutral-400">Last Updated: {lastUpdated}</p>
          <div className="mt-12 prose prose-invert prose-lg max-w-none prose-h2:font-display prose-h2:text-amber prose-a:text-amber hover:prose-a:text-amber/90">
            {children}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default LegalPageLayout;