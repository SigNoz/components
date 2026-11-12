import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Checkbox } from '../checkbox.js';

let warn: MockInstance<typeof console.warn>;

beforeEach(() => {
	warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
	warn.mockRestore();
});

describe('Checkbox value rule', () => {
	it('starts at defaultValue and keeps its own state while value is undefined', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Checkbox color="primary" aria-label="Accept" defaultValue onChange={onChange} />);

		expect(screen.getByRole('checkbox')).toBeChecked();

		await user.click(screen.getByRole('checkbox'));

		expect(screen.getByRole('checkbox')).not.toBeChecked();
		expect(onChange).toHaveBeenCalledWith(false);
		expect(warn).not.toHaveBeenCalled();
	});

	it('follows a value that arrives after the first render, with one warning', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const { rerender } = render(
			<Checkbox color="primary" aria-label="Accept" onChange={onChange} />,
		);

		await user.click(screen.getByRole('checkbox'));

		expect(screen.getByRole('checkbox')).toBeChecked();

		rerender(<Checkbox color="primary" aria-label="Accept" value={false} onChange={onChange} />);

		expect(screen.getByRole('checkbox')).not.toBeChecked();
		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('Checkbox'));

		await user.click(screen.getByRole('checkbox'));

		expect(onChange).toHaveBeenLastCalledWith(true);
		expect(screen.getByRole('checkbox')).not.toBeChecked();

		rerender(<Checkbox color="primary" aria-label="Accept" value onChange={onChange} />);

		expect(screen.getByRole('checkbox')).toBeChecked();
		expect(warn).toHaveBeenCalledTimes(1);
	});

	it('follows a late indeterminate value', () => {
		const { rerender } = render(<Checkbox color="primary" aria-label="Select all" />);

		rerender(<Checkbox color="primary" aria-label="Select all" value="indeterminate" />);

		expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
		expect(warn).toHaveBeenCalledTimes(1);
	});

	it('shows unchecked when a controlled value turns undefined, and stays controlled', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const { rerender } = render(
			<Checkbox color="primary" aria-label="Accept" value onChange={onChange} />,
		);

		rerender(
			<Checkbox color="primary" aria-label="Accept" value={undefined} onChange={onChange} />,
		);

		expect(screen.getByRole('checkbox')).not.toBeChecked();

		await user.click(screen.getByRole('checkbox'));

		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole('checkbox')).not.toBeChecked();
		expect(warn).not.toHaveBeenCalled();
	});

	it('drops the mixed state when a controlled indeterminate value turns undefined', () => {
		const { rerender } = render(
			<Checkbox color="primary" aria-label="Select all" value="indeterminate" />,
		);

		expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');

		rerender(<Checkbox color="primary" aria-label="Select all" value={undefined} />);

		expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
		expect(warn).not.toHaveBeenCalled();
	});
});
