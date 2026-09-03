import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { StepNavigation, STEPS } from './StepNavigation';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}));

describe('StepNavigation', () => {
  it('renders all 5 steps', () => {
    render(<StepNavigation />);
    expect(screen.getByRole('navigation', { name: /Dashboard Steps/i })).toBeInTheDocument();
    STEPS.forEach((step) => {
      expect(screen.getByRole('tab', { name: new RegExp(step.title, 'i') })).toBeInTheDocument();
    });
  });

  it('highlights active step and not others', () => {
    render(<StepNavigation activeStep={3} onSelectStep={vi.fn()} />);
    const activeTab = screen.getByRole('tab', { name: /Send Money/i });
    expect(activeTab).toHaveAttribute('aria-selected', 'true');
    expect(activeTab).toHaveAttribute('aria-current', 'step');
    expect(activeTab.className).toContain('bg-[#141414]');
    expect(activeTab.className).toContain('border-[#53adfe]');

    const inactiveTab = screen.getByRole('tab', { name: /Home/i });
    expect(inactiveTab).toHaveAttribute('aria-selected', 'false');
    expect(inactiveTab.className).toContain('bg-[#0f111a]');
  });

  it('calls onSelectStep when tab clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<StepNavigation activeStep={1} onSelectStep={onSelect} />);

    await user.click(screen.getByRole('tab', { name: /Your Account/i }));
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it('is a single horizontal row on mobile (no wrap)', () => {
    render(<StepNavigation />);
    const nav = screen.getByRole('navigation');
    const tablist = nav.querySelector('[role="tablist"]');
    expect(tablist?.className).toContain('flex');
    expect(tablist?.className).toContain('overflow-x-auto');
    expect(tablist?.className).not.toContain('grid-rows');
  });

  it('has no axe violations', async () => {
    const { container } = render(<StepNavigation activeStep={1} onSelectStep={vi.fn()} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<StepNavigation activeStep={1} onSelectStep={onSelect} />);

    const firstTab = screen.getByRole('tab', { name: /Home/i });
    firstTab.focus();
    expect(firstTab).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
