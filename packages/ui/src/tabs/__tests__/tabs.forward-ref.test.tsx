import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Tabs } from '../index.js';
import type { TabsItemProps } from '../types.js';

const ITEMS: TabsItemProps[] = [
	{ key: 'overview', label: 'Overview', children: 'Overview content' },
	{ key: 'settings', label: 'Settings', children: 'Settings content' },
];

describe('Tabs forwardRef', () => {
	it('forwards the ref to the rendered root element', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				testId="tabs"
				ref={ref}
			/>,
		);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByTestId('tabs'));
		expect(ref.current).toHaveAttribute('data-slot', 'tabs');
	});

	it('calls a callback ref with the root and with null on unmount', () => {
		const seen: Array<HTMLDivElement | null> = [];
		const { unmount } = render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				testId="tabs"
				ref={(node) => {
					seen.push(node);
				}}
			/>,
		);
		const root = screen.getByTestId('tabs');

		unmount();

		expect(seen[0]).toBe(root);
		expect(seen.at(-1)).toBeNull();
	});
});
