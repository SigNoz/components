import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Pagination } from '../index.js';

describe('Pagination forwardRef', () => {
	it('forwards the ref of every variant to the nav', () => {
		const refs = [createRef<HTMLElement>(), createRef<HTMLElement>(), createRef<HTMLElement>()];

		render(
			<>
				<Pagination ref={refs[0]} total={100} />
				<Pagination ref={refs[1]} total={100} variant="compact" />
				<Pagination.Cursor ref={refs[2]} hasNextPage />
			</>,
		);

		for (const ref of refs) {
			expect(ref.current).toBeInstanceOf(HTMLElement);
			expect(ref.current?.tagName).toBe('NAV');
			expect(ref.current).toHaveAttribute('data-slot', 'pagination');
		}
	});

	it('forwards a callback ref', () => {
		let node: HTMLElement | null = null;

		render(
			<Pagination
				total={100}
				ref={(element) => {
					node = element;
				}}
			/>,
		);

		expect((node as HTMLElement | null)?.tagName).toBe('NAV');
	});

	it.each([5, 0])('attaches the ref to the nav for a total of %i', (total) => {
		const ref = createRef<HTMLElement>();

		render(<Pagination ref={ref} total={total} />);

		expect(ref.current?.tagName).toBe('NAV');
		expect(ref.current).toHaveAttribute('data-slot', 'pagination');
	});

	it('keeps the ref on the same node while the page changes', () => {
		const ref = createRef<HTMLElement>();
		const { rerender } = render(<Pagination ref={ref} total={100} current={1} />);
		const first = ref.current;

		rerender(<Pagination ref={ref} total={100} current={2} />);

		expect(ref.current).toBe(first);
	});

	it('is named for the devtools', () => {
		expect(Pagination.Cursor.displayName).toBe('Pagination.Cursor');
	});
});
