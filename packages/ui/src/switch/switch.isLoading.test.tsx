import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from './index.js';

describe('Switch — isLoading', () => {
	it('renders the spinner when isLoading is true', () => {
		render(<Switch isLoading />);
		expect(screen.getByTestId('switch-loading-icon')).toBeInTheDocument();
	});

	it('does not render the spinner when isLoading is false', () => {
		render(<Switch isLoading={false} />);
		expect(screen.queryByTestId('switch-loading-icon')).not.toBeInTheDocument();
	});

	it('sets data-loading attribute when isLoading is true', () => {
		render(<Switch isLoading />);
		expect(screen.getByRole('switch')).toHaveAttribute('data-loading');
	});

	it('does not set data-loading attribute when isLoading is false', () => {
		render(<Switch isLoading={false} />);
		expect(screen.getByRole('switch')).not.toHaveAttribute('data-loading');
	});

	it('disables the switch when isLoading is true', () => {
		const { container } = render(<Switch isLoading />);

		// The interactive root is not a native form control, so it conveys the
		// state with aria-disabled; the native `disabled` sits on the hidden
		// input that carries the value into a form.
		expect(screen.getByRole('switch')).toHaveAttribute('aria-disabled', 'true');
		expect(container.querySelector('input[type="checkbox"]')).toBeDisabled();
	});

	it('sets aria-busy when isLoading is true', () => {
		render(<Switch isLoading />);
		expect(screen.getByRole('switch')).toHaveAttribute('aria-busy', 'true');
	});

	it('does not set aria-busy when isLoading is false', () => {
		render(<Switch isLoading={false} />);
		expect(screen.getByRole('switch')).not.toHaveAttribute('aria-busy');
	});

	it('does not fire onChange while loading', () => {
		const onChange = vi.fn();
		render(<Switch isLoading onChange={onChange} />);
		fireEvent.click(screen.getByRole('switch'));
		expect(onChange).not.toHaveBeenCalled();
	});

	it('loading styles take precedence over disabled when both are set', () => {
		render(<Switch isLoading disabled />);
		const switchEl = screen.getByRole('switch');
		expect(switchEl).toHaveAttribute('data-loading');
		expect(switchEl).toHaveAttribute('aria-disabled', 'true');
		expect(screen.getByTestId('switch-loading-icon')).toBeInTheDocument();
	});
});
