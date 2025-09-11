import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../components/ui/CartContext';
import { MobileNavigation } from '../components/navigation/MobileNavigation';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Beats', href: '/beats' },
  { name: 'Services', href: '/services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' }
];

const Header: React.FC = () => {
  const { cartCount, toggleCart } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800/60">
      <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/assets/logo/main-logo.png" 
            alt="YBF Studio Logo" 
            className="h-12 w-auto sm:h-14"
          />
          <img
            src="/assets/logo/text-logo.png"
            alt="Site Text Logo"
            className="h-7 w-auto sm:h-9"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-3d-spline-text-secondary hover:text-3d-spline-text-primary transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleCart}
            className="relative rounded-full p-2 hover:bg-3d-spline-accent/20 transition-colors duration-300 focus-visible:ring focus-visible:ring-3d-spline-accent/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <ShoppingCart className="h-5 w-5 text-3d-spline-text-secondary hover:text-3d-spline-accent transition-colors duration-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-3d-spline-accent text-xs font-bold text-white shadow-lg">
                {cartCount}
              </span>
            )}
          </button>

          {/* Enhanced Mobile Navigation */}
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
};

export default Header;