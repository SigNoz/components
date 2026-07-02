import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { TooltipProvider, TooltipSimple } from '../tooltip/index.js';
import { DropdownMenuSimple } from './index.js';

const menu = { items: [{ key: '1', label: 'Action 1' }] };

describe('DropdownMenuSimple tooltip compatibility', () => {
	it('forwards ref to the trigger button (not the content)', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<DropdownMenuSimple ref={ref} menu={menu}>
				<button type="button">Open</button>
			</DropdownMenuSimple>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
		expect(ref.current).toHaveAttribute('data-slot', 'dropdown-menu-trigger');
	});

	it('forwards leftover props onto the trigger', () => {
		render(
			<DropdownMenuSimple menu={menu} aria-describedby="tip-1">
				<button type="button">Open</button>
			</DropdownMenuSimple>
		);
		expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute(
			'aria-describedby',
			'tip-1'
		);
	});

	it('opens the tooltip on hover when wrapped in TooltipSimple', async () => {
		const user = userEvent.setup();
		render(
			<TooltipProvider delayDuration={0}>
				<TooltipSimple title="Menu tooltip">
					<DropdownMenuSimple menu={menu}>
						<button type="button">Open</button>
					</DropdownMenuSimple>
				</TooltipSimple>
			</TooltipProvider>
		);

		await user.hover(screen.getByRole('button', { name: 'Open' }));

		await waitFor(() => {
			expect(screen.getAllByText('Menu tooltip').length).toBeGreaterThan(0);
		});
	});
});
