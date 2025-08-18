import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import AnimatedSection from '../ui/AnimatedSection';

interface Testimonial {
  id: string;
  name: string;
  artist: string;
  content: string;
  rating: number;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    artist: 'Luna & The Stars',
    content: 'The mixing and mastering service completely transformed our track. The clarity and depth they achieved is incredible. Highly recommend!',
    rating: 5,
    avatar: '/assets/avatar-1.jpg'
  },
  {
    id: '2',
    name: 'Marcus Chen',
    artist: 'MC Flow',
    content: 'Professional quality at an affordable price. The team really understood our vision and delivered exactly what we needed.',
    rating: 5,
    avatar: '/assets/avatar-2.jpg'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    artist: 'Neon Pulse',
    content: 'Fast turnaround time and exceptional quality. The before/after difference was mind-blowing. Will definitely work with them again!',
    rating: 5,
    avatar: '/assets/avatar-3.jpg'
  },
  {
    id: '4',
    name: 'David Kim',
    artist: 'The Wanderers',
    content: 'Outstanding service from start to finish. They took our raw recordings and turned them into radio-ready tracks.',
    rating: 5,
    avatar: '/assets/avatar-4.jpg'
  }
];

const TestimonialsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-amber' : 'text-neutral-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
          <section className="py-20 bg-gradient-testimonial">
      <div className="container mx-auto px-4 max-w-6xl">
        <AnimatedSection delay={150}>
          <h2 className="text-section lg:text-display-small font-bold text-white text-center mb-4">
            What Our Clients Say
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={250}>
          <p className="text-body text-neutral-300 text-center mb-12 max-w-2xl mx-auto">
            Don&apos;t just take our word for it - hear from artists who&apos;ve transformed their sound with us
          </p>
        </AnimatedSection>

        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Testimonial Card */}
          <AnimatedSection delay={350}>
            <Card className="text-center p-8 lg:p-12">
              <div className="flex justify-center mb-6">
                {renderStars(testimonials[currentIndex].rating)}
              </div>
              
                              <blockquote className="text-body text-neutral-200 mb-8 italic">
                &ldquo;{testimonials[currentIndex].content}&rdquo;
              </blockquote>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-amber rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-card-title">
                    {testimonials[currentIndex].name.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">{testimonials[currentIndex].name}</p>
                  <p className="text-sm text-neutral-400">{testimonials[currentIndex].artist}</p>
                </div>
              </div>
            </Card>
          </AnimatedSection>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-amber' : 'bg-neutral-600 hover:bg-neutral-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel; 