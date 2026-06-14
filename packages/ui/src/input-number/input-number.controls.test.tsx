import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { InputNumber } from './index.js';

describe('InputNumber — spinner controls', () => {
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
