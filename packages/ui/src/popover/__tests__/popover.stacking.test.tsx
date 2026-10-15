import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CSSProperties } from 'react';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../../tooltip/presets/tooltip.js';
import { Popover } from '../popover.js';
import { usePopoverHandle } from '../use-popover-handle.js';

// Another library keeps a fixed ladder of its own — antd puts its modal and drawer at 1000, its
// dropdown at 1050 — and an app runs both ladders at once for as long as a migration lasts. A
// popup of ours opened from inside one of those layers has to clear it.
const FOREIGN_MODAL: CSSProperties = { position: 'fixed', inset: 0, zIndex: 1000 };

function isOnTop(element: Element): boolean {
	const { left, top, width, height } = element.getBoundingClientRect();

	return element.contains(document.elementFromPoint(left + width / 2, top + height / 2));
}

function zIndexOf(slot: string, role: string, name?: string): number {
	const positioner = screen.getByRole(role, { name }).closest(`[data-slot="${slot}"]`);

	return Number.parseInt(getComputedStyle(positioner as Element).zIndex, 10);
}

describe('Popover stacking', () => {
	it('shows a tooltip opened from inside the popup above it', async () => {
		const user = userEvent.setup();
		render(
			<Popover
				nativeButton
				side="bottom"
				align="start"
				aria-label="Actions"
				trigger={<button type="button">Open</button>}
			>
				<Tooltip title="Copies the span id">
					<button type="button">Copy</button>
				</Tooltip>
			</Popover>,
		);

		await user.click(screen.getByRole('button', { name: 'Open' }));
		await user.hover(await screen.findByRole('button', { name: 'Copy' }));
		await screen.findByRole('tooltip');

		expect(zIndexOf('tooltip-positioner', 'tooltip')).toBeGreaterThan(
			zIndexOf('popover-positioner', 'dialog'),
		);
		expect(isOnTop(screen.getByRole('tooltip'))).toBe(true);
	});

	it('stacks above a modal from another library the trigger sits in', async () => {
		const user = userEvent.setup();
		render(
			<div style={FOREIGN_MODAL}>
				<Popover
					nativeButton
					side="bottom"
					align="start"
					aria-label="Actions"
					trigger={<button type="button">Open</button>}
				>
					<p>Body</p>
				</Popover>
			</div>,
		);

		await user.click(screen.getByRole('button', { name: 'Open' }));

		expect(isOnTop(await screen.findByRole('dialog'))).toBe(true);
	});

	// The handle is the one route with no trigger to read the layer from.
	it('stacks above that modal when the popup is shown from a handle', async () => {
		function Menu(): JSX.Element {
			const menu = usePopoverHandle();

			return (
				<div style={FOREIGN_MODAL}>
					<button type="button" onClick={(event) => menu.showAt(event.currentTarget)}>
						Open
					</button>
					<Popover nativeButton side="bottom" align="start" aria-label="Actions" handle={menu}>
						<p>Body</p>
					</Popover>
				</div>
			);
		}
		const user = userEvent.setup();
		render(<Menu />);

		await user.click(screen.getByRole('button', { name: 'Open' }));

		expect(isOnTop(await screen.findByRole('dialog'))).toBe(true);
	});

	it('stays under a modal that covers a trigger outside it', async () => {
		const user = userEvent.setup();
		render(
			<>
				<Popover
					nativeButton
					side="bottom"
					align="start"
					aria-label="Actions"
					trigger={<button type="button">Open</button>}
				>
					<p>Body</p>
				</Popover>
				<div style={FOREIGN_MODAL} />
			</>,
		);

		await user.click(screen.getByRole('button', { name: 'Open' }));

		expect(zIndexOf('popover-positioner', 'dialog')).toBeLessThan(1000);
	});
});
