import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ForceOpenProvider } from '../../testing/index.js';
import { Popover } from '../popover.js';
import { usePopoverHandle } from '../use-popover-handle.js';

function positionerZIndex(): string {
	const positioner = screen.getByRole('dialog').closest('[data-slot="popover-positioner"]');

	return getComputedStyle(positioner as Element).zIndex;
}

function renderInLayer(layer?: { position: string; zIndex: number }) {
	const popover = (
		<Popover nativeButton side="bottom" align="start" trigger={<button type="button">Open</button>}>
			<p>Body</p>
		</Popover>
	);

	return render(layer ? <div style={layer}>{popover}</div> : popover, {
		wrapper: ForceOpenProvider,
	});
}

describe('Popover layer', () => {
	it('keeps the default z-index for a trigger outside any layer', () => {
		renderInLayer();

		expect(positionerZIndex()).toBe('50');
	});

	it('stacks just above the layer of a trigger inside a fixed overlay', () => {
		renderInLayer({ position: 'fixed', zIndex: 1000 });

		expect(positionerZIndex()).toBe('1001');
	});

	it('never goes below --popover-z-index', () => {
		renderInLayer({ position: 'relative', zIndex: 10 });

		expect(positionerZIndex()).toBe('50');
	});

	// There is no trigger to read, so the layer has to come from where the popup is being shown.
	it('reads the layer from the element a handle shows it at', async () => {
		function Menu(): JSX.Element {
			const menu = usePopoverHandle();

			return (
				<>
					<div style={{ position: 'fixed', zIndex: 1000 }}>
						<button type="button" onClick={(event) => menu.showAt(event.currentTarget)}>
							Open
						</button>
					</div>
					<Popover side="bottom" align="start" aria-label="Actions" handle={menu}>
						<p>Body</p>
					</Popover>
				</>
			);
		}
		render(<Menu />);

		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		await screen.findByRole('dialog');

		expect(positionerZIndex()).toBe('1001');
	});

	it('reads the layer from the point a handle shows it at', async () => {
		function Chart(): JSX.Element {
			const menu = usePopoverHandle();

			return (
				<>
					<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
						<button
							type="button"
							onClick={(event) => menu.showAt({ x: event.clientX, y: event.clientY })}
						>
							Chart
						</button>
					</div>
					<Popover side="bottom" align="start" aria-label="Actions" handle={menu}>
						<p>Body</p>
					</Popover>
				</>
			);
		}
		render(<Chart />);

		await userEvent.click(screen.getByRole('button', { name: 'Chart' }));
		await screen.findByRole('dialog');

		expect(positionerZIndex()).toBe('1001');
	});
});
