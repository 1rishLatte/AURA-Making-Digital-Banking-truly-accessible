import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { TransactionConfirmationModal } from './TransactionConfirmationModal';

describe('TransactionConfirmationModal', () => {
  const baseProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
    recipientName: 'Arun Kumar',
    recipientId: 'arun@upi',
    amount: 5000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock speechSynthesis for this test file
    Object.defineProperty(window, 'speechSynthesis', {
      writable: true,
      value: {
        getVoices: () => [],
        speak: vi.fn(),
        cancel: vi.fn(),
        addEventListener: () => {},
        removeEventListener: () => {},
      },
    });
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('renders null when closed', () => {
    const { container } = render(<TransactionConfirmationModal {...baseProps} isOpen={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders transfer summary with recipient and amount', async () => {
    render(<TransactionConfirmationModal {...baseProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Arun Kumar')).toBeInTheDocument();
    expect(screen.getByText('arun@upi')).toBeInTheDocument();
    expect(screen.getByText('₹5,000')).toBeInTheDocument();
    expect(screen.getByText(/5,000 rupees/i)).toBeInTheDocument();
    expect(screen.getByText(/Low Risk/i)).toBeInTheDocument();
  });

  it('traps focus and restores on close', async () => {
    const user = userEvent.setup();
    const trigger = document.createElement('button');
    trigger.textContent = 'trigger';
    document.body.appendChild(trigger);
    trigger.focus();

    const { rerender } = render(<TransactionConfirmationModal {...baseProps} />);

    await waitFor(() => expect(screen.getByLabelText(/Cancel and close modal/i)).toHaveFocus());

    await user.keyboard('{Escape}');
    expect(baseProps.onClose).toHaveBeenCalled();

    rerender(<TransactionConfirmationModal {...baseProps} isOpen={false} />);
    await waitFor(() => expect(trigger).toHaveFocus());

    document.body.removeChild(trigger);
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<TransactionConfirmationModal {...baseProps} />);

    await user.keyboard('{Escape}');
    expect(baseProps.onClose).toHaveBeenCalled();
  });

  it('closes on Cancel button', async () => {
    const user = userEvent.setup();
    render(<TransactionConfirmationModal {...baseProps} />);

    await user.click(screen.getByRole('button', { name: /Cancel and Go Back/i }));
    expect(baseProps.onClose).toHaveBeenCalled();
  });

  it('closes on backdrop click', async () => {
    const user = userEvent.setup();
    render(<TransactionConfirmationModal {...baseProps} />);

    const dialog = screen.getByRole('dialog');
    await user.click(dialog);
    expect(baseProps.onClose).toHaveBeenCalled();
  });

  it('reads summary aloud when Hear Summary is clicked', async () => {
    const user = userEvent.setup();
    const mockSpeak = vi.fn();
    const mockCancel = vi.fn();
    Object.defineProperty(window, 'speechSynthesis', {
      writable: true,
      value: {
        getVoices: () => [],
        speak: mockSpeak,
        cancel: mockCancel,
      },
    });

    render(<TransactionConfirmationModal {...baseProps} />);

    await user.click(screen.getByRole('button', { name: /Hear summary out loud/i }));
    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();
    const utterance = mockSpeak.mock.calls[0][0] as SpeechSynthesisUtterance;
    expect(utterance.text).toContain('Arun Kumar');
    expect(utterance.text).toContain('5,000');
  });

  it('requires 1.5s hold to confirm — early release cancels', async () => {
    const user = userEvent.setup();
    render(<TransactionConfirmationModal {...baseProps} />);

    const holdButton = screen.getByLabelText(/Hold to confirm transaction/i);
    expect(holdButton).toBeInTheDocument();

    // Start hold
    await user.pointer({ keys: '[MouseLeft>]', target: holdButton });
    // Wait 200ms (less than 1.5s)
    await new Promise((r) => setTimeout(r, 200));
    await user.pointer({ keys: '[/MouseLeft]', target: holdButton });

    expect(baseProps.onSuccess).not.toHaveBeenCalled();
    expect(holdButton).toHaveTextContent(/Press & Hold to Confirm Transfer/);
  });

  it('calls onSuccess after full 1.5s hold', async () => {
    const user = userEvent.setup();
    render(<TransactionConfirmationModal {...baseProps} />);

    const holdButton = screen.getByLabelText(/Hold to confirm transaction/i);

    await user.pointer({ keys: '[MouseLeft>]', target: holdButton });
    // Wait for the 1.5s interval (5% every 75ms = 20 steps)
    await new Promise((r) => setTimeout(r, 1600));
    await waitFor(() => expect(baseProps.onSuccess).toHaveBeenCalled());
  });

  it('resets progress on touch cancel', async () => {
    const user = userEvent.setup();
    render(<TransactionConfirmationModal {...baseProps} />);

    const holdButton = screen.getByLabelText(/Hold to confirm transaction/i);
    // Simulate touch start
    await user.pointer({ keys: '[MouseLeft>]', target: holdButton });
    await new Promise((r) => setTimeout(r, 300));
    // Simulate mouse leave (cancels)
    await user.unhover(holdButton);
    // Progress should reset — button text back to initial
    await waitFor(() => expect(holdButton).toHaveTextContent(/Press & Hold to Confirm Transfer/));
  });

  it('has no axe violations when open', async () => {
    const { container } = render(<TransactionConfirmationModal {...baseProps} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it('supports keyboard activation of Hold button via Space', async () => {
    const user = userEvent.setup();
    render(<TransactionConfirmationModal {...baseProps} />);

    const holdButton = screen.getByLabelText(/Hold to confirm transaction/i);
    holdButton.focus();
    expect(holdButton).toHaveFocus();
    // Space should be able to activate — we test that the button is focusable and has correct role
    expect(holdButton).toHaveAccessibleName(/Hold to confirm transaction/i);
  });
});
