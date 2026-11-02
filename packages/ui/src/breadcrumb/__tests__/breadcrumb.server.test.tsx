import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';
import { Breadcrumb } from '../breadcrumb.js';
import type { BreadcrumbItemType } from '../types.js';

const ITEMS: BreadcrumbItemType[] = [
	{ title: 'Dashboards', href: '/dashboards' },
	{ title: 'Payments', href: '/dashboards/payments' },
	{ title: 'Checkout', menu: [{ title: 'Prod', href: '/prod' }] },
	{ title: 'Current page' },
];

let error: MockInstance<typeof console.error>;

beforeEach(() => {
	error = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Breadcrumb on the server', () => {
	// React 18 logs an error for every `useLayoutEffect` it renders on the server, so the collapse
	// hook measures through `useIsomorphicLayoutEffect`.
	it('renders with no warning', () => {
		const html = renderToString(<Breadcrumb items={ITEMS} testId="trail" />);

		expect(html).toContain('data-slot="breadcrumb"');
		expect(error).not.toHaveBeenCalled();
	});

	it('renders the navigation and every crumb, since nothing can be measured yet', () => {
		const html = renderToString(<Breadcrumb items={ITEMS} testId="trail" />);

		expect(html).toContain('data-slot="breadcrumb"');
		for (const title of ['Dashboards', 'Payments', 'Checkout', 'Current page']) {
			expect(html).toContain(title);
		}
		expect(html).not.toContain('data-slot="breadcrumb-ellipsis"');
		expect(html).not.toContain('data-collapsed');
		expect(html).toContain('data-testid="trail"');
		expect(html).toContain('data-testid="trail-item-3"');
	});

	it('applies maxVisible without a layout', () => {
		const html = renderToString(<Breadcrumb items={ITEMS} maxVisible={2} testId="trail" />);

		expect(html).toContain('data-slot="breadcrumb-ellipsis"');
		expect(html.match(/data-collapsed/g)).toHaveLength(2);
	});

	// Nothing says yet whether the trail fits, so the last crumb is the one that may shorten, and a long
	// one does not push the server render past its container.
	it('lets the last crumb shorten while only two crumbs show, since nothing can be measured yet', () => {
		expect(renderToString(<Breadcrumb items={ITEMS.slice(0, 2)} />)).toContain(
			'data-shrinking="end"',
		);
		expect(renderToString(<Breadcrumb items={ITEMS} maxVisible={2} />)).toContain(
			'data-shrinking="end"',
		);
		expect(renderToString(<Breadcrumb items={ITEMS} />)).not.toContain('data-shrinking');
	});

	it('names the last crumb as the current page', () => {
		const html = renderToString(<Breadcrumb items={ITEMS} />);

		expect(html).toContain('aria-current="page"');
		expect(html.match(/aria-current/g)).toHaveLength(1);
	});

	it('renders nothing for a trail with no title', () => {
		expect(renderToString(<Breadcrumb items={[{ title: '' }]} />)).toBe('');
	});
});
