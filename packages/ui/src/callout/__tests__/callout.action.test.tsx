import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Callout } from '../callout.js';

const icon = <svg />;

describe('Callout.Action', () => {
	it('renders the action after the description and leaves its click to it', async () => {
		const user = userEvent.setup();
		const onRefresh = vi.fn();
		render(
			<Callout.Action
				color="warning"
				size="sm"
				icon={icon}
				testId="c"
				action={
					<button type="button" onClick={onRefresh}>
						Refresh
					</button>
				}
			>
				New data is available.
			</Callout.Action>,
		);

		const action = screen.getByTestId('c-action');
		expect(action).toHaveAttribute('data-slot', 'callout-action');
		expect(screen.getByTestId('c-description').compareDocumentPosition(action)).toBe(
			Node.DOCUMENT_POSITION_FOLLOWING,
		);

		await user.click(screen.getByRole('button', { name: 'Refresh' }));

		expect(onRefresh).toHaveBeenCalledOnce();
		expect(screen.getByTestId('c')).toBeInTheDocument();
	});

	it('keeps the live region role of its color', () => {
		render(
			<Callout.Action color="danger" size="sm" icon={icon} testId="c" action="Retry">
				The request failed.
			</Callout.Action>,
		);

		expect(screen.getByTestId('c')).toHaveAttribute('role', 'alert');
		expect(screen.getByRole('alert')).toContainElement(screen.getByTestId('c-action'));
	});

	it('renders nothing while the children are empty', () => {
		render(
			<Callout.Action color="warning" size="sm" icon={icon} testId="c" action="Refresh">
				{null}
			</Callout.Action>,
		);

		expect(screen.queryByTestId('c')).not.toBeInTheDocument();
	});

	it('leaves out the action box while the action is empty', () => {
		render(
			<Callout.Action color="warning" size="sm" icon={icon} testId="c" action={false}>
				a
			</Callout.Action>,
		);

		expect(screen.getByTestId('c')).toBeInTheDocument();
		expect(screen.queryByTestId('c-action')).not.toBeInTheDocument();
	});
});
