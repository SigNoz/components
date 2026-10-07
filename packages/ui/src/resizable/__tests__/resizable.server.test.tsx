import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Resizable } from '../resizable.js';
import type { ResizableItemType } from '../types.js';

afterEach(() => {
	vi.restoreAllMocks();
});

const ITEMS: ResizableItemType[] = [
	{ value: 'a', label: 'A', defaultSize: '50%', children: 'a' },
	{ value: 'b', label: 'B', children: 'b' },
];

describe('Resizable on the server', () => {
	it('renders with no warning', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});

		const html = renderToString(
			<Resizable testId="split" orientation="horizontal" storageKey="editor" items={ITEMS} />,
		);

		expect(html).toContain('data-slot="resizable"');
		expect(error).not.toHaveBeenCalled();
	});

	// `react-resizable-panels` writes `data-testid` from the element `id` on the root, the panels and
	// the handles, and the component can only fix it after the first commit. Needs an option upstream.
	it.fails('names the root and the handles from testId in the server markup', () => {
		const html = renderToString(
			<Resizable testId="split" orientation="horizontal" items={ITEMS} />,
		);

		expect(html).toMatch(/<div[^>]*data-slot="resizable"[^>]*data-testid="split"/);
		expect(html).toContain('data-testid="split-handle-a"');
	});
});
