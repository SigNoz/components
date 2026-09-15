import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
	mockLabelMeasurement,
	resetLabelMeasurement,
	resize,
	truncate,
} from '../../__tests__/test-utils.js';
import { RadioGroup } from '../radio-group.js';
import type { RadioGroupItemType } from '../types.js';

const LONG_LABEL = 'Production, the one every customer is looking at right now';

const ITEMS: RadioGroupItemType[] = [{ label: LONG_LABEL, value: 'production' }];

beforeAll(() => mockLabelMeasurement('radio-group-label'));
afterEach(resetLabelMeasurement);

describe('RadioGroup textOverflow=ellipsis', () => {
	it('marks the label truncated once it does not fit', () => {
		truncate();
		render(<RadioGroup color="primary" items={ITEMS} testId="group" />);

		expect(screen.getByText(LONG_LABEL)).toHaveAttribute('data-truncated');
	});

	it('shows the full label on hover', async () => {
		const user = userEvent.setup();
		truncate();
		render(<RadioGroup color="primary" items={ITEMS} />);

		await user.hover(screen.getByText(LONG_LABEL));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG_LABEL);
	});

	it('stacks an item reason above the full label, reason first', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<RadioGroup
				color="primary"
				items={[
					{
						label: LONG_LABEL,
						value: 'production',
						disabled: true,
						disabledTooltip: 'Ask an admin',
					},
				]}
			/>,
		);

		await user.hover(screen.getByText(LONG_LABEL));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip.textContent?.indexOf('Ask an admin')).toBeLessThan(
			tooltip.textContent?.indexOf(LONG_LABEL) ?? -1,
		);
	});

	it('says nothing while the label fits', async () => {
		const user = userEvent.setup();
		render(<RadioGroup color="primary" items={ITEMS} />);

		await user.hover(screen.getByText(LONG_LABEL));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('closes an open popup when a resize makes the label fit', async () => {
		const user = userEvent.setup();
		truncate();
		render(<RadioGroup color="primary" items={ITEMS} />);

		await user.hover(screen.getByText(LONG_LABEL));
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		resize(300, 300);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});
});

describe('RadioGroup textOverflow opt-outs', () => {
	it.each(['wrap', 'visible', 'hidden'] as const)(
		'never measures or explains for %s',
		async (textOverflow) => {
			const user = userEvent.setup();
			truncate();
			render(<RadioGroup color="primary" items={ITEMS} textOverflow={textOverflow} />);

			await user.hover(screen.getByText(LONG_LABEL));

			expect(screen.getByText(LONG_LABEL)).not.toHaveAttribute('data-truncated');
			expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
		},
	);
});
