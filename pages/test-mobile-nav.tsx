import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Icon } from '../components/ui/Icon';
import Head from 'next/head';

const TestMobileNav: React.FC = () => {
  return (
    <>
      <Head>
        <title>Test Mobile Navigation | YBF Studio</title>
        <meta name="description" content="Test page for mobile navigation styling" />
      </Head>

      <div className="min-h-screen bg-neutral-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">
            Mobile Navigation Test
          </h1>
          
          <div className="bg-neutral-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Test Instructions:
            </h2>
            <ul className="text-neutral-300 space-y-2">
              <li>• Resize your browser window to mobile size (or use dev tools)</li>
              <li>• Use the hamburger menu in the header</li>
              <li>• Verify the drawer opens with a dark backdrop</li>
              <li>• Press Esc or tap outside to close; focus should return to the trigger</li>
              <li>• Try navigating to a new page; the drawer should auto-close</li>
            </ul>
          </div>

          <div className="bg-neutral-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Expected Styling:
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-emerald-400 mb-2">Backdrop + Portal:</h3>
                <p className="text-neutral-300">Backdrop should cover the whole screen using <code className="bg-neutral-700 px-2 py-1 rounded">bg-black/80</code> and render via a portal to <code className="bg-neutral-700 px-2 py-1 rounded">document.body</code>.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-emerald-400 mb-2">Drawer Panel:</h3>
                <p className="text-neutral-300">Panel uses <code className="bg-neutral-700 px-2 py-1 rounded">bg-neutral-800/95</code>, <code className="bg-neutral-700 px-2 py-1 rounded">backdrop-blur-xl</code>, emerald borders, and <code className="bg-neutral-700 px-2 py-1 rounded">rounded-l-xl</code>.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-emerald-400 mb-2">Scroll Area:</h3>
                <p className="text-neutral-300">Content area is scrollable with <code className="bg-neutral-700 px-2 py-1 rounded">overflow-y-auto</code> and <code className="bg-neutral-700 px-2 py-1 rounded">max-h-[calc(100vh-160px)]</code>, plus iOS safe-area padding.</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Current Status:
            </h2>
            <div className="space-y-2">
              <p className="text-neutral-300 flex items-center gap-2"><Icon as={CheckCircle2} className="h-4 w-4 text-emerald-400" /> Portal overlay with semantic z-index (modal tier)</p>
              <p className="text-neutral-300 flex items-center gap-2"><Icon as={CheckCircle2} className="h-4 w-4 text-emerald-400" /> Backdrop and glassmorphic drawer styling in place</p>
              <p className="text-neutral-300 flex items-center gap-2"><Icon as={CheckCircle2} className="h-4 w-4 text-emerald-400" /> Focus trap, Escape to close, and route-change auto-close</p>
              <p className="text-neutral-300 flex items-center gap-2"><Icon as={CheckCircle2} className="h-4 w-4 text-emerald-400" /> Consistent trigger button in the header</p>
            </div>
          </div>
        </div>

        {/* Note: Mobile Navigation is provided by the global Header layout */}
        <div className="fixed top-4 right-4 z-overlay bg-emerald-600 text-white px-3 py-1 rounded text-xs">
          Mobile nav is in the header (portal-backed)
        </div>
      </div>
    </>
  );
};

export default TestMobileNav;
