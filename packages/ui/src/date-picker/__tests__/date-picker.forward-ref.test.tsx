import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { DatePicker } from '../index.js';
import { StampDatePicker, ZonedDatePicker } from './date-picker.test-utils.js';

describe('DatePicker forwardRef', () => {
	it('forwards the ref to the trigger, a button', () => {
		const ref = createRef<HTMLButtonElement>();
		render(<DatePicker placeholder="Select date" aria-label="Expiry" ref={ref} testId="dp" />);

		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
		expect(ref.current).toBe(screen.getByTestId('dp'));
		expect(ref.current).toHaveAttribute('data-slot', 'date-picker-trigger');
	});

	it('forwards the ref while the date picker is disabled or read-only', () => {
		const disabledRef = createRef<HTMLButtonElement>();
		const readOnlyRef = createRef<HTMLButtonElement>();
		render(
			<>
				<DatePicker
					placeholder="Select date"
					aria-label="Disabled"
					disabled
					disabledTooltip="No access"
					ref={disabledRef}
				/>
				<DatePicker
					placeholder="Select date"
					aria-label="Read-only"
					readOnly
					readOnlyTooltip="Locked"
					ref={readOnlyRef}
				/>
			</>,
		);

		expect(disabledRef.current).toBe(screen.getByRole('combobox', { name: 'Disabled' }));
		expect(readOnlyRef.current).toBe(screen.getByRole('combobox', { name: 'Read-only' }));
	});

	it('calls a callback ref with the trigger and with null on unmount', () => {
		const seen: Array<HTMLElement | null> = [];
		const { unmount } = render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				testId="dp"
				ref={(node) => {
					seen.push(node);
				}}
			/>,
		);
		const trigger = screen.getByTestId('dp');

		unmount();

		expect(seen[0]).toBe(trigger);
		expect(seen.at(-1)).toBeNull();
	});

	it('forwards the ref of a date picker made with createDatePicker', () => {
		const stampRef = createRef<HTMLButtonElement>();
		const zonedRef = createRef<HTMLButtonElement>();
		render(
			<>
				<StampDatePicker placeholder="Select date" aria-label="Stamp" ref={stampRef} />
				<ZonedDatePicker placeholder="Select date" aria-label="Zoned" ref={zonedRef} />
			</>,
		);

		expect(stampRef.current).toBe(screen.getByRole('combobox', { name: 'Stamp' }));
		expect(zonedRef.current).toBe(screen.getByRole('combobox', { name: 'Zoned' }));
	});

	it('lets the ref focus the trigger', () => {
		const ref = createRef<HTMLButtonElement>();
		render(<DatePicker placeholder="Select date" aria-label="Expiry" ref={ref} />);

		ref.current?.focus();

		expect(screen.getByRole('combobox', { name: 'Expiry' })).toHaveFocus();
	});

	it('lands the id on the trigger next to the ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(<DatePicker placeholder="Select date" aria-label="Expiry" id="expiry" ref={ref} />);

		expect(ref.current).toHaveAttribute('id', 'expiry');
	});
});
