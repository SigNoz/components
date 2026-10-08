import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactElement, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { AlertStrip } from '../alert-strip.js';

describe('AlertStrip forwardRef', () => {
	it('forwards the ref of every variant to the root', () => {
		const refs = [
			createRef<HTMLDivElement>(),
			createRef<HTMLDivElement>(),
			createRef<HTMLDivElement>(),
		];

		render(
			<>
				<AlertStrip ref={refs[0]} color="primary" side="bottom">
					a
				</AlertStrip>
				<AlertStrip.Closeable
					ref={refs[1]}
					color="primary"
					side="bottom"
					closed={false}
					onClose={() => {}}
				>
					a
				</AlertStrip.Closeable>
				<AlertStrip.CloseablePersisted ref={refs[2]} storageKey="k" color="primary" side="bottom">
					a
				</AlertStrip.CloseablePersisted>
			</>,
		);

		for (const ref of refs) {
			expect(ref.current).toBeInstanceOf(HTMLDivElement);
			expect(ref.current).toHaveAttribute('data-slot', 'alert-strip');
		}
	});

	it('measures the whole strip through the ref, and follows it as it wraps', async () => {
		const ref = createRef<HTMLDivElement>();
		const { rerender } = render(
			<div style={{ width: 600 }}>
				<AlertStrip ref={ref} color="primary" side="bottom" testId="s">
					a
				</AlertStrip>
			</div>,
		);

		const heights: number[] = [];
		const observer = new ResizeObserver(([entry]) => {
			heights.push(entry.borderBoxSize[0].blockSize);
		});
		observer.observe(ref.current as HTMLDivElement);
		await vi.waitFor(() => expect(heights).toEqual([32]));

		rerender(
			<div style={{ width: 600 }}>
				<AlertStrip ref={ref} color="primary" side="bottom" testId="s">
					{'Your workspace is over its ingestion quota for this month. '.repeat(3)}
				</AlertStrip>
			</div>,
		);

		const height = screen.getByTestId('s').getBoundingClientRect().height;
		expect(height).toBeGreaterThan(32);
		await vi.waitFor(() => expect(heights).toEqual([32, height]));
		observer.disconnect();
	});

	it('calls a callback ref with null once the strip closes', async () => {
		const ref = vi.fn();

		function Strip(): ReactElement {
			const [closed, setClosed] = useState(false);

			return (
				<AlertStrip.Closeable
					ref={ref}
					color="primary"
					side="bottom"
					closed={closed}
					onClose={() => setClosed(true)}
				>
					a
				</AlertStrip.Closeable>
			);
		}

		render(<Strip />);
		expect(ref).toHaveBeenCalledTimes(1);
		expect(ref).toHaveBeenLastCalledWith(expect.any(HTMLDivElement));

		await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));

		expect(ref).toHaveBeenCalledTimes(2);
		expect(ref).toHaveBeenLastCalledWith(null);
	});
});
