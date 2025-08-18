import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EnhancedFaq from '../components/shared/EnhancedFaq';

describe('EnhancedFaq', () => {
  const items = [
    { question: 'What is your refund policy?', answer: 'We offer a 30-day refund.' },
    { question: 'How long is turnaround?', answer: '3-5 business days.' }
  ];
  const categories = ['General'];

  it('renders FAQ questions and allows expanding answers', () => {
    render(<EnhancedFaq items={items} categories={categories} />);
    // Question is present
    expect(screen.getByText(/What is your refund policy/i)).toBeTruthy();
    // Expand answer
    fireEvent.click(screen.getByText(/What is your refund policy/i));
    expect(screen.getByText(/We offer a 30-day refund/i)).toBeTruthy();
  });
});