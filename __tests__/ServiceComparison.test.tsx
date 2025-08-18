import React from 'react';
import { render, screen } from '@testing-library/react';
import ServiceComparison from '../components/services/ServiceComparison';
import { SERVICE_PACKAGES } from '../lib/pricing-config';

describe('ServiceComparison', () => {
  it('renders the service comparison table and service names', () => {
    render(<ServiceComparison />);
    // Table heading
    expect(screen.getByText(/Service Comparison/i)).toBeTruthy();
    // At least one service name
    expect(screen.getByText(SERVICE_PACKAGES[0].name)).toBeTruthy();
  });
});