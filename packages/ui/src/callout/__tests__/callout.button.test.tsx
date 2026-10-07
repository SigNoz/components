import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Callout } from '../callout.js';

const icon = <svg />;

afterEach(() => vi.restoreAllMocks());

describe('Callout.Button', () => {
	it('renders a small solid button in the color of the callout', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Callout.Action
				color="warning"
				size="md"
				icon={icon}
				action={
					<Callout.Button testId="b" onClick={onClick}>
						Refresh
					</Callout.Button>
				}
			>
				New data is available.
			</Callout.Action>,
		);

		const button = screen.getByRole('button', { name: 'Refresh' });
		expect(button).toHaveAttribute('data-testid', 'b');
		expect(button).toHaveAttribute('data-slot', 'callout-button');
		expect(button).toHaveAttribute('data-variant', 'solid');
		expect(button).toHaveAttribute('data-color', 'warning');
		expect(button).toHaveAttribute('data-size', 'sm');

		await user.click(button);

		expect(onClick).toHaveBeenCalledOnce();
	});

	it('takes the color of the nearest callout', () => {
		render(
			<Callout color="danger" size="sm" icon={icon}>
				The request failed.{' '}
				<Callout color="info" size="sm" icon={icon}>
					<Callout.Button>Retry</Callout.Button>
				</Callout>
			</Callout>,
		);

		expect(screen.getByRole('button', { name: 'Retry' })).toHaveAttribute('data-color', 'info');
	});

	it('forwards the ref to the button', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Callout color="primary" size="sm" icon={icon}>
				<Callout.Button ref={ref}>Retry</Callout.Button>
			</Callout>,
		);

		expect(ref.current).toBe(screen.getByRole('button', { name: 'Retry' }));
	});

	it('renders as secondary and warns outside a callout', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(<Callout.Button>Retry</Callout.Button>);

		expect(screen.getByRole('button', { name: 'Retry' })).toHaveAttribute(
			'data-color',
			'secondary',
		);
		expect(warn).toHaveBeenCalled();
	});
});
