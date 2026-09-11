import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { Button } from '../button.js';
import {
	mockLabelMeasurement,
	resetLabelMeasurement,
	truncate,
} from '../../__tests__/test-utils.js';

const BUSY = 'Deleting the rules, this can take a minute';
const REASON = 'You need write access to edit alerts';
const LABEL = 'Delete every alert rule in this workspace';

beforeAll(() => mockLabelMeasurement('button-label'));
afterEach(resetLabelMeasurement);

describe('Button loadingTooltip', () => {
	it('says what the button is busy with on hover', async () => {
		const user = userEvent.setup();
		render(
			<Button size="md" variant="solid" color="primary" loading loadingTooltip={BUSY}>
				Delete alert
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(BUSY);
	});

	it('says nothing while the button is idle', async () => {
		const user = userEvent.setup();
		render(
			<Button size="md" variant="solid" color="primary" loading={false} loadingTooltip={BUSY}>
				Delete alert
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('takes the place of the disabled reason while loading', async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				loading
				loadingTooltip={BUSY}
				disabled
				disabledTooltip={REASON}
			>
				Delete alert
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent(BUSY);
		expect(tooltip).not.toHaveTextContent(REASON);

		rerender(
			<Button
				size="md"
				variant="solid"
				color="primary"
				loading={false}
				loadingTooltip={BUSY}
				disabled
				disabledTooltip={REASON}
			>
				Delete alert
			</Button>,
		);

		expect(await screen.findByRole('tooltip')).toHaveTextContent(REASON);
	});

	it('stacks above the truncated label, busy first', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Button size="md" variant="solid" color="primary" loading loadingTooltip={BUSY}>
				{LABEL}
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent(`${BUSY}${LABEL}`);
		expect(tooltip.querySelector('[data-slot="tooltip-divider"]')).toBeInTheDocument();
	});
});
