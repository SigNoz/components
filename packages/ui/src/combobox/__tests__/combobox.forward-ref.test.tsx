import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Combobox } from '../index.js';
import { FRAMEWORKS } from './combobox.test-utils.js';

describe('Combobox forwardRef', () => {
	it('forwards the ref to a single trigger, a button', () => {
		const ref = createRef<HTMLElement>();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				ref={ref}
				testId="cb"
			/>,
		);

		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
		expect(ref.current).toBe(screen.getByTestId('cb'));
		expect(ref.current).toHaveAttribute('data-slot', 'combobox-trigger');
	});

	it('forwards the ref to a multiple trigger, a div', () => {
		const ref = createRef<HTMLElement>();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={FRAMEWORKS}
				ref={ref}
				testId="cb"
			/>,
		);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByTestId('cb'));
		expect(ref.current).toHaveAttribute('data-slot', 'combobox-trigger');
	});

	it('calls a callback ref with the trigger and with null on unmount', () => {
		const seen: Array<HTMLElement | null> = [];
		const { unmount } = render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				testId="cb"
				ref={(node) => {
					seen.push(node);
				}}
			/>,
		);
		const trigger = screen.getByTestId('cb');

		unmount();

		expect(seen[0]).toBe(trigger);
		expect(seen.at(-1)).toBeNull();
	});
});
