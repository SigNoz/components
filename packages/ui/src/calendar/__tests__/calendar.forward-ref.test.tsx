import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Calendar } from '../index.js';

const JUNE_2025 = new Date(2025, 5, 11);

describe('Calendar forwardRef', () => {
	it('forwards the ref to the rendered root element', () => {
		const ref = createRef<HTMLDivElement>();

		render(<Calendar mode="single" defaultMonth={JUNE_2025} testId="calendar" ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByTestId('calendar'));
		expect(ref.current).toHaveAttribute('data-slot', 'calendar');
	});

	it('still forwards the ref while react-day-picker holds one of its own', () => {
		const ref = createRef<HTMLDivElement>();

		render(<Calendar mode="single" defaultMonth={JUNE_2025} testId="calendar" animate ref={ref} />);

		expect(ref.current).toBe(screen.getByTestId('calendar'));
	});

	it('calls a callback ref with the root and with null on unmount', () => {
		const seen: Array<HTMLDivElement | null> = [];

		const { unmount } = render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_2025}
				testId="calendar"
				ref={(node) => {
					seen.push(node);
				}}
			/>,
		);
		const root = screen.getByTestId('calendar');

		unmount();

		expect(seen[0]).toBe(root);
		expect(seen.at(-1)).toBeNull();
	});
});
