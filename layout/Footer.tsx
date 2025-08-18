import React from 'react';
import Link from 'next/link';
import { Instagram, Youtube, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black ring-1 ring-neutral-800/60">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img 
                src="/assets/logo/main-logo.png" 
                alt="AudioService Logo" 
                className="h-8 w-auto"
              />
              <span className="text-card-title">AudioService</span>
            </div>
            <p className="text-sm text-neutral-400">
              Your next hit starts here. Exclusive beats and pro mixing services.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">Quick Links</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/beats" className="text-sm text-neutral-400 hover:text-white">Beat Store</Link></li>
                <li><Link href="/services" className="text-sm text-neutral-400 hover:text-white">Services</Link></li>
                <li><Link href="/portfolio" className="text-sm text-neutral-400 hover:text-white">Portfolio</Link></li>
                <li><Link href="/contact" className="text-sm text-neutral-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">Legal</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/terms" className="text-sm text-neutral-400 hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-sm text-neutral-400 hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-neutral-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-neutral-500">&copy; {new Date().getFullYear()} AudioService. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="#" className="text-neutral-500 hover:text-white"><Twitter className="h-5 w-5" /></Link>
            <Link href="#" className="text-neutral-500 hover:text-white"><Youtube className="h-5 w-5" /></Link>
            <Link href="#" className="text-neutral-500 hover:text-white"><Instagram className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;