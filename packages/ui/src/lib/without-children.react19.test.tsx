import type * as React from 'react';
import type { ReactElement, Ref } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { withoutChildren } from './without-children.js';

vi.mock('react', async (importOriginal) => ({
	...(await importOriginal<typeof React>()),
	version: '19.0.0',
}));

/**
 * What React 19 builds: the ref sits in `props`, and reading `element.ref` logs an error in
 * development. The installed React is 18, so the element is put together by hand.
 */
function react19Element(ref: Ref<HTMLAnchorElement>): { element: ReactElement; reads: string[] } {
	const reads: string[] = [];
	const element = {
		$$typeof: Symbol.for('react.transitional.element'),
		type: 'a',
		key: null,
		props: { href: '/docs', children: 'Docs', ref },
		get ref(): null {
			reads.push('element.ref');
			return null;
		},
	};

	return { element: element as unknown as ReactElement, reads };
}

describe('withoutChildren on React 19', () => {
	it('reads the ref from the props, never from element.ref', () => {
		const ref = { current: null };
		const { element, reads } = react19Element(ref);

		const copy = withoutChildren(element);

		expect(reads).toEqual([]);
		expect(copy.props).toMatchObject({ href: '/docs' });
		expect(copy.props).not.toHaveProperty('children');
	});
});
