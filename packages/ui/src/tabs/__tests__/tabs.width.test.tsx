import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tabs } from '../tabs.js';
import type { TabsItemProps } from '../types.js';

const ITEMS: TabsItemProps[] = [
	{ key: 'overview', label: 'Overview', children: 'Overview content' },
	{ key: 'settings', label: 'Settings', children: 'Settings content' },
];

function getRoot(): HTMLElement {
	const root = screen.getByRole('tablist').closest<HTMLElement>('[data-slot="tabs"]');

	if (!root) {
		throw new Error('the tabs root is missing');
	}

	return root;
}

describe('Tabs width', () => {
	it('maps width to the inline-size custom property', () => {
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				width="40rem"
			/>,
		);

		expect(getRoot().style.getPropertyValue('--tabs-internal-inline-size')).toBe('40rem');
	});

	it('maps maxWidth to the max-inline-size custom property', () => {
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				maxWidth="60rem"
			/>,
		);

		expect(getRoot().style.getPropertyValue('--tabs-internal-max-inline-size')).toBe('60rem');
	});

	it('writes a number as px, custom properties get no unit from React', () => {
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				width={640}
				maxWidth={960}
			/>,
		);

		const { style } = getRoot();
		expect(style.getPropertyValue('--tabs-internal-inline-size')).toBe('640px');
		expect(style.getPropertyValue('--tabs-internal-max-inline-size')).toBe('960px');
	});

	it('keeps a zero, which is a real length', () => {
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				maxWidth={0}
			/>,
		);

		expect(getRoot().style.getPropertyValue('--tabs-internal-max-inline-size')).toBe('0px');
	});

	it('leaves both custom properties unset by default, so the tokens win', () => {
		render(<Tabs variant="secondary" orientation="horizontal" alignment="start" items={ITEMS} />);

		const { style } = getRoot();
		expect(style.getPropertyValue('--tabs-internal-inline-size')).toBe('');
		expect(style.getPropertyValue('--tabs-internal-max-inline-size')).toBe('');
	});

	it('keeps the caller style alongside the custom properties', () => {
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				width="40rem"
				style={{ color: 'red', marginTop: '4px' }}
			/>,
		);

		const { style } = getRoot();
		expect(style.color).toBe('red');
		expect(style.marginTop).toBe('4px');
		expect(style.getPropertyValue('--tabs-internal-inline-size')).toBe('40rem');
	});
});
