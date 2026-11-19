import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ToggleGroupField } from '../presets/toggle-group-field.js';
import { ToggleGroup } from '../toggle-group.js';
import type { ToggleGroupItemProps } from '../types.js';

const BAR = { variant: 'outlined', color: 'secondary', size: 'md' } as const;

const ITEMS: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List' },
	{ value: 'grid', label: 'Grid' },
	{ value: 'table', label: 'Table' },
];

function form(): HTMLFormElement {
	return screen.getByRole('form') as HTMLFormElement;
}

describe('ToggleGroup in a form', () => {
	it('submits the pressed value under name', () => {
		render(
			<form aria-label="Preferences">
				<ToggleGroup type="single" {...BAR} items={ITEMS} name="layout" defaultValue="grid" />
			</form>,
		);

		expect(new FormData(form()).getAll('layout')).toEqual(['grid']);
	});

	it('submits one entry per pressed button of a multiple bar, in the order of items', () => {
		render(
			<form aria-label="Preferences">
				<ToggleGroup
					type="multiple"
					{...BAR}
					items={ITEMS}
					name="layouts"
					value={['table', 'list']}
				/>
			</form>,
		);

		expect(new FormData(form()).getAll('layouts')).toEqual(['list', 'table']);
	});

	it('follows the presses of an uncontrolled bar', async () => {
		const user = userEvent.setup();
		render(
			<form aria-label="Preferences">
				<ToggleGroup
					type="multiple"
					{...BAR}
					items={ITEMS}
					name="layouts"
					defaultValue={['list']}
				/>
			</form>,
		);

		await user.click(screen.getByRole('button', { name: 'Table' }));
		await user.click(screen.getByRole('button', { name: 'List' }));

		expect(new FormData(form()).getAll('layouts')).toEqual(['table']);
	});

	it('follows the value of a controlled bar', () => {
		const { rerender } = render(
			<form aria-label="Preferences">
				<ToggleGroup type="single" {...BAR} items={ITEMS} name="layout" value="list" />
			</form>,
		);

		rerender(
			<form aria-label="Preferences">
				<ToggleGroup type="single" {...BAR} items={ITEMS} name="layout" value="table" />
			</form>,
		);

		expect(new FormData(form()).getAll('layout')).toEqual(['table']);
	});

	it('submits nothing while no button is pressed', () => {
		render(
			<form aria-label="Preferences">
				<ToggleGroup type="single" {...BAR} items={ITEMS} name="layout" value="" />
				<ToggleGroup type="multiple" {...BAR} items={ITEMS} name="layouts" />
			</form>,
		);

		const data = new FormData(form());

		expect(data.has('layout')).toBe(false);
		expect(data.has('layouts')).toBe(false);
	});

	it('submits nothing for a value that matches no item', () => {
		render(
			<form aria-label="Preferences">
				<ToggleGroup type="single" {...BAR} items={ITEMS} name="layout" value="cards" />
			</form>,
		);

		expect(new FormData(form()).has('layout')).toBe(false);
	});

	it('leaves a disabled bar out of the submit', () => {
		render(
			<form aria-label="Preferences">
				<ToggleGroup
					type="single"
					{...BAR}
					items={ITEMS}
					name="layout"
					defaultValue="grid"
					disabled
					disabledTooltip="Ask an admin"
				/>
			</form>,
		);

		expect(new FormData(form()).has('layout')).toBe(false);
	});

	it('leaves a pressed button that is disabled out of the submit', () => {
		render(
			<form aria-label="Preferences">
				<ToggleGroup
					type="multiple"
					{...BAR}
					name="layouts"
					value={['list', 'grid']}
					items={[
						{ value: 'list', label: 'List' },
						{ value: 'grid', label: 'Grid', disabled: true, disabledTooltip: 'Not available' },
					]}
				/>
			</form>,
		);

		expect(new FormData(form()).getAll('layouts')).toEqual(['list']);
	});

	it('submits a read-only bar', () => {
		render(
			<form aria-label="Preferences">
				<ToggleGroup
					type="single"
					{...BAR}
					items={ITEMS}
					name="layout"
					defaultValue="grid"
					readOnly
					readOnlyTooltip="Saving your changes"
				/>
			</form>,
		);

		expect(new FormData(form()).getAll('layout')).toEqual(['grid']);
	});

	it('renders no input without a name', () => {
		render(
			<form aria-label="Preferences">
				<ToggleGroup type="single" {...BAR} items={ITEMS} defaultValue="grid" />
			</form>,
		);

		expect(form().querySelector('input')).toBeNull();
		expect(Array.from(new FormData(form()).keys())).toEqual([]);
	});

	it('does not put name on the root', () => {
		render(
			<ToggleGroup
				type="single"
				{...BAR}
				items={ITEMS}
				name="layout"
				defaultValue="grid"
				testId="layout-bar"
			/>,
		);

		expect(screen.getByTestId('layout-bar')).not.toHaveAttribute('name');
	});
});

describe('ToggleGroupField in a form', () => {
	it('submits the pressed value under name', async () => {
		const user = userEvent.setup();
		render(
			<form aria-label="Preferences">
				<ToggleGroupField label="Layout" type="single" {...BAR} items={ITEMS} name="layout" />
			</form>,
		);

		await user.click(screen.getByRole('button', { name: 'Grid' }));

		expect(new FormData(form()).getAll('layout')).toEqual(['grid']);
	});
});
