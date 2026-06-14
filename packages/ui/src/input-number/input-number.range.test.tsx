import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { InputNumber } from './index.js';

describe('InputNumber — clamping and range', () => {
	it('clamps to min/max on blur when changeOnBlur is true', () => {
		const onChange = vi.fn();
		render(<InputNumber onChange={onChange} min={0} max={10} testId="num" />);
		const input = screen.getByTestId('num') as HTMLInputElement;
		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: '50' } });
		expect(onChange).toHaveBeenLastCalledWith(50);
		fireEvent.blur(input);
		expect(onChange).toHaveBeenLastCalledWith(10);
	});

	it('does not clamp on blur when changeOnBlur={false}', () => {
		const onChange = vi.fn();
		render(<InputNumber onChange={onChange} min={0} max={10} changeOnBlur={false} testId="num" />);
		const input = screen.getByTestId('num') as HTMLInputElement;
		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: '50' } });
		expect(onChange).toHaveBeenLastCalledWith(50);
		fireEvent.blur(input);
		expect(onChange).toHaveBeenLastCalledWith(50);
	});

	it('marks the wrapper as out-of-range when value drifts outside [min, max]', () => {
		render(<InputNumber min={1} max={10} value={99} testId="num" />);
		const wrapper = screen.getByTestId('num').parentElement;
		expect(wrapper).toHaveAttribute('data-out-of-range', 'true');
	});
});
