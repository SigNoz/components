import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { ToggleGroup } from '../index.js';
import type { ToggleGroupItemProps } from '../types.js';

const ITEMS: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List' },
	{ value: 'grid', label: 'Grid' },
];

describe('ToggleGroup forwardRef', () => {
	it('forwards the ref to the rendered root element', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				testId="toggle-group"
				ref={ref}
			/>,
		);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByTestId('toggle-group'));
		expect(ref.current).toHaveAttribute('data-slot', 'toggle-group');
	});

	it('calls a callback ref with the root and with null on unmount', () => {
		const seen: Array<HTMLDivElement | null> = [];
		const { unmount } = render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				testId="toggle-group"
				ref={(node) => {
					seen.push(node);
				}}
			/>,
		);
		const root = screen.getByTestId('toggle-group');

		unmount();

		expect(seen[0]).toBe(root);
		expect(seen.at(-1)).toBeNull();
	});
});
