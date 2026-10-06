import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from '../input.js';

const DISABLED_REASON = 'Ask an admin to unlock this field';
const READ_ONLY_REASON = 'Saving your changes';

describe('Input tooltips', () => {
	it('opens disabledTooltip on hover', async () => {
		const user = userEvent.setup();
		render(
			<Input aria-label="Organisation" disabled disabledTooltip={DISABLED_REASON} testId="org" />,
		);

		// Browsers swallow pointer events over a disabled control, which would keep a pointer
		// inside the field from ever hovering the frame. The disabled input opts out of pointer
		// events entirely, so the frame underneath takes the hover and the tooltip opens.
		expect(getComputedStyle(screen.getByRole('textbox')).pointerEvents).toBe('none');

		await user.hover(screen.getByTestId('org'));

		await waitFor(() => {
			expect(screen.getByText(DISABLED_REASON)).toBeInTheDocument();
		});
	});

	it('opens readOnlyTooltip on hover', async () => {
		const user = userEvent.setup();
		render(
			<Input aria-label="Organisation" readOnly readOnlyTooltip={READ_ONLY_REASON} testId="org" />,
		);

		await user.hover(screen.getByTestId('org'));

		await waitFor(() => {
			expect(screen.getByText(READ_ONLY_REASON)).toBeInTheDocument();
		});
	});

	it('shows the read-only reason, not the disabled one, while both are set', async () => {
		const user = userEvent.setup();
		render(
			<Input
				aria-label="Organisation"
				disabled
				disabledTooltip={DISABLED_REASON}
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
				testId="org"
			/>,
		);

		await user.hover(screen.getByTestId('org'));

		await waitFor(() => {
			expect(screen.getByText(READ_ONLY_REASON)).toBeInTheDocument();
		});
		expect(screen.queryByText(DISABLED_REASON)).toBeNull();
	});

	it('shows no tooltip while the field is enabled, whatever the reasons say', async () => {
		const user = userEvent.setup();
		render(
			<div>
				<Input aria-label="Organisation" testId="org" />
				<span>elsewhere</span>
			</div>,
		);

		await user.hover(screen.getByTestId('org'));
		await user.hover(screen.getByText('elsewhere'));

		expect(screen.queryByText(DISABLED_REASON)).toBeNull();
	});

	it('opens the reason tooltip on the members too', async () => {
		const user = userEvent.setup();
		render(
			<Input.Number aria-label="Count" disabled disabledTooltip={DISABLED_REASON} testId="count" />,
		);

		await user.hover(screen.getByTestId('count'));

		await waitFor(() => {
			expect(screen.getByText(DISABLED_REASON)).toBeInTheDocument();
		});
	});
});
