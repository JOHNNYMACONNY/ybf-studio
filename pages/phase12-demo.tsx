import React, { useState } from 'react';
import Head from 'next/head';
import ServiceComparison from '../components/services/ServiceComparison';
import LicenseComparison from '../components/beats/LicenseComparison';
import EnhancedFaq from '../components/shared/EnhancedFaq';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientText } from '../components/ui/GradientText';
import { AdvancedButton } from '../components/ui/AdvancedButton';
import { CONTACT_INFO, SOCIAL_MEDIA } from '../lib/contact-config';
import { SERVICE_PACKAGES, BEAT_LICENSES } from '../lib/pricing-config';

export default function Phase12Demo() {
  const [activeSection, setActiveSection] = useState<'services' | 'beats' | 'faq' | 'contact'>('services');
  const [isOpen] = useState(true); // Simplified - always open for demo
  const [nextBusinessDay] = useState('Monday'); // Simplified for demo

      const popularTiers = SERVICE_PACKAGES.filter(pkg => pkg.popular);
    const recommendedTiers = SERVICE_PACKAGES.slice(0, 2); // Simplified for demo

  return (
    <>
      <Head>
        <title>Phase 12 Demo - Information Consistency & Client Experience</title>
        <meta name="description" content="Phase 12: Information Consistency & Client Experience Fixes - Centralized pricing, contact information, and enhanced user experience components" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6">
              <GradientText gradient="teal-blue">Phase 12 Demo</GradientText>
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Information Consistency & Client Experience Fixes
            </p>
            <p className="text-gray-400 max-w-3xl mx-auto">
              This phase implements centralized pricing and contact configuration systems, 
              enhanced comparison components, and improved client experience through consistency.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-center space-x-4 mb-8">
            {[
              { id: 'services', label: 'Service Comparison', icon: '🎵' },
              { id: 'beats', label: 'License Comparison', icon: '🎧' },
              { id: 'faq', label: 'Enhanced FAQ', icon: '❓' },
              { id: 'contact', label: 'Contact Info', icon: '📞' }
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as 'services' | 'beats' | 'faq' | 'contact')}
                className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-lg'
                    : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50'
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Service Comparison */}
            {activeSection === 'services' && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    <GradientText gradient="amber-teal">Service Comparison System</GradientText>
                  </h2>
                  <p className="text-gray-400">
                    Centralized pricing configuration with clear package comparisons and detailed service information
                  </p>
                </div>

                <ServiceComparison />

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <GlassCard variant="default" className="p-6 text-center">
                    <div className="text-3xl font-bold text-teal-400 mb-2">
                      {SERVICE_PACKAGES.length}
                    </div>
                    <div className="text-gray-300">Service Categories</div>
                  </GlassCard>
                  <GlassCard variant="default" className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {popularTiers.length}
                    </div>
                    <div className="text-gray-300">Popular Packages</div>
                  </GlassCard>
                  <GlassCard variant="default" className="p-6 text-center">
                    <div className="text-3xl font-bold text-amber-400 mb-2">
                      {recommendedTiers.length}
                    </div>
                    <div className="text-gray-300">Recommended Options</div>
                  </GlassCard>
                </div>
              </div>
            )}

            {/* License Comparison */}
            {activeSection === 'beats' && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    <GradientText gradient="amber-teal">Beat License Comparison</GradientText>
                  </h2>
                  <p className="text-gray-400">
                    Clear license comparison with detailed rights, restrictions, and usage permissions
                  </p>
                </div>

                <LicenseComparison />

                {/* License Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  {BEAT_LICENSES.map((license) => (
                    <GlassCard key={license.id} variant="default" className="p-6">
                      <h3 className="text-lg font-bold mb-2">{license.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{license.description}</p>
                      <div className="text-2xl font-bold text-teal-400">
                        ${license.price}
                      </div>
                      <div className="mt-3 space-y-1">
                        {license.features.slice(0, 2).map((feature, index) => (
                          <div key={index} className="text-xs text-gray-300">✓ {feature}</div>
                        ))}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced FAQ */}
            {activeSection === 'faq' && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    <GradientText gradient="amber-teal">Enhanced FAQ System</GradientText>
                  </h2>
                  <p className="text-gray-400">
                    Categorized questions with search functionality and integrated contact information
                  </p>
                </div>

                <EnhancedFaq items={[]} />
              </div>
            )}

            {/* Contact Information */}
            {activeSection === 'contact' && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    <GradientText gradient="amber-teal">Centralized Contact Information</GradientText>
                  </h2>
                  <p className="text-gray-400">
                    Single source of truth for all contact methods, business hours, and support information
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Contact Methods */}
                  <GlassCard variant="elevated" className="p-6">
                    <h3 className="text-xl font-bold mb-4">
                      <GradientText gradient="teal-blue">Contact Methods</GradientText>
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                        <div className="text-2xl">📧</div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">Email</div>
                          <div className="text-gray-300 text-sm">{CONTACT_INFO.email}</div>
                          <div className="text-gray-400 text-xs">Primary contact method</div>
                        </div>
                        <span className="bg-teal-500 text-white px-2 py-1 rounded text-xs">
                          Primary
                        </span>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Business Hours */}
                  <GlassCard variant="elevated" className="p-6">
                    <h3 className="text-xl font-bold mb-4">
                      <GradientText gradient="teal-blue">Business Hours</GradientText>
                    </h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded">
                        <span className="text-gray-300">Monday - Friday</span>
                        <span className="text-white">9 AM - 6 PM EST</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded">
                        <span className="text-gray-300">Saturday - Sunday</span>
                        <span className="text-white">Closed</span>
                      </div>
                    </div>
                    
                    {/* Current Status */}
                    <div className={`p-4 rounded-lg ${isOpen ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                      <div className="flex items-center space-x-2">
                        <span className={isOpen ? 'text-green-400' : 'text-red-400'}>
                          {isOpen ? '🟢' : '🔴'}
                        </span>
                        <span className="text-white font-semibold">
                          {isOpen ? 'Currently Open' : 'Currently Closed'}
                        </span>
                      </div>
                      {!isOpen && (
                        <p className="text-gray-300 text-sm mt-1">
                          Next business day: {nextBusinessDay}
                        </p>
                      )}
                    </div>
                  </GlassCard>

                  {/* Social Media */}
                  <GlassCard variant="elevated" className="p-6">
                    <h3 className="text-xl font-bold mb-4">
                      <GradientText gradient="teal-blue">Social Media</GradientText>
                    </h3>
                    <div className="space-y-3">
                      {SOCIAL_MEDIA.filter(social => social.active).map((social) => (
                        <a
                          key={social.platform}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="text-2xl">
                            {social.platform === 'Instagram' && '📸'}
                            {social.platform === 'YouTube' && '📺'}
                            {social.platform === 'Twitter' && '🐦'}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white">{social.platform}</div>
                            <div className="text-gray-400 text-sm">{social.handle}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Location & Support */}
                  <GlassCard variant="elevated" className="p-6">
                    <h3 className="text-xl font-bold mb-4">
                      <GradientText gradient="teal-blue">Location & Support</GradientText>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-300 mb-2">Studio Location</h4>
                        <p className="text-white">
                          Virtual Studio<br />
                          Remote Services Available<br />
                          Worldwide
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-300 mb-2">Response Time</h4>
                        <p className="text-white">{CONTACT_INFO.responseTime}</p>
                      </div>
                      {/* Emergency contact removed - not in ContactInfo interface */}
                    </div>
                  </GlassCard>
                </div>
              </div>
            )}
          </div>

          {/* Phase Summary */}
          <GlassCard variant="cool" className="p-8 mt-12">
            <h3 className="text-2xl font-bold mb-4 text-center">
              <GradientText gradient="teal-blue">Phase 12 Implementation Summary</GradientText>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-300 mb-3">✅ Completed Features:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Centralized pricing configuration system</li>
                  <li>• Contact information management</li>
                  <li>• Service comparison components</li>
                  <li>• Beat license comparison system</li>
                  <li>• Enhanced FAQ with categories</li>
                  <li>• Business hours and status tracking</li>
                  <li>• Social media integration</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-300 mb-3">🎯 Benefits:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Single source of truth for all information</li>
                  <li>• Reduced client confusion and support inquiries</li>
                  <li>• Consistent pricing across all components</li>
                  <li>• Improved user experience and clarity</li>
                  <li>• Easy maintenance and updates</li>
                  <li>• Professional presentation of services</li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
} 