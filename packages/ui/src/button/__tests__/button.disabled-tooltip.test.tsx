import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../button.js';
import { queryOpenTooltip } from './test-utils.js';

const REASON = 'You need write access to edit alerts';

describe('Button disabledTooltip', () => {
	it('shows the reason on hover', async () => {
		const user = userEvent.setup();
		render(
			<Button size="md" variant="solid" color="primary" disabled disabledTooltip={REASON}>
				Delete alert
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(REASON);
	});

	it('shows the reason on keyboard focus', async () => {
		const user = userEvent.setup();
		render(
			<Button size="md" variant="solid" color="primary" disabled disabledTooltip={REASON}>
				Delete alert
			</Button>,
		);

		await user.tab();

		expect(await screen.findByRole('tooltip')).toHaveTextContent(REASON);
	});

	it('hides the reason again when the pointer leaves', async () => {
		const user = userEvent.setup();
		render(
			<Button size="md" variant="solid" color="primary" disabled disabledTooltip={REASON}>
				Delete alert
			</Button>,
		);
		const button = screen.getByRole('button');

		await user.hover(button);
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		await user.unhover(button);

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('hides the reason again on blur', async () => {
		const user = userEvent.setup();
		render(
			<>
				<Button size="md" variant="solid" color="primary" disabled disabledTooltip={REASON}>
					Delete alert
				</Button>
				<input data-testid="input" />
			</>,
		);

		await user.tab();
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		await user.tab();

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('renders a rich reason, not only text', async () => {
		const user = userEvent.setup();
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				disabled
				disabledTooltip={<span data-testid="reason">Ask an admin</span>}
			>
				Delete alert
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		expect(await screen.findByTestId('reason')).toBeInTheDocument();
	});

	it('ties the button to the popup with aria-describedby', async () => {
		const user = userEvent.setup();
		render(
			<Button size="md" variant="solid" color="primary" disabled disabledTooltip={REASON}>
				Delete alert
			</Button>,
		);
		const button = screen.getByRole('button');

		await user.hover(button);

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip.id).toBeTruthy();
		expect(button).toHaveAttribute('aria-describedby', tooltip.id);
	});

	it('points aria-describedby at nothing while there is no popup', () => {
		render(
			<Button size="md" variant="solid" color="primary" disabled={false} disabledTooltip={REASON}>
				Delete alert
			</Button>,
		);

		expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby');
	});
});

describe('Button disabledTooltip while usable', () => {
	it('says nothing while the button is enabled', async () => {
		const user = userEvent.setup();
		render(
			<Button size="md" variant="solid" color="primary" disabled={false} disabledTooltip={REASON}>
				Delete alert
			</Button>,
		);
		const button = screen.getByRole('button');

		await user.hover(button);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
		expect(button).toHaveAttribute('aria-disabled', 'false');
	});

	it('stops saying it the moment the button becomes usable', async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<Button size="md" variant="solid" color="primary" disabled disabledTooltip={REASON}>
				Delete alert
			</Button>,
		);

		await user.hover(screen.getByRole('button'));
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		rerender(
			<Button size="md" variant="solid" color="primary" disabled={false} disabledTooltip={REASON}>
				Delete alert
			</Button>,
		);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('is never mounted when there is no reason to give', async () => {
		const user = userEvent.setup();
		render(
			<Button size="md" variant="solid" color="primary">
				Delete alert
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});
});

describe('Button disabledTooltip while loading', () => {
	it('says nothing while loading, busy is not unavailable', async () => {
		const user = userEvent.setup();
		render(
			<Button size="md" variant="solid" color="primary" loading disabled disabledTooltip={REASON}>
				Deleting…
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('is still not natively disabled while loading and disabled at once', () => {
		render(
			<Button size="md" variant="solid" color="primary" loading disabled disabledTooltip={REASON}>
				Deleting…
			</Button>,
		);

		const button = screen.getByRole('button');
		expect(button).toBeEnabled();
		expect(button).toHaveAttribute('aria-disabled', 'true');
		expect(button).toHaveAttribute('aria-busy', 'true');
	});

	it('shows the reason again once loading ends', async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<Button size="md" variant="solid" color="primary" loading disabled disabledTooltip={REASON}>
				Deleting…
			</Button>,
		);

		rerender(
			<Button
				size="md"
				variant="solid"
				color="primary"
				loading={false}
				disabled
				disabledTooltip={REASON}
			>
				Delete alert
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(REASON);
	});

	it('does not pop back open when the reason disappears and returns with the pointer away', async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<Button size="md" variant="solid" color="primary" disabled disabledTooltip={REASON}>
				Delete alert
			</Button>,
		);
		const button = screen.getByRole('button');

		await user.hover(button);
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		rerender(
			<Button size="md" variant="solid" color="primary" loading disabled disabledTooltip={REASON}>
				Deleting…
			</Button>,
		);
		await user.unhover(button);

		rerender(
			<Button size="md" variant="solid" color="primary" disabled disabledTooltip={REASON}>
				Delete alert
			</Button>,
		);

		await waitFor(() => expect(queryOpenTooltip()).toBeNull());
	});
});

describe('Button disabledTooltip element identity', () => {
	it('keeps the same element as the tooltip content is mounted and unmounted', () => {
		const { rerender } = render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				disabled={false}
				disabledTooltip={REASON}
				testId="btn"
			>
				Delete alert
			</Button>,
		);
		const button = screen.getByTestId('btn');

		rerender(
			<Button
				size="md"
				variant="solid"
				color="primary"
				disabled
				disabledTooltip={REASON}
				testId="btn"
			>
				Delete alert
			</Button>,
		);
		expect(screen.getByTestId('btn')).toBe(button);

		rerender(
			<Button
				size="md"
				variant="solid"
				color="primary"
				disabled={false}
				disabledTooltip={REASON}
				testId="btn"
			>
				Delete alert
			</Button>,
		);
		expect(screen.getByTestId('btn')).toBe(button);
	});

	it('keeps forwarding testId and data attributes through the tooltip trigger', () => {
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				disabled
				disabledTooltip={REASON}
				testId="btn"
				data-foo="bar"
			>
				Delete alert
			</Button>,
		);

		expect(screen.getByTestId('btn')).toHaveAttribute('data-foo', 'bar');
	});
});
