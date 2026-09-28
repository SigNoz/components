import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Switch } from '../switch.js';

const DISABLED_REASON = 'Ask an admin to unlock this setting';
const READ_ONLY_REASON = 'Saving your changes';

describe('Switch disabledTooltip', () => {
	it('shows the reason on hover', async () => {
		const user = userEvent.setup();
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				disabled
				disabledTooltip={DISABLED_REASON}
			>
				Wrap text
			</Switch>,
		);

		await user.hover(screen.getByTestId('switch'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(DISABLED_REASON);
	});

	it('shows the reason from the label too: the whole row is the trigger', async () => {
		const user = userEvent.setup();
		render(
			<Switch color="primary" textPlacement="right" disabled disabledTooltip={DISABLED_REASON}>
				Wrap text
			</Switch>,
		);

		await user.hover(screen.getByText('Wrap text'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(DISABLED_REASON);
	});

	it('shows the reason on a bare switch as well', async () => {
		const user = userEvent.setup();
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				aria-label="Wrap text"
				disabled
				disabledTooltip={DISABLED_REASON}
			/>,
		);

		await user.hover(screen.getByTestId('switch'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(DISABLED_REASON);
	});

	it('hides the reason again when the pointer leaves', async () => {
		const user = userEvent.setup();
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				disabled
				disabledTooltip={DISABLED_REASON}
			>
				Wrap text
			</Switch>,
		);
		const root = screen.getByTestId('switch');

		await user.hover(root);
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		await user.unhover(root);

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('renders a rich reason, not only text', async () => {
		const user = userEvent.setup();
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				disabled
				disabledTooltip={<span data-testid="reason">Ask an admin</span>}
			>
				Wrap text
			</Switch>,
		);

		await user.hover(screen.getByTestId('switch'));

		expect(await screen.findByTestId('reason')).toBeInTheDocument();
	});

	it('says nothing while the switch is usable', async () => {
		const user = userEvent.setup();
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				disabled={false}
				disabledTooltip={DISABLED_REASON}
			>
				Wrap text
			</Switch>,
		);

		await user.hover(screen.getByTestId('switch'));

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});
});

describe('Switch readOnlyTooltip', () => {
	it('shows the reason on hover', async () => {
		const user = userEvent.setup();
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
			>
				Wrap text
			</Switch>,
		);

		await user.hover(screen.getByTestId('switch'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(READ_ONLY_REASON);
	});

	it('takes the place of the disabled reason while both are set', async () => {
		const user = userEvent.setup();
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				disabled
				disabledTooltip={DISABLED_REASON}
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
			>
				Wrap text
			</Switch>,
		);

		await user.hover(screen.getByTestId('switch'));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent(READ_ONLY_REASON);
		expect(tooltip).not.toHaveTextContent(DISABLED_REASON);
	});
});

describe('Switch tooltip stacking', () => {
	it('stacks the reason above the truncated label, reason first', async () => {
		const user = userEvent.setup();
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				width={120}
				disabled
				disabledTooltip={DISABLED_REASON}
			>
				A label far too long for a one hundred and twenty pixel row
			</Switch>,
		);

		await user.hover(screen.getByTestId('switch'));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent(DISABLED_REASON);
		expect(tooltip).toHaveTextContent('A label far too long');
		expect(tooltip.textContent?.indexOf(DISABLED_REASON)).toBeLessThan(
			tooltip.textContent?.indexOf('A label far too long') ?? -1,
		);
	});
});
