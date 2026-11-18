import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ToggleGroupField } from '../presets/toggle-group-field.js';
import { ToggleGroup } from '../toggle-group.js';
import type { ToggleGroupItemProps } from '../types.js';

const ITEMS: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List' },
	{ value: 'grid', label: 'Grid' },
	{ value: 'table', label: 'Table' },
];

const MANY_ITEMS: ToggleGroupItemProps[] = Array.from({ length: 8 }, (_, index) => ({
	value: `item-${index}`,
	label: `Option ${index}`,
}));

describe('ToggleGroup onBlur', () => {
	it('is called once when the focus leaves the bar', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		render(
			<>
				<ToggleGroup
					type="single"
					variant="outlined"
					color="secondary"
					size="md"
					items={ITEMS}
					defaultValue="list"
					onBlur={onBlur}
				/>
				<button type="button">Next</button>
			</>,
		);

		await user.tab();

		expect(screen.getByRole('button', { name: 'List' })).toHaveFocus();
		expect(onBlur).not.toHaveBeenCalled();

		await user.tab();

		expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
		expect(onBlur).toHaveBeenCalledTimes(1);
	});

	it('is not called while the focus moves between the buttons', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		render(
			<ToggleGroup
				type="multiple"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				defaultValue={['list']}
				onBlur={onBlur}
			/>,
		);

		await user.tab();
		await user.keyboard('{ArrowRight}{ArrowRight}');

		expect(screen.getByRole('button', { name: 'Table' })).toHaveFocus();
		expect(onBlur).not.toHaveBeenCalled();
	});

	it('is not called while the focus moves to a scroll arrow of the bar', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		render(
			<div style={{ width: 160 }}>
				<ToggleGroup
					type="single"
					variant="outlined"
					color="secondary"
					size="md"
					width="100%"
					items={MANY_ITEMS}
					defaultValue="item-0"
					onBlur={onBlur}
				/>
			</div>,
		);

		await waitFor(() =>
			expect(screen.getByRole('button', { name: 'Scroll options right' })).toBeInTheDocument(),
		);
		await user.tab();
		await user.tab();

		expect(screen.getByRole('button', { name: 'Scroll options right' })).toHaveFocus();
		expect(onBlur).not.toHaveBeenCalled();
	});

	it('is accepted by ToggleGroupField', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		render(
			<>
				<ToggleGroupField
					label="Layout"
					type="single"
					variant="outlined"
					color="secondary"
					size="md"
					items={ITEMS}
					defaultValue="list"
					onBlur={onBlur}
				/>
				<button type="button">Next</button>
			</>,
		);

		await user.tab();
		await user.tab();

		expect(onBlur).toHaveBeenCalledTimes(1);
	});
});
