import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { ConsultationPackage } from '../lib/consultation';
import ConsultationBookingForm from '../components/consultation/ConsultationBookingForm';
import Button from '../components/ui/Button';

const ConsultationPage: NextPage = () => {
  const [packages, setPackages] = useState<ConsultationPackage[]>([]);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleBookingSuccess = (consultation: any) => {
    // You can add success notification here
    console.log('Consultation booked successfully:', consultation);
  };

  const handleBookingError = (error: string) => {
    // You can add error notification here
    console.error('Booking error:', error);
    alert(`Booking failed: ${error}`);
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
        <title>Professional Consultation Services | Audio Service App</title>
        <meta name="description" content="Book professional audio engineering and music production consultations. Get expert advice, project planning, and technical guidance tailored to your needs." />
        <meta name="keywords" content="audio consultation, music production consultation, audio engineering, professional advice, project planning" />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Audio Consultation
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-emerald-100 max-w-3xl mx-auto">
            Get expert guidance from industry professionals to elevate your audio projects and achieve your creative vision.
          </p>
          <Button
            size="lg"
            onClick={() => setIsBookingFormOpen(true)}
            className="text-lg px-8 py-4"
          >
            Book Your Consultation
          </Button>
        </div>
      </section>

      {/* Consultation Packages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Consultation Package
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer flexible consultation options to meet your specific needs, from quick discovery calls to comprehensive project planning sessions.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-500">Loading consultation packages...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-8 text-center">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                      <div className="text-4xl font-bold text-emerald-600 mb-2">
                        {formatPrice(pkg.price_cents)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDuration(pkg.duration_minutes)}
                      </div>
                    </div>

                    {pkg.description && (
                      <p className="text-gray-600 mb-6">{pkg.description}</p>
                    )}

                    {pkg.features && pkg.features.length > 0 && (
                      <ul className="text-left space-y-2 mb-8">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    <Button
                      onClick={() => setIsBookingFormOpen(true)}
                      className="w-full"
                      variant={pkg.price_cents === 0 ? 'secondary' : 'premium'}
                    >
                      Book {pkg.name}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Our Consultations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Consultations?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized, professional guidance that helps you make informed decisions and achieve your audio production goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Knowledge</h3>
              <p className="text-gray-600">
                Access to industry professionals with years of experience in audio engineering and music production.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Time-Saving</h3>
              <p className="text-gray-600">
                Avoid costly mistakes and get straight to the solution with targeted, actionable advice.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Approach</h3>
              <p className="text-gray-600">
                Each consultation is tailored to your specific project, goals, and technical requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Proven Results</h3>
              <p className="text-gray-600">
                Our clients consistently achieve better outcomes and faster project completion times.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ongoing Support</h3>
              <p className="text-gray-600">
                Get follow-up guidance and support to ensure your project stays on track.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Turnaround</h3>
              <p className="text-gray-600">
                Quick scheduling and immediate access to solutions when you need them most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Our Consultation Process Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple, effective process designed to get you the answers and guidance you need quickly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Book Your Session</h3>
              <p className="text-gray-600">
                Choose your preferred consultation package and select a convenient time slot.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Prepare & Connect</h3>
              <p className="text-gray-600">
                Receive confirmation and preparation materials, then join your consultation at the scheduled time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Expert Guidance</h3>
              <p className="text-gray-600">
                Work directly with our professionals to address your specific questions and challenges.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Implement & Succeed</h3>
              <p className="text-gray-600">
                Apply the insights and strategies from your consultation to achieve better results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take Your Audio Projects to the Next Level?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Book your consultation today and get the expert guidance you need to succeed.
          </p>
          <Button
            size="lg"
            onClick={() => setIsBookingFormOpen(true)}
            className="text-lg px-8 py-4 bg-white text-emerald-900 hover:bg-gray-100"
          >
            Book Your Consultation Now
          </Button>
        </div>
      </section>

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

export default ConsultationPage;
