import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Switch } from '../switch.js';

let warn: MockInstance<typeof console.warn>;

beforeEach(() => {
	warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
	warn.mockRestore();
});

describe('Switch value rule', () => {
	it('starts at defaultValue and keeps its own state while value is undefined', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Switch
				color="primary"
				textPlacement="right"
				aria-label="Accept"
				defaultValue
				onChange={onChange}
			/>,
		);

		expect(screen.getByRole('switch')).toBeChecked();

		await user.click(screen.getByRole('switch'));

		expect(screen.getByRole('switch')).not.toBeChecked();
		expect(onChange).toHaveBeenCalledWith(false);
		expect(warn).not.toHaveBeenCalled();
	});

	it('follows a value that arrives after the first render, with one warning', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const { rerender } = render(
			<Switch color="primary" textPlacement="right" aria-label="Accept" onChange={onChange} />,
		);

		await user.click(screen.getByRole('switch'));

		expect(screen.getByRole('switch')).toBeChecked();

		rerender(
			<Switch
				color="primary"
				textPlacement="right"
				aria-label="Accept"
				value={false}
				onChange={onChange}
			/>,
		);

		expect(screen.getByRole('switch')).not.toBeChecked();
		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('Switch'));

		await user.click(screen.getByRole('switch'));

		expect(onChange).toHaveBeenLastCalledWith(true);
		expect(screen.getByRole('switch')).not.toBeChecked();

		rerender(
			<Switch
				color="primary"
				textPlacement="right"
				aria-label="Accept"
				value
				onChange={onChange}
			/>,
		);

		expect(screen.getByRole('switch')).toBeChecked();
		expect(warn).toHaveBeenCalledTimes(1);
	});

	it('shows off when a controlled value turns undefined, and stays controlled', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const { rerender } = render(
			<Switch
				color="primary"
				textPlacement="right"
				aria-label="Accept"
				value
				onChange={onChange}
			/>,
		);

		rerender(
			<Switch
				color="primary"
				textPlacement="right"
				aria-label="Accept"
				value={undefined}
				onChange={onChange}
			/>,
		);

		expect(screen.getByRole('switch')).not.toBeChecked();

		await user.click(screen.getByRole('switch'));

		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole('switch')).not.toBeChecked();
		expect(warn).not.toHaveBeenCalled();
	});
});
