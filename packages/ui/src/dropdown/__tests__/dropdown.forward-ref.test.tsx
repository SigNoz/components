import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Dropdown } from '../index.js';
import type { DropdownItemType } from '../types.js';

const ITEMS: DropdownItemType[] = [{ type: 'item', value: 'rename', label: 'Rename' }];

describe('Dropdown forwardRef', () => {
	it('forwards the ref to the trigger element', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Dropdown nativeButton side="bottom" align="start" items={ITEMS} testId="menu" ref={ref}>
				<button type="button">Actions</button>
			</Dropdown>,
		);

		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
		expect(ref.current).toBe(screen.getByTestId('menu'));
		expect(ref.current).toHaveAttribute('data-slot', 'dropdown-trigger');
	});

	it('calls a callback ref with the trigger and with null on unmount', () => {
		const seen: Array<HTMLButtonElement | null> = [];
		const { unmount } = render(
			<Dropdown
				nativeButton
				side="bottom"
				align="start"
				items={ITEMS}
				testId="menu"
				ref={(node) => {
					seen.push(node);
				}}
			>
				<button type="button">Actions</button>
			</Dropdown>,
		);
		const trigger = screen.getByTestId('menu');

		unmount();

		expect(seen[0]).toBe(trigger);
		expect(seen.at(-1)).toBeNull();
	});
});
