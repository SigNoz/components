import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../../field/field.js';
import { ToggleGroup, ToggleGroupField } from '../index.js';
import type { ToggleGroupItemProps } from '../types.js';

const ITEMS: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List' },
	{ value: 'grid', label: 'Grid' },
];

const BAR = { type: 'single', variant: 'outlined', color: 'secondary', size: 'md' } as const;

describe('ToggleGroupField name', () => {
	it('names the group list with the legend, so the fieldset and the list read the same name', () => {
		render(<ToggleGroupField label="Layout" {...BAR} items={ITEMS} testId="layout" />);

		const legend = screen.getByTestId('layout-label');
		const list = document.querySelector('[data-slot="toggle-group-list"]');

		expect(legend.tagName).toBe('LEGEND');
		expect(list).toHaveAttribute('role', 'group');
		expect(list).toHaveAttribute('aria-labelledby', legend.id);
		expect(screen.getAllByRole('group', { name: 'Layout' })).toHaveLength(2);
	});

	it('names each button after its item', () => {
		render(<ToggleGroupField label="Layout" {...BAR} items={ITEMS} />);

		expect(screen.getByRole('button', { name: 'List' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Grid' })).toBeInTheDocument();
	});

	it('keeps an aria-label of its own on the root and does not name the list with the legend', () => {
		render(
			<ToggleGroupField
				label="Layout"
				{...BAR}
				items={ITEMS}
				aria-label="Own name"
				testId="layout"
			/>,
		);

		expect(screen.getByTestId('layout')).toHaveAttribute('aria-label', 'Own name');
		expect(document.querySelector('[data-slot="toggle-group-list"]')).not.toHaveAttribute(
			'aria-labelledby',
		);
	});

	it('keeps an aria-labelledby of its own on the root', () => {
		render(
			<div>
				<span id="own-name">Own name</span>
				<ToggleGroupField
					label="Layout"
					{...BAR}
					items={ITEMS}
					aria-labelledby="own-name"
					testId="layout"
				/>
			</div>,
		);

		expect(screen.getByTestId('layout')).toHaveAttribute('aria-labelledby', 'own-name');
		expect(document.querySelector('[data-slot="toggle-group-list"]')).not.toHaveAttribute(
			'aria-labelledby',
		);
	});

	it('renders the same name from a hand-written Field.Group', () => {
		render(
			<Field.Group label="Layout">
				<ToggleGroup {...BAR} items={ITEMS} />
			</Field.Group>,
		);

		expect(document.querySelector('[data-slot="toggle-group-list"]')).toHaveAccessibleName(
			'Layout',
		);
	});

	it('leaves a bare toggle group without a name of its own', () => {
		render(<ToggleGroup {...BAR} items={ITEMS} />);

		expect(document.querySelector('[data-slot="toggle-group-list"]')).not.toHaveAttribute(
			'aria-labelledby',
		);
	});
});

describe('ToggleGroupField description, message and status', () => {
	it('lists the description in the fieldset description', () => {
		render(
			<ToggleGroupField
				label="Layout"
				{...BAR}
				items={ITEMS}
				description="How the rows are drawn"
				testId="layout"
			/>,
		);

		expect(screen.getByTestId('layout-description')).toHaveTextContent('How the rows are drawn');
		expect(screen.getAllByRole('group', { name: 'Layout' })[0]).toHaveAccessibleDescription(
			'How the rows are drawn',
		);
	});

	it('shows a danger message without aria-invalid, which role=group does not take', () => {
		render(
			<ToggleGroupField
				label="Layout"
				{...BAR}
				items={ITEMS}
				error="Pick a layout"
				testId="layout"
			/>,
		);

		expect(screen.getByTestId('layout-message')).toHaveTextContent('Pick a layout');
		expect(document.querySelector('[data-slot="field-group"]')).toHaveAttribute(
			'data-status',
			'danger',
		);
		expect(document.querySelector('[aria-invalid]')).not.toBeInTheDocument();
		expect(document.querySelector('[data-slot="field-announcer"]')).toHaveTextContent(
			'Pick a layout',
		);
	});

	it('shows the asterisk in the legend and nothing on the group, which takes no aria-required', () => {
		render(<ToggleGroupField label="Layout" {...BAR} items={ITEMS} required />);

		expect(document.querySelector('[data-slot="field-required-marker"]')).toHaveAttribute(
			'aria-hidden',
			'true',
		);
		expect(document.querySelector('[aria-required]')).not.toBeInTheDocument();
		expect(document.querySelector('[required]')).not.toBeInTheDocument();
	});
});

describe('ToggleGroupField props split', () => {
	it('gives the root the testId and the parts the same prefix, and the fieldset none', () => {
		render(
			<ToggleGroupField
				label="Layout"
				{...BAR}
				items={ITEMS}
				description="Rows"
				labelTooltip="Plain text"
				testId="layout"
			/>,
		);

		expect(screen.getByTestId('layout')).toHaveAttribute('data-slot', 'toggle-group');
		expect(screen.getByTestId('layout-label')).toBeInTheDocument();
		expect(screen.getByTestId('layout-label-tooltip')).toBeInTheDocument();
		expect(screen.getByTestId('layout-description')).toBeInTheDocument();
		expect(screen.getByTestId('layout-button-list')).toBeInTheDocument();
		expect(document.querySelector('[data-slot="field-group"]')).not.toHaveAttribute('data-testid');
	});

	it('hands variant, color, size, aria and data attributes to the root', () => {
		render(
			<ToggleGroupField
				label="Layout"
				{...BAR}
				items={ITEMS}
				data-analytics="layout"
				testId="layout"
			/>,
		);

		const root = screen.getByTestId('layout');

		expect(root).toHaveAttribute('data-variant', 'outlined');
		expect(root).toHaveAttribute('data-color', 'secondary');
		expect(root).toHaveAttribute('data-size', 'md');
		expect(root).toHaveAttribute('data-analytics', 'layout');
	});

	it('hands the ref to a button of the bar, not to the root', () => {
		const ref = createRef<HTMLButtonElement>();
		render(<ToggleGroupField label="Layout" {...BAR} items={ITEMS} ref={ref} testId="layout" />);

		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
		expect(ref.current).not.toBe(screen.getByTestId('layout'));
	});

	it('drops className, style and htmlFor that get past the types', () => {
		const props = { className: 'styled', style: { color: 'red' }, htmlFor: 'x' } as never;

		render(<ToggleGroupField label="Layout" {...BAR} items={ITEMS} {...props} testId="layout" />);

		expect(screen.getByTestId('layout')).not.toHaveClass('styled');
		expect(screen.getByTestId('layout')).not.toHaveAttribute('for');
	});
});

describe('ToggleGroupField value', () => {
	it('reports the pressed value through onChange', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<ToggleGroupField label="Layout" {...BAR} items={ITEMS} onChange={onChange} />);

		await user.click(screen.getByRole('button', { name: 'Grid' }));

		expect(onChange).toHaveBeenCalledExactlyOnceWith('grid');
		expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'true');
	});

	it('stays controlled by value', async () => {
		const user = userEvent.setup();

		function Controlled() {
			const [value, setValue] = useState('list');

			return (
				<ToggleGroupField label="Layout" {...BAR} items={ITEMS} value={value} onChange={setValue} />
			);
		}

		render(<Controlled />);
		await user.click(screen.getByRole('button', { name: 'Grid' }));

		expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'false');
	});

	it('reports the list while it presses several', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroupField
				label="Layout"
				type="multiple"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'List' }));
		await user.click(screen.getByRole('button', { name: 'Grid' }));

		expect(onChange).toHaveBeenLastCalledWith(['list', 'grid']);
	});
});
