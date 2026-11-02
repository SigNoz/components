import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactElement, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Breadcrumb } from '../breadcrumb.js';
import { TRAIL } from './breadcrumb.test-utils.js';

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('Breadcrumb forwardRef', () => {
	it('points the ref at the navigation element', () => {
		const ref = createRef<HTMLElement>();
		render(<Breadcrumb items={TRAIL} testId="bc" ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLElement);
		expect(ref.current?.tagName).toBe('NAV');
		expect(ref.current).toBe(screen.getByRole('navigation', { name: 'Breadcrumb' }));
		expect(ref.current).toBe(screen.getByTestId('bc'));
		expect(ref.current).toHaveAttribute('data-slot', 'breadcrumb');
	});

	it('points the ref at the navigation element of a trail that cannot collapse', () => {
		const ref = createRef<HTMLElement>();
		render(<Breadcrumb items={TRAIL.slice(0, 2)} ref={ref} />);

		expect(ref.current).toBe(screen.getByRole('navigation'));
	});

	it('calls a callback ref with the element, and with null on unmount', () => {
		const seen: (HTMLElement | null)[] = [];
		const { unmount } = render(
			<Breadcrumb
				items={TRAIL}
				testId="bc"
				ref={(node) => {
					seen.push(node);
				}}
			/>,
		);
		const nav = screen.getByTestId('bc');

		expect(seen[0]).toBe(nav);

		unmount();

		expect(seen.at(-1)).toBeNull();
	});

	it('moves to a new ref object when it changes', () => {
		const first = createRef<HTMLElement>();
		const second = createRef<HTMLElement>();
		const { rerender } = render(<Breadcrumb items={TRAIL} testId="bc" ref={first} />);

		rerender(<Breadcrumb items={TRAIL} testId="bc" ref={second} />);

		expect(first.current).toBeNull();
		expect(second.current).toBe(screen.getByTestId('bc'));
	});

	it('leaves no ref behind for a trail that renders nothing', () => {
		const ref = createRef<HTMLElement>();
		render(<Breadcrumb items={[]} ref={ref} />);

		expect(ref.current).toBeNull();
	});

	it('keeps collapsing while a consumer ref is attached', () => {
		const ref = createRef<HTMLElement>();
		render(<Breadcrumb items={TRAIL} maxVisible={3} testId="bc" ref={ref} />);

		expect(ref.current).toHaveAttribute('data-overflowing');
		expect(screen.getByTestId('bc-ellipsis')).toBeInTheDocument();
	});

	it('observes the trail once, whatever ref the consumer passes', async () => {
		// The crumbs and their labels have observers of their own, so only the root counts.
		let observed = 0;
		vi.stubGlobal(
			'ResizeObserver',
			class extends ResizeObserver {
				override observe(target: Element, options?: ResizeObserverOptions): void {
					if (target.getAttribute('data-slot') === 'breadcrumb') {
						observed++;
					}
					super.observe(target, options);
				}
			},
		);

		function Harness(): ReactElement {
			const [, setTick] = useState(0);

			return (
				<>
					<button type="button" onClick={() => setTick((tick) => tick + 1)}>
						Render again
					</button>
					<Breadcrumb items={TRAIL} ref={(node) => node} />
				</>
			);
		}

		const user = userEvent.setup();
		render(<Harness />);
		const afterMount = observed;

		for (let index = 0; index < 3; index++) {
			await user.click(screen.getByRole('button', { name: 'Render again' }));
		}

		expect(afterMount).toBe(1);
		expect(observed).toBe(afterMount);
	});
});
