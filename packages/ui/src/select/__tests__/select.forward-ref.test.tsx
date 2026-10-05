import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Select } from '../index.js';
import { FRAMEWORKS } from './select.test-utils.js';

describe('Select forwardRef', () => {
	it('forwards the ref to a single trigger, a button', () => {
		const ref = createRef<HTMLElement>();
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				ref={ref}
				testId="select"
			/>,
		);

		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
		expect(ref.current).toBe(screen.getByTestId('select'));
		expect(ref.current).toHaveAttribute('data-slot', 'select-trigger');
	});

	it('forwards the ref to a multiple trigger, a div', () => {
		const ref = createRef<HTMLElement>();
		render(
			<Select
				placeholder="Select a framework..."
				multiple
				aria-label="Framework"
				items={FRAMEWORKS}
				ref={ref}
				testId="select"
			/>,
		);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByTestId('select'));
		expect(ref.current).toHaveAttribute('data-slot', 'select-trigger');
	});

	it('calls a callback ref with the trigger and with null on unmount', () => {
		const seen: Array<HTMLElement | null> = [];
		const { unmount } = render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				testId="select"
				ref={(node) => {
					seen.push(node);
				}}
			/>,
		);
		const trigger = screen.getByTestId('select');

		unmount();

		expect(seen[0]).toBe(trigger);
		expect(seen.at(-1)).toBeNull();
	});
});
