import React from 'react';
import { render, screen } from '@testing-library/react';
import ServiceComparison from '../components/services/ServiceComparison';
import { Service } from '../types/service';

// Mock services data for testing
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Basic Mixing',
    price: 99,
    turnaround: '3-5 days',
    features: ['2 revisions', 'Up to 8 stems', 'WAV delivery'],
    category: 'mixing',
    description: 'Basic mixing service',
    is_active: true,
    created_at: '2025-01-01',
    updated_at: '2025-01-01'
  },
  {
    id: '2', 
    name: 'Premium Mastering',
    price: 199,
    turnaround: '1-2 days',
    features: ['1 revision', 'Up to 2 stems', 'WAV delivery'],
    category: 'mastering',
    description: 'Premium mastering service',
    is_active: true,
    created_at: '2025-01-01',
    updated_at: '2025-01-01'
  }
];

describe('ServiceComparison', () => {
  it('renders the service comparison table and service names', () => {
    render(<ServiceComparison services={mockServices} />);
    // Table heading
    expect(screen.getByText(/Service Comparison/i)).toBeTruthy();
    // At least one service name
    expect(screen.getByText(mockServices[0].name)).toBeTruthy();
  });

  it('renders all provided services', () => {
    render(<ServiceComparison services={mockServices} />);
    // Check all service names are rendered
    mockServices.forEach(service => {
      expect(screen.getByText(service.name)).toBeTruthy();
    });
  });

  it('handles empty services array', () => {
    render(<ServiceComparison services={[]} />);
    // Table heading should still be present
    expect(screen.getByText(/Service Comparison/i)).toBeTruthy();
  });

  it('renders table with proper accessibility attributes', () => {
    render(<ServiceComparison services={mockServices} />);
    // Check for table role and aria-label
    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('aria-label', 'Service comparison table');
    
    // Check for proper table structure
    expect(screen.getByRole('columnheader', { name: 'Feature name' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'Basic Mixing service details' })).toBeTruthy();
  });

  it('displays service prices correctly', () => {
    render(<ServiceComparison services={mockServices} />);
    // Check that prices are displayed
    expect(screen.getByText('$99')).toBeTruthy();
    expect(screen.getByText('$199')).toBeTruthy();
  });

  it('renders stems supported information', () => {
    render(<ServiceComparison services={mockServices} />);
    // Check that stems supported row is present
    expect(screen.getByText('Stems Supported')).toBeTruthy();
  });
});