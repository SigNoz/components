import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Pill } from '../pill.js';

describe('Pill disabled', () => {
	it('is a native disabled button, not reachable by Tab', async () => {
		const user = userEvent.setup();
		render(
			<Pill variant="outlined" color="primary" disabled>
				Filter
			</Pill>,
		);

		expect(screen.getByRole('button')).toBeDisabled();

		await user.tab();
		expect(screen.getByRole('button')).not.toHaveFocus();
	});

	it('does not call onClick when disabled', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Pill variant="outlined" color="primary" disabled onClick={onClick}>
				Filter
			</Pill>,
		);

		await user.click(screen.getByRole('button'), { pointerEventsCheck: 0 });

		expect(onClick).not.toHaveBeenCalled();
	});

	it('is enabled by default', () => {
		render(
			<Pill variant="outlined" color="primary">
				Filter
			</Pill>,
		);

		expect(screen.getByRole('button')).toBeEnabled();
	});
});

describe('Pill.Closeable disabled', () => {
	it('marks the body aria-disabled and drops it from the tab order', () => {
		render(
			<Pill.Closeable onClose={vi.fn()} disabled>
				env:prod
			</Pill.Closeable>,
		);

		const body = screen.getByRole('button', { name: 'env:prod' });
		expect(body).toHaveAttribute('aria-disabled', 'true');
		expect(body).toHaveAttribute('tabindex', '-1');
	});

	it('disables the close button natively', () => {
		render(
			<Pill.Closeable onClose={vi.fn()} disabled>
				env:prod
			</Pill.Closeable>,
		);

		expect(screen.getByRole('button', { name: 'Remove env:prod' })).toBeDisabled();
	});

	it('does not call onClick or onClose when disabled', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const onClose = vi.fn();
		render(
			<Pill.Closeable onClick={onClick} onClose={onClose} disabled>
				env:prod
			</Pill.Closeable>,
		);

		await user.click(screen.getByRole('button', { name: 'env:prod' }), { pointerEventsCheck: 0 });
		await user.click(screen.getByRole('button', { name: 'Remove env:prod' }), {
			pointerEventsCheck: 0,
		});

		expect(onClick).not.toHaveBeenCalled();
		expect(onClose).not.toHaveBeenCalled();
	});
});
