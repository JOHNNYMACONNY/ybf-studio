import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { ConsultationPackage } from '../lib/consultation';
import ConsultationBookingForm from '../components/consultation/ConsultationBookingForm';
import Button from '../components/ui/Button';
import AnimatedSection from '../components/ui/AnimatedSection';
import { useToast } from '../components/ui/ToastContext';

const ConsultationPage: NextPage = () => {
  const [packages, setPackages] = useState<ConsultationPackage[]>([]);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/consultation-packages');
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
      } else {
        console.error('Failed to fetch consultation packages');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingSuccess = (consultation: { id: string }) => {
    console.log('Consultation booked successfully:', consultation);
    addToast({ type: 'success', message: 'Your consultation has been scheduled. Check your email for details.' });
  };

  const handleBookingError = (error: string) => {
    console.error('Booking error:', error);
    addToast({ type: 'error', message: `Booking failed: ${error}` });
  };

  const formatPrice = (priceCents: number) => {
    if (priceCents === 0) return 'Free';
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <>
      <Head>
        <title>Professional Consultation Services | YBF Studio</title>
        <meta name="description" content="Book professional audio engineering and music production consultations. Get expert advice, project planning, and technical guidance tailored to your needs." />
        <meta name="keywords" content="audio consultation, music production consultation, audio engineering, professional advice, project planning" />
      </Head>

      {/* Hero Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12 hero-background-enhanced hero-card-enhanced">
        <AnimatedSection animation="fadeIn">
          <div className="text-center space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold text-3d-spline-text-primary">Professional Audio Consultation</h1>
            <p className="text-xl text-3d-spline-text-secondary max-w-3xl mx-auto">
              Get expert guidance from industry professionals to elevate your audio projects and achieve your creative vision.
            </p>
            <Button size="lg" variant="primary" onClick={() => setIsBookingFormOpen(true)}>
              Book Your Consultation
            </Button>
          </div>
        </AnimatedSection>
      </div>

      {/* Consultation Packages */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-3d-spline-text-primary mb-4">Choose Your Consultation Package</h2>
            <p className="text-lg text-3d-spline-text-secondary max-w-3xl mx-auto">We offer flexible consultation options to meet your specific needs, from quick discovery calls to comprehensive project planning sessions.</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-500">Loading consultation packages...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="card-3d-spline rounded-xl p-6">
                  <div className="text-center space-y-4">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-3d-spline-text-primary mb-2">{pkg.name}</h3>
                      <div className="text-3xl font-bold text-3d-spline-primary mb-1">
                        {formatPrice(pkg.price_cents)}
                      </div>
                      <div className="text-sm text-3d-spline-text-muted">
                        {formatDuration(pkg.duration_minutes)}
                      </div>
                    </div>

                    {pkg.description && <p className="text-3d-spline-text-secondary text-sm">{pkg.description}</p>}

                    {pkg.features && pkg.features.length > 0 && (
                      <ul className="text-left space-y-2">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-3d-spline-text-muted">
                            <svg className="w-4 h-4 text-emerald-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="pt-2">
                      <Button onClick={() => setIsBookingFormOpen(true)} className="w-full" variant={pkg.price_cents === 0 ? 'secondary' : 'primary'}>
                        Book {pkg.name}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Why Choose Our Consultations */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-3d-spline-text-primary mb-4">Why Choose Our Consultations?</h2>
            <p className="text-lg text-3d-spline-text-secondary max-w-3xl mx-auto">Get personalized, professional guidance that helps you make informed decisions and achieve your audio production goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-3d-spline-primary to-3d-spline-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-3d-spline-text-primary mb-2">Expert Knowledge</h3>
              <p className="text-3d-spline-text-secondary text-sm">
                Access to industry professionals with years of experience in audio engineering and music production.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-3d-spline-primary to-3d-spline-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-3d-spline-text-primary mb-2">Time-Saving</h3>
              <p className="text-3d-spline-text-secondary text-sm">
                Avoid costly mistakes and get straight to the solution with targeted, actionable advice.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-3d-spline-primary to-3d-spline-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-3d-spline-text-primary mb-2">Personalized Approach</h3>
              <p className="text-3d-spline-text-secondary text-sm">
                Each consultation is tailored to your specific project, goals, and technical requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-3d-spline-primary to-3d-spline-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-3d-spline-text-primary mb-2">Proven Results</h3>
              <p className="text-3d-spline-text-secondary text-sm">
                Our clients consistently achieve better outcomes and faster project completion times.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-3d-spline-primary to-3d-spline-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-3d-spline-text-primary mb-2">Ongoing Support</h3>
              <p className="text-3d-spline-text-secondary text-sm">
                Get follow-up guidance and support to ensure your project stays on track.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-3d-spline-primary to-3d-spline-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-3d-spline-text-primary mb-2">Fast Turnaround</h3>
              <p className="text-3d-spline-text-secondary text-sm">
                Quick scheduling and immediate access to solutions when you need them most.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Process */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-3d-spline-text-primary mb-4">How Our Consultation Process Works</h2>
            <p className="text-lg text-3d-spline-text-secondary max-w-3xl mx-auto">A simple, effective process designed to get you the answers and guidance you need quickly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-3d-spline-primary to-3d-spline-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-3d-spline-text-primary mb-2">Book Your Session</h3>
              <p className="text-3d-spline-text-secondary text-sm">
                Choose your preferred consultation package and select a convenient time slot.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-3d-spline-primary to-3d-spline-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-3d-spline-text-primary mb-2">Prepare & Connect</h3>
              <p className="text-3d-spline-text-secondary text-sm">
                Receive confirmation and preparation materials, then join your consultation at the scheduled time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-3d-spline-primary to-3d-spline-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-3d-spline-text-primary mb-2">Get Expert Guidance</h3>
              <p className="text-3d-spline-text-secondary text-sm">
                Work directly with our professionals to address your specific questions and challenges.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-3d-spline-primary to-3d-spline-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-3d-spline-text-primary mb-2">Implement & Succeed</h3>
              <p className="text-3d-spline-text-secondary text-sm">
                Apply the insights and strategies from your consultation to achieve better results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-3d-spline-text-primary mb-4">Ready to Take Your Audio Projects to the Next Level?</h2>
          <p className="text-lg text-3d-spline-text-secondary mb-8">Book your consultation today and get the expert guidance you need to succeed.</p>
          <Button size="lg" variant="primary" onClick={() => setIsBookingFormOpen(true)}>
            Book Your Consultation Now
          </Button>
        </div>
      </div>

      {/* Consultation Booking Form Modal */}
      <ConsultationBookingForm
        isOpen={isBookingFormOpen}
        onClose={() => setIsBookingFormOpen(false)}
        onSuccess={handleBookingSuccess}
        onError={handleBookingError}
      />
    </>
  );
};

export async function getStaticProps() {
  return {
    props: {
      use3DSplineBackground: true,
    },
  };
}

export default ConsultationPage;
