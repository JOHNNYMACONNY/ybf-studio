import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = '',
  showHome = true
}) => {
  const allItems = showHome 
    ? [{ label: 'Home', href: '/' }, ...items]
    : items;

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isCurrent = item.current || isLast;

          return (
            <li key={item.href || index} className="flex items-center">
              {index > 0 && (
                <ChevronRight 
                  className="h-4 w-4 text-neutral-500 mx-2 flex-shrink-0" 
                  aria-hidden="true"
                />
              )}
              
              {item.href && !isCurrent ? (
                <Link
                  href={item.href}
                  className="flex items-center space-x-1 text-neutral-400 hover:text-neutral-200 transition-colors min-h-[44px] min-w-[44px] px-2 py-1 rounded-lg hover:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-neutral-900"
                  aria-label={`Navigate to ${item.label}`}
                >
                  {index === 0 && showHome && (
                    <Home className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span 
                  className="flex items-center space-x-1 text-neutral-200 font-medium min-h-[44px] px-2 py-1"
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {index === 0 && showHome && (
                    <Home className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

