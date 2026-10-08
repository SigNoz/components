import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { AlertStrip } from '../alert-strip.js';

describe('AlertStrip.Button', () => {
	it('renders a small solid button with its slot and testId', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<AlertStrip color="warning" side="bottom">
				Trial ends soon.
				<AlertStrip.Button testId="b" onClick={onClick}>
					Upgrade
				</AlertStrip.Button>
			</AlertStrip>,
		);

		const button = screen.getByRole('button', { name: 'Upgrade' });
		expect(button).toHaveAttribute('data-testid', 'b');
		expect(button).toHaveAttribute('data-slot', 'alert-strip-button');
		expect(button).toHaveAttribute('data-variant', 'solid');
		expect(button).toHaveAttribute('data-size', 'sm');

		await user.click(button);

		expect(onClick).toHaveBeenCalledOnce();
	});

	it('forwards the ref to the button', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<AlertStrip color="primary" side="bottom">
				<AlertStrip.Button ref={ref}>Retry</AlertStrip.Button>
			</AlertStrip>,
		);

		expect(ref.current).toBe(screen.getByRole('button', { name: 'Retry' }));
	});

	it('keeps loading from Button and stays focusable', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<AlertStrip color="danger" side="bottom">
				<AlertStrip.Button loading onClick={onClick}>
					Pay the bill
				</AlertStrip.Button>
			</AlertStrip>,
		);

		const button = screen.getByRole('button', { name: 'Pay the bill' });
		expect(button).toHaveAttribute('aria-busy', 'true');

		await user.tab();
		expect(button).toHaveFocus();
		await user.click(button);
		expect(onClick).not.toHaveBeenCalled();
	});

	it('drops a suffix that gets past the types', () => {
		const props = { suffix: <svg data-testid="suffix" /> };
		render(
			<AlertStrip color="primary" side="bottom">
				<AlertStrip.Button {...(props as object)}>Retry</AlertStrip.Button>
			</AlertStrip>,
		);

		expect(screen.queryByTestId('suffix')).not.toBeInTheDocument();
	});
});
