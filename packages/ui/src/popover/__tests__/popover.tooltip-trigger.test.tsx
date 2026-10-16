import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../../tooltip/presets/tooltip.js';
import { Popover } from '../popover.js';
import { usePopoverHandle } from '../use-popover-handle.js';

/**
 * A trigger that both names itself on hover and opens a popup on a press.
 *
 * Wrapping the trigger in a `Tooltip` does not give you that: a non-stacked Tooltip routes every
 * prop it does not recognise to its own popup, so the press handlers the popover merges in never
 * reach the button. A trigger that needs a tooltip is driven by a handle instead.
 */
describe('Popover with a tooltipped trigger', () => {
	it('does not open from a tooltip-wrapped trigger', async () => {
		render(
			<Popover
				nativeButton
				side="bottom"
				align="end"
				testId="export"
				aria-label="Export"
				trigger={
					<Tooltip title="Download">
						<button type="button">Download</button>
					</Tooltip>
				}
			>
				<p>Formats</p>
			</Popover>,
		);

		await userEvent.click(screen.getByRole('button', { name: 'Download' }));

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});

	it('opens from a handle the tooltipped button drives', async () => {
		function Export(): JSX.Element {
			const menu = usePopoverHandle();

			return (
				<>
					<Tooltip title="Download">
						<button type="button" onClick={(event) => menu.showAt(event.currentTarget)}>
							Download
						</button>
					</Tooltip>
					<Popover side="bottom" align="end" aria-label="Export" handle={menu}>
						<p>Formats</p>
					</Popover>
				</>
			);
		}
		render(<Export />);

		await userEvent.click(screen.getByRole('button', { name: 'Download' }));

		expect(await screen.findByRole('dialog')).toHaveTextContent('Formats');
	});

	it('still shows the tooltip on hover', async () => {
		const user = userEvent.setup();
		render(
			<Popover
				nativeButton
				side="bottom"
				align="end"
				aria-label="Export"
				trigger={
					<Tooltip title="Download">
						<button type="button">Download</button>
					</Tooltip>
				}
			>
				<p>Formats</p>
			</Popover>,
		);

		await user.hover(screen.getByRole('button', { name: 'Download' }));

		await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Download'));
	});
});
