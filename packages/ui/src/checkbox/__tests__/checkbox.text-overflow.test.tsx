import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
	mockLabelMeasurement,
	resetLabelMeasurement,
	resize,
	truncate,
} from '../../__tests__/test-utils.js';
import { Checkbox } from '../checkbox.js';

const LONG_LABEL = 'Accept the terms and conditions of the service before continuing';

beforeAll(() => mockLabelMeasurement('checkbox-label'));
afterEach(resetLabelMeasurement);

describe('Checkbox textOverflow=ellipsis', () => {
	it('marks the label truncated once it does not fit', () => {
		truncate();
		render(<Checkbox color="primary">{LONG_LABEL}</Checkbox>);

		expect(screen.getByText(LONG_LABEL)).toHaveAttribute('data-truncated');
	});

	it('shows the full label on hover', async () => {
		const user = userEvent.setup();
		truncate();
		render(<Checkbox color="primary">{LONG_LABEL}</Checkbox>);

		await user.hover(screen.getByText(LONG_LABEL));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG_LABEL);
	});

	it('says nothing while the label fits', async () => {
		const user = userEvent.setup();
		render(<Checkbox color="primary">{LONG_LABEL}</Checkbox>);

		await user.hover(screen.getByText(LONG_LABEL));

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('unmarks the label when a resize makes it fit', async () => {
		truncate();
		render(<Checkbox color="primary">{LONG_LABEL}</Checkbox>);
		expect(screen.getByText(LONG_LABEL)).toHaveAttribute('data-truncated');

		resize(300, 300);

		await waitFor(() => expect(screen.getByText(LONG_LABEL)).not.toHaveAttribute('data-truncated'));
	});
});

describe('Checkbox textOverflow opt-outs', () => {
	it.each(['wrap', 'visible', 'hidden'] as const)(
		'never measures or explains for %s',
		async (textOverflow) => {
			const user = userEvent.setup();
			truncate();
			render(
				<Checkbox color="primary" textOverflow={textOverflow}>
					{LONG_LABEL}
				</Checkbox>,
			);

			await user.hover(screen.getByText(LONG_LABEL));

			expect(screen.getByText(LONG_LABEL)).not.toHaveAttribute('data-truncated');
			await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
		},
	);
});
