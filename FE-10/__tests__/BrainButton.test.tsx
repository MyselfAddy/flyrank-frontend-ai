import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrainButton } from '@/components/BrainButton';
import { BrainActionButton } from '@/components/BrainActionButton';

describe('BrainButton Component (FE-AA1)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders in idle state with proper accessible label and classes', () => {
    render(
      <BrainButton
        labels={{ idle: 'Send AI message' }}
        id="test-btn"
      />
    );

    const button = screen.getByRole('button', { name: /Send AI message/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'false');
    expect(button).toHaveAttribute('aria-live', 'polite');
  });

  it('transitions from idle to loading upon click, disabling spam-click duplicate runs', async () => {
    const user = userEvent.setup({ delay: null });
    const onClick = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(true), 1000))
    );

    render(
      <BrainButton
        onClick={onClick}
        labels={{ idle: 'Send', loading: 'Thinking...' }}
      />
    );

    const button = screen.getByRole('button', { name: /Send/i });
    
    // First click
    act(() => {
      fireEvent.click(button);
    });

    // Expect loading state
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Thinking...')).toBeInTheDocument();
    expect(onClick).toHaveBeenCalledTimes(1);

    // Spam click attempt while loading
    act(() => {
      fireEvent.click(button);
    });
    expect(onClick).toHaveBeenCalledTimes(1); // Still 1, spam click prevented!
  });

  it('transitions to success state and automatically resets to idle after autoResetSuccessMs', async () => {
    const onClick = vi.fn().mockResolvedValue(true);

    render(
      <BrainButton
        onClick={onClick}
        labels={{ idle: 'Send', success: 'Sent!' }}
        autoResetSuccessMs={600}
      />
    );

    const button = screen.getByRole('button', { name: /Send/i });
    act(() => {
      fireEvent.click(button);
    });

    // Fast-forward promises
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Check success moment
    expect(screen.getByText('Sent!')).toBeInTheDocument();

    // Fast-forward autoResetSuccess timer
    await act(async () => {
      vi.advanceTimersByTime(600);
    });

    // Back to idle
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('transitions to error state on failure, allows retry which executes operation again', async () => {
    let callCount = 0;
    const onClick = vi.fn().mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        return false; // first run fails
      }
      return true; // second run succeeds
    });

    render(
      <BrainButton
        onClick={onClick}
        labels={{ idle: 'Send', error: 'Failed', retry: 'Retry' }}
      />
    );

    const button = screen.getByRole('button', { name: /Send/i });
    act(() => {
      fireEvent.click(button);
    });

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Button should now display Retry
    expect(screen.getByText('Retry')).toBeInTheDocument();
    expect(onClick).toHaveBeenCalledTimes(1);

    // User clicks Retry
    act(() => {
      fireEvent.click(button);
    });

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('respects disabled prop and prevents clicks', () => {
    const onClick = vi.fn();
    render(
      <BrainButton
        disabled={true}
        onClick={onClick}
        labels={{ idle: 'Send' }}
      />
    );

    const button = screen.getByRole('button', { name: /Send/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('supports deterministic forceOutcome="success"', async () => {
    const onStatusChange = vi.fn();
    render(
      <BrainButton
        forceOutcome="success"
        asyncDurationMs={100}
        onStatusChange={onStatusChange}
      />
    );

    const button = screen.getByRole('button');
    act(() => {
      fireEvent.click(button);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(150);
    });

    expect(onStatusChange).toHaveBeenCalledWith('loading', 'idle');
    expect(onStatusChange).toHaveBeenCalledWith('success', 'loading');
  });

  it('supports deterministic forceOutcome="error"', async () => {
    const onStatusChange = vi.fn();
    render(
      <BrainButton
        forceOutcome="error"
        asyncDurationMs={100}
        onStatusChange={onStatusChange}
      />
    );

    const button = screen.getByRole('button');
    act(() => {
      fireEvent.click(button);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(150);
    });

    expect(onStatusChange).toHaveBeenCalledWith('loading', 'idle');
    expect(onStatusChange).toHaveBeenCalledWith('error', 'loading');
  });

  it('renders properly in reduced motion mode', () => {
    render(
      <BrainButton
        forceReducedMotion={true}
        labels={{ idle: 'Send' }}
      />
    );

    const button = screen.getByRole('button', { name: /Send/i });
    expect(button).toBeInTheDocument();
  });
});

describe('BrainActionButton Component', () => {
  it('renders and triggers secondary AI action micro-interaction', async () => {
    vi.useFakeTimers();
    const onTrigger = vi.fn().mockResolvedValue(true);

    render(
      <BrainActionButton
        label="Enhance Prompt"
        loadingLabel="Optimizing..."
        successLabel="Optimized!"
        onTrigger={onTrigger}
      />
    );

    const button = screen.getByRole('button', { name: /Enhance Prompt/i });
    act(() => {
      fireEvent.click(button);
    });

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(onTrigger).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    vi.useRealTimers();
  });
});
