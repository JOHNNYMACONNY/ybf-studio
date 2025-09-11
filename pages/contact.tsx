import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { Mail, Twitter, Youtube, Instagram } from 'lucide-react';

import ContactForm from '../components/contact/ContactForm';
import FaqAccordion from '../components/shared/FaqAccordion';
import AnimatedSection from '../components/ui/AnimatedSection';
import { getHeroImage } from '../lib/hero-config';

const faqs = [
  { question: 'What is the typical turnaround time for a mix?', answer: 'Our standard turnaround time for mixing is 3-5 business days. Rush options are available as an add-on if you need it sooner.' },
  { question: 'How do I receive my purchased beats?', answer: 'Immediately after your payment is processed, you will receive an email with secure download links for your files and license agreement.' },
  { question: 'Do you offer custom beats?', answer: 'Yes! We love working on custom projects. Use the contact form to send us details about what you\'re looking for, and we can discuss creating a unique beat just for you.' },
];

const Contact: React.FC = () => {
  const heroImage = getHeroImage('contact');

  return (
    <>
      <Head>
        <title>Contact | YBF Studio</title>
        <meta name="description" content="Get in touch with us for custom projects, questions, or collaborations." />
      </Head>

      {/* Hero Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12 hero-background-enhanced hero-card-enhanced">
        {/* Background Image with configurable opacity */}
        <div className="hero-background-image" style={{ opacity: (heroImage.opacity || 60) / 100 }}>
          <Image 
            src={heroImage.path} 
            alt={heroImage.alt}
            fill 
            className="object-cover"
            priority
          />
        </div>
        
        {/* Content in foreground */}
        <AnimatedSection animation="fadeIn" className="relative z-10">
          <div className="text-center space-y-8">
            <h1 className="text-5xl font-bold text-3d-spline-text-primary">
              Get in <span className="text-3d-spline-accent">Touch</span>
            </h1>
            <p className="text-xl text-3d-spline-text-secondary max-w-3xl mx-auto">
              Ready to start your next project? We&apos;re here to help bring your musical vision to life.
            </p>
          </div>
        </AnimatedSection>
      </div>

        {/* Contact Form Section */}
        <div className="card-3d-spline rounded-2xl p-8 mb-12">
          <AnimatedSection animation="fadeIn" delay={100}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="card-3d-spline rounded-xl p-6">
                  <ContactForm />
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-3d-spline-text-primary text-xl mb-4">Direct Contact</h3>
                  <div className="space-y-3">
                    <Link href="mailto:jmaconny@ybfstudio.com" className="flex items-center gap-3 text-3d-spline-text-secondary hover:text-3d-spline-accent transition-colors">
                      <Mail className="h-5 w-5 text-3d-spline-text-muted" />
                      <span>jmaconny@ybfstudio.com</span>
                    </Link>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-3d-spline-text-primary text-xl mb-4">Follow Us</h3>
                  <div className="flex space-x-6">
                    <Link href="#" className="text-3d-spline-text-muted hover:text-3d-spline-accent transition-colors"><Twitter className="h-6 w-6" /></Link>
                    <Link href="#" className="text-3d-spline-text-muted hover:text-3d-spline-accent transition-colors"><Youtube className="h-6 w-6" /></Link>
                    <Link href="#" className="text-3d-spline-text-muted hover:text-3d-spline-accent transition-colors"><Instagram className="h-6 w-6" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* FAQ Section */}
        <div className="card-3d-spline rounded-2xl p-8 mb-12">
          <AnimatedSection animation="fadeIn" delay={200}>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-3d-spline-primary mb-4">
                Quick <span className="text-3d-spline-accent">Answers</span>
              </h2>
              <p className="text-3d-spline-text-secondary max-w-2xl mx-auto">
                Find answers to common questions about our services and process.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <FaqAccordion items={faqs} />
            </div>
          </AnimatedSection>
        </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      use3DSplineBackground: true,
    },
  };
};

export default Contact;
