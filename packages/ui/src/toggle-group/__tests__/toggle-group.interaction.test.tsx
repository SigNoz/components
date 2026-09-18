import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ToggleGroup } from '../toggle-group.js';
import type { ToggleGroupItemProps } from '../types.js';

const ITEMS: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List' },
	{ value: 'grid', label: 'Grid' },
	{ value: 'table', label: 'Table' },
];

describe('ToggleGroup selection', () => {
	it('reports the pressed value as a string on a single bar', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				defaultValue="list"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Grid' }));

		expect(onChange).toHaveBeenCalledWith('grid');
		expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'false');
	});

	it('holds the pressed button down when it is pressed again', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				defaultValue="list"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'List' }));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
	});

	it('reports the empty string once allowClear releases the pressed button', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				defaultValue="list"
				allowClear
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'List' }));

		expect(onChange).toHaveBeenCalledWith('');
		expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'false');
	});

	it('keeps the last pressed button of a multiple bar down, and releases the others', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="multiple"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				defaultValue={['list', 'grid']}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Grid' }));

		expect(onChange).toHaveBeenCalledWith(['list']);

		await user.click(screen.getByRole('button', { name: 'List' }));

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
	});

	it('reports the empty array once allowClear releases the last pressed button', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="multiple"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				defaultValue={['list']}
				allowClear
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'List' }));

		expect(onChange).toHaveBeenCalledWith([]);
	});

	it('presses the first button of a bar that starts empty', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Grid' }));

		expect(onChange).toHaveBeenCalledWith('grid');
	});

	it('reports every pressed value as an array on a multiple bar', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="multiple"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				defaultValue={['list']}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Table' }));

		expect(onChange).toHaveBeenCalledWith(expect.arrayContaining(['list', 'table']));
		expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByRole('button', { name: 'Table' })).toHaveAttribute('aria-pressed', 'true');
	});

	it('holds a controlled bar at its value until the call site moves it', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				value="list"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Grid' }));

		expect(onChange).toHaveBeenCalledWith('grid');
		expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'false');
		expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
	});

	it('moves focus between the buttons with the arrow keys, looping at the end', async () => {
		const user = userEvent.setup();
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				defaultValue="list"
			/>,
		);

		await user.tab();
		expect(screen.getByRole('button', { name: 'List' })).toHaveFocus();

		await user.keyboard('{ArrowRight}');
		expect(screen.getByRole('button', { name: 'Grid' })).toHaveFocus();

		await user.keyboard('{ArrowRight}{ArrowRight}');
		expect(screen.getByRole('button', { name: 'List' })).toHaveFocus();
	});
});

describe('ToggleGroup disabled', () => {
	it('blocks one disabled item without taking its events', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				defaultValue="logs"
				onChange={onChange}
				items={[
					{ value: 'logs', label: 'Logs' },
					{
						value: 'profiles',
						label: 'Profiles',
						disabled: true,
						disabledTooltip: 'Profiling is not enabled',
					},
				]}
			/>,
		);

		const profiles = screen.getByRole('button', { name: 'Profiles' });

		expect(profiles).toHaveAttribute('aria-disabled', 'true');
		// The native attribute would take every pointer event with it, and the tooltip with them.
		expect(profiles).not.toBeDisabled();

		await user.click(profiles);

		expect(onChange).not.toHaveBeenCalled();
		expect(profiles).toHaveAttribute('aria-pressed', 'false');
	});

	// The two paths reach the button differently: the bar's prop lands as the native attribute, an
	// item's own lands as `aria-disabled`. Only the cursor is asserted, because it is the one value
	// here that is a literal rather than a design token the runner does not load.
	it('marks both disabled paths as blocked rather than clickable', () => {
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				defaultValue="logs"
				items={[
					{ value: 'logs', label: 'Logs' },
					{
						value: 'profiles',
						label: 'Profiles',
						disabled: true,
						disabledTooltip: 'Profiling is not enabled',
					},
				]}
			/>,
		);

		expect(getComputedStyle(screen.getByRole('button', { name: 'Profiles' })).cursor).toBe(
			'not-allowed',
		);
		expect(getComputedStyle(screen.getByRole('button', { name: 'Logs' })).cursor).toBe('pointer');
	});

	it('marks every button of a disabled bar as blocked', () => {
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				defaultValue="list"
				disabled
				disabledTooltip="This workspace is read only"
			/>,
		);

		for (const button of screen.getAllByRole('button')) {
			expect(getComputedStyle(button).cursor).toBe('not-allowed');
		}
	});

	it('blocks every button while the bar is disabled', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				defaultValue="list"
				onChange={onChange}
				disabled
				disabledTooltip="This workspace is read only"
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Grid' }));

		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('ToggleGroup readOnly', () => {
	it('holds the value where it is, without calling onChange', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				defaultValue="list"
				onChange={onChange}
				readOnly
				readOnlyTooltip="Saving your changes"
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Grid' }));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'false');
	});

	// Every button of a locked bar is inert, so Base UI's composite has nowhere to move the arrow
	// keys and holds the roving tab stop on the first one. The reason is the bar's, identical on
	// every button, so that one tab stop is enough to reach it. A disabled bar behaves the same.
	it('keeps its tab stop, and refuses the press that lands on it', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				defaultValue="list"
				onChange={onChange}
				readOnly
				readOnlyTooltip="Saving your changes"
			/>,
		);

		await user.tab();
		expect(screen.getByRole('button', { name: 'List' })).toHaveFocus();

		await user.keyboard('{Enter}');

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
	});

	it('blocks a multiple bar the same way', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="multiple"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				defaultValue={['list']}
				onChange={onChange}
				readOnly
				readOnlyTooltip="Saving your changes"
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Grid' }));
		await user.click(screen.getByRole('button', { name: 'List' }));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
	});

	// The cursor is the one value in the read-only rules that is a literal rather than a design
	// token the runner does not load.
	it('marks every button of a locked bar as blocked', () => {
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				defaultValue="list"
				readOnly
				readOnlyTooltip="Saving your changes"
			/>,
		);

		for (const button of screen.getAllByRole('button')) {
			expect(getComputedStyle(button).cursor).toBe('not-allowed');
		}
	});
});
