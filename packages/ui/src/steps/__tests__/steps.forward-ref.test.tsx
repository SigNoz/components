import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Steps } from '../index.js';
import { PLAIN } from './steps.test-utils.js';

describe('Steps forwardRef', () => {
	it('forwards the ref of Steps to the ol, and the ref of Steps.List to its root div', () => {
		const rowRef = createRef<HTMLOListElement>();
		const listRef = createRef<HTMLDivElement>();

		render(
			<>
				<Steps ref={rowRef} current={1} items={PLAIN} />
				<Steps.List ref={listRef} items={[{ children: 'a' }]} />
			</>,
		);

		expect(rowRef.current).toBeInstanceOf(HTMLOListElement);
		expect(rowRef.current?.tagName).toBe('OL');
		expect(rowRef.current).toHaveAttribute('data-slot', 'steps');
		expect(listRef.current).toBeInstanceOf(HTMLDivElement);
		expect(listRef.current?.tagName).toBe('DIV');
		expect(listRef.current).toHaveAttribute('data-slot', 'steps-list');
		expect(listRef.current?.querySelector(':scope > ol')).toHaveAttribute(
			'data-slot',
			'steps-list-items',
		);
	});

	it('forwards a callback ref', () => {
		let row: HTMLOListElement | null = null;
		let list: HTMLDivElement | null = null;

		render(
			<>
				<Steps
					current={1}
					items={PLAIN}
					ref={(element) => {
						row = element;
					}}
				/>
				<Steps.List
					items={[{ children: 'a' }]}
					ref={(element) => {
						list = element;
					}}
				/>
			</>,
		);

		expect((row as HTMLOListElement | null)?.tagName).toBe('OL');
		expect((list as HTMLDivElement | null)?.tagName).toBe('DIV');
	});

	it('calls a callback ref with null on unmount', () => {
		const calls: (HTMLOListElement | null)[] = [];

		const { unmount } = render(
			<Steps
				current={1}
				items={PLAIN}
				ref={(element) => {
					calls.push(element);
				}}
			/>,
		);
		unmount();

		expect(calls[0]?.tagName).toBe('OL');
		expect(calls.at(-1)).toBeNull();
	});

	it('keeps the same node while current changes', () => {
		const ref = createRef<HTMLOListElement>();

		const { rerender } = render(<Steps ref={ref} current={1} items={PLAIN} />);
		const node = ref.current;
		expect(node).not.toBeNull();

		for (const current of [2, 3, 4, 1]) {
			rerender(<Steps ref={ref} current={current} items={PLAIN} />);
			expect(ref.current, `current ${current}`).toBe(node);
		}
	});

	it('keeps the same step nodes while current changes', () => {
		const { rerender, container } = render(<Steps current={1} items={PLAIN} />);
		const before = Array.from(container.querySelectorAll('li'));

		rerender(<Steps current={3} items={PLAIN} />);

		expect(Array.from(container.querySelectorAll('li'))).toEqual(before);
	});
});
