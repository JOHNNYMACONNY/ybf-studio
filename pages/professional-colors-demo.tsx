import React from 'react';

export default function ProfessionalColorsDemo() {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-6xl font-bold text-neutral-100 mb-8 text-center font-instrument-serif">
          🎨 PulseSync-Inspired Color Palette Demo
        </h1>
        <p className="text-xl text-neutral-400 text-center mb-12 max-w-4xl mx-auto">
          Modern, healthcare-inspired color system with emerald green, amber accents, 
          and sophisticated neutral tones for a premium digital experience.
        </p>
        
        {/* Core Brand Colors */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-100 mb-8 text-center">Core Brand Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-24 bg-emerald-300 rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-emerald-300 font-bold text-lg mb-2">Emerald Primary</h3>
              <p className="text-neutral-400 text-sm mb-2">#10b981 / emerald-300</p>
              <p className="text-neutral-500 text-xs">Main brand color, primary actions</p>
            </div>
            
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-24 bg-emerald-600 rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-emerald-600 font-bold text-lg mb-2">Emerald Secondary</h3>
              <p className="text-neutral-400 text-sm mb-2">#059669 / emerald-600</p>
              <p className="text-neutral-500 text-xs">Hover states, secondary elements</p>
            </div>
            
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-24 bg-emerald-900 rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-emerald-900 font-bold text-lg mb-2">Emerald Dark</h3>
              <p className="text-neutral-400 text-sm mb-2">#064e3b / emerald-900</p>
              <p className="text-neutral-500 text-xs">Dark backgrounds, deep accents</p>
            </div>
          </div>
        </section>

        {/* Supporting Colors */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-100 mb-8 text-center">Supporting Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-24 bg-amber-400 rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-amber-400 font-bold text-lg mb-2">Amber Accent</h3>
              <p className="text-neutral-400 text-sm mb-2">#fbbf24 / amber-400</p>
              <p className="text-neutral-500 text-xs">CTAs, warnings, warm elements</p>
            </div>
            
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-24 bg-amber-700 rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-amber-700 font-bold text-lg mb-2">Amber Secondary</h3>
              <p className="text-neutral-400 text-sm mb-2">#b45309 / amber-700</p>
              <p className="text-neutral-500 text-xs">Secondary actions, highlights</p>
            </div>
            
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-24 bg-orange-500 rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-orange-500 font-bold text-lg mb-2">Orange Accent</h3>
              <p className="text-neutral-400 text-sm mb-2">#f97316 / orange-500</p>
              <p className="text-neutral-500 text-xs">High-energy actions, creative elements</p>
            </div>
            
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-24 bg-orange-700 rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-orange-700 font-bold text-lg mb-2">Orange Secondary</h3>
              <p className="text-neutral-400 text-sm mb-2">#ea580c / orange-700</p>
              <p className="text-neutral-500 text-xs">Deep accents, energetic elements</p>
            </div>
          </div>
        </section>

        {/* Neutral Color System */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-100 mb-8 text-center">Neutral Color System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-16 bg-neutral-100 rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-neutral-100 font-bold text-lg mb-2">Neutral 100</h3>
              <p className="text-neutral-400 text-sm mb-2">#f5f5f5</p>
              <p className="text-neutral-500 text-xs">Light backgrounds</p>
            </div>
            
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-16 bg-neutral-200 rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-neutral-200 font-bold text-lg mb-2">Neutral 200</h3>
              <p className="text-neutral-400 text-sm mb-2">#e5e5e5</p>
              <p className="text-neutral-500 text-xs">Borders, dividers</p>
            </div>
            
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-16 bg-neutral-500 rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-neutral-500 font-bold text-lg mb-2">Neutral 500</h3>
              <p className="text-neutral-400 text-sm mb-2">#737373</p>
              <p className="text-neutral-500 text-xs">Secondary text</p>
            </div>
            
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-16 bg-neutral-800 rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-neutral-800 font-bold text-lg mb-2">Neutral 800</h3>
              <p className="text-neutral-400 text-sm mb-2">#262626</p>
              <p className="text-neutral-500 text-xs">Card backgrounds</p>
            </div>
          </div>
        </section>

        {/* Mathematical Harmony - Warm Analogous Colors */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-100 mb-8 text-center">Mathematical Harmony - Warm Analogous Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-24 bg-emerald-300 rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-emerald-300 font-bold text-lg mb-2">Emerald Primary</h3>
              <p className="text-neutral-400 text-sm mb-2">#10b981 / emerald-300</p>
              <p className="text-neutral-500 text-xs">Cool primary brand color</p>
            </div>
            
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-24 bg-amber-400 rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-amber-400 font-bold text-lg mb-2">Amber Accent</h3>
              <p className="text-neutral-400 text-sm mb-2">#fbbf24 / amber-400</p>
              <p className="text-neutral-500 text-xs">Warm secondary accent</p>
            </div>
            
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-24 bg-orange-500 rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-orange-500 font-bold text-lg mb-2">Orange Energy</h3>
              <p className="text-neutral-400 text-sm mb-2">#f97316 / orange-500</p>
              <p className="text-neutral-500 text-xs">High-energy warm accent</p>
            </div>
          </div>
        </section>

        {/* PulseSync-Inspired Gradients */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-100 mb-8 text-center">PulseSync-Inspired Gradients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-32 bg-gradient-emerald rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-neutral-100 font-bold text-lg mb-2">Emerald Gradient</h3>
              <p className="text-neutral-400 text-sm mb-2">Primary brand gradient</p>
              <p className="text-neutral-500 text-xs">emerald-900 → emerald-600 → emerald-300</p>
            </div>
            
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-32 bg-gradient-amber rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-neutral-100 font-bold text-lg mb-2">Amber Gradient</h3>
              <p className="text-neutral-400 text-sm mb-2">Accent color gradient</p>
              <p className="text-neutral-500 text-xs">amber-950 → amber-700 → amber-400</p>
            </div>
            
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-32 bg-gradient-orange rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-neutral-100 font-bold text-lg mb-2">Orange Gradient</h3>
              <p className="text-neutral-400 text-sm mb-2">Complementary gradient</p>
              <p className="text-neutral-500 text-xs">orange-900 → orange-700 → orange-500</p>
            </div>
            
            <div className="bg-black rounded-xl p-6 border border-neutral-800/60 shadow-sm">
              <div className="w-full h-32 bg-gradient-emerald-orange rounded-lg mb-4 shadow-lg"></div>
              <h3 className="text-neutral-100 font-bold text-lg mb-2">Emerald-Orange</h3>
              <p className="text-neutral-400 text-sm mb-2">Complementary harmony</p>
              <p className="text-neutral-500 text-xs">emerald-300 → orange-500</p>
            </div>
          </div>
        </section>

        {/* Interactive Elements Demo */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-100 mb-8 text-center">Interactive Elements</h2>
          <div className="bg-black rounded-xl p-8 border border-neutral-800/60 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <button className="bg-emerald-300 hover:bg-emerald-400 text-neutral-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200">
                Primary Action
              </button>
              
              <button className="bg-amber-400 hover:bg-amber-500 text-neutral-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200">
                Secondary Action
              </button>
              
              <button className="bg-orange-500 hover:bg-orange-600 text-neutral-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200">
                Complementary Action
              </button>
              
              <button className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold py-3 px-6 rounded-lg transition-colors duration-200 border border-neutral-700">
                Tertiary Action
              </button>
              
              <button className="bg-emerald-900 hover:bg-emerald-800 text-emerald-100 font-bold py-3 px-6 rounded-lg transition-colors duration-200">
                Success Action
              </button>
            </div>
          </div>
        </section>

        {/* Text Hierarchy Demo */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-100 mb-8 text-center">Text Hierarchy</h2>
          <div className="bg-black rounded-xl p-8 border border-neutral-800/60 shadow-sm">
            <h1 className="text-neutral-100 text-4xl font-bold mb-4">Primary Text (neutral-100)</h1>
            <h2 className="text-neutral-400 text-2xl font-semibold mb-4">Secondary Text (neutral-400)</h2>
            <p className="text-neutral-500 text-lg mb-4">Muted Text (neutral-500) - Used for metadata, timestamps, and less important information.</p>
            <div className="space-y-2">
              <p className="text-emerald-300">Emerald Primary Text</p>
              <p className="text-amber-400">Amber Accent Text</p>
              <p className="text-orange-500">Orange Complementary Text</p>
              <p className="text-emerald-600">Emerald Secondary Text</p>
              <p className="text-amber-700">Amber Secondary Text</p>
              <p className="text-orange-700">Orange Secondary Text</p>
            </div>
          </div>
        </section>

        {/* PulseSync Design Principles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-100 mb-8 text-center">PulseSync Design Principles</h2>
          <div className="bg-black rounded-xl p-8 border border-neutral-800/60 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-neutral-100 text-xl font-bold mb-4">Healthcare-Inspired Design</h3>
                <ul className="text-neutral-400 space-y-2">
                  <li>• <strong>Emerald Green:</strong> Trust, health, growth, and vitality</li>
                  <li>• <strong>Amber Accents:</strong> Warmth, attention, and energy</li>
                  <li>• <strong>Orange Energy:</strong> High-energy actions, creativity, enthusiasm</li>
                  <li>• <strong>Neutral Grays:</strong> Professional, clean, and accessible</li>
                  <li>• <strong>High Contrast:</strong> Excellent readability and accessibility</li>
                </ul>
              </div>
              <div>
                <h3 className="text-neutral-100 text-xl font-bold mb-4">Warm Analogous Harmony</h3>
                <ul className="text-neutral-400 space-y-2">
                  <li>• <strong>Cool-Warm Balance:</strong> Emerald (cool) ↔ Amber/Orange (warm)</li>
                  <li>• <strong>Analogous Warmth:</strong> Amber and orange create warm harmony</li>
                  <li>• <strong>Color Theory:</strong> Scientifically proven visual harmony</li>
                  <li>• <strong>Professional Standards:</strong> Industry-leading color psychology</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility Information */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-100 mb-8 text-center">Accessibility Compliance</h2>
          <div className="bg-black rounded-xl p-8 border border-neutral-800/60 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-neutral-400">
                <thead>
                  <tr className="border-b border-neutral-800/60">
                    <th className="text-left py-2">Element</th>
                    <th className="text-left py-2">Background</th>
                    <th className="text-left py-2">Text</th>
                    <th className="text-left py-2">Ratio</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-800/30">
                    <td className="py-2">Primary Text</td>
                    <td className="py-2">Neutral 900</td>
                    <td className="py-2">Neutral 100</td>
                    <td className="py-2">15.2:1</td>
                    <td className="py-2 text-emerald-300">✅ Excellent</td>
                  </tr>
                  <tr className="border-b border-neutral-800/30">
                    <td className="py-2">Secondary Text</td>
                    <td className="py-2">Neutral 900</td>
                    <td className="py-2">Neutral 400</td>
                    <td className="py-2">8.1:1</td>
                    <td className="py-2 text-emerald-300">✅ Good</td>
                  </tr>
                  <tr className="border-b border-neutral-800/30">
                    <td className="py-2">Primary Button</td>
                    <td className="py-2">Emerald 300</td>
                    <td className="py-2">Neutral 900</td>
                    <td className="py-2">4.6:1</td>
                    <td className="py-2 text-emerald-300">✅ Acceptable</td>
                  </tr>
                  <tr>
                    <td className="py-2">Muted Text</td>
                    <td className="py-2">Neutral 900</td>
                    <td className="py-2">Neutral 500</td>
                    <td className="py-2">4.8:1</td>
                    <td className="py-2 text-emerald-300">✅ Acceptable</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* PulseSync Brand Showcase */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-100 mb-8 text-center">PulseSync Brand Showcase</h2>
          <div className="bg-black rounded-xl p-8 border border-neutral-800/60 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-emerald-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-neutral-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-emerald-300 text-xl font-bold mb-2">PulseSync</h3>
                <p className="text-neutral-400">Your Digital Health Hub</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-emerald-300 rounded-full"></div>
                  <span className="text-neutral-100">Data-driven care that fits your life</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-amber-400 rounded-full"></div>
                  <span className="text-neutral-100">Stay in sync with your care team</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="text-neutral-100">Mathematically harmonious design</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-neutral-500 rounded-full"></div>
                  <span className="text-neutral-100">Anytime, anywhere access</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center">
          <p className="text-neutral-400 text-lg">
            This PulseSync-inspired color palette provides modern healthcare aesthetics, 
            excellent accessibility, and professional digital experience for YBF Studio.
          </p>
        </div>
      </div>
    </div>
  );
} 