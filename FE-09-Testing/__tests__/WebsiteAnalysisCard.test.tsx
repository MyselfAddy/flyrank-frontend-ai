import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import WebsiteAnalysisCard from '@/components/WebsiteAnalysisCard';
import type { WebsiteAnalysisResult } from '@/lib/tools/analyzeWebsite';

describe('WebsiteAnalysisCard Component', () => {
  const mockResult: WebsiteAnalysisResult = {
    url: 'https://example.com',
    domain: 'example.com',
    title: 'Example Domain',
    description: 'This domain is for use in illustrative examples in documents.',
    https: true,
    seoScore: 92,
    accessibilityScore: 88,
    summary:
      'The domain example.com is fully secured with HTTPS and meets high SEO and accessibility standards.',
  };

  it('renders domain name and audit region heading', () => {
    render(<WebsiteAnalysisCard result={mockResult} />);

    expect(
      screen.getByRole('region', { name: /Website Analysis for example\.com/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'example.com' })).toBeInTheDocument();
  });

  it('renders verified HTTPS secure badge and link', () => {
    render(<WebsiteAnalysisCard result={mockResult} />);

    expect(screen.getByText('HTTPS Secure')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /https:\/\/example\.com/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders HTTP Insecure badge when https is false', () => {
    const insecureResult: WebsiteAnalysisResult = {
      ...mockResult,
      https: false,
      url: 'http://insecure-site.org',
      domain: 'insecure-site.org',
    };

    render(<WebsiteAnalysisCard result={insecureResult} />);

    expect(screen.getByText('HTTP Insecure')).toBeInTheDocument();
  });

  it('renders accessible progressbars for SEO and Accessibility scores', () => {
    render(<WebsiteAnalysisCard result={mockResult} />);

    const seoProgress = screen.getByRole('progressbar', { name: /SEO Score/i });
    expect(seoProgress).toHaveAttribute('aria-valuenow', '92');
    expect(screen.getByText('92 / 100')).toBeInTheDocument();

    const a11yProgress = screen.getByRole('progressbar', { name: /Accessibility Score/i });
    expect(a11yProgress).toHaveAttribute('aria-valuenow', '88');
    expect(screen.getByText('88 / 100')).toBeInTheDocument();
  });

  it('renders title, description, and executive summary content', () => {
    render(<WebsiteAnalysisCard result={mockResult} />);

    expect(screen.getByText('Example Domain')).toBeInTheDocument();
    expect(
      screen.getByText('This domain is for use in illustrative examples in documents.')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'The domain example.com is fully secured with HTTPS and meets high SEO and accessibility standards.'
      )
    ).toBeInTheDocument();
  });
});
