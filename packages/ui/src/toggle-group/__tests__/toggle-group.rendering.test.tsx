import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TOGGLE_GROUP_EMPTY_LABEL } from '../constants.js';
import { ToggleGroup } from '../toggle-group.js';
import type { ToggleGroupItemProps } from '../types.js';

const ITEMS: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List' },
	{ value: 'grid', label: 'Grid' },
];

describe('ToggleGroup rendering', () => {
	it('renders one button per item, named by its label', () => {
		render(
			<ToggleGroup type="single" variant="outlined" color="secondary" size="md" items={ITEMS} />,
		);

		expect(screen.getAllByRole('button')).toHaveLength(2);
		expect(screen.getByRole('button', { name: 'List' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Grid' })).toBeInTheDocument();
	});

	it('marks the item in defaultValue as pressed', () => {
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				defaultValue="grid"
			/>,
		);

		expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('data-pressed');
		expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'false');
	});

	it('mirrors variant, color and size as data attributes on the root', () => {
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="sm"
				items={ITEMS}
				testId="toggle-group"
			/>,
		);

		const root = screen.getByTestId('toggle-group');

		expect(root).toHaveAttribute('data-variant', 'outlined');
		expect(root).toHaveAttribute('data-color', 'secondary');
		expect(root).toHaveAttribute('data-size', 'sm');
		expect(root).not.toHaveAttribute('data-disabled');
		expect(root).not.toHaveAttribute('data-readonly');
	});

	it('names each button after the group, and lets an item name itself', () => {
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				testId="layout"
				items={[
					{ value: 'list', label: 'List' },
					{ value: 'grid', label: 'Grid', testId: 'own' },
				]}
			/>,
		);

		expect(screen.getByTestId('layout-button-list')).toHaveTextContent('List');
		expect(screen.getByTestId('own')).toHaveTextContent('Grid');
	});

	it('forwards aria-* and data-* to the root', () => {
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				testId="toggle-group"
				aria-label="Layout"
				data-analytics="layout-picker"
			/>,
		);

		const root = screen.getByTestId('toggle-group');

		expect(root).toHaveAttribute('aria-label', 'Layout');
		expect(root).toHaveAttribute('data-analytics', 'layout-picker');
	});

	it('marks the whole bar as disabled without taking the buttons out of reach', () => {
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				testId="toggle-group"
				disabled
				disabledTooltip="This workspace is read only"
			/>,
		);

		const list = screen.getByRole('button', { name: 'List' });

		expect(screen.getByTestId('toggle-group')).toHaveAttribute('data-disabled');
		expect(list).toHaveAttribute('aria-disabled', 'true');
		// The native attribute would take every pointer event with it, and the reason with them.
		expect(list).not.toBeDisabled();
		// `data-disabled` on a button stays the item's own, so the stylesheet can tell the two apart.
		expect(list).not.toHaveAttribute('data-disabled');
	});

	it('marks a read-only bar as locked rather than disabled', () => {
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				testId="toggle-group"
				disabled
				disabledTooltip="This workspace is read only"
				readOnly
				readOnlyTooltip="Saving your changes"
			/>,
		);

		const root = screen.getByTestId('toggle-group');
		const list = screen.getByRole('button', { name: 'List' });

		// `readOnly` outranks `disabled`, so the bar the call site also disabled is not disabled.
		expect(root).toHaveAttribute('data-readonly');
		expect(root).not.toHaveAttribute('data-disabled');
		expect(list).toHaveAttribute('data-readonly');
		// `aria-readonly` is not allowed on `role="button"`, so the lock is announced this way.
		expect(list).toHaveAttribute('aria-disabled', 'true');
		expect(list).not.toBeDisabled();
	});

	it('renders a prefix and a suffix around the label', () => {
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				testId="layout"
				items={[
					{
						value: 'list',
						label: 'List',
						prefix: <span data-testid="lead">*</span>,
						suffix: <span data-testid="trail">#</span>,
					},
					{ value: 'grid', label: 'Grid' },
				]}
			/>,
		);

		const button = screen.getByTestId('layout-button-list');

		expect(button.querySelector('[data-slot="toggle-group-prefix"]')).toContainElement(
			screen.getByTestId('lead'),
		);
		expect(button.querySelector('[data-slot="toggle-group-suffix"]')).toContainElement(
			screen.getByTestId('trail'),
		);
		expect(
			screen.getByTestId('layout-button-grid').querySelector('[data-slot="toggle-group-prefix"]'),
		).toBeNull();
	});

	it('keeps an item with an empty label, showing the fallback text and saying so', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});

		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				testId="layout"
				items={[
					{ value: 'list', label: 'List' },
					{ value: 'grid', label: '' },
				]}
			/>,
		);

		const button = screen.getByTestId('layout-button-grid');

		expect(button).toHaveTextContent(TOGGLE_GROUP_EMPTY_LABEL);
		expect(button.querySelector('[data-slot="toggle-group-label"]')).toHaveAttribute(
			'data-empty-label',
		);
		expect(error).toHaveBeenCalledWith(expect.stringContaining('renders no label'));

		error.mockRestore();
	});

	it('writes width and maxWidth as the internal custom properties', () => {
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				testId="toggle-group"
				width={320}
				maxWidth="20rem"
			/>,
		);

		const root = screen.getByTestId('toggle-group');

		expect(root.style.getPropertyValue('--toggle-group-internal-inline-size')).toBe('320px');
		expect(root.style.getPropertyValue('--toggle-group-internal-max-inline-size')).toBe('20rem');
	});
});
