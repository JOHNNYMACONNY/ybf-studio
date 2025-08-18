import React from 'react';
import { render, screen } from '@testing-library/react';
import LicenseComparison from '../components/beats/LicenseComparison';
import { BEAT_LICENSES } from '../lib/pricing-config';

describe('LicenseComparison', () => {
  it('renders the license comparison grid and license names', () => {
    render(<LicenseComparison />);
    // Grid heading
    expect(screen.getByText(/License Comparison/i)).toBeTruthy();
    // At least one license name
    expect(screen.getByText(BEAT_LICENSES[0].name)).toBeTruthy();
  });
});