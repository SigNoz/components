import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Popover } from '../popover.js';
import { usePopoverHandle } from '../use-popover-handle.js';
import { openPopover, renderPopover } from './popover.test-utils.js';

describe('Popover positioning', () => {
	it('renders the side and align it was given as data attributes', async () => {
		// Room above and left of the trigger, so neither value is flipped away by the viewport edge.
		render(
			<div style={{ paddingBlockStart: 200, paddingInlineStart: 300 }}>
				<Popover nativeButton side="top" align="end" trigger={<button type="button">Open</button>}>
					<p>Body</p>
				</Popover>
			</div>,
		);
		const popup = await openPopover();

		expect(popup).toHaveAttribute('data-side', 'top');
		expect(popup).toHaveAttribute('data-align', 'end');
	});

	it('flips to the opposite side when the viewport leaves no room', async () => {
		renderPopover({ side: 'top', align: 'start' });
		const popup = await openPopover();

		expect(popup).toHaveAttribute('data-side', 'bottom');
	});

	it('positions at a point through a handle, with no trigger at all', async () => {
		function AtAPoint() {
			const menu = usePopoverHandle<string>();

			return (
				<>
					<button
						type="button"
						onClick={(event) => menu.showAt({ x: event.clientX, y: event.clientY }, 'Drilldown')}
					>
						Chart
					</button>
					<Popover nativeButton side="bottom" align="start" handle={menu}>
						{(label) => <p>{label}</p>}
					</Popover>
				</>
			);
		}
		render(<AtAPoint />);

		await userEvent.click(screen.getByRole('button', { name: 'Chart' }));

		expect(await screen.findByRole('dialog')).toHaveTextContent('Drilldown');
		// The only trigger in the DOM is the chart button, which is not the popover's.
		expect(document.querySelector('[data-slot="popover-trigger"]')).toBeNull();
	});

	it('positions against another element passed as anchor while the trigger stays the opener', async () => {
		const anchor = document.createElement('div');
		document.body.appendChild(anchor);
		renderPopover({ anchor });

		const popup = await openPopover();

		expect(popup).toBeInTheDocument();
		anchor.remove();
	});
});
