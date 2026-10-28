import { render, screen } from '@testing-library/react';
import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { Tabs } from '../tabs.js';
import type { TabsItemProps } from '../types.js';

/**
 * Real layout, so nothing here may import `mockLabelMeasurement`.
 *
 * The package tokens are not loaded here, so the frame supplies the ones a trigger is built from,
 * with the numbers `@signozhq/design-tokens` ships. There is no global `box-sizing` reset either,
 * as in signoz-v3, so every border-box a height relies on has to be the component's own.
 */
const TOKENS = {
	'--spacing-3': '6px',
	'--spacing-4': '8px',
	'--spacing-16': '32px',
	'--tabs-border': 'rgb(1, 2, 3)',
	'--label-base-400-line-height': '1',
} as CSSProperties;

const Icon = (): ReactElement => <svg aria-hidden="true" viewBox="0 0 16 16" />;

const ITEMS: TabsItemProps[] = [
	{ key: 'overview', label: 'Overview', children: 'Overview content' },
	{ key: 'logs', label: 'Logs', prefixIcon: <Icon />, children: 'Logs content' },
	{
		key: 'traces',
		label: 'Traces',
		// eslint-disable-next-line jsx-a11y/anchor-has-content -- the children arrive through `props`.
		render: (props) => <a {...props} href="#traces" />,
	},
];

function renderInFrame(ui: ReactElement): ReturnType<typeof render> {
	return render(ui, {
		wrapper: ({ children }: { children: ReactNode }) => <div style={TOKENS}>{children}</div>,
	});
}

function heights(): number[] {
	return screen.getAllByRole('tab').map((tab) => tab.getBoundingClientRect().height);
}

describe('Tabs trigger height', () => {
	it('keeps a primary tab 32px tall, with or without an icon, as a button or an anchor', () => {
		renderInFrame(
			<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />,
		);

		expect(heights()).toEqual([32, 32, 32]);
	});

	it('keeps a secondary tab 34px tall, its borders included', () => {
		renderInFrame(
			<Tabs variant="secondary" orientation="horizontal" alignment="start" items={ITEMS} />,
		);

		expect(heights()).toEqual([34, 34, 34]);
	});
});

describe('Tabs label', () => {
	it('clips the label on the inline axis only, so descenders still paint', () => {
		renderInFrame(
			<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />,
		);

		const label = screen
			.getByRole('tab', { name: 'Overview' })
			.querySelector('[data-slot="tabs-label"]') as HTMLElement;
		const style = getComputedStyle(label);

		expect(style.overflowX).toBe('clip');
		expect(style.overflowY).toBe('visible');
		expect(style.textOverflow).toBe('ellipsis');
	});
});
