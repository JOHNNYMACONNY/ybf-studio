import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { X, Menu, Home, Music, Settings, FolderOpen, FileText, Phone } from 'lucide-react';
import { createPortal } from 'react-dom';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Beats', href: '/beats', icon: Music },
  { label: 'Services', href: '/services', icon: Settings },
  { label: 'Portfolio', href: '/portfolio', icon: FolderOpen },
  { label: 'Blog', href: '/blog', icon: FileText },
  { label: 'Contact', href: '/contact', icon: Phone }
];

export const MobileNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    router.events.on('routeChangeStart', close);
    return () => {
      router.events.off('routeChangeStart', close);
    };
  }, [isOpen, router.events]);

  // Focus trap when open
  useEffect(() => {
    if (!isOpen) return;
    const panel = menuRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    (first as HTMLElement | undefined)?.focus?.();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusable.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          (last as HTMLElement)?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          (first as HTMLElement)?.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const overlay = (
    <div className="fixed inset-0 z-modal z-[1000]" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={() => setIsOpen(false)} aria-hidden="true" />

      {/* Panel */}
      <div className="absolute top-0 right-0 w-80 h-full bg-neutral-800/95 backdrop-blur-xl border border-emerald-500/30 shadow-2xl rounded-l-xl" ref={menuRef}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-500/15">
          <h2 id="mobile-menu-title" className="text-xl font-bold text-white">
            <span className="text-emerald-400">Navigation</span>
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-3 text-neutral-400 hover:text-emerald-400 transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(100vh-160px)] pb-[env(safe-area-inset-bottom)]">
          {/* Links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-4 p-4 text-neutral-300 hover:text-emerald-400 hover:bg-neutral-700/50 rounded-lg transition-all duration-300 group"
                  onClick={() => setIsOpen(false)}
                >
                  <IconComponent className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium group-hover:text-emerald-400 transition-colors">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="mt-4 border-t border-emerald-500/15 pt-4 space-y-3">
            <button className="w-full p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25" onClick={() => setIsOpen(false)}>
              Shop Beats
            </button>
            <button className="w-full p-3 bg-neutral-700 text-white rounded-lg font-medium hover:bg-neutral-600 transition-all duration-300 border border-neutral-600 hover:border-emerald-500/30" onClick={() => setIsOpen(false)}>
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 text-neutral-300 hover:text-emerald-400 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-neutral-900 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-haspopup="true"
      >
        {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
      </button>

      {isOpen && mounted ? createPortal(overlay, document.body) : null}
    </div>
  );
}; 