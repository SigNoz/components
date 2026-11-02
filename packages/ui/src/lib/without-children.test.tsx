import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { withoutChildren } from './without-children.js';

describe('withoutChildren', () => {
	it('drops the children and keeps the type and the other props', () => {
		const copy = withoutChildren(
			<a href="/docs" data-track="docs">
				Docs
			</a>,
		);

		expect(copy.type).toBe('a');
		expect(copy.props).toEqual({ href: '/docs', 'data-track': 'docs' });
	});

	it('leaves the key unset when the element has none, instead of the string "null"', () => {
		const copy = withoutChildren(<a href="/docs">Docs</a>);

		expect(copy.key).toBeNull();
	});

	it('keeps the key the element has', () => {
		const copy = withoutChildren(
			<a key="docs" href="/docs">
				Docs
			</a>,
		);

		expect(copy.key).toBe('docs');
	});

	it('keeps an object ref, which still reaches the node', () => {
		const ref = createRef<HTMLAnchorElement>();
		const copy = withoutChildren(
			<a ref={ref} href="/docs">
				Docs
			</a>,
		);

		render(copy);

		expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
	});

	it('keeps a callback ref', () => {
		const nodes: Array<HTMLAnchorElement | null> = [];
		const copy = withoutChildren(
			<a
				ref={(node) => {
					nodes.push(node);
				}}
				href="/docs"
			>
				Docs
			</a>,
		);

		const { unmount } = render(copy);
		expect(nodes).toEqual([expect.any(HTMLAnchorElement)]);

		unmount();
		expect(nodes.at(-1)).toBeNull();
	});

	it('draws the copy with no children', () => {
		const { container } = render(withoutChildren(<a href="/docs">Docs</a>));

		expect(container.querySelector('a')).toBeEmptyDOMElement();
	});
});
