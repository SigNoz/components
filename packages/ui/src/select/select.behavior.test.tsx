import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { activate } from '../__tests__/interactions.js';
import { Select } from './components/select.js';
import { SelectContent } from './components/select-content.js';
import { SelectItem } from './components/select-item.js';
import { SelectSeparator } from './components/select-separator.js';
import { SelectTrigger } from './components/select-trigger.js';

/**
 * Assertions target the ARIA contract, the value callbacks and the public prop
 * surface rather than the primitive's own state attributes, so they remain
 * meaningful if the primitive underneath is replaced.
 */
function renderSelect(
	props: Partial<React.ComponentProps<typeof Select>> = {},
	triggerProps: Partial<React.ComponentProps<typeof SelectTrigger>> = {},
) {
	return render(
		<Select {...props}>
			<SelectTrigger placeholder="Pick one" {...triggerProps} />
			<SelectContent withPortal={false}>
				<SelectItem value="apple">Apple</SelectItem>
				<SelectItem value="banana">Banana</SelectItem>
				<SelectItem value="cherry" disabled>
					Cherry
				</SelectItem>
			</SelectContent>
		</Select>,
	);
}

describe('Select ARIA contract', () => {
	it('exposes the trigger as a combobox and the options as options', () => {
		renderSelect();

		const trigger = screen.getByRole('combobox');
		expect(trigger).toBeInTheDocument();

		fireEvent.click(trigger);
		expect(screen.getAllByRole('option')).toHaveLength(3);
	});

	it('marks the trigger as a placeholder until a value is picked', () => {
		renderSelect();

		expect(screen.getByRole('combobox')).toHaveAttribute('data-placeholder');

		fireEvent.click(screen.getByRole('combobox'));
		activate(screen.getByRole('option', { name: 'Apple' }));

		expect(screen.getByRole('combobox')).not.toHaveAttribute('data-placeholder');
	});

	it('reports the selected option as selected', () => {
		renderSelect({ defaultValue: 'banana' });

		fireEvent.click(screen.getByRole('combobox'));
		expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'false');
	});

	it('does not select a disabled item', () => {
		const onChange = vi.fn();
		renderSelect({ onChange });

		fireEvent.click(screen.getByRole('combobox'));
		activate(screen.getByRole('option', { name: 'Cherry' }));

		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('Select value handling', () => {
	it('emits a string for single select and an array for multi select', () => {
		const onChange = vi.fn();
		const { unmount } = renderSelect({ onChange });

		fireEvent.click(screen.getByRole('combobox'));
		activate(screen.getByRole('option', { name: 'Apple' }));
		expect(onChange).toHaveBeenCalledWith('apple');
		unmount();

		const onMultiChange = vi.fn();
		renderSelect({ multiple: true, onChange: onMultiChange });
		fireEvent.click(screen.getByRole('combobox'));
		activate(screen.getByRole('option', { name: 'Apple' }));
		expect(onMultiChange).toHaveBeenCalledWith(['apple']);
	});

	it('resolves the label of the selected value while the popup is closed', () => {
		renderSelect({ defaultValue: 'cherry' });

		expect(screen.getByRole('combobox')).toHaveTextContent('Cherry');
	});

	it('honours a controlled value', () => {
		const { rerender } = render(
			<Select value="apple" onChange={() => {}}>
				<SelectTrigger placeholder="Pick one" />
				<SelectContent withPortal={false}>
					<SelectItem value="apple">Apple</SelectItem>
					<SelectItem value="banana">Banana</SelectItem>
				</SelectContent>
			</Select>,
		);
		expect(screen.getByRole('combobox')).toHaveTextContent('Apple');

		rerender(
			<Select value="banana" onChange={() => {}}>
				<SelectTrigger placeholder="Pick one" />
				<SelectContent withPortal={false}>
					<SelectItem value="apple">Apple</SelectItem>
					<SelectItem value="banana">Banana</SelectItem>
				</SelectContent>
			</Select>,
		);
		expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
	});

	it('uses resolveLabel for the trigger when provided', () => {
		renderSelect({ defaultValue: 'apple' }, { resolveLabel: (value) => value.toUpperCase() });

		expect(screen.getByRole('combobox')).toHaveTextContent('APPLE');
	});
});

describe('Select multi trigger', () => {
	it('renders a removable pill per selected value', () => {
		const onChange = vi.fn();
		renderSelect({ multiple: true, defaultValue: ['apple', 'banana'], onChange });

		expect(screen.getByRole('button', { name: 'Remove apple' })).toBeInTheDocument();
		fireEvent.pointerDown(screen.getByRole('button', { name: 'Remove apple' }));

		expect(onChange).toHaveBeenCalledWith(['banana']);
	});

	it('limits the pills shown and reports the overflow count', () => {
		renderSelect(
			{ multiple: true, defaultValue: ['apple', 'banana', 'cherry'] },
			{
				maxDisplayedPills: 2,
			},
		);

		expect(screen.getByText('+1')).toBeInTheDocument();
	});
});

describe('Select open state', () => {
	it('closes after picking in single select and stays open in multi select', () => {
		const { unmount } = renderSelect();
		fireEvent.click(screen.getByRole('combobox'));
		activate(screen.getByRole('option', { name: 'Apple' }));
		expect(screen.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument();
		unmount();

		renderSelect({ multiple: true });
		fireEvent.click(screen.getByRole('combobox'));
		activate(screen.getByRole('option', { name: 'Apple' }));
		expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
	});

	it('reports open changes through onOpenChange', () => {
		const onOpenChange = vi.fn();
		renderSelect({ onOpenChange });

		fireEvent.click(screen.getByRole('combobox'));

		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it('does not open while disabled', () => {
		renderSelect({ disabled: true });

		fireEvent.click(screen.getByRole('combobox'));

		expect(screen.queryByRole('option')).not.toBeInTheDocument();
	});
});

describe('Select dismissal callbacks', () => {
	it('calls onEscapeKeyDown when Escape closes the popup', () => {
		const onEscapeKeyDown = vi.fn();
		render(
			<Select>
				<SelectTrigger placeholder="Pick one" />
				<SelectContent withPortal={false} onEscapeKeyDown={onEscapeKeyDown}>
					<SelectItem value="apple">Apple</SelectItem>
				</SelectContent>
			</Select>,
		);

		fireEvent.click(screen.getByRole('combobox'));
		fireEvent.keyDown(document, { key: 'Escape' });

		expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('option')).not.toBeInTheDocument();
	});
});

describe('Select structure', () => {
	it('renders a separator between items', () => {
		render(
			<Select>
				<SelectTrigger placeholder="Pick one" />
				<SelectContent withPortal={false}>
					<SelectItem value="apple">Apple</SelectItem>
					<SelectSeparator testId="sep" />
					<SelectItem value="banana">Banana</SelectItem>
				</SelectContent>
			</Select>,
		);

		fireEvent.click(screen.getByRole('combobox'));
		expect(screen.getByTestId('sep')).toBeInTheDocument();
	});
});
