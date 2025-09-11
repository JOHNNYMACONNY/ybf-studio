import React from 'react';
import Link from 'next/link';
import { Instagram, Youtube, Twitter, Mail, Phone, MapPin, Music, Headphones, Mic } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';

const Footer: React.FC = () => {
  return (
    <footer className="card-3d-spline rounded-t-3xl">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <AnimatedSection animation="fadeIn" delay={100}>
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="/assets/logo/main-logo.png" 
                  alt="YBF Studio Logo" 
                  className="h-10 w-auto"
                />
                <span className="text-2xl font-bold text-3d-spline-text-primary">YBF Studio</span>
              </div>
              <p className="text-3d-spline-text-secondary mb-6 leading-relaxed">
                Your next hit starts here. Exclusive beats and professional mixing services that elevate your music to the next level.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-3d-spline-text-secondary">
                  <Mail className="h-4 w-4 text-3d-spline-accent" />
                  <span className="text-sm">jmaconny@ybfstudio.com</span>
                </div>
                <div className="flex items-center gap-3 text-3d-spline-text-secondary">
                  <Phone className="h-4 w-4 text-3d-spline-accent" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-3d-spline-text-secondary">
                  <MapPin className="h-4 w-4 text-3d-spline-accent" />
                  <span className="text-sm">Los Angeles, CA</span>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <AnimatedSection animation="fadeIn" delay={200}>
              <h4 className="text-lg font-bold text-3d-spline-text-primary mb-6 flex items-center gap-2">
                <Music className="h-5 w-5 text-3d-spline-accent" />
                Quick Links
              </h4>
              <ul className="space-y-4">
                <li><Link href="/beats" className="text-3d-spline-text-secondary hover:text-3d-spline-accent transition-colors duration-300 flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-3d-spline-accent rounded-full group-hover:scale-150 transition-transform"></div>
                  Beat Store
                </Link></li>
                <li><Link href="/services" className="text-3d-spline-text-secondary hover:text-3d-spline-accent transition-colors duration-300 flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-3d-spline-accent rounded-full group-hover:scale-150 transition-transform"></div>
                  Services
                </Link></li>
                <li><Link href="/portfolio" className="text-3d-spline-text-secondary hover:text-3d-spline-accent transition-colors duration-300 flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-3d-spline-accent rounded-full group-hover:scale-150 transition-transform"></div>
                  Portfolio
                </Link></li>
                <li><Link href="/blog" className="text-3d-spline-text-secondary hover:text-3d-spline-accent transition-colors duration-300 flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-3d-spline-accent rounded-full group-hover:scale-150 transition-transform"></div>
                  Blog
                </Link></li>
                <li><Link href="/contact" className="text-3d-spline-text-secondary hover:text-3d-spline-accent transition-colors duration-300 flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-3d-spline-accent rounded-full group-hover:scale-150 transition-transform"></div>
                  Contact
                </Link></li>
              </ul>
            </AnimatedSection>
          </div>

          {/* Services */}
          <div className="lg:col-span-1">
            <AnimatedSection animation="fadeIn" delay={300}>
              <h4 className="text-lg font-bold text-3d-spline-text-primary mb-6 flex items-center gap-2">
                <Headphones className="h-5 w-5 text-3d-spline-accent" />
                Services
              </h4>
              <ul className="space-y-4">
                <li><Link href="/services#basic-mix" className="text-3d-spline-text-secondary hover:text-3d-spline-accent transition-colors duration-300 flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-3d-spline-accent rounded-full group-hover:scale-150 transition-transform"></div>
                  Basic Mix
                </Link></li>
                <li><Link href="/services#advanced-mix" className="text-3d-spline-text-secondary hover:text-3d-spline-accent transition-colors duration-300 flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-3d-spline-accent rounded-full group-hover:scale-150 transition-transform"></div>
                  Advanced Mix
                </Link></li>
                <li><Link href="/services#stereo-master" className="text-3d-spline-text-secondary hover:text-3d-spline-accent transition-colors duration-300 flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-3d-spline-accent rounded-full group-hover:scale-150 transition-transform"></div>
                  Stereo Master
                </Link></li>
                <li><Link href="/consultation" className="text-3d-spline-text-secondary hover:text-3d-spline-accent transition-colors duration-300 flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-3d-spline-accent rounded-full group-hover:scale-150 transition-transform"></div>
                  Consultation
                </Link></li>
              </ul>
            </AnimatedSection>
          </div>

          {/* Legal & Social */}
          <div className="lg:col-span-1">
            <AnimatedSection animation="fadeIn" delay={400}>
              <h4 className="text-lg font-bold text-3d-spline-text-primary mb-6 flex items-center gap-2">
                <Mic className="h-5 w-5 text-3d-spline-accent" />
                Connect
              </h4>
              
              {/* Social Media */}
              <div className="flex space-x-4 mb-8">
                <Link href="#" className="p-3 bg-gradient-to-r from-3d-spline-accent/20 to-3d-spline-primary/20 rounded-xl border border-3d-spline-accent/30 hover:from-3d-spline-accent/30 hover:to-3d-spline-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-3d-spline-accent/25">
                  <Twitter className="h-5 w-5 text-3d-spline-accent" />
                </Link>
                <Link href="#" className="p-3 bg-gradient-to-r from-3d-spline-accent/20 to-3d-spline-primary/20 rounded-xl border border-3d-spline-accent/30 hover:from-3d-spline-accent/30 hover:to-3d-spline-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-3d-spline-accent/25">
                  <Youtube className="h-5 w-5 text-3d-spline-accent" />
                </Link>
                <Link href="#" className="p-3 bg-gradient-to-r from-3d-spline-accent/20 to-3d-spline-primary/20 rounded-xl border border-3d-spline-accent/30 hover:from-3d-spline-accent/30 hover:to-3d-spline-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-3d-spline-accent/25">
                  <Instagram className="h-5 w-5 text-3d-spline-accent" />
                </Link>
              </div>

              {/* Legal Links */}
              <div className="space-y-3">
                <Link href="/terms" className="text-sm text-3d-spline-text-muted hover:text-3d-spline-accent transition-colors duration-300 block">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="text-sm text-3d-spline-text-muted hover:text-3d-spline-accent transition-colors duration-300 block">
                  Privacy Policy
                </Link>
                <Link href="/contact" className="text-sm text-3d-spline-text-muted hover:text-3d-spline-accent transition-colors duration-300 block">
                  Support
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Bottom Bar */}
        <AnimatedSection animation="fadeIn" delay={500}>
          <div className="mt-12 pt-8 border-t border-3d-spline-accent/20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-3d-spline-text-muted">
                &copy; {new Date().getFullYear()} YBF Studio. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-sm text-3d-spline-text-muted">
                <span>Made with</span>
                <div className="w-2 h-2 bg-3d-spline-accent rounded-full animate-pulse"></div>
                <span>for artists</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
};

export default Footer;