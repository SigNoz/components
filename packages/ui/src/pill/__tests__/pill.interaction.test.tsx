import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Pill } from '../pill.js';

describe('Pill pointer interaction', () => {
	it('calls onClick with the pill as the event target', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Pill variant="outlined" color="primary" onClick={onClick}>
				env:prod
			</Pill>,
		);

		const pill = screen.getByRole('button', { name: 'env:prod' });
		await user.click(pill);

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick.mock.calls[0]?.[0].target).toBe(pill);
	});

	it('calls onClick once per click', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Pill variant="outlined" color="primary" onClick={onClick}>
				env:prod
			</Pill>,
		);

		const pill = screen.getByRole('button');
		await user.click(pill);
		await user.click(pill);
		await user.click(pill);

		expect(onClick).toHaveBeenCalledTimes(3);
	});

	it('does not activate on hover alone', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Pill variant="outlined" color="primary" onClick={onClick}>
				env:prod
			</Pill>,
		);

		await user.hover(screen.getByRole('button'));

		expect(onClick).not.toHaveBeenCalled();
	});
});

describe('Pill keyboard interaction', () => {
	it('activates on Enter', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Pill variant="outlined" color="primary" onClick={onClick}>
				env:prod
			</Pill>,
		);

		screen.getByRole('button').focus();
		await user.keyboard('{Enter}');

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('activates on Space', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Pill variant="outlined" color="primary" onClick={onClick}>
				env:prod
			</Pill>,
		);

		screen.getByRole('button').focus();
		await user.keyboard('[Space]');

		expect(onClick).toHaveBeenCalledTimes(1);
	});
});

describe('Pill focus', () => {
	it('is reachable by Tab', async () => {
		const user = userEvent.setup();
		render(
			<Pill variant="outlined" color="primary">
				env:prod
			</Pill>,
		);

		await user.tab();

		expect(screen.getByRole('button')).toHaveFocus();
	});
});
