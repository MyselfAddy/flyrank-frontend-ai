import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ToolInvocationView from '@/components/ToolInvocationView';
import type { ToolInvocation } from 'ai';
import type { WebsiteAnalysisResult } from '@/lib/tools/analyzeWebsite';

describe('ToolInvocationView Component', () => {
  it('renders partial-call state while input parameters are streaming', () => {
    const partialInvocation: ToolInvocation = {
      state: 'partial-call',
      toolCallId: 'call-1',
      toolName: 'analyzeWebsite',
      args: { url: 'https://examp' },
    };

    render(<ToolInvocationView invocation={partialInvocation} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Preparing website analysis')).toBeInTheDocument();
    expect(screen.getByText('Reading analysis request')).toBeInTheDocument();
  });

  it('renders call state with target URL while tool execution is in progress', () => {
    const callInvocation: ToolInvocation = {
      state: 'call',
      toolCallId: 'call-2',
      toolName: 'analyzeWebsite',
      args: { url: 'https://github.com' },
    };

    render(<ToolInvocationView invocation={callInvocation} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Website Analysis')).toBeInTheDocument();
    expect(screen.getByText('Analyzing')).toBeInTheDocument();
    expect(screen.getByText('https://github.com')).toBeInTheDocument();
    expect(screen.getByText('Executing server-side audit...')).toBeInTheDocument();
  });

  it('renders structured WebsiteAnalysisCard on successful tool result', () => {
    const mockResult: WebsiteAnalysisResult = {
      url: 'https://vercel.com',
      domain: 'vercel.com',
      title: 'Develop. Preview. Ship.',
      description: 'The platform for frontend developers.',
      https: true,
      seoScore: 95,
      accessibilityScore: 90,
      summary: 'Vercel is optimized for fast web deployment.',
    };

    const resultInvocation: ToolInvocation = {
      state: 'result',
      toolCallId: 'call-3',
      toolName: 'analyzeWebsite',
      args: { url: 'https://vercel.com' },
      result: mockResult,
    };

    render(<ToolInvocationView invocation={resultInvocation} />);

    expect(
      screen.getByRole('region', { name: /Website Analysis for vercel\.com/i })
    ).toBeInTheDocument();
    expect(screen.getByText('95 / 100')).toBeInTheDocument();
    expect(screen.getByText('90 / 100')).toBeInTheDocument();
    expect(screen.getByText('HTTPS Secure')).toBeInTheDocument();
  });

  it('renders error alert when tool returns an error or invalid URL payload', () => {
    const errorInvocation: ToolInvocation = {
      state: 'result',
      toolCallId: 'call-4',
      toolName: 'analyzeWebsite',
      args: { url: 'invalid-url' },
      result: {
        error: 'Invalid URL format. URL must start with http:// or https://',
      },
    };

    render(<ToolInvocationView invocation={errorInvocation} />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(
      screen.getByText(/Website analysis couldn't be completed/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Invalid URL format\. URL must start with http:\/\/ or https:\/\//i)
    ).toBeInTheDocument();
  });
});
