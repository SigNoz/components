import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { InputNumber } from './index.js';

describe('InputNumber — keyboard and wheel', () => {
	it('steps the value with the keyboard', () => {
		const onChange = vi.fn();
		const onStep = vi.fn();
		render(<InputNumber defaultValue={5} onChange={onChange} onStep={onStep} testId="num" />);
		const input = screen.getByTestId('num');
		fireEvent.keyDown(input, { key: 'ArrowUp' });
		expect(onChange).toHaveBeenLastCalledWith(6);
		expect(onStep).toHaveBeenLastCalledWith(
			6,
			expect.objectContaining({ type: 'up', emitter: 'keydown' })
		);
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		expect(onChange).toHaveBeenLastCalledWith(5);
	});

	it('fires onPressEnter on Enter and respects keyboard=false', () => {
		const onPressEnter = vi.fn();
		const onChange = vi.fn();
		render(
			<InputNumber
				defaultValue={5}
				onChange={onChange}
				onPressEnter={onPressEnter}
				keyboard={false}
				testId="num"
			/>
		);
		const input = screen.getByTestId('num');
		fireEvent.keyDown(input, { key: 'Enter' });
		expect(onPressEnter).toHaveBeenCalledTimes(1);
		fireEvent.keyDown(input, { key: 'ArrowUp' });
		expect(onChange).not.toHaveBeenCalled();
	});

	it('steps via mouse wheel when changeOnWheel is set and the input is focused', () => {
		const onChange = vi.fn();
		render(<InputNumber defaultValue={5} onChange={onChange} changeOnWheel testId="num" />);
		const input = screen.getByTestId('num') as HTMLInputElement;
		fireEvent.focus(input);
		act(() => {
			fireEvent.wheel(input, { deltaY: -1 });
		});
		expect(onChange).toHaveBeenLastCalledWith(6);
		act(() => {
			fireEvent.wheel(input, { deltaY: 1 });
		});
		expect(onChange).toHaveBeenLastCalledWith(5);
	});
});
