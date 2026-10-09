import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { queryOpenTooltip } from '../../__tests__/test-utils.js';
import { Select } from '../index.js';
import type { SelectItemType } from '../types.js';
import { FRAMEWORKS, openSelect } from './select.test-utils.js';

const LONG_LABEL = 'Every service that reports to the production collector, across every region';

function renderSelect(items: SelectItemType[]) {
	return render(
		<Select
			placeholder="Select a service..."
			aria-label="Framework"
			items={items}
			contentMaxWidth={200}
			testId="select"
		/>,
	);
}

describe('Select tooltips', () => {
	it('marks a row label that does not fit and shows it in full', async () => {
		renderSelect([{ type: 'item', value: 'all', label: LONG_LABEL }]);
		await openSelect();

		const row = screen.getByTestId('select-item-all');
		const label = row.querySelector('[data-slot="select-item-label"]');

		await waitFor(() => {
			expect(label).toHaveAttribute('data-truncated', 'true');
		});

		await userEvent.hover(row);

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent(LONG_LABEL);
		});
	});

	it('leaves a row label that fits unmarked and opens no tooltip', async () => {
		renderSelect([{ type: 'item', value: 'react', label: 'React' }]);
		await openSelect();

		const row = screen.getByTestId('select-item-react');
		await userEvent.hover(row);

		expect(row.querySelector('[data-slot="select-item-label"]')).not.toHaveAttribute(
			'data-truncated',
		);
		expect(queryOpenTooltip()).toBeNull();
	});

	it('stacks the reason of a disabled row above its full label', async () => {
		renderSelect([
			{
				type: 'item',
				value: 'all',
				label: LONG_LABEL,
				disabled: true,
				disabledTooltip: 'Needs the admin role',
			},
		]);
		await openSelect();

		await userEvent.hover(screen.getByTestId('select-item-all'));

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent(LONG_LABEL);
		});
		const text = queryOpenTooltip()?.textContent ?? '';

		expect(text.indexOf('Needs the admin role')).toBeGreaterThanOrEqual(0);
		expect(text.indexOf('Needs the admin role')).toBeLessThan(text.indexOf(LONG_LABEL));
	});

	it('shows the full value of a trigger that does not fit', async () => {
		render(
			<Select
				placeholder="Select a service..."
				aria-label="Service"
				items={[{ type: 'item', value: 'all', label: LONG_LABEL }]}
				defaultValue="all"
				width={160}
			/>,
		);

		const trigger = screen.getByRole('combobox', { name: 'Service' });

		// The value is measured after the first paint, and the tooltip mounts with it. A pointer that
		// was already over the trigger by then would never have entered it.
		await waitFor(() => {
			expect(trigger).toHaveAttribute('aria-describedby');
		});
		await userEvent.hover(trigger);

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent(LONG_LABEL);
		});
	});

	it('lists the values folded into the +N chip', async () => {
		render(
			<Select
				multiple
				placeholder="Select frameworks..."
				aria-label="Frameworks"
				items={FRAMEWORKS}
				defaultValue={['react', 'vue', 'solid']}
				maxDisplayedPills={1}
				testId="select"
			/>,
		);

		await userEvent.hover(screen.getByTestId('select-chip-overflow'));

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('Vue, solid');
		});
	});
});
