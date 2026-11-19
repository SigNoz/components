import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../../field/field.js';
import { ToggleGroupField } from '../presets/toggle-group-field.js';
import { ToggleGroup } from '../toggle-group.js';
import type { ToggleGroupItemProps } from '../types.js';

const BAR = { variant: 'outlined', color: 'secondary', size: 'md' } as const;

const ITEMS: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List' },
	{ value: 'grid', label: 'Grid' },
	{ value: 'table', label: 'Table' },
];

describe('ToggleGroupField ref', () => {
	it('focuses the pressed button', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<ToggleGroupField
				label="Layout"
				type="single"
				{...BAR}
				items={ITEMS}
				value="grid"
				ref={ref}
			/>,
		);

		ref.current?.focus();

		expect(screen.getByRole('button', { name: 'Grid' })).toHaveFocus();
	});

	it('focuses the first pressed button of a multiple bar', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<ToggleGroupField
				label="Layout"
				type="multiple"
				{...BAR}
				items={ITEMS}
				value={['table', 'grid']}
				ref={ref}
			/>,
		);

		ref.current?.focus();

		expect(screen.getByRole('button', { name: 'Grid' })).toHaveFocus();
	});

	it('focuses the first button while nothing is pressed, skipping a disabled one', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<ToggleGroupField
				label="Layout"
				type="single"
				{...BAR}
				ref={ref}
				items={[
					{ value: 'list', label: 'List', disabled: true, disabledTooltip: 'Not available' },
					{ value: 'grid', label: 'Grid' },
				]}
			/>,
		);

		ref.current?.focus();

		expect(screen.getByRole('button', { name: 'Grid' })).toHaveFocus();
	});

	it('follows the pressed button of an uncontrolled bar', async () => {
		const user = userEvent.setup();
		const ref = createRef<HTMLButtonElement>();
		render(
			<ToggleGroupField
				label="Layout"
				type="single"
				{...BAR}
				items={ITEMS}
				defaultValue="list"
				ref={ref}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Table' }));
		(document.activeElement as HTMLElement).blur();
		ref.current?.focus();

		expect(screen.getByRole('button', { name: 'Table' })).toHaveFocus();
	});

	it('moves to the first pressed button as the controlled value changes', () => {
		const ref = createRef<HTMLButtonElement>();
		const { rerender } = render(
			<ToggleGroupField
				label="Layout"
				type="single"
				{...BAR}
				items={ITEMS}
				value="list"
				ref={ref}
			/>,
		);

		rerender(
			<ToggleGroupField
				label="Layout"
				type="single"
				{...BAR}
				items={ITEMS}
				value="table"
				ref={ref}
			/>,
		);
		ref.current?.focus();

		expect(screen.getByRole('button', { name: 'Table' })).toHaveFocus();
	});

	it('is called with null once the field unmounts', () => {
		const ref = vi.fn();
		const { unmount } = render(
			<ToggleGroupField label="Layout" type="single" {...BAR} items={ITEMS} ref={ref} />,
		);

		unmount();

		expect(ref).toHaveBeenLastCalledWith(null);
	});
});

describe('ToggleGroup ref', () => {
	it('stays the root div, alone and inside a Field.Group', () => {
		const alone = createRef<HTMLDivElement>();
		const inside = createRef<HTMLDivElement>();
		render(
			<>
				<ToggleGroup type="single" {...BAR} items={ITEMS} testId="alone" ref={alone} />
				<Field.Group label="Inside">
					<ToggleGroup type="single" {...BAR} items={ITEMS} testId="inside" ref={inside} />
				</Field.Group>
			</>,
		);

		expect(alone.current).toBe(screen.getByTestId('alone'));
		expect(inside.current).toBe(screen.getByTestId('inside'));
		expect(inside.current).toBeInstanceOf(HTMLDivElement);
	});
});
