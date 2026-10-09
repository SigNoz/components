import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import {
	mockLabelMeasurement,
	resetLabelMeasurement,
	truncate,
} from '../../__tests__/test-utils.js';
import { Callout } from '../callout.js';

const icon = <svg />;

afterEach(resetLabelMeasurement);

describe('Callout.Expandable title tooltip', () => {
	const TITLE = 'A title that is far too long to fit in the title row of the callout';

	function renderExpandable() {
		return render(
			<Callout.Expandable
				color="primary"
				size="sm"
				icon={icon}
				testId="c"
				title={TITLE}
				defaultExpanded
			>
				a
			</Callout.Expandable>,
		);
	}

	it('shows the whole title on hover once it is truncated', async () => {
		const user = userEvent.setup();
		mockLabelMeasurement('callout-title');
		truncate();
		renderExpandable();

		await user.hover(screen.getByText(TITLE));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(TITLE);
	});

	it('shows the whole title on keyboard focus too', async () => {
		const user = userEvent.setup();
		mockLabelMeasurement('callout-title');
		truncate();
		renderExpandable();

		await user.tab();

		expect(screen.getByRole('button', { name: TITLE })).toHaveFocus();
		expect(await screen.findByRole('tooltip')).toHaveTextContent(TITLE);
	});

	it('shows no tooltip while the title fits', async () => {
		const user = userEvent.setup();
		mockLabelMeasurement('callout-title');
		renderExpandable();

		await user.hover(screen.getByText(TITLE));

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});
});
