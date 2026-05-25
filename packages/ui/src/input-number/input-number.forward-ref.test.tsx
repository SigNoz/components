import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { InputNumber, type InputNumberRef } from './index.js';

describe('InputNumber', () => {
	it('forwards an imperative ref with focus/blur/nativeElement', () => {
		const ref = createRef<InputNumberRef>();
		render(<InputNumber ref={ref} placeholder="0" testId="num" />);
		expect(ref.current).not.toBeNull();
		expect(ref.current?.nativeElement).toBeInstanceOf(HTMLInputElement);
		ref.current?.focus();
		expect(document.activeElement).toBe(ref.current?.nativeElement);
		ref.current?.blur();
		expect(document.activeElement).not.toBe(ref.current?.nativeElement);
	});

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

	it('steps the value with the keyboard', () => {
		const onChange = vi.fn();
		const onStep = vi.fn();
		render(
			<InputNumber defaultValue={5} onChange={onChange} onStep={onStep} testId="num" />
		);
		const input = screen.getByTestId('num');
		fireEvent.keyDown(input, { key: 'ArrowUp' });
		expect(onChange).toHaveBeenLastCalledWith(6);
		expect(onStep).toHaveBeenLastCalledWith(6, expect.objectContaining({ type: 'up', emitter: 'keydown' }));
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

	it('renders controls and steps via click', () => {
		const onChange = vi.fn();
		render(<InputNumber defaultValue={3} onChange={onChange} controls testId="num" />);
		fireEvent.click(screen.getByLabelText('Increase value'));
		expect(onChange).toHaveBeenLastCalledWith(4);
		fireEvent.click(screen.getByLabelText('Decrease value'));
		expect(onChange).toHaveBeenLastCalledWith(3);
	});

	it('disables the up control at max and the down control at min', () => {
		render(<InputNumber value={10} min={0} max={10} controls />);
		expect(screen.getByLabelText('Increase value')).toBeDisabled();
		expect(screen.getByLabelText('Decrease value')).not.toBeDisabled();
	});

	it('renders addonBefore and addonAfter wrappers', () => {
		render(
			<InputNumber
				addonBefore={<span data-testid="addon-before">unit</span>}
				addonAfter={<span data-testid="addon-after">GiB</span>}
			/>
		);
		expect(screen.getByTestId('addon-before')).toBeInTheDocument();
		expect(screen.getByTestId('addon-after')).toBeInTheDocument();
	});

	it('hides spinner controls when controls={false}, even with mode="spinner"', () => {
		render(<InputNumber controls={false} mode="spinner" defaultValue={1} />);
		expect(screen.queryByLabelText('Increase value')).not.toBeInTheDocument();
		expect(screen.queryByLabelText('Decrease value')).not.toBeInTheDocument();
	});

	it('mode="spinner" lays the actions out side-by-side when controls are enabled', () => {
		render(<InputNumber controls mode="spinner" defaultValue={1} />);
		const actions = screen.getByLabelText('Increase value').parentElement;
		expect(actions).toHaveAttribute('data-mode', 'spinner');
	});

	it('does not clamp on blur when changeOnBlur={false}', () => {
		const onChange = vi.fn();
		render(
			<InputNumber
				onChange={onChange}
				min={0}
				max={10}
				changeOnBlur={false}
				testId="num"
			/>
		);
		const input = screen.getByTestId('num') as HTMLInputElement;
		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: '50' } });
		expect(onChange).toHaveBeenLastCalledWith(50);
		fireEvent.blur(input);
		expect(onChange).toHaveBeenLastCalledWith(50);
	});

	it('round-trips decimalSeparator for display and parsing', () => {
		const onChange = vi.fn();
		render(
			<InputNumber
				defaultValue={1.5}
				decimalSeparator=","
				onChange={onChange}
				testId="num"
			/>
		);
		const input = screen.getByTestId('num') as HTMLInputElement;
		expect(input.value).toBe('1,5');
		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: '2,75' } });
		expect(onChange).toHaveBeenLastCalledWith(2.75);
	});

	it('marks the wrapper as out-of-range when value drifts outside [min, max]', () => {
		render(<InputNumber min={1} max={10} value={99} testId="num" />);
		const wrapper = screen.getByTestId('num').parentElement;
		expect(wrapper).toHaveAttribute('data-out-of-range', 'true');
	});

	it('steps via mouse wheel when changeOnWheel is set and the input is focused', () => {
		const onChange = vi.fn();
		render(
			<InputNumber
				defaultValue={5}
				onChange={onChange}
				changeOnWheel
				testId="num"
			/>
		);
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

	it('honors custom aria labels for the increment/decrement buttons', () => {
		render(
			<InputNumber
				controls
				defaultValue={0}
				incrementAriaLabel="Augmenter"
				decrementAriaLabel="Diminuer"
			/>
		);
		expect(screen.getByLabelText('Augmenter')).toBeInTheDocument();
		expect(screen.getByLabelText('Diminuer')).toBeInTheDocument();
	});
});
