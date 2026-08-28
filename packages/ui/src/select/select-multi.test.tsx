import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { activate } from '../__tests__/interactions.js';
import { renderMultiSelect } from './select.test-utils.js';

describe('Select multi', () => {
	it('renders trigger with placeholder when no value is selected', () => {
		renderMultiSelect();
		expect(screen.getByRole('combobox')).toHaveAttribute('data-placeholder');
	});

	it('calls onChange with array containing selected value on first selection', () => {
		const onChange = vi.fn();
		renderMultiSelect({ onChange });

		fireEvent.click(screen.getByRole('combobox'));
		activate(screen.getByRole('option', { name: 'Red' }));

		expect(onChange).toHaveBeenCalledWith(['red']);
	});

	/**
	 * BEHAVIOUR CHANGE (Base UI migration): multi-select is now the primitive's
	 * own `multiple` mode, so the popup stays open across selections. It
	 * previously closed on every pick and had to be reopened in between, which
	 * contradicted the "keep open for multi-select" intent in the old code.
	 */
	it('allows several selections without closing in between', () => {
		const onChange = vi.fn();
		renderMultiSelect({ onChange });

		fireEvent.click(screen.getByRole('combobox'));
		activate(screen.getByRole('option', { name: 'Red' }));
		activate(screen.getByRole('option', { name: 'Blue' }));

		expect(onChange).toHaveBeenCalledTimes(2);
		expect(onChange).toHaveBeenNthCalledWith(1, ['red']);
		expect(onChange).toHaveBeenNthCalledWith(2, ['red', 'blue']);
		expect(screen.getByRole('option', { name: 'Red' })).toBeInTheDocument();
	});

	it('displays pills for selected values', () => {
		renderMultiSelect({ defaultValue: ['red', 'green'] });
		expect(screen.getByText('red')).toBeInTheDocument();
		expect(screen.getByText('green')).toBeInTheDocument();
	});

	it('renders remove button for each pill', () => {
		renderMultiSelect({ defaultValue: ['red', 'green'] });
		expect(screen.getByRole('button', { name: 'Remove red' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Remove green' })).toBeInTheDocument();
	});

	it('removes value when pill X button is clicked', () => {
		const onChange = vi.fn();
		renderMultiSelect({ defaultValue: ['red', 'green'], onChange });

		fireEvent.pointerDown(screen.getByRole('button', { name: 'Remove red' }));

		expect(onChange).toHaveBeenCalledWith(['green']);
	});

	it('removes last remaining pill and calls onChange with empty array', () => {
		const onChange = vi.fn();
		renderMultiSelect({ defaultValue: ['red'], onChange });

		fireEvent.pointerDown(screen.getByRole('button', { name: 'Remove red' }));

		expect(onChange).toHaveBeenCalledWith([]);
	});

	it('deselects item on second click via onChange toggling', () => {
		const onChange = vi.fn();
		renderMultiSelect({ defaultValue: ['red', 'green'], onChange });

		fireEvent.click(screen.getByRole('combobox'));
		activate(screen.getByRole('option', { name: 'Red' }));

		expect(onChange).toHaveBeenCalledWith(['green']);
	});
});
