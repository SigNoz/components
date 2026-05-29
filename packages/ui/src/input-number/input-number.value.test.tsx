import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { InputNumber } from './index.js';

describe('InputNumber — value, parsing, precision', () => {
	it('emits parsed numeric values via onChange', () => {
		const onChange = vi.fn();
		render(<InputNumber onChange={onChange} testId="num" />);
		const input = screen.getByTestId('num') as HTMLInputElement;
		fireEvent.change(input, { target: { value: '42' } });
		expect(onChange).toHaveBeenLastCalledWith(42);
		fireEvent.change(input, { target: { value: '' } });
		expect(onChange).toHaveBeenLastCalledWith(null);
	});

	it('rounds to the configured precision', () => {
		const onChange = vi.fn();
		render(<InputNumber onChange={onChange} precision={2} testId="num" />);
		fireEvent.change(screen.getByTestId('num'), { target: { value: '1.234' } });
		expect(onChange).toHaveBeenLastCalledWith(1.23);
	});

	it('applies formatter for display and parser for input', () => {
		const onChange = vi.fn();
		render(
			<InputNumber
				defaultValue={1000}
				onChange={onChange}
				formatter={(v) => `$ ${v}`}
				parser={(v) => v.replace(/[^\d.-]/g, '')}
				testId="num"
			/>
		);
		const input = screen.getByTestId('num') as HTMLInputElement;
		expect(input.value).toBe('$ 1000');
		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: '$ 1234' } });
		expect(onChange).toHaveBeenLastCalledWith(1234);
	});

	it('round-trips decimalSeparator for display and parsing', () => {
		const onChange = vi.fn();
		render(
			<InputNumber defaultValue={1.5} decimalSeparator="," onChange={onChange} testId="num" />
		);
		const input = screen.getByTestId('num') as HTMLInputElement;
		expect(input.value).toBe('1,5');
		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: '2,75' } });
		expect(onChange).toHaveBeenLastCalledWith(2.75);
	});
});
